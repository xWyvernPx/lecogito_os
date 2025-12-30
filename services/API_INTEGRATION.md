# API Integration Documentation

This directory contains the complete API integration layer for the Cogito OS application, including TypeScript types, API services, and React Query hooks.

## 📁 Structure

```
services/
├── api/                    # API service layer
│   ├── auth.api.ts        # Authentication endpoints
│   ├── blog.api.ts        # Blog CRUD operations
│   ├── category.api.ts    # Category management
│   ├── comment.api.ts     # Comment operations
│   ├── file.api.ts        # File upload
│   ├── project.api.ts     # Project management
│   ├── serie.api.ts       # Series management
│   ├── static-content.api.ts # Static content
│   ├── tag.api.ts         # Tag management
│   ├── user.api.ts        # User operations
│   └── index.ts           # Barrel export
│
├── hooks/                 # React Query hooks
│   ├── use-auth.ts
│   ├── use-blog.ts
│   ├── use-category.ts
│   ├── use-comment.ts
│   ├── use-file.ts
│   ├── use-project.ts
│   ├── use-serie.ts
│   ├── use-static-content.ts
│   ├── use-tag.ts
│   ├── use-user.ts
│   └── index.ts
│
types/
└── api.ts                 # Complete TypeScript definitions

lib/
└── api-client.ts          # Axios instance with interceptors
```

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file:

```bash
VITE_API_URL=http://localhost:5025/api/v1  # For local development
# VITE_API_URL=https://cogito.wyvernp.id.vn/api/v1  # For production
```

### 2. Using API Hooks

```tsx
import { useBlogSearch, useProject, useCreateComment } from '@/services/hooks';

function MyComponent() {
  // Fetch data
  const { data, isLoading, error } = useBlogSearch(
    { keyword: 'react' }, 
    { pageIndex: 0, pageSize: 10 }
  );

  // Mutations
  const createComment = useCreateComment();
  
  const handleSubmit = async (comment) => {
    await createComment.mutateAsync(comment);
  };

  return (
    // Your UI
  );
}
```

### 3. Direct API Usage

```tsx
import { BlogApi } from '@/services/api';

// Use directly without React Query
const blogs = await BlogApi.search(
  { keyword: 'typescript' },
  { pageIndex: 0, pageSize: 10 }
);
```

## 📖 Available Hooks

### Authentication

```tsx
// Get current user
const { data: user } = useMe();

// Login
const login = useLogin();
await login.mutateAsync({ email: 'user@example.com' });

// Refresh token
const refresh = useRefreshToken();
await refresh.mutateAsync({ accessToken, refreshToken });
```

### Blog Operations

```tsx
// Search blogs
const { data } = useBlogSearch(
  { keyword: 'react', categoryIds: [1, 2] },
  { pageIndex: 0, pageSize: 20 }
);

// Get single blog
const { data: blog } = useBlog('uuid-here');

// Get blog comments
const { data: comments } = useBlogComments(blogId, { pageIndex: 0, pageSize: 10 });

// Create blog (auth required)
const createBlog = useCreateBlog();
await createBlog.mutateAsync({ title: 'New Post', content: '...' });

// Update blog
const updateBlog = useUpdateBlog();
await updateBlog.mutateAsync(blogData);
```

### Project Operations

```tsx
// Search projects
const { data } = useProjects({
  request: { pageIndex: 0, pageSize: 10 },
  keyword: 'portfolio',
  type: 'SIDE_PROJECT'
});

// Get single project
const { data: project } = useProject(projectId);

// Create/Update
const createProject = useCreateProject();
const updateProject = useUpdateProject();
```

### Comment Operations

```tsx
// Get comments by blog path
const { data } = useCommentsByPath('/blog/my-post', { pageIndex: 0 });

// Create comment
const createComment = useCreateComment();
await createComment.mutateAsync({
  content: 'Great post!',
  author: 'John Doe',
  email: 'john@example.com',
  path: '/blog/my-post',
  blogPostId: 123
});

// Delete comment
const deleteComment = useDeleteComment();
await deleteComment.mutateAsync(commentId);
```

### Series/Categories/Tags

```tsx
// Get series
const { data: series } = useSeries({ pageIndex: 0, pageSize: 20 });

// Get categories
const { data: categories } = useCategories({ pageIndex: 0, pageSize: 50 });

// Get tags
const { data: tags } = useTags({ pageIndex: 0, pageSize: 100 });

// Get blogs in a series
const { data: serieBlogs } = useSerieBlogs(
  serieId,
  { pageIndex: 0 },
  { keyword: 'tutorial' }
);
```

### Static Content

```tsx
// Get static content by type
const { data } = useStaticContentByType('PERSONAL');

// Get by key
const { data } = useStaticContent('about-me');

// Search
const { data } = useStaticContentSearch('key-prefix');

// Update
const updateContent = useUpdateStaticContent();
await updateContent.mutateAsync({
  key: 'about-me',
  content: { key: 'about-me', value: 'Updated content', ... }
});
```

### File Upload

```tsx
const uploadFile = useUploadFile();

const handleFileUpload = async (file: File) => {
  const result = await uploadFile.mutateAsync({ 
    file, 
    path: '/uploads/images' 
  });
  console.log('File URL:', result.data);
};
```

## 🔐 Authentication Flow

The API client automatically handles:

1. **Token Injection**: Adds `Authorization: Bearer <token>` header to requests
2. **Token Refresh**: Automatically refreshes expired tokens
3. **Error Handling**: Redirects to login on 401 errors
4. **Token Storage**: Uses localStorage for token persistence

```tsx
// Tokens are stored automatically after login
localStorage.setItem('accessToken', token);
localStorage.setItem('refreshToken', refreshToken);

// Cleared on logout or token refresh failure
```

## 📝 TypeScript Types

All API types are defined in `types/api.ts`:

```tsx
import type { 
  BlogDto, 
  ProjectDto, 
  CommentDto,
  ApiResponse,
  ApiListResponse 
} from '@/types/api';
```

### Common Types

- `ApiResponse<T>` - Single item response wrapper
- `ApiListResponse<T>` - Paginated list response
- `SearchRequest` - Pagination parameters
- `Pagination` - Pagination metadata
- All DTOs: `BlogDto`, `ProjectDto`, `UserDto`, etc.

## 🎯 Query Key Organization

Each hook module exports query keys for cache management:

```tsx
import { blogKeys, projectKeys } from '@/services/hooks';

// Invalidate all blogs
queryClient.invalidateQueries({ queryKey: blogKeys.all });

// Invalidate specific blog
queryClient.invalidateQueries({ queryKey: blogKeys.detail('uuid') });

// Invalidate project lists
queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
```

## 🛠️ Error Handling

The API client shows toast notifications for errors:

- **401 Unauthorized**: Attempts token refresh, then redirects to login
- **403 Forbidden**: "Access Denied" toast
- **404 Not Found**: "Not Found" toast with details
- **500 Server Error**: "Server Error" toast
- **Other errors**: Generic error toast with message

## 🔄 Cache & Refetch

React Query provides automatic:

- **Caching**: Responses cached by query key
- **Background refetch**: Stale data refreshed automatically
- **Optimistic updates**: Mutations can update cache before server response
- **Retry logic**: Failed requests retried automatically

Configure globally in `lib/query-client.ts` or per-hook:

```tsx
const { data } = useBlog('uuid', {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: true,
});
```

## 📚 API Endpoints Reference

Based on OpenAPI spec v0.0.1:

### Base URLs
- **DEV**: `http://localhost:5025`
- **PROD**: `https://cogito.wyvernp.id.vn`

### Authentication
- `POST /api/v1/auth/login` - Email-based login
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/verify` - Verify token
- `GET /api/v1/auth/me` - Get current user (requires auth)

### Blog
- `GET /api/v1/blog` - Search blogs
- `GET /api/v1/blog/{uuid}` - Get blog by UUID
- `POST /api/v1/blog` - Create blog (requires auth)
- `PUT /api/v1/blog` - Update blog
- `GET /api/v1/blog/{id}/comments` - Get blog comments
- `GET /api/v1/blog/{id}/comments/count` - Count comments

### Projects
- `GET /api/v1/project` - Search projects
- `GET /api/v1/project/{id}` - Get project by ID
- `POST /api/v1/project` - Create project
- `PUT /api/v1/project/{id}` - Update project

### Series
- `GET /api/v1/series` - List series
- `GET /api/v1/series/{id}` - Get series by ID
- `GET /api/v1/series/{id}/blogs` - Get blogs in series
- `POST /api/v1/series` - Create series
- `PUT /api/v1/series/{id}` - Update series
- `DELETE /api/v1/series/{id}` - Delete series

### Categories & Tags
- `GET /api/v1/category` - List categories
- `POST /api/v1/category` - Create category
- `GET /api/v1/tag` - List tags
- `POST /api/v1/tag` - Create tag

### Comments
- `GET /api/v1/comment` - Get comments by path
- `POST /api/v1/comment` - Create comment
- `PUT /api/v1/comment` - Update comment
- `DELETE /api/v1/comment/{commentId}` - Delete comment

### Static Content
- `GET /api/v1/static-content` - Search content
- `GET /api/v1/static-content/{key}` - Get by key
- `GET /api/v1/static-content/type/{type}` - Get by type
- `POST /api/v1/static-content` - Create content
- `PUT /api/v1/static-content/{key}` - Update content

### Files
- `POST /api/v1/file` - Upload file (multipart/form-data)

## 💡 Best Practices

1. **Use hooks in components**: Prefer React Query hooks over direct API calls
2. **Handle loading states**: Always check `isLoading` and `error`
3. **Invalidate related queries**: After mutations, invalidate affected queries
4. **Use query keys wisely**: Leverage the exported key factories
5. **Enable/disable queries**: Use the `enabled` option to control when queries run
6. **Optimistic updates**: For better UX, update cache before server confirms

## 🐛 Troubleshooting

### CORS Issues
Ensure API server allows your origin. The client sends `withCredentials: true`.

### 401 Errors
Check that token is stored in localStorage and not expired.

### Type Errors
Ensure you're importing types from `@/types/api` correctly.

### Query Not Refetching
Check `staleTime` and `cacheTime` settings, or manually invalidate.

---

**Generated from OpenAPI Spec v0.0.1**
Last updated: 2025-12-30
