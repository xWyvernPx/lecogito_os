
import type { CommentDto } from '@/types/api';\nimport type { ApiListResponseCommentDto, CommentSearchRequest, CreateCommentRequest } from './types';

// Mock Data Store
let MOCK_COMMENTS: CommentDto[] = [
    {
        id: 101,
        author: 'CyberPunk_Fan',
        email: 'fan@net.com',
        content: 'This archive contains critical intel. Great work on the documentation.',
        createdDate: '2025-01-15T10:30:00Z',
        blogPostId: 1,
        path: '/blog/1',
        parentId: null,
        hasReplies: true
    },
    {
        id: 102,
        author: 'LegacyDrifter',
        email: 'drifter@void.net',
        content: 'I encountered a similar anomaly in the React 18 update. The suspense boundaries were unstable.',
        createdDate: '2025-01-16T14:20:00Z',
        blogPostId: 1,
        path: '/blog/1',
        parentId: null,
        hasReplies: false
    },
    {
        id: 103,
        author: 'SystemAdmin',
        email: 'admin@sys.com',
        content: 'Acknowledged. The documentation has been updated to reflect the new protocols.',
        createdDate: '2025-01-15T12:00:00Z',
        blogPostId: 1,
        path: '/blog/1',
        parentId: 101, // Reply to 101
        hasReplies: false
    }
];

export const fetchCommentsByBlog = async (req: CommentSearchRequest): Promise<ApiListResponseCommentDto> => {
    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Filter by Blog ID
    const filtered = MOCK_COMMENTS.filter(c => c.blogPostId === req.blogId);
    
    // Sort descending by date (Newest first)
    filtered.sort((a, b) => new Date(b.createdDate!).getTime() - new Date(a.createdDate!).getTime());

    return {
        pagination: {
            pageIndex: req.pageIndex,
            pageSize: req.pageSize,
            totalRows: filtered.length,
            sort: ['createdDate,desc']
        },
        rows: filtered,
        message: 'Success',
        success: true,
        status: 200
    };
};

export const createComment = async (payload: CreateCommentRequest): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const newComment: CommentDto = {
        id: Math.floor(Math.random() * 10000) + 1000,
        ...payload,
        createdDate: new Date().toISOString(),
        lastModifiedDate: new Date().toISOString(),
        hasReplies: false,
        parentId: payload.parentId || null
    };

    MOCK_COMMENTS.push(newComment);
    return true;
};

export const deleteComment = async (commentId: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    MOCK_COMMENTS = MOCK_COMMENTS.filter(c => c.id !== commentId);
    return true;
};
