import { PresignedFileInformation, PresignedUrlDto } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StorageApi } from "../api/storage.api";

export const storageKeys = {
  all: ['storage'] as const,
  item: (key: string) => [...storageKeys.all, key] as const,
};

export const useCreateBatchPresignUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: Partial<PresignedFileInformation[]>) => StorageApi.getBatchPresignedUrl(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storageKeys.all });
    },
  });
};


export const useCreatePresignUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: PresignedFileInformation) => StorageApi.getPresignedUrl(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storageKeys.all });
    },
  });
};
