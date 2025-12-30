import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StaticContentApi } from '../api/static-content.api';
import type { SearchRequest, StaticContentDto } from '@/types/api';

// Query Keys
export const staticContentKeys = {
  all: ['static-content'] as const,
  lists: () => [...staticContentKeys.all, 'list'] as const,
  list: (key?: string, request?: SearchRequest) =>
    [...staticContentKeys.lists(), { key, request }] as const,
  details: () => [...staticContentKeys.all, 'detail'] as const,
  detail: (key: string) => [...staticContentKeys.details(), key] as const,
  byType: (type: 'PERSONAL') => [...staticContentKeys.all, 'type', type] as const,
};

// Hooks
export const useStaticContentSearch = (key?: string, request?: SearchRequest) => {
  return useQuery({
    queryKey: staticContentKeys.list(key, request),
    queryFn: () => StaticContentApi.search(key, request),
  });
};

export const useStaticContent = (key: string, enabled = true) => {
  return useQuery({
    queryKey: staticContentKeys.detail(key),
    queryFn: () => StaticContentApi.getByKey(key),
    enabled,
  });
};

export const useStaticContentByType = (type: 'PERSONAL') => {
  return useQuery({
    queryKey: staticContentKeys.byType(type),
    queryFn: () => StaticContentApi.getByType(type),
  });
};

export const useCreateStaticContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: Partial<StaticContentDto>) => StaticContentApi.create(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staticContentKeys.lists() });
    },
  });
};

export const useUpdateStaticContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, content }: { key: string; content: StaticContentDto }) =>
      StaticContentApi.update(key, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: staticContentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staticContentKeys.detail(variables.key) });
    },
  });
};
