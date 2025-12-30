import { useQuery } from '@tanstack/react-query';
import { UserApi } from '../api/user.api';
import type { SearchRequest } from '@/types/api';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (requestParams: SearchRequest) => [...userKeys.lists(), requestParams] as const,
  unregistered: (email: string) => [...userKeys.all, 'unregistered', email] as const,
};

// Hooks
export const useUsers = (requestParams: SearchRequest) => {
  return useQuery({
    queryKey: userKeys.list(requestParams),
    queryFn: () => UserApi.search(requestParams),
  });
};

export const useUnregisteredUser = (email: string, enabled = true) => {
  return useQuery({
    queryKey: userKeys.unregistered(email),
    queryFn: () => UserApi.getUnregistered(email),
    enabled,
  });
};

export const useRegisterNotification = (email: string, enabled = true) => {
  return useQuery({
    queryKey: [...userKeys.all, 'register-notification', email],
    queryFn: () => UserApi.registerNotification(email),
    enabled,
  });
};
