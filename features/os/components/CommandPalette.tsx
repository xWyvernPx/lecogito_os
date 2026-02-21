
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight, Sparkles, FileText, AppWindow, Folder, Terminal } from 'lucide-react';
import { useOSStore } from '../stores/os-store';
import { useSearch, SearchResult } from '../../search/use-search';
import { HighlightText } from '../../../components/ui/text-utils';

export const CommandPalette: React.FC = () => {
    const { isCommandPaletteOpen, setCommandPalette, spawnWindow } = useOSStore();
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const results = useSearch(query, spawnWindow);

    useEffect(() => {
        if (isCommandPaletteOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isCommandPaletteOpen]);

    // Keyboard Navigation
    useEffect(() => {
        if (!isCommandPaletteOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % results.length);
                scrollIntoView(selectedIndex + 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
                scrollIntoView(selectedIndex - 1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (results[selectedIndex]) {
                    results[selectedIndex].action();
                    setCommandPalette(false);
                }
            } else if (e.key === 'Escape') {
                setCommandPalette(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCommandPaletteOpen, results, selectedIndex, setCommandPalette]);

    const scrollIntoView = (index: number) => {
        if (!listRef.current) return;
        const items = listRef.current.children;
        if (items[index]) {
            items[index].scrollIntoView({ block: 'nearest' });
        }
    };

    const handleAskAI = () => {
        spawnWindow('chatbot');
        setCommandPalette(false);
    };

    const getIcon = (type: SearchResult['type']) => {
        switch (type) {
            case 'blog': return <FileText size={16} className="text-os-accent" />;
            case 'app': return <AppWindow size={16} className="text-blue-500" />;
            case 'project': return <Folder size={16} className="text-green-500" />;
            case 'file': return <Terminal size={16} className="text-stone-500" />;
            default: return <Search size={16} />;
        }
    };

    return (
        <AnimatePresence>
            {isCommandPaletteOpen && (
                <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[15vh] px-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setCommandPalette(false)}
                    />

                    {/* Palette Window */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className="relative w-full max-w-2xl bg-[#f4f1ea] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-stone-300 overflow-hidden flex flex-col max-h-[60vh] font-sans"
                    >
                        {/* Input Area */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-300 bg-white">
                            <Search className="text-stone-400" size={20} />
                            <input 
                                ref={inputRef}
                                type="text" 
                                className="flex-1 bg-transparent outline-none text-lg text-stone-800 placeholder:text-stone-400 font-medium"
                                placeholder="Search documentation, blog, files..."
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                            />
                            <button 
                                onClick={handleAskAI}
                                className="flex items-center gap-1.5 px-2 py-1 rounded bg-stone-100 border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-200 hover:text-os-accent transition-colors"
                            >
                                <Sparkles size={12} /> Ask AI
                            </button>
                        </div>

                        {/* Category Tabs (Visual Only for now) */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#fdfdfd] border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wide overflow-x-auto scrollbar-hide">
                            <span className="px-2 py-1 bg-stone-200 rounded text-stone-800">All</span>
                            <span className="px-2 py-1 hover:bg-stone-100 rounded cursor-pointer">Blog ({results.filter(r => r.type === 'blog').length})</span>
                            <span className="px-2 py-1 hover:bg-stone-100 rounded cursor-pointer">Apps</span>
                            <span className="px-2 py-1 hover:bg-stone-100 rounded cursor-pointer">Files</span>
                        </div>

                        {/* Results List */}
                        <div ref={listRef} className="flex-1 overflow-y-auto bg-[#fdfdfd] p-2 space-y-1">
                            {results.length === 0 ? (
                                <div className="py-12 text-center text-stone-400">
                                    <p className="text-sm font-medium">No results found.</p>
                                    <p className="text-xs mt-1">Try searching for "blog", "terminal", or "project".</p>
                                </div>
                            ) : (
                                results.map((result, idx) => (
                                    <button
                                        key={`${result.type}-${result.id}`}
                                        onClick={() => { result.action(); setCommandPalette(false); }}
                                        onMouseEnter={() => setSelectedIndex(idx)}
                                        className={`w-full text-left px-4 py-3 rounded-md flex items-start gap-4 transition-all group ${
                                            idx === selectedIndex 
                                            ? 'bg-stone-100 border border-stone-200 shadow-sm' 
                                            : 'border border-transparent hover:bg-stone-50'
                                        }`}
                                    >
                                        <div className={`mt-1 p-1.5 rounded-md bg-white border border-stone-200 shadow-sm shrink-0 ${idx === selectedIndex ? 'text-os-accent' : 'text-stone-400'}`}>
                                            {getIcon(result.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-[10px] font-mono text-os-accent bg-os-accent/10 px-1.5 rounded truncate max-w-[200px]">
                                                    {result.path}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-bold text-stone-900 leading-tight mb-1">
                                                <HighlightText text={result.title} query={query} />
                                            </h4>
                                            <p className="text-xs text-stone-500 line-clamp-1">
                                                <HighlightText text={result.description} query={query} />
                                            </p>
                                        </div>
                                        {idx === selectedIndex && (
                                            <ArrowRight size={16} className="text-stone-400 self-center" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 bg-stone-100 border-t border-stone-200 flex justify-between items-center text-[10px] text-stone-500 font-medium">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1"><kbd className="bg-white border border-stone-300 rounded px-1 min-w-[16px] text-center shadow-sm">↵</kbd> to select</span>
                                <span className="flex items-center gap-1"><kbd className="bg-white border border-stone-300 rounded px-1 min-w-[16px] text-center shadow-sm">↓</kbd> <kbd className="bg-white border border-stone-300 rounded px-1 min-w-[16px] text-center shadow-sm">↑</kbd> to navigate</span>
                                <span className="flex items-center gap-1"><kbd className="bg-white border border-stone-300 rounded px-1 min-w-[16px] text-center shadow-sm">esc</kbd> to close</span>
                            </div>
                            <div>
                                Cogito Indexer v2.1
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
