import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TagApi } from '../api/tag.api';
import type { SearchRequest, TagDto } from '@/types/api';

// Query Keys
export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'list'] as const,
  list: (requestParams: SearchRequest) => [...tagKeys.lists(), requestParams] as const,
};

// Hooks
export const useTags = (requestParams: SearchRequest) => {
  return useQuery({
    queryKey: tagKeys.list(requestParams),
    queryFn: () => TagApi.search(requestParams),
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tag: Partial<TagDto>) => TagApi.create(tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
  });
};
