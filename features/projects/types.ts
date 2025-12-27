export type ProjectType = "OFFICIAL" | "SIDE_PROJECT" | "OPEN_SOURCE" | "CLOSED_SOURCE" | "INTERNAL" | "EXTENSION";

export interface ProjectDto {
  id: number;
  name: string;
  description?: string;
  detail?: string; // JSON string containing rich text blocks
  thumbnailUrl?: string;
  published?: boolean;
  sourceUrl?: string;
  demoUrl?: string;
  type?: ProjectType;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
}

export interface SearchRequest {
  pageIndex: number;
  pageSize: number;
  keyword?: string;
  sort?: string[];
}

export interface Pagination {
  pageIndex: number;
  pageSize: number;
  sort?: string[] | null;
  totalRows?: number | null;
  keyword?: string;
}

// Flattened structure based on user response
export interface ApiListResponseProjectDto {
  pagination: Pagination;
  rows: ProjectDto[];
  message: string;
  success: boolean;
  status: number;
}

export interface ApiProjectDetailResponseDto {
    status: number;
    message: string;
    success: boolean;
    data: ProjectDto;
}

// --- Rich Text Types ---
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