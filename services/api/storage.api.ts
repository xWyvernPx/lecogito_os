import { apiClient } from '@/lib/api-client';
import type {
    ApiResponse,
    PresignedFileInformation,
    PresignedUrlDto
} from '@/types/api';

export const StorageApi = {
    // POST /storage/presign - Get a presigned URL for uploading a file to storage
    getPresignedUrl: async (fileInformation: PresignedFileInformation): Promise<ApiResponse<PresignedUrlDto>> => {
        const response = await apiClient.post<ApiResponse<PresignedUrlDto>>('/presign', fileInformation);
        return response.data;
    },
    // POST /storage/presign/batch - Get a presigned URL for uploading a file to storage
    getBatchPresignedUrl: async (filesInformation: PresignedFileInformation[]): Promise<ApiResponse<PresignedUrlDto[]>> => {
        const response = await apiClient.post<ApiResponse<PresignedUrlDto[]>>('/presign/batch', filesInformation);
        return response.data;
    }
}