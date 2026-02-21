import React from 'react';
import { HighlightText } from '@/components/ui/text-utils';
import { ContentItemProps } from './types';

export const ImageRenderer: React.FC<ContentItemProps> = ({ item, searchQuery }) => {
    return (
        <div className="mb-6 relative group w-full">
            <div className="w-full border-2 border-os-border shadow-retro-md overflow-hidden bg-stone-200">
                <img
                    src={item.src}
                    alt={item.alt || 'Content image'}
                    className="w-full h-auto object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    style={{ height: item.height || 'auto', maxHeight: '400px' }}
                />
            </div>
            {item.text && (
                <p className="mt-2 text-xs text-stone-500 italic border-l-2 border-os-accent pl-2">
                    <HighlightText text={item.text} query={searchQuery} />
                </p>
            )}
        </div>
    );
};
