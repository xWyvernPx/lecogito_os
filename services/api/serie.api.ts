import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  ApiListResponse,
  SerieDto,
  BlogDto,
  BlogSearchCriteria,
  SearchRequest,
} from '@/types/api';

export const SerieApi = {
  // GET /api/v1/series - Search series
  search: async (requestParams: SearchRequest): Promise<ApiListResponse<SerieDto>> => {
    const response = await apiClient.get<ApiListResponse<SerieDto>>('/series', {
      params: requestParams,
    });
    return response.data;
  },

  // GET /api/v1/series/{id} - Get serie by ID
  getById: async (id: string): Promise<ApiResponse<SerieDto>> => {
    const response = await apiClient.get<ApiResponse<SerieDto>>(`/series/${id}`);
    return response.data;
  },

  // POST /api/v1/series - Create serie
  create: async (serie: Partial<SerieDto>): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.post<ApiResponse<boolean>>('/series', serie);
    return response.data;
  },

  // PUT /api/v1/series/{id} - Update serie
  update: async (id: number, serie: Partial<SerieDto>): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.put<ApiResponse<boolean>>(`/series/${id}`, serie);
    return response.data;
  },

  // DELETE /api/v1/series/{id} - Delete serie
  delete: async (id: number): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/series/${id}`);
    return response.data;
  },

  // GET /api/v1/series/{id}/blogs - Get blogs in a serie
  getBlogs: async (
    id: number,
    requestParams: SearchRequest,
    criteria: BlogSearchCriteria
  ): Promise<ApiListResponse<BlogDto>> => {
    const response = await apiClient.get<ApiListResponse<BlogDto>>(`/series/${id}/blogs`, {
      params: { ...requestParams, ...criteria },
    });
    return response.data;
  },
};
