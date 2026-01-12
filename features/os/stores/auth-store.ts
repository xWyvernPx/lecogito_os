import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AuthState,
  LoginResponseDto,
  RefreshResponseDto,
  UserDto,
} from "@/types/api";

export const AUTH_STORAGE_KEYS = {
  TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  TOKEN_EXPIRES: "token_expires",
  USER: "user",
} as const;

const loadStoredAuth = (): AuthState => {
  try {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
    const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    const tokenExpiresStr = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRES);
    const userStr = localStorage.getItem(AUTH_STORAGE_KEYS.USER);

    const tokenExpires = tokenExpiresStr ? parseInt(tokenExpiresStr, 10) : null;
    const user = userStr ? JSON.parse(userStr) : null;

    const isExpired = tokenExpires ? Date.now() > tokenExpires : false;

    if (token && !isExpired) {
      return {
        token,
        refreshToken,
        tokenExpires,
        user,
        isAuthenticated: true,
      };
    }

    if (isExpired && refreshToken) {
      return {
        token: null,
        refreshToken,
        tokenExpires: null,
        user: null,
        isAuthenticated: false,
      };
    }

    return {
      token: null,
      refreshToken: null,
      tokenExpires: null,
      user: null,
      isAuthenticated: false,
    };
  } catch {
    return {
      token: null,
      refreshToken: null,
      tokenExpires: null,
      user: null,
      isAuthenticated: false,
    };
  }
};

const clearAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRES);
  localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
};

interface AuthStore extends AuthState {
  login: (response: LoginResponseDto) => void;
  logout: () => void;
  refresh: (response: RefreshResponseDto) => void;
  setUser: (user: UserDto) => void;
  getToken: () => string | null;
  getRefreshToken: () => string | null;
  checkAuth: () => boolean;
}

const persistAuth = (state: AuthState) => {
  if (state.token) {
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, state.token);
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
  }

  if (state.refreshToken) {
    localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, state.refreshToken);
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  }

  if (state.tokenExpires) {
    localStorage.setItem(
      AUTH_STORAGE_KEYS.TOKEN_EXPIRES,
      state.tokenExpires.toString()
    );
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN_EXPIRES);
  }

  if (state.user) {
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(state.user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...loadStoredAuth(),

      login: (response: LoginResponseDto) => {
        const tokenExpires = Date.now() + 3600000; // 1 hour from now
        const newState: AuthState = {
          token: response.accessToken,
          refreshToken: response.refreshToken,
          tokenExpires,
          user: response.user,
          isAuthenticated: true,
        };
        set(newState);
        persistAuth(newState);
      },

      logout: () => {
        clearAuth();
        set({
          token: null,
          refreshToken: null,
          tokenExpires: null,
          user: null,
          isAuthenticated: false,
        });
      },

      refresh: (response: RefreshResponseDto) => {
        const tokenExpires = Date.now() + 3600000; // 1 hour from now
        set((state) => {
          const newState: AuthState = {
            ...state,
            token: response.accessToken,
            refreshToken: response.refreshToken,
            tokenExpires,
          };
          persistAuth(newState);
          return newState;
        });
      },

      setUser: (user: UserDto) => {
        set((state) => ({
          ...state,
          user,
        }));
      },

      getToken: () => {
        return get().token;
      },

      getRefreshToken: () => {
        return get().refreshToken;
      },

      checkAuth: () => {
        return get().isAuthenticated;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
