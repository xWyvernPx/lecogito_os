import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { EvidenceImage } from '@/features/timeline/types';

export const Lightbox: React.FC<{ image: EvidenceImage; onClose: () => void }> = ({ image, onClose }) => {
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
