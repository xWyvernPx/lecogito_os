/**
 * Comment data hooks — facade that selects mock or real API layer.
 * Consumers import from this file and never know which backend is active.
 */
import { USE_MOCK_API } from '@/lib/env';
import {
    useComments as useCommentsMock,
    useCreateComment as useCreateCommentMock,
    useDeleteComment as useDeleteCommentMock,
} from './use-comments-mock';
import {
    useCommentsByPath,
    useCreateComment as useCreateCommentReal,
    useDeleteComment as useDeleteCommentReal,
} from '@/services/hooks/use-comment';

/**
 * Adapter: wraps the real `useCommentsByPath` to match mock interface (blogId-based).
 */
const useCommentsAdapter = (blogId: number) => {
    return useCommentsByPath(`/blog/${blogId}`, { pageIndex: 0, pageSize: 50 });
};

export const useComments = USE_MOCK_API ? useCommentsMock : useCommentsAdapter;
export const useCreateComment = USE_MOCK_API ? useCreateCommentMock : useCreateCommentReal;
export const useDeleteComment = USE_MOCK_API ? useDeleteCommentMock : useDeleteCommentReal;
