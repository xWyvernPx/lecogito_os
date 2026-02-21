import React from 'react';
import { HighlightText } from '@/components/ui/text-utils';
import { ContentItemProps } from './types';

export const ListItemRenderer: React.FC<ContentItemProps> = ({ item, searchQuery }) => {
    return (
        <li className="list-none ml-2 before:content-['>'] before:mr-2 before:text-os-accent before:font-bold mb-2">
            <HighlightText text={item.text} query={searchQuery} />
        </li>
    );
};
