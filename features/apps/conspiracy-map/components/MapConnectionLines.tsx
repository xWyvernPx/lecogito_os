import React from 'react';
import { motion } from 'framer-motion';
import { NodeData, Connection } from '@/features/timeline/types';

export const MapConnectionLines: React.FC<{
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
