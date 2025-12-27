import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BOOT_SEQUENCE } from '../../../config/system';

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    let timeouts: number[] = [];
    BOOT_SEQUENCE.forEach(({ text, delay }) => {
      const id = window.setTimeout(() => {
        setLines(prev => {
            // If the last line was a cursor, remove it before adding new line
            const cleanPrev = prev.filter(l => l !== "_");
            return [...cleanPrev, text];
        });
      }, delay);
      timeouts.push(id);
    });

    // Finish boot in ~3s (slightly longer than last animation to ensure everything is read)
    const totalTime = Math.max(...BOOT_SEQUENCE.map(i => i.delay)) + 500;
    const finishId = window.setTimeout(onComplete, totalTime);
    timeouts.push(finishId);

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black text-[#e8e4d9] font-mono p-8 text-sm md:text-base z-[9999] overflow-hidden select-none cursor-wait">
      {lines.map((line, i) => (
        <div key={i} className="mb-1 leading-tight">
            {line === "_" ? (
                <motion.span 
                    animate={{ opacity: [0, 1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.5 }}
                >
                    _
                </motion.span>
            ) : line}
        </div>
      ))}
    </div>
  );
};