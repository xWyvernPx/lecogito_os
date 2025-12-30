import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '../api/auth.api';
import type { AuthRequest, AuthVerificationRequest, RefreshTokenRequest } from '@/types/api';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

// Hooks
export const useMe = (enabled = true) => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => AuthApi.getMe(),
    enabled,
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AuthRequest) => AuthApi.login(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (request: RefreshTokenRequest) => AuthApi.refreshToken(request),
  });
};

export const useVerifyToken = () => {
  return useMutation({
    mutationFn: (request: AuthVerificationRequest) => AuthApi.verify(request),
  });
};
