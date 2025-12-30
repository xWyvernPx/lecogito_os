import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  ApiListResponse,
  CommentDto,
  SearchRequest,
} from '@/types/api';

export const CommentApi = {
  // GET /api/v1/comment - Get comments by blog path
  getByBlogPath: async (
    path: string,
    searchRequest: SearchRequest
  ): Promise<ApiListResponse<CommentDto>> => {
    const response = await apiClient.get<ApiListResponse<CommentDto>>('/comment', {
      params: { path, ...searchRequest },
    });
    return response.data;
  },

  // POST /api/v1/comment - Create comment
  create: async (comment: Partial<CommentDto>): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/comment', comment);
    return response.data;
  },

  // PUT /api/v1/comment - Update comment
  update: async (comment: CommentDto): Promise<ApiResponse<any>> => {
    const response = await apiClient.put<ApiResponse<any>>('/comment', comment);
    return response.data;
  },

  // DELETE /api/v1/comment/{commentId} - Delete comment
  delete: async (commentId: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete<ApiResponse<any>>(`/comment/${commentId}`);
    return response.data;
  },
};
