import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

// Base URL from OpenAPI spec
// DEV: http://localhost:5025
// PROD: https://cogito.wyvernp.id.vn
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://cogito.wyvernp.id.vn/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // For cookie-based auth if needed
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or your auth store
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh");

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // Clear auth and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh-token`,
          {
            accessToken: localStorage.getItem('accessToken'),
            refreshToken,
          }
        );

        const newToken = response.data?.data?.accessToken;
        const newRefreshToken = response.data?.data?.refreshToken;

        if (newToken) {
          localStorage.setItem('accessToken', newToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        toast.error("Session expired. Please login again.");
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const status = error.response?.status;
    const message = (error.response?.data as any)?.message || error.message;

    if (status === 403) {
      toast.error("Access Denied", {
        description: "You don't have permission to perform this action.",
      });
    } else if (status === 404) {
      toast.error("Not Found", {
        description: message || "The requested resource was not found.",
      });
    } else if (status === 500) {
      toast.error("Server Error", {
        description: "Something went wrong on the server.",
      });
    } else if (!isAuthEndpoint) {
      toast.error("Error", {
        description: message || "An unexpected error occurred.",
      });
    }

    return Promise.reject(error);
  }
);

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = authActions.getToken();

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// apiClient.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     const isAuthEndpoint =
//       originalRequest?.url?.includes("/auth/email/login") ||
//       originalRequest?.url?.includes("/auth/refresh");

//     if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
//       if (isRefreshing) {
//         // Wait for refresh to complete
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return apiClient(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       const refreshToken = authActions.getRefreshToken();

//       if (!refreshToken) {
//         authActions.logout();
//         window.location.href = "/auth/login";
//         return Promise.reject(error);
//       }

//       try {

//         const response = await axios.post<ApiResponse<RefreshResponseDto>>(
//           `${apiClient.defaults.baseURL}/auth/refresh`,
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${refreshToken}`,
//             },
//           }
//         );


//         const { token, refreshToken: newRefreshToken, tokenExpires } = response.data.data;

//         authActions.refresh({ token, refreshToken: newRefreshToken, tokenExpires });

//         processQueue(null, token);

//         originalRequest.headers.Authorization = `Bearer ${token}`;
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError as Error, null);
//         authActions.logout();
//         toast.error("Session expired", {
//           description: "Please login again",
//         });
//         window.location.href = "/auth/login";
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     // Handle other errors
//     const status = error.response?.status;
//     const data = error.response?.data as any;
//     let messageKey = "serverErrorDesc";

//     if (status === 422 && data?.errors) {
//       const firstField = Object.keys(data.errors)[0];
//       const errorValue = data.errors[firstField];
//       messageKey = errorValue;
//     }

//     const translatedMessage = i18n.exists(`errors.${messageKey}`)
//       ? i18n.t(`errors.${messageKey}`)
//       : (i18n.exists(messageKey) ? i18n.t(messageKey) : messageKey);

//     if (error.response?.status === 403) {
//       toast.error(i18n.t("errors.accessDenied"), {
//         description: i18n.t("errors.accessDeniedDesc"),
//       });
//     } else if (error.response?.status === 404) {
//       console.log(translatedMessage)
//       toast.error(i18n.t("errors.notFound"), {
//         description: translatedMessage,
//       });
//     } else {
//       toast.error(i18n.t("errors.errorTitle"), {
//         description: translatedMessage,
//       });
//     }

//     return Promise.reject(error);
//   }
// );