import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SerieApi } from '../api/serie.api';
import type { SearchRequest, SerieDto, BlogSearchCriteria } from '@/types/api';

// Query Keys
export const serieKeys = {
  all: ['series'] as const,
  lists: () => [...serieKeys.all, 'list'] as const,
  list: (requestParams: SearchRequest) => [...serieKeys.lists(), requestParams] as const,
  details: () => [...serieKeys.all, 'detail'] as const,
  detail: (id: string) => [...serieKeys.details(), id] as const,
  blogs: (id: number, requestParams: SearchRequest, criteria: BlogSearchCriteria) =>
    [...serieKeys.all, 'blogs', id, { requestParams, criteria }] as const,
};

// Hooks
export const useSeries = (requestParams: SearchRequest) => {
  return useQuery({
    queryKey: serieKeys.list(requestParams),
    queryFn: () => SerieApi.search(requestParams),
  });
};

export const useSerie = (id: string, enabled = true) => {
  return useQuery({
    queryKey: serieKeys.detail(id),
    queryFn: () => SerieApi.getById(id),
    enabled,
  });
};

export const useSerieBlogs = (
  id: number,
  requestParams: SearchRequest,
  criteria: BlogSearchCriteria
) => {
  return useQuery({
    queryKey: serieKeys.blogs(id, requestParams, criteria),
    queryFn: () => SerieApi.getBlogs(id, requestParams, criteria),
  });
};

export const useCreateSerie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serie: Partial<SerieDto>) => SerieApi.create(serie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serieKeys.lists() });
    },
  });
};

export const useUpdateSerie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, serie }: { id: number; serie: Partial<SerieDto> }) =>
      SerieApi.update(id, serie),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: serieKeys.lists() });
      queryClient.invalidateQueries({ queryKey: serieKeys.detail(variables.id.toString()) });
    },
  });
};

export const useDeleteSerie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => SerieApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serieKeys.lists() });
    },
  });
};
