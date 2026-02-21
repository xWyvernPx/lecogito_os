import React from 'react';
import { TableCell } from '@/types';
import { HighlightText } from '@/components/ui/text-utils';
import { ContentItemProps } from './types';

export const TableRenderer: React.FC<ContentItemProps> = ({ item, searchQuery, spawnWindow }) => {
    if (!item.headers || !item.rows) return null;

    return (
        <div className="border-2 border-os-border rounded-sm overflow-hidden text-sm my-6 bg-white">
            <div className="flex bg-stone-100 border-b-2 border-os-border font-bold text-stone-600">
                {item.headers.map((h, i) => (
                    <div key={i} className={`${h.width} p-3 border-r-2 border-os-border last:border-r-0`}>{h.text}</div>
                ))}
            </div>
            {item.rows.map((row, r) => (
                <div key={r} className="flex border-b border-os-border last:border-b-0 hover:bg-[#fff7ed] transition-colors group items-stretch">
                    {row.map((cell: TableCell, c) => (
                        <div key={c} className={`${item.headers![c].width} p-3 border-r border-os-border last:border-r-0 flex items-center`}>
                            {typeof cell === 'object' && cell.type === 'tags' ? (
                                <div className="flex gap-2 flex-wrap">
                                    {cell.tags.map((t, ti) => (
                                        <span key={ti} className="px-2 py-1 border border-stone-300 bg-stone-50 rounded text-[11px] font-bold shadow-sm">
                                            <HighlightText text={t} query={searchQuery} />
                                        </span>
                                    ))}
                                </div>
                            ) : typeof cell === 'object' && cell.type === 'link' ? (
                                <button
                                    onClick={() => cell.url ? window.open(cell.url, '_blank') : cell.action && spawnWindow(cell.action)}
                                    className="text-os-accentBorder font-bold underline decoration-2 underline-offset-2 hover:text-os-accent"
                                >
                                    <HighlightText text={cell.text} query={searchQuery} />
                                </button>
                            ) : typeof cell === 'object' && cell.type === 'icon' ? (
                                <div className="w-10 h-10 bg-white rounded-full border border-stone-300 p-0.5 shadow-sm group-hover:scale-110 transition-transform duration-200 shrink-0 overflow-hidden">
                                    <img src={cell.src} alt={cell.alt || 'icon'} className="w-full h-full object-cover rounded-full" />
                                </div>
                            ) : (
                                <span className={c === 0 ? "font-bold text-stone-800" : "text-stone-600 leading-snug"}>
                                    {typeof cell === 'string' ? <HighlightText text={cell} query={searchQuery} /> : ''}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
