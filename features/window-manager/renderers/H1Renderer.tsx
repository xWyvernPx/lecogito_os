import React from 'react';
import { HighlightText } from '@/components/ui/text-utils';
import { ContentItemProps } from './types';

export const H1Renderer: React.FC<ContentItemProps> = ({ item, searchQuery }) => {
    return (
        <div className="mb-6">
            <h1 className="text-4xl font-bold font-sans tracking-tight mb-2 text-os-text">
                <HighlightText text={item.text} query={searchQuery} />
            </h1>
            {item.sub && (
                <p className="text-stone-500 text-base">
                    <HighlightText text={item.sub} query={searchQuery} />
                </p>
            )}
        </div>
    );
};
