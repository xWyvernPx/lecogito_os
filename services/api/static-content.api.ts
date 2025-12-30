import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  ApiListResponse,
  StaticContentDto,
  SearchRequest,
} from '@/types/api';

export const StaticContentApi = {
  // GET /api/v1/static-content - Search static content
  search: async (
    key?: string,
    request?: SearchRequest
  ): Promise<ApiListResponse<StaticContentDto>> => {
    const response = await apiClient.get<ApiListResponse<StaticContentDto>>('/static-content', {
      params: { key: key || '', ...request },
    });
    return response.data;
  },

  // GET /api/v1/static-content/{key} - Get static content by key
  getByKey: async (key: string): Promise<ApiResponse<StaticContentDto>> => {
    const response = await apiClient.get<ApiResponse<StaticContentDto>>(`/static-content/${key}`);
    return response.data;
  },

  // GET /api/v1/static-content/type/{type} - Get static content by type
  getByType: async (type: 'PERSONAL'): Promise<ApiResponse<StaticContentDto[]>> => {
    const response = await apiClient.get<ApiResponse<StaticContentDto[]>>(
      `/static-content/type/${type}`
    );
    return response.data;
  },

  // POST /api/v1/static-content - Create static content
  create: async (content: Partial<StaticContentDto>): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.post<ApiResponse<boolean>>('/static-content', content);
    return response.data;
  },

  // PUT /api/v1/static-content/{key} - Update static content
  update: async (key: string, content: StaticContentDto): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.put<ApiResponse<boolean>>(`/static-content/${key}`, content);
    return response.data;
  },
};
