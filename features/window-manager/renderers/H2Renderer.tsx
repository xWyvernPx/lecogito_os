import React from 'react';
import { HighlightText } from '@/components/ui/text-utils';
import { ContentItemProps } from './types';

export const H2Renderer: React.FC<ContentItemProps> = ({ item, searchQuery }) => {
    return (
        <h2 className="font-bold text-os-accentBorder mt-8 mb-3 uppercase tracking-wider text-sm border-l-4 border-os-accentBorder pl-2">
            <HighlightText text={item.text} query={searchQuery} />
        </h2>
    );
};
