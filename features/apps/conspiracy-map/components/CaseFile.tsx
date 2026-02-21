import React, { useState } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { MapPin, X, FileText, Calendar, Crosshair, Camera, Image as ImageIcon } from 'lucide-react';
import { Map as PigeonMap, Overlay } from 'pigeon-maps';
import { NodeData, EvidenceImage } from '@/features/timeline/types';
import { Lightbox } from './Lightbox';

export const CaseFile: React.FC<{ node: NodeData; onClose: () => void }> = ({ node, onClose }) => {
    const highlights = node.images.filter(img => img.isHighlight);
    const archives = node.images.filter(img => !img.isHighlight);
    const [lightboxImage, setLightboxImage] = useState<EvidenceImage | null>(null);
    
    // Drag Controls for the Window
    const dragControls = useDragControls();

    return (
        <>
            <motion.div 
                drag
                dragListener={false}
                dragControls={dragControls}
                dragMomentum={false}
                initial={{ y: 50, scale: 0.9, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: 100, scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-[#fdfaf5] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-[#d6cbb5] pointer-events-auto rounded-sm overflow-hidden flex flex-col max-h-[85vh] z-[100]"
                onPointerDown={() => {}} // Stop propagation to board
            >
                {/* Header / Drag Handle */}
                <div 
                    onPointerDown={(e) => dragControls.start(e)}
                    className="p-4 md:p-6 border-b border-stone-200 bg-[#e8e4d9] cursor-grab active:cursor-grabbing select-none relative"
                >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-20">
                        <div className="w-16 h-1 bg-stone-900 rounded-full" />
                        <div className="w-16 h-1 bg-stone-900 rounded-full" />
                    </div>

                    <div className="flex justify-between items-start mt-2">
                        <div className="flex items-start gap-4">
                            <div className="bg-stone-800 text-[#e8e4d9] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest border border-stone-900 shadow-sm rotate-[-2deg]">
                                CASE #{node.id.toString().padStart(4, '0')}
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-2xl md:text-3xl font-black text-stone-900 uppercase tracking-tighter mb-1 leading-none">{node.title}</h2>
                                <div className="flex items-center gap-3 font-mono text-xs font-bold text-stone-500">
                                    <span className="flex items-center gap-1"><Calendar size={12}/> {node.fullDate}</span>
                                    <span className="text-stone-300">|</span>
                                    <span className="flex items-center gap-1"><MapPin size={12}/> {node.location}</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={onClose} 
                            onPointerDown={(e) => e.stopPropagation()}
                            className="p-2 hover:bg-stone-300 rounded-full transition-colors text-stone-600 bg-white/50 border border-stone-300 shadow-sm"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] cursor-default">
                    
                    {/* Intel Map - Interactive */}
                    <div className="mb-6 border-2 border-stone-200 p-1 bg-white shadow-sm rotate-[0.5deg]">
                        <div className="h-48 relative">
                            <PigeonMap 
                                center={[node.lat, node.lng]} 
                                defaultZoom={13} 
                                mouseEvents={true} 
                                touchEvents={true}
                            >
                                    <Overlay anchor={[node.lat, node.lng]} offset={[10, 24]}>
                                        <MapPin className="text-red-600 drop-shadow-md" size={32} />
                                    </Overlay>
                            </PigeonMap>
                            <div className="absolute top-2 right-2 bg-white/90 border border-stone-300 px-2 py-1 text-[10px] font-bold shadow-sm flex items-center gap-1 pointer-events-none">
                                <Crosshair size={10} className="text-red-500 animate-pulse"/> TARGET LOCK
                            </div>
                            <div className="absolute bottom-2 left-2 bg-white/90 border border-stone-300 px-2 py-1 text-[8px] font-bold shadow-sm pointer-events-none">
                                INTERACTIVE UPLINK
                            </div>
                        </div>
                        <div className="px-2 py-1 bg-stone-100 text-[10px] font-mono text-stone-500 border-t border-stone-200 flex justify-between">
                            <span>COORDINATES: {node.lat.toFixed(4)}, {node.lng.toFixed(4)}</span>
                            <span>SECTOR: {node.location}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 mb-8">
                        <FileText size={24} className="text-stone-400 mt-1 shrink-0" />
                        <div className="font-serif text-lg leading-relaxed text-stone-800">
                            {node.description}
                        </div>
                    </div>

                    {/* Evidence Gallery Section */}
                    {(highlights.length > 0 || archives.length > 0) && (
                        <div className="mb-6 mt-8 border-b-2 border-stone-300 pb-2">
                            <h3 className="font-black text-sm uppercase tracking-widest text-stone-700 flex items-center gap-2">
                                <Camera size={16} /> Visual Evidence
                            </h3>
                        </div>
                    )}

                    {/* Highlights (Polaroids) */}
                    {highlights.length > 0 && (
                        <div className="mb-8 flex flex-wrap gap-6 justify-center md:justify-start">
                            {highlights.map((img, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => setLightboxImage(img)} 
                                    className="bg-white p-3 pb-8 shadow-lg border border-stone-200 cursor-zoom-in w-48 relative transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 group"
                                >
                                    <div className="aspect-[4/3] bg-stone-100 overflow-hidden mb-2 filter sepia-[20%] group-hover:sepia-0 transition-all">
                                        <img src={img.url} alt="Highlight" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-center font-handwriting text-xs text-stone-600 font-bold">{img.caption}</div>
                                    {/* Tape Effect */}
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 border-l border-r border-white/60 rotate-[-4deg] opacity-60 pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Archives (Filmstrip) */}
                    {archives.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                                <ImageIcon size={10} /> Supporting Archives
                            </h4>
                            <div className="bg-black/90 p-3 overflow-x-auto rounded-sm shadow-inner flex gap-4 scrollbar-hide border-y-4 border-black relative">
                                {archives.map((img, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => setLightboxImage(img)} 
                                        className="relative shrink-0 cursor-zoom-in w-32 aspect-square bg-stone-800 border-x-4 border-black overflow-hidden group hover:border-stone-600 transition-colors"
                                    >
                                        <img src={img.url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300" alt="archive" />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                            {img.caption}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
            
            <AnimatePresence>
                {lightboxImage && (
                    <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
                )}
            </AnimatePresence>
        </>
    );
};
