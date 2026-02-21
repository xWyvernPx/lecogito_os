import React from 'react';
import { AtSign, Link2 } from 'lucide-react';
import type { SuggestionState } from '../hooks/use-blog-editor';

interface SuggestionPopupProps {
    suggestion: SuggestionState;
    filteredItems: string[];
    selectedIndex: number;
    insertItem: (item: string, type: SuggestionState['type']) => void;
    setSelectedIndex: (idx: number) => void;
    maxLeft: number;
}

export const SuggestionPopup: React.FC<SuggestionPopupProps> = ({
    suggestion,
    filteredItems,
    selectedIndex,
    insertItem,
    setSelectedIndex,
    maxLeft,
}) => {
    if (!suggestion.type) return null;

    return (
        <div
            className="absolute z-50 w-64 bg-white border-2 border-stone-800 shadow-retro-md overflow-hidden flex flex-col"
            style={{
                top: suggestion.top,
                left: Math.min(suggestion.left, maxLeft - 260),
            }}
        >
            <div className="px-2 py-1 bg-stone-100 border-b border-stone-200 text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                {suggestion.type === 'mention' ? (
                    <AtSign size={10} />
                ) : (
                    <Link2 size={10} />
                )}
                {suggestion.type === 'mention'
                    ? 'Summon Author'
                    : 'Link Scroll'}
            </div>
            <div className="max-h-48 overflow-y-auto">
                {filteredItems.length === 0 ? (
                    <div className="p-3 text-xs text-stone-400 italic text-center">
                        No matches found.
                    </div>
                ) : (
                    filteredItems.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() =>
                                insertItem(item, suggestion.type)
                            }
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors ${
                                idx === selectedIndex
                                    ? 'bg-os-accent text-white'
                                    : 'text-stone-700 hover:bg-stone-100'
                            }`}
                        >
                            <UserAvatar name={item} />
                            <span className="truncate">{item}</span>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

const UserAvatar = ({ name }: { name: string }) => {
    const bgColors = [
        'bg-red-200',
        'bg-blue-200',
        'bg-green-200',
        'bg-yellow-200',
        'bg-purple-200',
    ];
    const bg = bgColors[name.length % bgColors.length];
    return (
        <div
            className={`w-5 h-5 rounded-full ${bg} border border-black/20 flex items-center justify-center text-[9px] font-bold`}
        >
            {name.charAt(0)}
        </div>
    );
};
