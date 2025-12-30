import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  ApiListResponse,
  TagDto,
  SearchRequest,
} from '@/types/api';

export const TagApi = {
  // GET /api/v1/tag - Search tags
  search: async (requestParams: SearchRequest): Promise<ApiListResponse<TagDto>> => {
    const response = await apiClient.get<ApiListResponse<TagDto>>('/tag', {
      params: requestParams,
    });
    return response.data;
  },

  // POST /api/v1/tag - Create tag
  create: async (tag: Partial<TagDto>): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.post<ApiResponse<boolean>>('/tag', tag);
    return response.data;
  },
};
