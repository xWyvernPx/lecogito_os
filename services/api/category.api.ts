import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  ApiListResponse,
  CategoryDto,
  SearchRequest,
} from '@/types/api';

export const CategoryApi = {
  // GET /api/v1/category - Search categories
  search: async (requestParams: SearchRequest): Promise<ApiListResponse<CategoryDto>> => {
    const response = await apiClient.get<ApiListResponse<CategoryDto>>('/category', {
      params: requestParams,
    });
    return response.data;
  },

  // POST /api/v1/category - Create category
  create: async (category: Partial<CategoryDto>): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.post<ApiResponse<boolean>>('/category', category);
    return response.data;
  },
};
