
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SHORTCUT_SECTIONS } from '@/config/shortcuts';

interface KeyProps {
    children: React.ReactNode;
}

const Key: React.FC<KeyProps> = ({ children }) => (
    <kbd className="min-w-[24px] h-6 px-1.5 flex items-center justify-center bg-white border border-stone-300 rounded text-[11px] font-mono font-bold text-stone-700 shadow-[0_2px_0_0_#d6d3d1] mx-0.5 transform active:translate-y-[2px] active:shadow-none transition-all">
        {children}
    </kbd>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-stone-900 border-b border-stone-200 pb-1 flex items-center gap-2">
            <div className="w-1 h-3 bg-os-accent" />
            {title}
        </h3>
        <div className="flex flex-col gap-2">
            {children}
        </div>
    </div>
);

const Row: React.FC<{ label: string; keys: React.ReactNode }> = ({ label, keys }) => (
    <div className="flex justify-between items-center text-xs">
        <span className="text-stone-600">{label}</span>
        <div className="flex items-center">
            {keys}
        </div>
    </div>
);

interface ShortcutsViewProps {
    isOpen: boolean;
    onClose: () => void;
    t: (key: string) => string;
}

export const ShortcutsView: React.FC<ShortcutsViewProps> = ({ isOpen, onClose, t }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Window */}
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className="relative w-full max-w-4xl bg-[#f4f1ea] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-stone-800 overflow-hidden flex flex-col font-sans"
                    >
                        {/* Header */}
                        <div className="flex justify-between p-6 md:p-8 pb-0">
                            <div className="flex-1">
                                <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">{t('shortcuts.title')}</h1>
                                <p className="text-sm text-stone-500 max-w-md leading-relaxed">
                                    {t('shortcuts.desc')}
                                </p>
                                <div className="flex items-center gap-2 mt-4 text-xs font-medium text-stone-400 bg-white/50 inline-flex px-3 py-1.5 rounded-full border border-stone-200">
                                    {t('shortcuts.hint')} <Key>?</Key>
                                </div>
                            </div>
                            
                            <div className="hidden md:block relative w-32 h-32">
                                <div className="absolute top-0 right-0 transform rotate-12 bg-white p-2 shadow-retro-md border-2 border-stone-800">
                                    <img 
                                        src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Hacker" 
                                        alt="Hacker" 
                                        className="w-20 h-20 bg-stone-100" 
                                    />
                                    <div className="absolute -top-3 -left-3 bg-yellow-300 text-[10px] font-black px-2 py-0.5 border border-black transform -rotate-12 shadow-sm">
                                        PRO TIPS!
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={onClose} 
                                className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors text-stone-500 hover:text-stone-900"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 p-6 md:p-8">
                            {SHORTCUT_SECTIONS.map((section) => (
                                <Section key={section.titleKey} title={t(section.titleKey)}>
                                    {section.shortcuts.map((shortcut) => (
                                        <Row
                                            key={shortcut.labelKey}
                                            label={t(shortcut.labelKey)}
                                            keys={<>{shortcut.keys.map((k, i) => <Key key={i}>{k}</Key>)}</>}
                                        />
                                    ))}
                                </Section>
                            ))}
                        </div>
                        
                        {/* Footer */}
                        <div className="bg-stone-100 p-3 border-t border-stone-200 text-center text-[10px] font-mono text-stone-400">
                            COGITO_OS_KEYMAP_V1.0
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
