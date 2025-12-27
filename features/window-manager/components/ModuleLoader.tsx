
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, X, Loader2, Minus } from 'lucide-react';

const LOAD_MESSAGES = [
    "ALLOCATING_MEMORY...",
    "RESOLVING_DEPENDENCIES...",
    "MOUNTING_VIRTUAL_DOM...",
    "HYDRATING_UI...",
    "ESTABLISHING_UPLINK..."
];

export const ModuleLoader: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        // Simulate progress bar filling
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 0;
                return prev + 5;
            });
        }, 100);

        // Cycle text slower than progress
        const textInterval = setInterval(() => {
            setMsgIndex(prev => (prev + 1) % LOAD_MESSAGES.length);
        }, 800);

        return () => {
            clearInterval(interval);
            clearInterval(textInterval);
        };
    }, []);

    // Calculate number of blocks for the progress bar (20 blocks total)
    const blocks = Math.floor(progress / 5);

    return (
        <div className="flex h-full w-full items-center justify-center bg-[#e8e4d9]/50 backdrop-blur-[2px] p-4 cursor-wait">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-sm bg-[#fdfdfd] border-2 border-[#121212] shadow-[6px_6px_0_0_#121212] overflow-hidden"
            >
                {/* Title Bar */}
                <div className="bg-[#ff7e33] px-2 py-1.5 flex items-center justify-between border-b-2 border-[#121212] select-none">
                    <div className="flex items-center gap-2 text-[#121212]">
                        <Cpu size={16} strokeWidth={2.5} />
                        <span className="font-bold font-mono text-xs tracking-wider uppercase">System_Loader.exe</span>
                    </div>
                    <div className="flex gap-1.5">
                        <button className="w-5 h-5 bg-white border-2 border-[#121212] flex items-center justify-center hover:bg-stone-100 active:translate-y-[1px] transition-all">
                            <Minus size={12} strokeWidth={4} />
                        </button>
                        <button className="w-5 h-5 bg-[#ef4444] border-2 border-[#121212] flex items-center justify-center text-white hover:bg-red-600 active:translate-y-[1px] transition-all">
                            <X size={12} strokeWidth={4} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-14 h-14 bg-[#e8e4d9] border-2 border-[#121212] flex items-center justify-center shadow-[3px_3px_0_0_#121212] shrink-0">
                            <Loader2 size={28} className="text-[#121212] animate-spin" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold font-sans text-[#121212] mb-1 uppercase tracking-tight">
                                Launching Application Module...
                            </p>
                            <p className="text-[10px] font-mono text-stone-500 uppercase leading-relaxed border-l-2 border-[#ff7e33] pl-2">
                                {LOAD_MESSAGES[msgIndex]}
                            </p>
                        </div>
                    </div>

                    {/* Retro Segmented Progress Bar */}
                    <div className="space-y-1.5">
                        <div className="h-6 w-full border-2 border-[#121212] p-[3px] flex gap-[2px] bg-white">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div 
                                    key={i}
                                    className={`h-full flex-1 transition-colors duration-75 ${i < blocks ? 'bg-[#121212]' : 'bg-transparent'}`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#121212]">
                            <span>BUFFERING</span>
                            <span>{progress}%</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                        <button className="px-6 py-2 bg-white border-2 border-[#121212] shadow-[3px_3px_0_0_#121212] text-xs font-bold uppercase hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#121212] active:translate-y-[3px] active:shadow-none transition-all">
                            Run in Background
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
