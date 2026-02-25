import { apiClient } from '@/lib/api-client';
import type {
    ApiResponse,
    PresignedFileInformation,
    PresignedUrlDto
} from '@/types/api';

export const StorageApi = {
    // POST /storage/presign - Get a presigned URL for uploading a file to storage
    getPresignedUrl: async (fileInformation: PresignedFileInformation): Promise<ApiResponse<PresignedUrlDto>> => {
        const response = await apiClient.post<ApiResponse<PresignedUrlDto>>('/storage/presign', fileInformation);
        return response.data;
    },
    // POST /storage/presign/batch - Get a presigned URL for uploading a file to storage
    getBatchPresignedUrl: async (filesInformation: PresignedFileInformation[]): Promise<ApiResponse<PresignedUrlDto[]>> => {
        const response = await apiClient.post<ApiResponse<PresignedUrlDto[]>>('/storage/presign/batch', filesInformation);
        return response.data;
    },
    uploadObjectToStorage: async (presignedUrl: string, file: File): Promise<void> => {
        const response = await apiClient.put(presignedUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
        });

    return response.data;
    }
}