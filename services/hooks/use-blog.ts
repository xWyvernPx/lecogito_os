import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BlogApi, AdminBlogApi } from '../api/blog.api';
import type { BlogSearchCriteria, SearchRequest } from '@/types/api';

// Query Keys
export const blogKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (criteria: BlogSearchCriteria, request: SearchRequest) =>
    [...blogKeys.lists(), { criteria, request }] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (uuid: string) => [...blogKeys.details(), uuid] as const,
  comments: (id: number, request: SearchRequest) =>
    [...blogKeys.all, 'comments', id, request] as const,
  commentsCount: (id: number) => [...blogKeys.all, 'comments-count', id] as const,
};

// Hooks
export const useBlogSearch = (criteria: BlogSearchCriteria, request: SearchRequest) => {
  return useQuery({
    queryKey: blogKeys.list(criteria, request),
    queryFn: () => BlogApi.search(criteria, request),
  });
};

export const useBlog = (uuid: string, enabled = true) => {
  return useQuery({
    queryKey: blogKeys.detail(uuid),
    queryFn: () => BlogApi.getByUuid(uuid),
    enabled,
  });
};

export const useBlogComments = (id: number, request: SearchRequest) => {
  return useQuery({
    queryKey: blogKeys.comments(id, request),
    queryFn: () => BlogApi.getComments(id, request),
  });
};

export const useBlogCommentsCount = (id: number) => {
  return useQuery({
    queryKey: blogKeys.commentsCount(id),
    queryFn: () => BlogApi.getCommentsCount(id),
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BlogApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BlogApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
};

// Admin Blog Hooks
export const useAdminBlogSearch = (criteria: BlogSearchCriteria, request: SearchRequest) => {
  return useQuery({
    queryKey: [...blogKeys.all, 'admin', { criteria, request }],
    queryFn: () => AdminBlogApi.search(criteria, request),
  });
};
