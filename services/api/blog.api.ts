import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  ApiListResponse,
  BlogDto,
  BlogSearchCriteria,
  SearchRequest,
  CommentDto,
} from '@/types/api';

export const BlogApi = {
  // GET /api/v1/blog - Search blogs
  search: async (
    criteria: BlogSearchCriteria,
    request: SearchRequest
  ): Promise<ApiListResponse<BlogDto>> => {
    const response = await apiClient.get<ApiListResponse<BlogDto>>('/blog', {
      params: { ...criteria, ...request },
    });
    return response.data;
  },

  // GET /api/v1/blog/{uuid} - Get blog by UUID
  getByUuid: async (uuid: string): Promise<ApiResponse<BlogDto>> => {
    const response = await apiClient.get<ApiResponse<BlogDto>>(`/blog/${uuid}`);
    return response.data;
  },

  // POST /api/v1/blog - Create blog (requires auth)
  create: async (blog: Partial<BlogDto>): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.post<ApiResponse<boolean>>('/blog', blog);
    return response.data;
  },

  // PUT /api/v1/blog - Update blog
  update: async (blog: BlogDto): Promise<boolean> => {
    const response = await apiClient.put<boolean>('/blog', blog);
    return response.data;
  },

  // GET /api/v1/blog/{id}/comments - Get comments for a blog
  getComments: async (
    id: number,
    request: SearchRequest
  ): Promise<ApiListResponse<CommentDto>> => {
    const response = await apiClient.get<ApiListResponse<CommentDto>>(
      `/blog/${id}/comments`,
      { params: request }
    );
    return response.data;
  },

  // GET /api/v1/blog/{id}/comments/count - Count comments for a blog
  getCommentsCount: async (id: number): Promise<ApiResponse<number>> => {
    const response = await apiClient.get<ApiResponse<number>>(
      `/blog/${id}/comments/count`
    );
    return response.data;
  },
};

// Admin Blog API
export const AdminBlogApi = {
  // GET /api/v1/admin/blog - Admin search blogs
  search: async (
    criteria: BlogSearchCriteria,
    request: SearchRequest
  ): Promise<ApiListResponse<BlogDto>> => {
    const response = await apiClient.get<ApiListResponse<BlogDto>>('/admin/blog', {
      params: { ...criteria, ...request },
    });
    return response.data;
  },
};
