import React from 'react';
import { ContentItemProps } from './types';

export const HeroRenderer: React.FC<ContentItemProps> = ({ item }) => {
    return (
        <div className="-mx-6 -mt-6 mb-8 relative h-64 border-b-2 border-os-border bg-[#8B4513] group select-none overflow-hidden">
            <div
                className="absolute inset-0 bg-repeat opacity-90"
                style={{
                    backgroundImage: `url(${item.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            {item.text && <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />}
            {item.secondarySrc && (
                <div className="absolute bottom-[-10px] right-2 md:right-10 w-48 md:w-64 z-10 drop-shadow-[4px_0_0_rgba(0,0,0,0.5)] transition-transform hover:scale-105 duration-300 origin-bottom">
                    <img
                        src={item.secondarySrc}
                        alt="Character"
                        className="w-full h-auto object-contain pixelated"
                        style={{ imageRendering: 'pixelated' }}
                    />
                </div>
            )}
            {item.text && (
                <div className="absolute bottom-4 left-6 z-20 text-white max-w-[60%]">
                    <h1 className="text-3xl md:text-5xl font-bold font-sans tracking-tight text-os-accent drop-shadow-[2px_2px_0_#000] mb-1">
                        {item.text}
                    </h1>
                    {item.sub && (
                        <p className="text-sm md:text-lg text-stone-300 font-mono bg-black/50 inline-block px-2 py-1 border border-stone-500 backdrop-blur-sm">
                            {item.sub}
                        </p>
                    )}
                </div>
            )}
            {item.text && (
                <div className="absolute top-4 right-4 bg-os-accent text-black border-2 border-os-border shadow-retro-md px-3 py-1 font-bold font-mono text-xs rotate-3 animate-pulse">
                    LEVEL UP!
                </div>
            )}
        </div>
    );
};
