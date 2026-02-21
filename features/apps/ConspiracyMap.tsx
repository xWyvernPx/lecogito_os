import React, { useState, useRef, useMemo } from 'react';
import { AnimatePresence, useMotionValue, MotionValue } from 'framer-motion';
import { Layout, Globe, Plus } from 'lucide-react';
import { useNodes, useConnections } from '../timeline/hooks/use-timeline';
import { useOSStore } from '../os/stores/os-store';
import { RetroButton } from '../../components/ui/retro-ui';
import { YEARS } from './conspiracy-map/constants';
import { CaseFile } from './conspiracy-map/components/CaseFile';
import { BoardView } from './conspiracy-map/components/BoardView';
import { SatelliteView } from './conspiracy-map/components/SatelliteView';

export const ConspiracyMap: React.FC = () => {
    const { spawnWindow } = useOSStore();
    const [selectedYear, setSelectedYear] = useState('All');
    const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'BOARD' | 'SATELLITE'>('BOARD');
    const canvasX = useMotionValue(0);
    const canvasY = useMotionValue(0);
    const [zoom, setZoom] = useState(1);
    const [isPanningCanvas, setIsPanningCanvas] = useState(false);
    const { data: nodes, isLoading } = useNodes();
    const { data: connections } = useConnections();
    const safeNodes = nodes || [];
    const safeConnections = connections || [];
    const nodePositions = useRef<Map<number, { x: MotionValue<number>, y: MotionValue<number> }>>(new Map()).current;

    useMemo(() => {
        if (!nodes) return;
        nodes.forEach(node => {
            if (!nodePositions.has(node.id)) {
                nodePositions.set(node.id, { x: new MotionValue(node.boardX), y: new MotionValue(node.boardY) });
            }
        });
    }, [nodes]); 

    const visibleNodes = safeNodes.filter(n => selectedYear === 'All' || n.year === selectedYear);
    const visibleConnections = safeConnections.filter(conn => visibleNodes.find(n => n.id === conn.from) && visibleNodes.find(n => n.id === conn.to));
    const activeNode = safeNodes.find(n => n.id === activeNodeId);
    const isBoard = viewMode === 'BOARD';

    if (isLoading) return <div className="w-full h-full bg-[#121212] flex items-center justify-center text-os-accent font-mono animate-pulse">ESTABLISHING SECURE UPLINK...</div>;

    return (
        <div className="relative w-full h-full bg-[#121212] overflow-hidden select-none font-sans cursor-crosshair">
            <div className="absolute top-4 right-4 z-40 flex flex-col items-end gap-2 sm:flex-row sm:items-start">
                <RetroButton size="sm" variant="secondary" className="uppercase text-[10px] py-1" icon={<Plus size={12} />} onClick={() => spawnWindow('event-editor')}>Add Evidence</RetroButton>
                <div className="flex gap-2">
                    <button onClick={() => setViewMode('BOARD')} className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-2 border-2 shadow-retro-sm transition-all ${isBoard ? 'bg-[#f0e6d2] border-stone-800 text-stone-900' : 'bg-stone-800 border-stone-600 text-stone-400 hover:bg-stone-700'}`}><Layout size={14} /> <span className="hidden sm:inline">Case File</span></button>
                    <button onClick={() => setViewMode('SATELLITE')} className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-2 border-2 shadow-retro-sm transition-all ${!isBoard ? 'bg-green-900 border-green-400 text-green-100' : 'bg-stone-800 border-stone-600 text-stone-400 hover:bg-stone-700'}`}><Globe size={14} /> <span className="hidden sm:inline">Satellite</span></button>
                </div>
            </div>
            {isBoard && <BoardView visibleNodes={visibleNodes} visibleConnections={visibleConnections} nodePositions={nodePositions} isPanningCanvas={isPanningCanvas} setIsPanningCanvas={setIsPanningCanvas} canvasX={canvasX} canvasY={canvasY} zoom={zoom} setZoom={setZoom} setActiveNodeId={setActiveNodeId} />}
            {!isBoard && <SatelliteView visibleNodes={visibleNodes} visibleConnections={visibleConnections} setActiveNodeId={setActiveNodeId} />}
            <AnimatePresence>{activeNode && <CaseFile node={activeNode} onClose={() => setActiveNodeId(null)} />}</AnimatePresence>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-[90%] flex justify-center">
                <div className="bg-stone-800/90 backdrop-blur-sm border-2 border-stone-600 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] p-1 flex gap-1 rounded-sm overflow-x-auto max-w-full">
                    {YEARS.map(year => (
                        <button key={year} onClick={() => setSelectedYear(year)} className={`px-3 py-1 text-xs font-bold font-mono transition-all whitespace-nowrap ${selectedYear === year ? 'bg-os-accent text-white shadow-sm' : 'text-stone-400 hover:bg-stone-700 hover:text-white'}`} aria-label={`Filter events by year ${year}`} aria-pressed={selectedYear === year}>{year}</button>
                    ))}
                </div>
            </div>
            <div className="absolute top-4 left-4 z-30 pointer-events-none">
                 <div className={`backdrop-blur border-2 px-4 py-3 shadow-retro-md transform -rotate-1 transition-colors duration-500 ${isBoard ? 'bg-white/90 border-red-800' : 'bg-black/60 border-green-500'}`}>
                     <h1 className={`font-black text-lg uppercase tracking-widest border-b-2 mb-1 ${isBoard ? 'text-red-700 border-red-800' : 'text-green-500 border-green-500'}`}>{isBoard ? 'Top Secret' : 'Sat Uplink'}</h1>
                     <p className={`font-mono text-[10px] font-bold ${isBoard ? 'text-stone-900' : 'text-green-400'}`}>OPERATION: "CAREER DOMINATION"</p>
                     {isBoard && <p className="font-mono text-[8px] text-stone-600 mt-1 italic">Drag board to pan • Drag cards to move</p>}
                     <div className={`absolute -right-3 -top-3 rotate-12 border-2 px-2 py-1 font-bold text-xs uppercase ${isBoard ? 'border-red-700 text-red-700 bg-white/80' : 'border-green-400 text-green-900 bg-green-400'}`}>{isBoard ? 'Confidential' : 'Live Feed'}</div>
                 </div>
            </div>
            <div className="absolute bottom-2 right-4 z-30 pointer-events-none text-[8px] font-mono text-stone-500/50 hidden md:block">Generated by Cogito OS</div>
        </div>
    );
};
