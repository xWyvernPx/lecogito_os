// ==================== Base API Response Types ====================

export interface ApiResponse<T = any> {
  status: number;
  message: string;
  success: boolean;
  data: T;
}

export interface ApiListResponse<T> {
  pagination: Pagination;
  rows: T[];
  message: string;
  success: boolean;
  status: number;
}

export interface Pagination {
  pageIndex: number;
  pageSize: number;
  sort?: string[];
  totalRows: number;
}

export interface SearchRequest {
  pageIndex?: number;
  pageSize?: number;
  sort?: string[];
  totalRows?: number;
  keyword?: string;
}

// ==================== Domain Models ====================

export interface UserDto {
  id: number;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: 'ADMIN' | 'USER' | 'CONTRIBUTOR';
}

export interface BlogDto {
  id: number;
  title: string;
  content: string;
  description: string;
  contentType: 'RICH_TEXT' | 'MARKDOWN' | 'CODE_BLOCK' | 'BLOCK';
  status: 'DRAFT' | 'PUBLIC' | 'PRIVATE';
  thumbnailUrl: string;
  published: boolean;
  uuid: string;
  viewCount: number;
  author: UserDto;
  serie?: SerieDto;
  category?: CategoryDto;
  tags: TagDto[];
  createdDate?: string;
  lastModifiedDate?: string;
}

export interface SerieDto {
  id?: number;
  name: string;
  slug?: string;
  coverUrl?: string;
  uuid?: string;
  description?: string;
  postCount?: number;
  createdDate?: string;
  lastModifiedDate?: string;
  enabled?: boolean;
  deleted?: boolean;
}

export interface CategoryDto {
  id: number;
  name: string;
  slug: string;
  path: string;
  createdDate?: string;
  lastModifiedDate?: string;
  enabled?: boolean;
  deleted?: boolean;
}

export interface TagDto {
  id: number;
  name: string;
  enabled?: boolean;
  deleted?: boolean;
}

export interface CommentDto {
  id: number;
  content: string;
  author: string;
  email: string;
  path: string;
  hasReplies: boolean;
  createdDate?: string;
  lastModifiedDate?: string;
  blogPostId: number;
  blogPost?: BlogDto;
}

export interface ProjectDto {
  id: number;
  name: string;
  description: string;
  detail: string;
  thumbnailUrl: string;
  published: boolean;
  sourceUrl: string;
  demoUrl: string;
  type: 'OFFICIAL' | 'SIDE_PROJECT' | 'OPEN_SOURCE' | 'CLOSED_SOURCE' | 'INTERNAL' | 'EXTENSION';
  createdDate?: string;
  lastModifiedDate?: string;
}

export interface StaticContentDto {
  key: string;
  value: string;
  description: string;
  type: 'PERSONAL';
}

// ==================== Search Criteria ====================

export interface BlogSearchCriteria {
  keyword?: string;
  categoryIds?: number[];
  tagIds?: number[];
  serieIds?: number[];
  authorIds?: number[];
}

// ==================== Auth Types ====================

export interface AuthRequest {
  email: string;
}

export interface AuthVerificationRequest {
  email: string;
  code: string;
}

export interface RefreshTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export interface ManualAuth {
  email: string;
  name: string;
  avatarUrl: string;
}

export interface GoogleFormAuthWebhookRequest {
  Email: string;
  "What's your name (Display on site)": string;
  "Avatar (optional)": string[];
}

// ==================== Auth Response Types ====================
export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

export interface RefreshResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  tokenExpires: number | null;
  user: UserDto | null;
  isAuthenticated: boolean;
}

// ==================== API Error response ====================
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
}
