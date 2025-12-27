
import { Pagination } from '../projects/types'; // Reusing existing pagination type

export interface CommentDto {
  id: number;
  content: string;
  author: string; // Name
  email: string;
  path?: string;
  hasReplies?: boolean;
  createdDate?: string;
  lastModifiedDate?: string;
  blogPostId?: number;
  parentId?: number | null;
}

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
