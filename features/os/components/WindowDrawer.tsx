
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Layers, Copy, Check } from 'lucide-react';
import { useOSStore } from '../stores/os-store';
import { useTranslation } from '../hooks/use-translation';

export const WindowDrawer: React.FC = () => {
    const { t } = useTranslation();
    const { windows, isWindowDrawerOpen, toggleWindowDrawer, closeAllWindows, restoreWindow, focusWindow } = useOSStore();
    const [copied, setCopied] = useState(false);

    // Filter to current workspace windows
    const activeWindows = windows; 

    const handleCopyUrl = () => {
        // Mock URL sharing logic
        const url = `https://cogito-os.app/share?layout=${Date.now()}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isWindowDrawerOpen && (
                <div className="absolute inset-0 z-[100] pointer-events-none overflow-hidden">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleWindowDrawer}
                        className="absolute inset-0 bg-black/20 backdrop-blur-[1px] pointer-events-auto"
                    />

                    {/* Drawer Panel */}
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute top-9 bottom-0 right-0 w-80 bg-os-window border-l-2 border-os-border shadow-[-10px_0_30px_rgba(0,0,0,0.2)] pointer-events-auto flex flex-col font-sans"
                    >
                        {/* Header */}
                        <div className="h-12 border-b-2 border-os-border flex items-center justify-between px-4 bg-white shrink-0">
                            <h2 className="font-bold text-lg text-os-text">{t('drawer.active_windows')}</h2>
                            <button 
                                onClick={closeAllWindows}
                                className="flex items-center gap-1 text-xs font-bold text-os-muted hover:text-red-500 transition-colors"
                            >
                                {t('drawer.close_all')} <ChevronRight size={12} />
                            </button>
                        </div>

                        {/* Windows List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-stone-50">
                            {activeWindows.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-os-muted opacity-50">
                                    <Layers size={48} className="mb-2" />
                                    <p className="text-xs font-bold">{t('drawer.no_windows')}</p>
                                </div>
                            ) : (
                                activeWindows.map(win => (
                                    <button
                                        key={win.id}
                                        onClick={() => win.isMinimized ? restoreWindow(win.id) : focusWindow(win.id)}
                                        className={`w-full text-left p-3 rounded border-2 transition-all flex items-center justify-between group
                                            ${win.isActive && !win.isMinimized
                                                ? 'bg-white border-os-accent shadow-sm' 
                                                : 'bg-stone-100 border-transparent hover:border-os-muted hover:bg-white'}
                                        `}
                                    >
                                        <div className="flex flex-col">
                                            <span className={`font-bold text-sm ${win.isActive && !win.isMinimized ? 'text-os-text' : 'text-os-muted'}`}>
                                                {win.title}
                                            </span>
                                            {win.isMinimized && (
                                                <span className="text-[10px] uppercase font-bold text-os-accent tracking-wider">Minimized</span>
                                            )}
                                        </div>
                                        {win.isActive && !win.isMinimized && (
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Footer Share Section */}
                        <div className="p-4 border-t-2 border-os-border bg-white">
                            <h3 className="font-bold text-sm text-os-text mb-2">{t('drawer.share_title')}</h3>
                            <p className="text-xs text-os-muted mb-3 leading-snug">{t('drawer.copy_url')}</p>
                            
                            <div className="flex gap-2">
                                <div className="flex-1 bg-stone-100 border border-stone-300 rounded px-3 py-2 text-xs text-stone-500 font-mono truncate select-all">
                                    https://cogito-os.app/share/session
                                </div>
                                <button 
                                    onClick={handleCopyUrl}
                                    className="p-2 border border-stone-300 rounded hover:bg-stone-100 hover:border-os-accent transition-colors text-os-text"
                                    title="Copy Link"
                                >
                                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                                </button>
                            </div>
                            <div className="mt-2 text-[10px] text-os-muted flex items-center gap-1">
                                {t('drawer.tip')}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
