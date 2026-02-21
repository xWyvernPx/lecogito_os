import React from 'react';
import { motion, AnimatePresence, MotionValue } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { NodeData, Connection } from '@/features/timeline/types';
import { BoardConnectionLine } from './BoardConnectionLine';

interface BoardViewProps {
    visibleNodes: NodeData[];
    visibleConnections: Connection[];
    nodePositions: Map<number, { x: MotionValue<number>; y: MotionValue<number> }>;
    isPanningCanvas: boolean;
    setIsPanningCanvas: (v: boolean) => void;
    canvasX: MotionValue<number>;
    canvasY: MotionValue<number>;
    zoom: number;
    setZoom: React.Dispatch<React.SetStateAction<number>>;
    setActiveNodeId: (id: number) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
    visibleNodes,
    visibleConnections,
    nodePositions,
    isPanningCanvas,
    setIsPanningCanvas,
    canvasX,
    canvasY,
    zoom,
    setZoom,
    setActiveNodeId,
}) => {
    return (
        <div className="absolute inset-0 bg-[#f0e6d2] overflow-hidden">
            {/* Static Background */}
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

            {/* Pannable Canvas Container */}
            <motion.div
                drag
                dragMomentum={false}
                dragElastic={0}
                onDragStart={() => setIsPanningCanvas(true)}
                onDragEnd={() => setIsPanningCanvas(false)}
                style={{ 
                    x: canvasX, 
                    y: canvasY,
                    scale: zoom,
                }}
                className="absolute inset-0 cursor-move"
            >
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
                                dragElastic={0}
                                onDragStart={(e) => e.stopPropagation()}
                                onTap={(e) => {
                                    if (!isPanningCanvas) {
                                        setActiveNodeId(node.id);
                                    }
                                }}
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
            </motion.div>
            
            {/* Zoom Controls */}
            <div className="absolute bottom-24 right-4 z-30 flex flex-col gap-2">
                <button
                    onClick={() => setZoom(z => Math.min(z + 0.1, 2))}
                    className="w-10 h-10 bg-white border-2 border-stone-800 shadow-retro-sm hover:bg-stone-100 font-bold text-xl flex items-center justify-center transition-colors"
                    aria-label="Zoom in"
                >
                    +
                </button>
                <div className="w-10 h-10 bg-stone-800 border-2 border-stone-600 text-white font-mono text-xs flex items-center justify-center">
                    {Math.round(zoom * 100)}%
                </div>
                <button
                    onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
                    className="w-10 h-10 bg-white border-2 border-stone-800 shadow-retro-sm hover:bg-stone-100 font-bold text-xl flex items-center justify-center transition-colors"
                    aria-label="Zoom out"
                >
                    −
                </button>
                <button
                    onClick={() => {
                        setZoom(1);
                        canvasX.set(0);
                        canvasY.set(0);
                    }}
                    className="w-10 h-10 bg-white border-2 border-stone-800 shadow-retro-sm hover:bg-stone-100 font-mono text-[10px] font-bold flex items-center justify-center transition-colors"
                    aria-label="Reset view"
                >
                    RST
                </button>
            </div>
        </div>
    );
};
