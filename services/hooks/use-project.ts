import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectApi } from '../api/project.api';
import type { SearchRequest, ProjectDto } from '@/types/api';

// Query Keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (params: { request: SearchRequest; keyword?: string; type?: ProjectDto['type'] }) =>
    [...projectKeys.lists(), params] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: number) => [...projectKeys.details(), id] as const,
};

// Hooks
export const useProjects = (params: {
  request: SearchRequest;
  keyword?: string;
  type?: ProjectDto['type'];
}) => {
  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: () => ProjectApi.search(params),
  });
};

export const useProject = (id: number, enabled = true) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => ProjectApi.getById(id),
    enabled,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (project: Partial<ProjectDto>) => ProjectApi.create(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, project }: { id: number; project: Partial<ProjectDto> }) =>
      ProjectApi.update(id, project),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
    },
  });
};
