import { ContentItem } from '@/types';

export interface ContentItemProps {
    item: ContentItem;
    searchQuery: string;
    spawnWindow: (id: string) => void;
}
