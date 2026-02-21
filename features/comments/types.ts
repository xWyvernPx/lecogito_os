/**
 * Feature-specific types for the Comments module.
 * Canonical API types (CommentDto, Pagination, ApiListResponse, etc.)
 * are imported from @/types/api.ts — never duplicate them here.
 */
import type { Pagination, CommentDto } from '@/types/api';

export interface CreateCommentRequest {
  content: string;
  author: string;
  email: string;
  blogPostId: number;
  path: string;
  parentId?: number | null;
}

export interface ApiListResponseCommentDto {
  pagination: Pagination;
  rows: CommentDto[];
  message: string;
  success: boolean;
  status: number;
}

export interface CommentSearchRequest {
  pageIndex: number;
  pageSize: number;
  blogId: number;
  keyword?: string;
}
