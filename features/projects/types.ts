/**
 * Feature-specific types for the Projects module.
 * Canonical API types (ProjectDto, Pagination, SearchRequest, etc.)
 * are imported from @/types/api.ts — never duplicate them here.
 */

// Re-export ProjectDto's type field as a convenience alias
export type ProjectType = 'OFFICIAL' | 'SIDE_PROJECT' | 'OPEN_SOURCE' | 'CLOSED_SOURCE' | 'INTERNAL' | 'EXTENSION';

// --- Rich Text Types (feature-specific, not in canonical types) ---
export interface StyleProps {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    textColor?: string;
    backgroundColor?: string;
}

export interface InlineContent {
    type: 'text' | 'link';
    text?: string;
    href?: string;
    content?: InlineContent[]; // Links have content array
    styles?: StyleProps;
}

export interface BlockProps {
    textColor?: string;
    backgroundColor?: string;
    textAlignment?: 'left' | 'center' | 'right';
    level?: number; // for headings
    url?: string; // for images
    caption?: string; // for images
    width?: number; // for images
}

export interface Block {
    id: string;
    type: 'paragraph' | 'heading' | 'bulletListItem' | 'image';
    props: BlockProps;
    content: InlineContent[];
    children: Block[];
}