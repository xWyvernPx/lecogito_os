
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCommentsByBlog, createComment, deleteComment } from '../api';
import { CreateCommentRequest } from '../types';

export const useComments = (blogId: number) => {
    return useQuery({
        queryKey: ['comments', blogId],
        queryFn: () => fetchCommentsByBlog({ pageIndex: 0, pageSize: 50, blogId }),
        staleTime: 1000 * 60, // 1 min
    });
};

export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCommentRequest) => createComment(data),
        onSuccess: (_, variables) => {
            // Invalidate the comments list for the specific blog post
            queryClient.invalidateQueries({ queryKey: ['comments', variables.blogPostId] });
        }
    });
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: number) => deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] });
        }
    });
};
