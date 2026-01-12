import type { BlogDto, SerieDto, CategoryDto } from '@/services';

/**
 * Blog utilities - convert between API DTOs and local display types
 */

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    author: string;
    thumbnail?: string;
    readTime: string;
    content?: string;
    serieId?: string;
    uuid: string;
    viewCount?: number;
}

export interface Serie {
    id: string;
    title: string;
    description: string;
    coverUrl?: string;
}

/**
 * Convert BlogDto from API to local BlogPost format
 */
export const blogDtoToPost = (dto: BlogDto): BlogPost => {
    return {
        id: dto.id.toString(),
        uuid: dto.uuid,
        title: dto.title,
        excerpt: dto.description || '',
        date: formatDate(dto.createdDate || new Date().toISOString()),
        category: dto.category?.name || 'Uncategorized',
        author: dto.author?.fullName || 'Anonymous',
        thumbnail: dto.thumbnailUrl || undefined,
        readTime: estimateReadTime(dto.content),
        content: dto.content,
        serieId: dto.serie?.uuid,
        viewCount: dto.viewCount,
    };
};

/**
 * Convert SerieDto from API to local Serie format
 */
export const serieDtoToLocal = (dto: SerieDto): Serie => {
    return {
        id: dto.uuid || dto.id?.toString() || '',
        title: dto.name,
        description: dto.description || '',
        coverUrl: dto.coverUrl,
    };
};

/**
 * Format ISO date string to readable format
 */
export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
};

/**
 * Estimate read time based on content length
 */
export const estimateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min`;
};

/**
 * Default search request for pagination
 */
export const DEFAULT_SEARCH_REQUEST = {
    pageIndex: 0,
    pageSize: 100,
    sort: ['createdDate:desc'],
};

/**
 * Default blog search criteria (empty = all blogs)
 */
export const DEFAULT_BLOG_CRITERIA = {};
