import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  ApiListResponse,
  UserDto,
  SearchRequest,
} from '@/types/api';

export const UserApi = {
  // GET /api/v1/user - Search users
  search: async (requestParams: SearchRequest): Promise<ApiListResponse<UserDto>> => {
    const response = await apiClient.get<ApiListResponse<UserDto>>('/user', {
      params: requestParams,
    });
    return response.data;
  },

  // GET /api/v1/user/unregistered - Get unregistered user by email
  getUnregistered: async (email: string): Promise<string> => {
    const response = await apiClient.get<string>('/user/unregistered', {
      params: { email },
    });
    return response.data;
  },

  // GET /api/v1/user/register-notification - Register for notifications
  registerNotification: async (email: string): Promise<string> => {
    const response = await apiClient.get<string>('/user/register-notification', {
      params: { email },
    });
    return response.data;
  },
};
