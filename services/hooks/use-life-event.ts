import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LifeEventApi } from '../api/life-event.api';
import type { LifeEventCreateRequest } from '@/types/api';

export const lifeEventKeys = {
    all: ['life-events'] as const,
    detail: (id: number) => [...lifeEventKeys.all, id] as const,
};

export const useLifeEvents = () => {
    return useQuery({
        queryKey: lifeEventKeys.all,
        queryFn: () => LifeEventApi.getAll(),
    });
};

export const useLifeEvent = (id: number) => {
    return useQuery({
        queryKey: lifeEventKeys.detail(id),
        queryFn: () => LifeEventApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateLifeEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LifeEventCreateRequest) => LifeEventApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lifeEventKeys.all });
        },
    });
};

export const useUpdateLifeEvent = (id: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<LifeEventCreateRequest>) => LifeEventApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lifeEventKeys.all });
            queryClient.invalidateQueries({ queryKey: lifeEventKeys.detail(id) });
        },
    });
};

export const useDeleteLifeEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => LifeEventApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lifeEventKeys.all });
        },
    });
};
