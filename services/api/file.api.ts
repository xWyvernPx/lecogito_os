import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api';

export const FileApi = {
  // POST /api/v1/file - Upload file
  upload: async (file: File, path: string = '/'): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<string>>('/file', formData, {
      params: { path },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
