import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Trash2 } from 'lucide-react';
import { FileSystemNode } from '@/types';
import { RetroButton } from '@/components/ui/retro-ui';
import { getFileIcon } from '@/features/apps/file-manager/utils';
import { FileMetadata } from '@/features/apps/file-manager/utils';
import { useTranslation } from '@/features/os/hooks/use-translation';

interface InspectorPanelProps {
    selectedItemName: string | null;
    selectedItemNode: FileSystemNode | null;
    selectedMeta: FileMetadata | null;
    handleOpenItem: (name: string, node: FileSystemNode) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
    selectedItemName,
    selectedItemNode,
    selectedMeta,
    handleOpenItem,
}) => {
    const { t } = useTranslation();

    return (
        <AnimatePresence>
            {selectedItemName && selectedItemNode && selectedMeta && (
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="bg-stone-100 border-l-2 border-stone-800 flex-col overflow-hidden shrink-0 shadow-[-4px_0_15px_rgba(0,0,0,0.1)] z-10 hidden md:flex"
                >
                    <div className="bg-stone-800 text-[#e8e4d9] px-3 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Info size={12} />
                        {t('fm.inspector')}
                    </div>

                    <div className="p-6 flex flex-col items-center border-b-2 border-stone-300 bg-white">
                        <div className="w-20 h-20 flex items-center justify-center mb-4 relative">
                            <div className="absolute inset-0 bg-stone-100 rounded-full animate-pulse opacity-50" />
                            {getFileIcon(selectedItemName, selectedItemNode, 64)}
                        </div>
                        <h3 className="font-black text-sm text-center text-stone-900 break-all mb-1">{selectedItemName}</h3>
                        <span className="text-[10px] font-bold text-stone-500 uppercase bg-stone-200 px-2 py-0.5 rounded">
                            {selectedItemNode.type === 'dir' ? 'Dimensional Pocket' : 'Frozen Data'}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-stone-500 uppercase border-b border-stone-300 pb-1">
                                <span>{t('fm.properties')}</span>
                                <span>{t('fm.value')}</span>
                            </div>
                            {[
                                ['Size', selectedMeta.size],
                                ['Created', selectedMeta.created],
                                ['Permissions', selectedMeta.permissions],
                                ['Owner', selectedMeta.owner],
                                ['Sector', selectedMeta.sector],
                            ].map(([k, v]) => (
                                <div key={k} className="flex justify-between text-xs font-mono">
                                    <span className="text-stone-600">{k}:</span>
                                    <span className="font-bold text-stone-900">{v}</span>
                                </div>
                            ))}

                            <div className="mt-4 pt-2 border-t border-dashed border-stone-300">
                                <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">{t('fm.analysis')}:</p>
                                <p className="text-xs font-serif italic text-stone-700 leading-snug bg-yellow-100 p-2 border border-yellow-200 rounded">
                                    "{selectedMeta.flavor}"
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t-2 border-dashed border-stone-300">
                            <RetroButton
                                variant="primary"
                                size="sm"
                                className="w-full mb-2"
                                onClick={() => handleOpenItem(selectedItemName, selectedItemNode)}
                            >
                                {t('fm.action.proke')}
                            </RetroButton>
                            <RetroButton
                                variant="secondary"
                                size="sm"
                                className="w-full text-red-600 hover:text-white hover:bg-red-600 border-red-200"
                                icon={<Trash2 size={12} />}
                                onClick={() => alert("Nice try. This is a read-only reality.")}
                            >
                                {t('fm.action.vaporize')}
                            </RetroButton>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
