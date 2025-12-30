import { useMutation } from '@tanstack/react-query';
import { FileApi } from '../api/file.api';

// Hooks
export const useUploadFile = () => {
  return useMutation({
    mutationFn: ({ file, path = '/' }: { file: File; path?: string }) =>
      FileApi.upload(file, path),
  });
};
