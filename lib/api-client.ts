import { AUTH_STORAGE_KEYS } from "@/features/os/stores/auth-store";
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
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    
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
      originalRequest?.url?.includes("/auth/refresh-token") || 
      originalRequest?.url?.includes("/auth/verify") ;

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

      const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        // Clear auth and redirect to login
        localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
        localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh-token`,
          {
            accessToken: localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN),
            refreshToken,
          }
        );

        const newToken = response.data?.data?.accessToken;
        const newRefreshToken = response.data?.data?.refreshToken;

        if (newToken) {
          localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, newToken);
          if (newRefreshToken) {
            localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
          }

          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
        localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
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