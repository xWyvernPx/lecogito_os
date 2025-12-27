
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchProjectById } from '../api';
import { ApiListResponseProjectDto, ApiProjectDetailResponseDto } from '../types';
import { useOSStore } from '../../os/stores/os-store';

export const useProjects = () => {
  const { language } = useOSStore();

  return useQuery<ApiListResponseProjectDto>({
    queryKey: ['projects', language], // Add language to key to trigger refetch on change
    queryFn: () => fetchProjects({ pageIndex: 0, pageSize: 20, language }), 
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProject = (id?: number) => {
  return useQuery<ApiProjectDetailResponseDto>({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
