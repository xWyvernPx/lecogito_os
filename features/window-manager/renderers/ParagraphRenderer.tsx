import React from 'react';
import { HighlightText } from '@/components/ui/text-utils';
import { ContentItemProps } from './types';

export const ParagraphRenderer: React.FC<ContentItemProps> = ({ item, searchQuery }) => {
    return (
        <p className="mb-3 leading-relaxed text-stone-700">
            <HighlightText text={item.text} query={searchQuery} />
        </p>
    );
};
