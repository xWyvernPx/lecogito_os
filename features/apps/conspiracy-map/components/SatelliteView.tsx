import React from 'react';
import { MapPin } from 'lucide-react';
import { Map as PigeonMap, Overlay } from 'pigeon-maps';
import { NodeData, Connection } from '@/features/timeline/types';
import { MapConnectionLines } from './MapConnectionLines';

interface SatelliteViewProps {
    visibleNodes: NodeData[];
    visibleConnections: Connection[];
    setActiveNodeId: (id: number) => void;
}

export const SatelliteView: React.FC<SatelliteViewProps> = ({
    visibleNodes,
    visibleConnections,
    setActiveNodeId,
}) => {
    return (
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
    );
};
