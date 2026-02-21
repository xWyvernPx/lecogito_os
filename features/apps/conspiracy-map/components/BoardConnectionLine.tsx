import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';

export const BoardConnectionLine: React.FC<{
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
