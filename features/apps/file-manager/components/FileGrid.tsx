import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ghost, DownloadCloud } from 'lucide-react';
import { FileSystemNode } from '@/types';
import { getFileIcon } from '@/features/apps/file-manager/utils';
import { useTranslation } from '@/features/os/hooks/use-translation';

interface FileGridProps {
    sortedItems: [string, FileSystemNode][];
    selectedItemName: string | null;
    setSelectedItemName: (name: string | null) => void;
    handleOpenItem: (name: string, node: FileSystemNode) => void;
    isDragging: boolean;
    handleDragOver: (e: React.DragEvent) => void;
    handleDragLeave: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
}

export const FileGrid: React.FC<FileGridProps> = ({
    sortedItems,
    selectedItemName,
    setSelectedItemName,
    handleOpenItem,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
}) => {
    const { t } = useTranslation();

    return (
        <div
            className="flex-1 bg-[#fdfdfd] relative flex flex-col overflow-hidden"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Drag & Drop Overlay */}
            <AnimatePresence>
                {isDragging && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-2 z-50 border-4 border-dashed border-os-accent bg-os-accent/10 flex flex-col items-center justify-center pointer-events-none rounded-lg"
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="bg-white p-4 rounded-full shadow-retro-md border-2 border-os-accent text-os-accent mb-4"
                        >
                            <DownloadCloud size={48} />
                        </motion.div>
                        <h3 className="text-2xl font-black text-os-accent uppercase tracking-tighter bg-white px-4 py-1 border-2 border-os-accent shadow-sm">
                            {t('fm.upload_zone')}
                        </h3>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                className="flex-1 overflow-y-auto p-4 md:p-6 content-start grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 auto-rows-min"
                onClick={() => setSelectedItemName(null)}
            >
                {sortedItems.map(([name, node]) => (
                    <div
                        key={name}
                        onClick={(e) => { e.stopPropagation(); setSelectedItemName(name); }}
                        onDoubleClick={(e) => { e.stopPropagation(); handleOpenItem(name, node); }}
                        className="group relative flex flex-col items-center cursor-pointer"
                    >
                        {/* Visual Container */}
                        <div className={`
                            w-full flex flex-col items-center p-2 border-2 transition-all
                            ${selectedItemName === name
                                ? 'bg-os-accent border-stone-900 shadow-[4px_4px_0_0_#121212] text-white z-10 scale-105 rotate-1'
                                : 'bg-white border-transparent hover:border-stone-300 hover:bg-stone-50 hover:shadow-sm text-stone-800'}
                        `}>
                            <div className={`mb-3 transition-transform ${selectedItemName === name ? 'scale-110 drop-shadow-md' : 'group-hover:scale-105 group-hover:rotate-3'}`}>
                                {getFileIcon(name, node, 48)}
                            </div>
                            <span className="text-xs font-bold font-mono text-center leading-tight break-all px-1 bg-inherit line-clamp-2">
                                {name}
                            </span>
                        </div>

                        {selectedItemName === name && (
                            <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full animate-ping z-20 pointer-events-none" />
                        )}
                    </div>
                ))}

                {sortedItems.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-stone-300">
                        <Ghost size={64} className="mb-4 opacity-20 animate-bounce" />
                        <p className="font-mono text-xs font-bold uppercase tracking-widest mb-1">It's quiet...</p>
                        <p className="text-[10px] italic">Too quiet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
