import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  AuthRequest,
  RefreshTokenRequest,
  UserDto,
  ManualAuth,
  GoogleFormAuthWebhookRequest,
  AuthVerificationRequest,
  LoginResponseDto,
  RefreshResponseDto,
} from '@/types/api';

export const AuthApi = {
  // POST /api/v1/auth/login - Login with email
  login: async (request: AuthRequest): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.post<ApiResponse<boolean>>('/auth/login', request);
    return response.data;
  },

  // POST /api/v1/auth/refresh-token - Refresh access token
  refreshToken: async (request: RefreshTokenRequest): Promise<ApiResponse<RefreshResponseDto>> => {
    const response = await apiClient.post<ApiResponse<RefreshResponseDto>>('/auth/refresh-token', request);
    return response.data;
  },

  // GET /api/v1/auth/verify - Verify token (returns login response)
  verify: async (request: AuthVerificationRequest): Promise<ApiResponse<LoginResponseDto>> => {
    const response = await apiClient.get<ApiResponse<LoginResponseDto>>('/auth/verify', { 
      params: { token: request.code, email: request.email } 
    });
    return response.data;
  },

  // GET /api/v1/auth/me - Get current user (requires auth)
  getMe: async (): Promise<ApiResponse<UserDto>> => {
    const response = await apiClient.get<ApiResponse<UserDto>>('/auth/me');
    return response.data;
  },
};

// Auth Webhook API
export const AuthWebhookApi = {
  // POST /api/v1/auth/webhook/manual - Manual auth webhook
  manual: async (request: ManualAuth): Promise<void> => {
    await apiClient.post('/auth/webhook/manual', request);
  },

  // POST /api/v1/auth/webhook/gg-form - Google Form auth webhook
  googleForm: async (request: GoogleFormAuthWebhookRequest): Promise<void> => {
    await apiClient.post('/auth/webhook/gg-form', request);
  },
};
