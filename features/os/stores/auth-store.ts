import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  AuthState,
  LoginResponseDto,
  RefreshResponseDto,
  UserDto,
} from '@/types/api';

const STORAGE_KEYS = {
  TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  TOKEN_EXPIRES: "token_expires",
  USER: "user",
} as const;

const loadStoredAuth = (): AuthState => {
  try {

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const tokenExpiresStr = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);

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
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES);
  localStorage.removeItem(STORAGE_KEYS.USER);
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

export const useAuthStore = create<AuthStore>()(persist(
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
      set((state) => ({
        ...state,
        token: response.accessToken,
        refreshToken: response.refreshToken,
        tokenExpires,
      }));
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
    name: 'auth-storage',
    storage: createJSONStorage(() => localStorage),
  }
));