/**
 * Project data hooks — facade that selects mock or real API layer.
 * Consumers import from this file and never know which backend is active.
 */
import { USE_MOCK_API } from '@/lib/env';
import {
    useProjects as useProjectsMock,
    useProject as useProjectMock,
} from './use-projects-mock';
import {
    useProjects as useProjectsReal,
    useProject as useProjectReal,
} from '@/services/hooks/use-project';
import { useOSStore } from '@/features/os/stores/os-store';
import type { ApiListResponse, ApiResponse, ProjectDto } from '@/types/api';

/**
 * Adapter that wraps the real `useProjects` hook to match the mock interface
 * (no parameters — language is read from the OS store).
 */
const useProjectsAdapter = () => {
    const { language } = useOSStore();
    return useProjectsReal({
        request: { pageIndex: 0, pageSize: 20 },
        keyword: undefined,
        type: undefined,
    }) as ReturnType<typeof useProjectsMock>;
};

/**
 * Adapter that wraps the real `useProject` hook to match the mock interface
 * (optional id, auto-disabled when undefined).
 */
const useProjectAdapter = (id?: number) => {
    return useProjectReal(id ?? 0, !!id) as ReturnType<typeof useProjectMock>;
};

export const useProjects = USE_MOCK_API ? useProjectsMock : useProjectsAdapter;
export const useProject = USE_MOCK_API ? useProjectMock : useProjectAdapter;
