
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, MotionValue, useDragControls } from 'framer-motion';
import { MapPin, X, FileText, Calendar, Layout, Globe, Crosshair, Plus, Camera, Image as ImageIcon, GripHorizontal } from 'lucide-react';
import { Map as PigeonMap, Overlay } from 'pigeon-maps';
import { useNodes, useConnections } from '../timeline/hooks/use-timeline';
import { NodeData, Connection, EvidenceImage } from '../timeline/types';
import { useOSStore } from '../os/stores/os-store';
import { RetroButton } from '../../components/ui/retro-ui';

// --- SHARED CONSTANTS ---
const YEARS = ['All', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

// --- SUB-COMPONENTS ---

const Lightbox: React.FC<{ image: EvidenceImage; onClose: () => void }> = ({ image, onClose }) => {
    // Handle Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-0 backdrop-blur-md"
            onClick={onClose}
        >
             <button 
                onClick={onClose} 
                className="absolute top-6 right-6 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all z-50"
             >
                 <X size={32} />
             </button>
             
             <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
             >
                 <div className="relative border-4 border-white shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black">
                    <img 
                        src={image.url} 
                        className="max-w-full max-h-[80vh] object-contain" 
                        alt={image.caption}
                    />
                 </div>
                 
                 <div className="mt-6 bg-black/80 text-white border border-white/20 px-6 py-3 rounded-sm flex flex-col items-center">
                     <span className="text-[10px] text-stone-400 font-mono uppercase tracking-widest mb-1">EVIDENCE CAPTION</span>
                     <span className="font-bold text-lg tracking-wide">{image.caption || 'NO CAPTION PROVIDED'}</span>
                 </div>
             </motion.div>
        </motion.div>
    );
};

const BoardConnectionLine: React.FC<{
    fromPos: { x: MotionValue<number>; y: MotionValue<number> };
    toPos: { x: MotionValue<number>; y: MotionValue<number> };
}> = ({ fromPos, toPos }) => {
    const x1 = useTransform(fromPos.x, (x) => x + 80);
    const y1 = useTransform(fromPos.y, (y) => y + 60);
    const x2 = useTransform(toPos.x, (x) => x + 80);
    const y2 = useTransform(toPos.y, (y) => y + 60);

    return (
        <motion.line 
            x1={x1} y1={y1} 
            x2={x2} y2={y2} 
            stroke="#ef4444" 
            strokeWidth="3" 
            strokeDasharray="8 6" 
            strokeLinecap="round"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 0.6, pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="drop-shadow-sm"
        />
    );
};

const MapConnectionLines: React.FC<{
    nodes: NodeData[];
    connections: Connection[];
    latLngToPixel?: (latLng: [number, number]) => [number, number];
}> = ({ nodes, connections, latLngToPixel }) => {
    if (!latLngToPixel) return null;

    return (
        <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible z-10">
            {connections.map((conn, i) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return null;

                const [x1, y1] = latLngToPixel([fromNode.lat, fromNode.lng]);
                const [x2, y2] = latLngToPixel([toNode.lat, toNode.lng]);

                return (
                    <motion.line 
                        key={i}
                        x1={x1} y1={y1} 
                        x2={x2} y2={y2} 
                        stroke="#22c55e" 
                        strokeWidth="2" 
                        strokeOpacity="0.6"
                        strokeDasharray="4 2" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1 }}
                    />
                );
            })}
        </svg>
    );
};

const CaseFile: React.FC<{ node: NodeData; onClose: () => void }> = ({ node, onClose }) => {
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

export const ConspiracyMap: React.FC = () => {
    const { spawnWindow } = useOSStore();
    const [selectedYear, setSelectedYear] = useState('All');
    const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'BOARD' | 'SATELLITE'>('BOARD');
    
    // Data Loading
    const { data: nodes, isLoading } = useNodes();
    const { data: connections } = useConnections();

    const safeNodes = nodes || [];
    const safeConnections = connections || [];

    // Board State
    const nodePositions = useRef<Map<number, { x: MotionValue<number>, y: MotionValue<number> }>>(new Map()).current;

    // Initialize positions for new nodes
    useMemo(() => {
        if (!nodes) return;
        nodes.forEach(node => {
            if (!nodePositions.has(node.id)) {
                nodePositions.set(node.id, {
                    x: new MotionValue(node.boardX),
                    y: new MotionValue(node.boardY)
                });
            }
        });
    }, [nodes]); 

    const visibleNodes = safeNodes.filter(n => selectedYear === 'All' || n.year === selectedYear);
    
    const visibleConnections = safeConnections.filter(conn => {
        const fromVisible = visibleNodes.find(n => n.id === conn.from);
        const toVisible = visibleNodes.find(n => n.id === conn.to);
        return fromVisible && toVisible;
    });

    const activeNode = safeNodes.find(n => n.id === activeNodeId);

    if (isLoading) {
        return <div className="w-full h-full bg-[#121212] flex items-center justify-center text-[#ff7e33] font-mono animate-pulse">ESTABLISHING SECURE UPLINK...</div>;
    }

    return (
        <div className="relative w-full h-full bg-[#121212] overflow-hidden select-none font-sans cursor-crosshair">
            
            {/* --- TOP RIGHT CONTROLS (View Switcher) --- */}
            <div className="absolute top-4 right-4 z-40 flex flex-col items-end gap-2 sm:flex-row sm:items-start">
                <RetroButton 
                     size="sm" 
                     variant="secondary" 
                     className="uppercase text-[10px] py-1" 
                     icon={<Plus size={12} />}
                     onClick={() => spawnWindow('event-editor')}
                >
                    Add Evidence
                </RetroButton>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setViewMode('BOARD')}
                        className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-2 border-2 shadow-retro-sm transition-all ${viewMode === 'BOARD' ? 'bg-[#f0e6d2] border-stone-800 text-stone-900' : 'bg-stone-800 border-stone-600 text-stone-400 hover:bg-stone-700'}`}
                    >
                        <Layout size={14} /> <span className="hidden sm:inline">Case File</span>
                    </button>
                    <button 
                        onClick={() => setViewMode('SATELLITE')}
                        className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-2 border-2 shadow-retro-sm transition-all ${viewMode === 'SATELLITE' ? 'bg-green-900 border-green-400 text-green-100' : 'bg-stone-800 border-stone-600 text-stone-400 hover:bg-stone-700'}`}
                    >
                        <Globe size={14} /> <span className="hidden sm:inline">Satellite</span>
                    </button>
                </div>
            </div>

            {/* --- BOARD VIEW --- */}
            {viewMode === 'BOARD' && (
                <div className="absolute inset-0 bg-[#f0e6d2]">
                    {/* Artistic Background */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        <svg width="100%" height="100%" viewBox="0 0 1000 600" preserveAspectRatio="none">
                            <defs>
                                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.2"/>
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                            {/* Decorative paths */}
                            <g fill="#d6cbb5" stroke="#a89f8e" strokeWidth="1">
                                <path d="M50,40 L120,30 L280,30 L320,100 L250,250 L150,200 L80,150 Z" /> 
                            </g>
                        </svg>
                        <div 
                            className="absolute inset-0" 
                            style={{ 
                                backgroundImage: 'radial-gradient(circle, transparent 40%, rgba(69, 58, 43, 0.4) 100%), url("https://www.transparenttextures.com/patterns/cream-paper.png")' 
                            }} 
                        />
                    </div>

                    {/* Red Strings */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                        {visibleConnections.map((conn, i) => {
                            const fromPos = nodePositions.get(conn.from);
                            const toPos = nodePositions.get(conn.to);
                            if(!fromPos || !toPos) return null;
                            return <BoardConnectionLine key={i} fromPos={fromPos} toPos={toPos} />;
                        })}
                    </svg>

                    {/* Draggable Cards */}
                    <AnimatePresence>
                        {visibleNodes.map((node) => {
                            const pos = nodePositions.get(node.id);
                            if (!pos) return null;
                            return (
                                <motion.div
                                    key={node.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    drag
                                    dragMomentum={false}
                                    onTap={() => setActiveNodeId(node.id)}
                                    style={{ x: pos.x, y: pos.y }} 
                                    className="absolute w-40 flex flex-col cursor-grab active:cursor-grabbing group z-20 hover:z-30"
                                >
                                    {/* Push Pin */}
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full shadow-[2px_2px_4px_rgba(0,0,0,0.4)] z-30 border border-red-800">
                                        <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full opacity-50" />
                                    </div>
                                    {/* Card */}
                                    <div className="bg-[#fdfdfd] p-2 pb-8 shadow-[4px_4px_15px_rgba(0,0,0,0.3)] border border-stone-300 rotate-1 group-hover:rotate-0 transition-transform duration-200">
                                        <div className="w-full h-24 bg-stone-100 mb-2 relative overflow-hidden border border-stone-200 group-hover:border-[#ff7e33] transition-colors">
                                            <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundColor: node.color }} />
                                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]" />
                                            <div className="absolute bottom-1 right-1 font-mono text-[9px] text-stone-500 bg-white/90 px-1 border border-stone-300">
                                                EVIDENCE #{node.id.toString().padStart(3, '0')}
                                            </div>
                                            <div className="absolute top-1 left-1 font-mono text-[9px] font-bold text-stone-700 bg-white/90 px-1 border border-stone-300">
                                                {node.year}
                                            </div>
                                            <MapPin size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-stone-600 opacity-80" />
                                        </div>
                                        <h3 className="font-bold text-xs text-center leading-tight font-mono uppercase truncate text-stone-800 tracking-tighter">
                                            {node.title}
                                        </h3>
                                    </div>
                                    {/* Sticky Note */}
                                    <div className="absolute -bottom-4 -right-2 w-36 bg-[#fef08a] p-3 shadow-md -rotate-2 border border-[#fde047]">
                                        <div className="font-handwriting text-[10px] text-blue-900 leading-tight font-bold">
                                            {node.note}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* --- SATELLITE VIEW (Pigeon Maps) --- */}
            {viewMode === 'SATELLITE' && (
                <div className="absolute inset-0 bg-[#0a0a0a]">
                    <PigeonMap 
                        defaultCenter={[20, 100]} 
                        defaultZoom={3} 
                        dprs={[1, 2]} 
                    >
                        <MapConnectionLines 
                            nodes={visibleNodes} 
                            connections={visibleConnections} 
                        />

                        {visibleNodes.map(node => (
                            <Overlay key={node.id} anchor={[node.lat, node.lng]} offset={[10, 24]}>
                                <div 
                                    className="group cursor-pointer transform -translate-x-1/2 -translate-y-full hover:z-50"
                                    onClick={() => setActiveNodeId(node.id)}
                                >
                                    <div className="relative flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full border-2 border-green-500 bg-black/80 flex items-center justify-center text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] group-hover:scale-110 transition-transform">
                                            <MapPin size={16} />
                                        </div>
                                        <div className="w-0.5 h-4 bg-green-500/50" />
                                        
                                        <div className="absolute top-10 w-32 bg-black/90 border border-green-500/50 p-2 backdrop-blur-sm shadow-xl rounded-sm opacity-80 group-hover:opacity-100 transition-opacity">
                                            <div className="text-[9px] text-green-700 font-bold mb-1 border-b border-green-900 pb-1">{node.year} | {node.location}</div>
                                            <div className="text-[10px] text-green-400 font-mono font-bold leading-tight">{node.title}</div>
                                        </div>
                                    </div>
                                </div>
                            </Overlay>
                        ))}
                    </PigeonMap>
                    
                    {/* Scanline Overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />
                </div>
            )}

            {/* --- COMMON OVERLAYS --- */}
            
            <AnimatePresence>
                {activeNode && (
                    <CaseFile node={activeNode} onClose={() => setActiveNodeId(null)} />
                )}
            </AnimatePresence>

            {/* Bottom Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-[90%] flex justify-center">
                <div className="bg-stone-800/90 backdrop-blur-sm border-2 border-stone-600 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] p-1 flex gap-1 rounded-sm overflow-x-auto max-w-full">
                    {YEARS.map(year => (
                        <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className={`
                                px-3 py-1 text-xs font-bold font-mono transition-all whitespace-nowrap
                                ${selectedYear === year 
                                    ? 'bg-[#ff7e33] text-white shadow-sm' 
                                    : 'text-stone-400 hover:bg-stone-700 hover:text-white'}
                            `}
                            aria-label={`Filter events by year ${year}`}
                            aria-pressed={selectedYear === year}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Info Badge */}
            <div className="absolute top-4 left-4 z-30 pointer-events-none">
                 <div className={`backdrop-blur border-2 px-4 py-3 shadow-retro-md transform -rotate-1 transition-colors duration-500 ${viewMode === 'BOARD' ? 'bg-white/90 border-red-800' : 'bg-black/60 border-green-500'}`}>
                     <h1 className={`font-black text-lg uppercase tracking-widest border-b-2 mb-1 ${viewMode === 'BOARD' ? 'text-red-700 border-red-800' : 'text-green-500 border-green-500'}`}>
                         {viewMode === 'BOARD' ? 'Top Secret' : 'Sat Uplink'}
                     </h1>
                     <p className={`font-mono text-[10px] font-bold ${viewMode === 'BOARD' ? 'text-stone-900' : 'text-green-400'}`}>OPERATION: "CAREER DOMINATION"</p>
                     
                     <div className={`absolute -right-3 -top-3 rotate-12 border-2 px-2 py-1 font-bold text-xs uppercase ${viewMode === 'BOARD' ? 'border-red-700 text-red-700 bg-white/80' : 'border-green-400 text-green-900 bg-green-400'}`}>
                         {viewMode === 'BOARD' ? 'Confidential' : 'Live Feed'}
                     </div>
                 </div>
            </div>
            
            {/* Footer Credit */}
            <div className="absolute bottom-2 right-4 z-30 pointer-events-none text-[8px] font-mono text-stone-500/50 hidden md:block">
                Generated by Cogito OS
            </div>
        </div>
    );
};
