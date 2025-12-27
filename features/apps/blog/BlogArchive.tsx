
import React, { useState } from 'react';
import { ChevronLeft, RotateCcw, RotateCw, Bold, Italic, Underline, Link, MessageSquare, Search, Settings, Share, ChevronDown, Check, User, PenTool, Share2, Layers } from 'lucide-react';
import { RetroBadge, RetroButton } from '../../../components/ui/retro-ui';
import { BlogPost } from './data';
import { AnimatePresence, motion } from 'framer-motion';
import { useOSStore } from '../../os/stores/os-store';
import { ShareDialog } from '../../os/components/ShareDialog';
import { useBlogStore } from './store';

interface BlogArchiveProps {
    onBack: () => void;
    onCompose: () => void;
    onSettings?: () => void;
    onPostClick: (post: BlogPost) => void;
}

export const BlogArchive: React.FC<BlogArchiveProps> = ({ onBack, onCompose, onSettings, onPostClick }) => {
    const { currentUser } = useOSStore();
    const { posts, categories, authors, series } = useBlogStore();
    const isAdmin = currentUser?.type === 'admin';

    const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All');
    const [selectedAuthor, setSelectedAuthor] = useState<string | 'All'>('All');
    const [selectedSeries, setSelectedSeries] = useState<string | 'All'>('All');
    
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isSeriesOpen, setIsSeriesOpen] = useState(false);
    
    const [isShareOpen, setIsShareOpen] = useState(false);

    const filteredPosts = posts.filter(post => {
        if (selectedCategory !== 'All' && post.category !== selectedCategory) return false;
        if (selectedAuthor !== 'All' && post.author !== selectedAuthor) return false;
        if (selectedSeries !== 'All' && post.serieId !== selectedSeries) return false;
        return true;
    });

    const categoryOptions = ['All', ...categories];
    const authorOptions = ['All', ...authors];
    const seriesOptions = ['All', ...series.map(s => s.id)];

    const getSeriesName = (id?: string) => {
        if (!id || id === 'All') return 'All';
        return series.find(s => s.id === id)?.title;
    };

    const toggleDropdown = (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean) => {
        setIsCatOpen(false);
        setIsAuthOpen(false);
        setIsSeriesOpen(false);
        setter(!current);
    };

    return (
        <div className="flex flex-col h-full bg-white text-stone-800">
            <ShareDialog 
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                meta={{
                    title: "The Grand Archives",
                    description: "Explore the latest scrolls and wisdom from the Cogito OS community.",
                    url: "https://designeros.app/blog",
                    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1000&auto=format&fit=crop"
                }}
            />

            {/* Toolbar */}
            <div className="h-12 bg-[#f4f1ea] border-b border-stone-300 flex items-center justify-between px-4 select-none shrink-0">
                <div className="flex items-center gap-1">
                     <button onClick={onBack} className="p-1.5 hover:bg-stone-200 rounded mr-2 text-stone-600">
                         <ChevronLeft size={18} />
                     </button>
                     <div className="h-6 w-px bg-stone-300 mx-2" />
                     <button className="p-1.5 hover:bg-stone-200 rounded text-stone-500"><RotateCcw size={14} /></button>
                     <button className="p-1.5 hover:bg-stone-200 rounded text-stone-500"><RotateCw size={14} /></button>
                     <div className="h-6 w-px bg-stone-300 mx-2" />
                     <button className="p-1.5 hover:bg-stone-200 rounded font-bold"><Bold size={14} /></button>
                     <button className="p-1.5 hover:bg-stone-200 rounded italic"><Italic size={14} /></button>
                     <button className="p-1.5 hover:bg-stone-200 rounded underline"><Underline size={14} /></button>
                     <div className="h-6 w-px bg-stone-300 mx-2" />
                     <button className="p-1.5 hover:bg-stone-200 rounded text-stone-500"><Link size={14} /></button>
                     <button className="p-1.5 hover:bg-stone-200 rounded text-stone-500"><MessageSquare size={14} /></button>
                </div>

                <div className="flex items-center gap-3">
                    {isAdmin && (
                         <RetroButton variant="secondary" size="sm" onClick={onCompose} icon={<PenTool size={12} />}>
                            New Scroll
                        </RetroButton>
                    )}
                    <div className="h-6 w-px bg-stone-300" />
                    <Search size={16} className="text-stone-400" />
                    <button 
                        onClick={onSettings}
                        className="p-1 hover:bg-stone-200 rounded text-stone-400 hover:text-stone-600 transition-colors"
                        title="System Configuration"
                    >
                        <Settings size={16} />
                    </button>
                    <RetroButton variant="primary" size="sm" onClick={() => setIsShareOpen(true)} icon={<Share2 size={12} />}>
                        Share
                    </RetroButton>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-stone-500 font-medium">where</span>
                
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-700">category</span>
                    <span className="text-stone-400 italic">is</span>
                    <div className="relative">
                        <button 
                            onClick={() => toggleDropdown(setIsCatOpen, isCatOpen)}
                            className="flex items-center gap-2 px-2 py-1 bg-white border border-stone-300 rounded shadow-sm hover:bg-stone-50 min-w-[100px] justify-between"
                        >
                            <span className={selectedCategory === 'All' ? 'text-stone-500' : 'text-stone-900 font-bold'}>{selectedCategory}</span>
                            <ChevronDown size={12} className="text-stone-400" />
                        </button>
                        <AnimatePresence>
                            {isCatOpen && (
                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full left-0 mt-1 w-48 bg-white border border-stone-200 shadow-xl rounded-md z-20 py-1">
                                    {categoryOptions.map(cat => (
                                        <button key={cat} onClick={() => { setSelectedCategory(cat as any); setIsCatOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-stone-100 text-xs flex justify-between items-center">
                                            <span>{cat}</span>
                                            {selectedCategory === cat && <Check size={12} className="text-[#ff7e33]" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <span className="text-stone-400 font-medium">and</span>

                {/* Author Filter */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-700">author</span>
                    <span className="text-stone-400 italic">includes</span>
                    <div className="relative">
                        <button 
                            onClick={() => toggleDropdown(setIsAuthOpen, isAuthOpen)}
                            className="flex items-center gap-2 px-2 py-1 bg-white border border-stone-300 rounded shadow-sm hover:bg-stone-50 min-w-[100px] justify-between"
                        >
                             <span className={selectedAuthor === 'All' ? 'text-stone-500' : 'text-stone-900 font-bold'}>{selectedAuthor}</span>
                            <ChevronDown size={12} className="text-stone-400" />
                        </button>
                        <AnimatePresence>
                            {isAuthOpen && (
                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full left-0 mt-1 w-48 bg-white border border-stone-200 shadow-xl rounded-md z-20 py-1 max-h-60 overflow-y-auto">
                                    {authorOptions.map(auth => (
                                        <button key={auth} onClick={() => { setSelectedAuthor(auth); setIsAuthOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-stone-100 text-xs flex justify-between items-center">
                                            <span>{auth}</span>
                                            {selectedAuthor === auth && <Check size={12} className="text-[#ff7e33]" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <span className="text-stone-400 font-medium">and</span>

                {/* Series Filter */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-700">series</span>
                    <span className="text-stone-400 italic">is</span>
                    <div className="relative">
                        <button 
                            onClick={() => toggleDropdown(setIsSeriesOpen, isSeriesOpen)}
                            className="flex items-center gap-2 px-2 py-1 bg-white border border-stone-300 rounded shadow-sm hover:bg-stone-50 min-w-[100px] justify-between"
                        >
                            <span className={`truncate max-w-[120px] ${selectedSeries === 'All' ? 'text-stone-500' : 'text-stone-900 font-bold'}`}>
                                {selectedSeries === 'All' ? 'All' : getSeriesName(selectedSeries)}
                            </span>
                            <ChevronDown size={12} className="text-stone-400 shrink-0" />
                        </button>
                        <AnimatePresence>
                            {isSeriesOpen && (
                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full left-0 mt-1 w-64 bg-white border border-stone-200 shadow-xl rounded-md z-20 py-1 max-h-60 overflow-y-auto">
                                    {seriesOptions.map(sId => (
                                        <button key={sId} onClick={() => { setSelectedSeries(sId); setIsSeriesOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-stone-100 text-xs flex justify-between items-center">
                                            <span className="truncate">{sId === 'All' ? 'All' : getSeriesName(sId)}</span>
                                            {selectedSeries === sId && <Check size={12} className="text-[#ff7e33]" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto p-8 bg-[#fdfdfd]">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-black mb-6">✦ The Grand Archives</h2>
                    <div className="grid grid-cols-1 border-t-2 border-stone-100">
                        {filteredPosts.length === 0 && (
                            <div className="py-12 text-center text-stone-400 font-mono">
                                No scrolls found with these parameters.
                            </div>
                        )}
                        {filteredPosts.map(post => (
                            <div 
                                key={post.id}
                                onClick={() => onPostClick(post)}
                                className="group flex flex-col md:flex-row gap-6 py-6 border-b border-stone-100 hover:bg-stone-50 transition-colors cursor-pointer px-4 -mx-4 rounded-lg relative overflow-hidden"
                            >
                                <div className="w-full md:w-48 aspect-video md:aspect-[4/3] bg-stone-200 rounded overflow-hidden shrink-0 border border-stone-200 shadow-sm group-hover:shadow-md transition-all">
                                    {post.thumbnail ? (
                                        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-[#e8e4d9] text-stone-400 font-mono text-xs p-4 text-center">NO IMAGE</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <RetroBadge label={post.category} colorClass="bg-stone-100 text-stone-600 border-stone-300" />
                                        <span className="text-xs text-stone-400 font-mono">{post.date}</span>
                                        {post.serieId && (
                                            <span className="text-[10px] font-bold text-[#ff7e33] border border-[#ff7e33]/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                                <Layers size={8} /> {getSeriesName(post.serieId)}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-[#ff7e33] transition-colors">{post.title}</h3>
                                    <p className="text-sm text-stone-600 line-clamp-2">{post.excerpt}</p>
                                    <div className="mt-auto pt-4 flex items-center gap-2 text-xs font-bold text-stone-500">
                                        <div className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center border border-stone-300"><User size={10} /></div>
                                        {post.author}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
