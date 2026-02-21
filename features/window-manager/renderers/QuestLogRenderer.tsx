import React from 'react';
import { Briefcase, Calendar, CheckCircle, Radio } from 'lucide-react';
import { HighlightText } from '@/components/ui/text-utils';
import { ContentItemProps } from './types';

export const QuestLogRenderer: React.FC<ContentItemProps> = ({ item, searchQuery }) => {
    if (!item.quests) return null;

    return (
        <div className="my-6 space-y-8">
            {item.quests.map((quest, qIdx) => (
                <div key={qIdx} className="relative bg-white border-2 border-os-border shadow-retro-md p-4 group hover:translate-y-[-2px] hover:shadow-retro-lg transition-all">
                    <div className={`absolute -top-3 -right-2 px-2 py-0.5 border-2 border-os-border font-bold text-xs shadow-sm flex items-center gap-1.5 ${quest.status === 'active' ? 'bg-os-accent text-white' : 'bg-[#10b981] text-white'}`}>
                        {quest.status === 'active' ? (
                            <><Radio size={10} className="animate-pulse" /> CURRENT QUEST</>
                        ) : (
                            <><CheckCircle size={10} /> QUEST COMPLETE</>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="w-full md:w-48 shrink-0">
                            <div className="w-full aspect-video md:aspect-square border-2 border-os-border bg-stone-200 overflow-hidden relative group-hover:border-os-accent transition-colors">
                                {quest.image ? (
                                    <img src={quest.image} alt={quest.title} className="w-full h-full object-cover grayscale-[80%] group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-300">
                                        <Briefcase size={24} />
                                        <span className="text-[10px] font-bold mt-1">NO_IMG</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-50" />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex flex-col mb-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-stone-400 font-mono mb-1">
                                    <span className="flex items-center gap-1"><Calendar size={10}/> {quest.period}</span>
                                    <span className="text-stone-300">|</span>
                                    <span className="flex items-center gap-1 text-os-accent"><Briefcase size={10}/> {quest.organization}</span>
                                </div>
                                <h3 className="text-xl font-bold leading-tight uppercase tracking-tight">
                                    <HighlightText text={quest.title} query={searchQuery} />
                                </h3>
                            </div>

                            <p className="text-sm text-stone-600 mb-4 leading-relaxed flex-1">
                                <HighlightText text={quest.description} query={searchQuery} />
                            </p>

                            {quest.tags && (
                                <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-dashed border-stone-200">
                                    {quest.tags.map((tag, tIdx) => (
                                        <span key={tIdx} className="px-1.5 py-0.5 border border-stone-300 bg-stone-50 text-[10px] font-bold text-stone-600 rounded-sm">
                                            <HighlightText text={tag} query={searchQuery} />
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
