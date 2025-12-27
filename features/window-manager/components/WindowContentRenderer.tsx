
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, CheckCircle, Radio } from 'lucide-react';
import { ContentItem, TableCell, WindowDef } from '../../../types';
import { useOSStore } from '../../os/stores/os-store';
import { HighlightText } from '../../../components/ui/text-utils';
import { getAppDefinition } from '../../apps/registry';
import { DESIGN_TOKENS } from '../../../theme/design-tokens';
import { ModuleLoader } from './ModuleLoader';

interface WindowContentRendererProps {
    content: ContentItem[];
    searchQuery: string;
    win: WindowDef;
}

export const WindowContentRenderer: React.FC<WindowContentRendererProps> = ({ content, searchQuery, win }) => {
    const { spawnWindow } = useOSStore();

    return (
        <>
           {content.map((item, idx) => {
              
              // 1. Check if this is a registered App
              const definition = getAppDefinition(item.type);
              if (definition) {
                  const AppComponent = definition.component;
                  return (
                    <Suspense key={idx} fallback={<ModuleLoader />}>
                        <AppComponent win={win} contentItem={item} />
                    </Suspense>
                  );
              }

              // 2. Fallback to Primitive Content Renderers
              
              if (item.type === 'hero') {
                return (
                  <div key={idx} className="-mx-6 -mt-6 mb-8 relative h-64 border-b-2 border-os-border bg-[#8B4513] group select-none overflow-hidden">
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
              }
              
              if (item.type === 'quest-log' && item.quests) {
                return (
                  <div key={idx} className="my-6 space-y-8">
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
              }
              
              if (item.type === 'collage') return (
                <div key={idx} className="mb-12 mt-4 relative flex justify-center py-4 px-8 w-full">
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

              if (item.type === 'stats' && item.stats) {
                return (
                  <div key={idx} className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.stats.map((stat, sIdx) => (
                      <div key={sIdx} className="bg-stone-50 border-2 border-os-border p-2 shadow-retro-sm">
                        <div className="flex justify-between text-xs font-bold mb-1">
                           <span>{stat.label}</span>
                           <span>{stat.value}%</span>
                        </div>
                        <div className="h-4 w-full border border-os-border bg-white relative">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.value}%` }}
                            transition={{ duration: 1, delay: 0.2 + (sIdx * 0.1), ease: "circOut" }}
                            className={`h-full border-r border-os-border relative overflow-hidden`}
                            style={{ backgroundColor: stat.color || '#ff7e33' }}
                          >
                             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '4px 4px' }} />
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }

              if (item.type === 'image') return (
                <div key={idx} className="mb-6 relative group w-full">
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

              if (item.type === 'h1') return (
                <div key={idx} className="mb-6">
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
              
              if (item.type === 'table' && item.headers && item.rows) {
                  return (
                      <div key={idx} className="border-2 border-os-border rounded-sm overflow-hidden text-sm my-6 bg-white">
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
              }

              if (item.type === 'line') return <div key={idx} className="border-b border-dashed border-os-border opacity-50 my-6" />;
              
              if (item.type === 'h2') return (
                  <h2 key={idx} className="font-bold text-os-accentBorder mt-8 mb-3 uppercase tracking-wider text-sm border-l-4 border-os-accentBorder pl-2">
                      <HighlightText text={item.text} query={searchQuery} />
                  </h2>
              );
              
              if (item.type === 'list') return (
                  <li key={idx} className="list-none ml-2 before:content-['>'] before:mr-2 before:text-os-accent before:font-bold mb-2">
                      <HighlightText text={item.text} query={searchQuery} />
                  </li>
              );
              
              if (item.type === 'button') return (
                <button 
                  key={idx} 
                  onClick={() => item.link ? window.open(item.link, '_blank') : item.action && spawnWindow(item.action)}
                  className="mt-6 px-6 py-2 bg-os-window border-2 border-os-border shadow-retro-md hover:translate-y-[1px] hover:shadow-[3px_3px_0_0_#000] active:translate-y-[4px] active:shadow-none font-bold transition-all w-full md:w-auto"
                >
                  <HighlightText text={item.text} query={searchQuery} />
                </button>
              );
              
              if (item.type === 'spacer') return <div key={idx} style={{ height: item.height }} />;
              
              return (
                  <p key={idx} className="mb-3 leading-relaxed text-stone-700">
                      <HighlightText text={item.text} query={searchQuery} />
                  </p>
              );
           })}
        </>
    )
}
