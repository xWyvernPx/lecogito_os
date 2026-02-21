import React from 'react';
import { HighlightText } from '@/components/ui/text-utils';
import { ContentItemProps } from './types';

export const ButtonRenderer: React.FC<ContentItemProps> = ({ item, searchQuery, spawnWindow }) => {
    return (
        <button
            onClick={() => item.link ? window.open(item.link, '_blank') : item.action && spawnWindow(item.action)}
            className="mt-6 px-6 py-2 bg-os-window border-2 border-os-border shadow-retro-md hover:translate-y-[1px] hover:shadow-[3px_3px_0_0_#000] active:translate-y-[4px] active:shadow-none font-bold transition-all w-full md:w-auto"
        >
            <HighlightText text={item.text} query={searchQuery} />
        </button>
    );
};
