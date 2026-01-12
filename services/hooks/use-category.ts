import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CategoryApi } from '../api/category.api';
import type { SearchRequest, CategoryDto } from '@/types/api';

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (requestParams: SearchRequest) => [...categoryKeys.lists(), requestParams] as const,
};

// Hooks
export const useCategories = (requestParams: SearchRequest) => {
  return useQuery({
    queryKey: categoryKeys.list(requestParams),
    queryFn: () => CategoryApi.search(requestParams),
    enabled: true,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category: Partial<CategoryDto>) => CategoryApi.create(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};

export const  useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => CategoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}