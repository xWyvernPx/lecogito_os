import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  ApiListResponse,
  ProjectDto,
  SearchRequest,
} from '@/types/api';

export const ProjectApi = {
  // GET /api/v1/project - Search projects
  search: async (params: {
    request: SearchRequest;
    keyword?: string;
    type?: ProjectDto['type'];
  }): Promise<ApiListResponse<ProjectDto>> => {
    const response = await apiClient.get<ApiListResponse<ProjectDto>>('/project', {
      params: {
        ...params.request,
        keyword: params.keyword,
        type: params.type,
      },
    });
    return response.data;
  },

  // GET /api/v1/project/{id} - Get project by ID
  getById: async (id: number): Promise<ApiResponse<ProjectDto>> => {
    const response = await apiClient.get<ApiResponse<ProjectDto>>(`/project/${id}`);
    return response.data;
  },

  // POST /api/v1/project - Create project
  create: async (project: Partial<ProjectDto>): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.post<ApiResponse<boolean>>('/project', project);
    return response.data;
  },

  // PUT /api/v1/project/{id} - Update project
  update: async (id: number, project: Partial<ProjectDto>): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.put<ApiResponse<boolean>>(`/project/${id}`, project);
    return response.data;
  },
};
