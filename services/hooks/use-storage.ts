import { PresignedFileInformation, PresignedUrlDto } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StorageApi } from "../api/storage.api";


export const storageKeys = {
  all: ['storage'] as const,
  item: (key: string) => [...storageKeys.all, key] as const,
};

interface BatchPresignParams {
  files: PresignedFileInformation[]; // Note: Moved Partial inside the array for better type safety
  path: string; 
}


export const useCreateBatchPresignUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: BatchPresignParams) => StorageApi.getBatchPresignedUrl(params.files, params.path),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storageKeys.all });
    },
  });
};


interface PresignParams {
  file: PresignedFileInformation;
  path: string; 
}


export const useCreatePresignUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PresignParams) => StorageApi.getPresignedUrl(params.file, params.path),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storageKeys.all });
    },
  });
};
