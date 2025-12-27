import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ShutdownScreenProps {
  onRestart: () => void;
}

export const ShutdownScreen: React.FC<ShutdownScreenProps> = ({ onRestart }) => {
  const [status, setStatus] = useState("Stopping services...");
  const [isSafe, setIsSafe] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStatus("Saving session..."), 1000);
    const t2 = setTimeout(() => setStatus("Unmounting disks..."), 2000);
    const t3 = setTimeout(() => setStatus("Powering off..."), 3000);
    const t4 = setTimeout(() => {
        setStatus("System Halted.");
        setIsSafe(true);
    }, 4000);

    return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999] select-none">
       <motion.div
         key={status}
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         className="text-[#e8e4d9] font-mono text-xl"
       >
         {status}
       </motion.div>
       
       {isSafe && (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="mt-8 flex flex-col items-center gap-4"
           >
                <div className="text-stone-500 text-sm">It is now safe to turn off your computer.</div>
                <button
                    onClick={onRestart}
                    className="px-6 py-2 border-2 border-[#e8e4d9] text-[#e8e4d9] font-bold font-mono hover:bg-[#e8e4d9] hover:text-black transition-colors"
                >
                    BOOT SYSTEM
                </button>
           </motion.div>
       )}
    </div>
  );
};