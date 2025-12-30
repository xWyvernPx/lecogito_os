import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentApi } from '../api/comment.api';
import type { SearchRequest, CommentDto } from '@/types/api';

// Query Keys
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (path: string, searchRequest: SearchRequest) =>
    [...commentKeys.lists(), { path, searchRequest }] as const,
};

// Hooks
export const useCommentsByPath = (path: string, searchRequest: SearchRequest) => {
  return useQuery({
    queryKey: commentKeys.list(path, searchRequest),
    queryFn: () => CommentApi.getByBlogPath(path, searchRequest),
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: Partial<CommentDto>) => CommentApi.create(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: CommentDto) => CommentApi.update(comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => CommentApi.delete(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
  });
};
