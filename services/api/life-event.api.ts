import { apiClient } from '@/lib/api-client';
import type {
    ApiResponse,
    ApiListResponse,
    LifeEventCreateRequest,
    LifeEventDto,
} from '@/types/api';

export const LifeEventApi = {
    // GET /life-event - Get all life events
    getAll: async (): Promise<ApiListResponse<LifeEventDto>> => {
        const response = await apiClient.get<ApiListResponse<LifeEventDto>>('/life-event');
        return response.data;
    },

    // GET /life-event/{id} - Get life event by ID
    getById: async (id: number): Promise<ApiResponse<LifeEventDto>> => {
        const response = await apiClient.get<ApiResponse<LifeEventDto>>(`/life-event/${id}`);
        return response.data;
    },

    // POST /life-event - Create new life event
    create: async (data: LifeEventCreateRequest): Promise<ApiResponse<LifeEventDto>> => {
        const response = await apiClient.post<ApiResponse<LifeEventDto>>('/life-event', data);
        return response.data;
    },

    // PUT /life-event/{id} - Update life event
    update: async (id: number, data: Partial<LifeEventCreateRequest>): Promise<ApiResponse<LifeEventDto>> => {
        const response = await apiClient.put<ApiResponse<LifeEventDto>>(`/life-event/${id}`, data);
        return response.data;
    },

    // DELETE /life-event/{id} - Delete life event
    delete: async (id: number): Promise<ApiResponse<boolean>> => {
        const response = await apiClient.delete<ApiResponse<boolean>>(`/life-event/${id}`);
        return response.data;
    },
};
