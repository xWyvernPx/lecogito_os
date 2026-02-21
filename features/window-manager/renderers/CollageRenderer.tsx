import React from 'react';
import { ContentItemProps } from './types';

export const CollageRenderer: React.FC<ContentItemProps> = ({ item }) => {
    return (
        <div className="mb-12 mt-4 relative flex justify-center py-4 px-8 w-full">
            {item.secondarySrc && (
                <div className="absolute top-16 left-4 md:left-12 w-32 h-32 md:w-40 md:h-40 -rotate-6 z-20 border-4 border-white shadow-[0_4px_6px_rgba(0,0,0,0.1)] overflow-hidden">
                    <img src={item.secondarySrc} className="w-full h-full object-cover" alt="Secondary decoration" />
                </div>
            )}
            <div className="w-full max-w-[28rem] aspect-video rotate-2 border-4 border-white shadow-[0_4px_10px_rgba(0,0,0,0.15)] overflow-hidden z-10 bg-stone-200">
                <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
            </div>
        </div>
    );
};
