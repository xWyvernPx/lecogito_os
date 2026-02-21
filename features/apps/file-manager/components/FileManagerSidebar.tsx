import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardDrive, Skull, X } from 'lucide-react';
import { HandDrawnIcon } from '@/components/ui/hand-drawn-icons';
import { useTranslation } from '@/features/os/hooks/use-translation';

interface FileManagerSidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    handleNavigate: (path: string[]) => void;
}

export const FileManagerSidebar: React.FC<FileManagerSidebarProps> = ({
    isSidebarOpen,
    setIsSidebarOpen,
    handleNavigate,
}) => {
    const { t } = useTranslation();

    return (
        <>
            <div className={`
                absolute inset-y-0 left-0 z-30 w-64 bg-[#e0d8c3] border-r-2 border-stone-800 flex flex-col shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 md:w-56 md:shadow-none
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Close button for mobile */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute top-2 right-2 p-1 md:hidden bg-white/50 rounded hover:bg-white"
                >
                    <X size={16} />
                </button>

                {/* Decorative Header */}
                <div className="px-3 py-2 bg-stone-800 text-[#e8e4d9] text-[10px] font-bold uppercase tracking-widest flex justify-between items-center shrink-0">
                    <span>{t('fm.places')}</span>
                    <HardDrive size={12} className="animate-spin duration-[10000ms]" />
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-6">
                    {/* Section: Drives */}
                    <div>
                        <div className="text-[9px] font-bold text-stone-500 uppercase mb-2 pl-2 border-l-2 border-[#ff7e33]">{t('fm.drives')}</div>
                        <div className="space-y-1">
                            <button onClick={() => handleNavigate([])} className="w-full text-left px-3 py-2 bg-[#fdfdfd] border-2 border-stone-400 hover:border-stone-800 hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.1)] transition-all flex items-center gap-2 group">
                                <div className="w-3 h-3 rounded-full bg-green-500 border border-black group-hover:animate-ping" />
                                <span className="font-bold">EXISTENCE (C:)</span>
                            </button>
                            <button className="w-full text-left px-3 py-2 bg-[#e8e4d9] border-2 border-transparent opacity-60 flex items-center gap-2 cursor-not-allowed group">
                                <div className="w-3 h-3 rounded-full bg-red-500 border border-black" />
                                <span className="font-bold line-through group-hover:no-underline group-hover:text-red-600">THE VOID (Z:)</span>
                            </button>
                        </div>
                    </div>

                    {/* Section: Quick Access */}
                    <div>
                        <div className="text-[9px] font-bold text-stone-500 uppercase mb-2 pl-2 border-l-2 border-blue-500">{t('fm.quick_access')}</div>
                        <div className="space-y-1">
                            {['Applications', 'Documents', 'Media'].map(dir => (
                                <button
                                    key={dir}
                                    onClick={() => handleNavigate([dir])}
                                    className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-white hover:text-[#ff7e33] transition-colors rounded-sm"
                                >
                                    <HandDrawnIcon type="folder" size={14} />
                                    <span className="font-bold text-xs">{dir}</span>
                                </button>
                            ))}
                            <button
                                onClick={() => alert("It's a trap!")}
                                className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-red-100 hover:text-red-600 transition-colors rounded-sm"
                            >
                                <Skull size={14} className="text-stone-600" />
                                <span className="font-bold text-xs">Do Not Click</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Disk Usage Viz */}
                <div className="p-4 border-t-2 border-stone-800 bg-[#d6cbb5]">
                    <div className="flex justify-between text-[9px] font-bold mb-1 uppercase">
                        <span>{t('fm.disk_usage')}</span>
                        <span>CRITICAL</span>
                    </div>
                    <div className="h-4 w-full border-2 border-stone-800 bg-white p-[2px]">
                        <div className="h-full w-[92%] bg-red-500 relative overflow-hidden animate-pulse">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_25%,rgba(0,0,0,0.2)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.2)_75%,rgba(0,0,0,0.2))] bg-[length:4px_4px]" />
                        </div>
                    </div>
                    <div className="mt-2 text-[9px] font-mono text-stone-500 truncate">
                        /dev/brain • 2 Neurons Left
                    </div>
                </div>
            </div>

            {/* Mobile Overlay for Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && window.innerWidth < 768 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="absolute inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>
        </>
    );
};
