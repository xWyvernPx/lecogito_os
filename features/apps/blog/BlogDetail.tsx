
import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, ChevronRight, Home, Search, X, List, HelpCircle, Bookmark,
    Hash, Link as LinkIcon, PanelLeft, PanelRight, Share2, Layers
} from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { CalloutBlock } from '@/components/ui/CalloutBlock';
import { ShareDialog } from '../../os/components/ShareDialog';
import { CommentSection } from '../../comments/components/CommentSection';
import { BlogDto, useBlogSearch, useSeries } from '@/services';
import { blogDtoToPost, serieDtoToLocal, DEFAULT_SEARCH_REQUEST, DEFAULT_BLOG_CRITERIA, type BlogPost } from './utils';

interface BlogDetailProps {
    post: BlogPost;
    onBack: () => void;
}

// Helper to generate consistent IDs from text
const slugify = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Helper to extract text from React children
const flattenChildren = (children: React.ReactNode): string => {
    return React.Children.toArray(children)
        .map(child => {
            if (typeof child === 'string' || typeof child === 'number') return String(child);
            if (React.isValidElement<{ children?: React.ReactNode }>(child) && child.props.children) return flattenChildren(child.props.children);
            return '';
        })
        .join('');
};

export const BlogDetail: React.FC<BlogDetailProps> = ({ post: initialPost, onBack }) => {
    const [currentPost, setCurrentPost] = useState<BlogDto>(initialPost);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeId, setActiveId] = useState<string>('');
    const [isShareOpen, setIsShareOpen] = useState(false);
    
    // Sidebar Visibility States
    const [showLeftSidebar, setShowLeftSidebar] = useState(false);
    const [showRightSidebar, setShowRightSidebar] = useState(true);

    const observer = useRef<IntersectionObserver | null>(null);
    const mainRef = useRef<HTMLElement>(null);

    // Update current post if prop changes
    useEffect(() => {
        setCurrentPost(initialPost);
    }, [initialPost]);

    // Fetch data from API
    const { data: blogsData } = useBlogSearch(DEFAULT_BLOG_CRITERIA, DEFAULT_SEARCH_REQUEST);
    const { data: seriesData } = useSeries(DEFAULT_SEARCH_REQUEST);

    // Convert API data to local format
    const posts = useMemo(() => {
        return blogsData?.rows?.map(blogDtoToPost) || [];
    }, [blogsData]);

    const series = useMemo(() => {
        return seriesData?.rows?.map(serieDtoToLocal) || [];
    }, [seriesData]);

    // Derived State for Series
    const currentSeries = useMemo(() => {
        return currentPost.serieId ? series.find(s => s.id === currentPost.serieId) : null;
    }, [currentPost.serieId, series]);

    const seriesPosts = useMemo(() => {
        if (!currentSeries) return [];
        return posts.filter(p => p.serieId === currentSeries.id).reverse();
    }, [currentSeries, posts]);

    // Extract headings for "Jump to" sidebar
    const headings = useMemo(() => {
        const lines = (currentPost.content || '').split('\n');
        return lines
            .filter(line => line.trim().startsWith('#'))
            .map(line => {
                const match = line.trim().match(/^(#+)\s+(.+)$/);
                if (!match) return null;
                return {
                    level: match[1].length,
                    text: match[2],
                    id: slugify(match[2])
                };
            })
            .filter(Boolean) as { level: number, text: string, id: string }[];
    }, [currentPost.content]);

    // Setup Intersection Observer to track active heading
    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        // Delay slightly to ensure DOM is ready and ref is attached
        const timer = setTimeout(() => {
            if (!mainRef.current) return;

            observer.current = new IntersectionObserver(
                (entries) => {
                    const visibleEntry = entries.find((entry) => entry.isIntersecting);
                    if (visibleEntry) {
                        setActiveId(visibleEntry.target.id);
                    }
                },
                { 
                    root: mainRef.current, // Use the scroll container as root
                    rootMargin: '0px 0px -50% 0px', // Trigger when element is in top half of view
                    threshold: 0.1
                } 
            );

            headings.forEach((h) => {
                const el = document.getElementById(h.id);
                if (el) observer.current?.observe(el);
            });
        }, 100);

        return () => {
            clearTimeout(timer);
            observer.current?.disconnect();
        };
    }, [headings, currentPost]);

    const scrollToHeading = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Convert string ID from local data to number for API, fallback to 1 if NaN
    const numericBlogId = parseInt(currentPost.id, 10) || 1;

    return (
        <div className="flex flex-col h-full bg-[#f4f1ea] text-stone-800 overflow-hidden font-sans">
            <ShareDialog 
                isOpen={isShareOpen} 
                onClose={() => setIsShareOpen(false)} 
                meta={{
                    title: currentPost.title,
                    description: currentPost.excerpt,
                    image: currentPost.thumbnail,
                    url: `https://designeros.app/blog/${currentPost.id}`
                }}
            />

            {/* --- TOP BROWSER-STYLE NAVIGATION BAR --- */}
            <div className="h-12 border-b border-stone-300 bg-[#e8e4d9] flex items-center justify-between px-4 shrink-0 z-30 select-none">
                <div className="flex items-center gap-1">
                    <button onClick={onBack} className="p-1.5 hover:bg-stone-200 rounded text-stone-600 transition-colors">
                        <Home size={18} />
                    </button>
                    <button 
                        onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                        className={`p-1.5 rounded transition-colors ${showLeftSidebar ? 'bg-stone-200 text-stone-900' : 'text-stone-600 hover:bg-stone-200'}`}
                        title="Toggle Navigation"
                    >
                        <PanelLeft size={18} />
                    </button>
                    <div className="h-6 w-px bg-stone-300 mx-2" />
                    <button className="p-1.5 hover:bg-stone-200 rounded text-stone-600 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="p-1.5 hover:bg-stone-200 rounded text-stone-600 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex-1 flex justify-center min-w-0 px-4">
                    <div className="hidden md:flex items-center gap-2 text-xs font-medium text-stone-400 truncate">
                        {currentSeries && (
                            <span className="font-bold text-os-accent flex items-center gap-1">
                                <Layers size={12} /> {currentSeries.title}
                            </span>
                        )}
                        {currentSeries && <span className="text-stone-300">/</span>}
                        <span className="truncate">{currentPost.title}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsShareOpen(true)}
                        className="p-1.5 hover:bg-stone-200 rounded text-stone-600 transition-colors"
                        title="Share this article"
                    >
                        <Share2 size={18} />
                    </button>
                    <button 
                        onClick={() => setSearchOpen(!searchOpen)}
                        className={`p-1.5 hover:bg-stone-200 rounded transition-colors ${searchOpen ? 'bg-stone-200' : ''}`}
                    >
                        <Search size={18} className="text-stone-600" />
                    </button>
                    <button 
                        onClick={() => setShowRightSidebar(!showRightSidebar)}
                        className={`p-1.5 rounded transition-colors ${showRightSidebar ? 'bg-stone-200 text-stone-900' : 'text-stone-600 hover:bg-stone-200'}`}
                        title="Toggle Table of Contents"
                    >
                        <PanelRight size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* --- LEFT SIDEBAR: Series or Next Post Navigation --- */}
                <motion.aside 
                    initial={false}
                    animate={{ 
                        width: showLeftSidebar ? 288 : 0,
                        opacity: showLeftSidebar ? 1 : 0
                    }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="border-r border-stone-300 bg-[#edeae1] overflow-hidden flex flex-col shrink-0"
                >
                    <div className="w-72 p-4 h-full overflow-y-auto">
                        
                        {currentSeries ? (
                            <div className="space-y-4">
                                <div className="bg-white border-2 border-stone-200 p-3 rounded-sm shadow-sm">
                                    <div className="text-[10px] font-bold text-os-accent uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <Layers size={10} /> Series
                                    </div>
                                    <h4 className="text-sm font-black text-stone-900 leading-tight mb-1">{currentSeries.title}</h4>
                                    <p className="text-[11px] text-stone-500 italic">{currentSeries.description}</p>
                                </div>

                                <div className="space-y-1">
                                    {seriesPosts.map((seriesPost, idx) => (
                                        <button
                                            key={seriesPost.id}
                                            onClick={() => setCurrentPost(seriesPost)}
                                            className={`w-full text-left px-3 py-2 rounded text-[13px] leading-tight transition-all border-l-2 ${
                                                seriesPost.id === currentPost.id
                                                ? 'bg-white border-os-accent text-stone-900 font-bold shadow-sm'
                                                : 'border-transparent text-stone-600 hover:bg-stone-200 hover:border-stone-300'
                                            }`}
                                        >
                                            <span className="text-[10px] text-stone-400 font-mono block mb-0.5">Part {idx + 1}</span>
                                            {seriesPost.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h4 className="text-[12px] font-black text-stone-900 uppercase tracking-widest px-2 mb-2 border-b border-stone-300 pb-2">
                                    Read Next
                                </h4>
                                <div className="space-y-1">
                                    {posts.filter(p => p.id !== currentPost.id).slice(0, 5).map(otherPost => (
                                        <button
                                            key={otherPost.id}
                                            onClick={() => setCurrentPost(otherPost)}
                                            className="w-full text-left px-3 py-2 rounded text-[13px] leading-tight text-stone-600 hover:bg-stone-200 transition-colors group"
                                        >
                                            <span className="block group-hover:text-os-accent transition-colors">{otherPost.title}</span>
                                            <span className="text-[10px] text-stone-400">{otherPost.readTime} read</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </motion.aside>

                {/* --- MAIN CONTENT AREA --- */}
                <main 
                    ref={mainRef}
                    className="flex-1 overflow-y-auto bg-white relative scroll-smooth"
                >
                    {/* Floating Search Overlay */}
                    {searchOpen && (
                        <div className="sticky top-4 right-4 z-50 float-right mr-4 w-64 bg-white border border-stone-300 shadow-xl p-1 flex items-center gap-1 rounded">
                            <div className="flex-1 flex items-center bg-stone-50 px-2 h-8">
                                <input 
                                    autoFocus
                                    type="text" 
                                    placeholder="Search this page..." 
                                    className="bg-transparent border-none outline-none text-xs w-full font-sans"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button onClick={() => setSearchOpen(false)} className="p-1 text-stone-400 hover:text-stone-900">
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    <div className="max-w-4xl mx-auto px-8 md:px-12 py-12 transition-all duration-300">
                        {/* Series Header (Mobile/Inline) */}
                        {currentSeries && (
                            <div className="mb-8 flex items-center gap-2 text-xs font-bold text-os-accent uppercase tracking-widest border-b border-os-accent/20 pb-2">
                                <Layers size={14} /> Part of series: <span className="text-stone-900">{currentSeries.title}</span>
                            </div>
                        )}

                        {/* Main Featured Image */}
                        {currentPost.thumbnail && (
                            <div className="w-full aspect-[16/9] mb-12 overflow-hidden bg-stone-100 rounded-sm">
                                <img src={currentPost.thumbnail} className="w-full h-full object-cover" alt={currentPost.title} />
                            </div>
                        )}

                        {/* Article Header */}
                        <header className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-black text-stone-900 leading-[1.1] mb-8 font-sans tracking-tight">
                                {currentPost.title}
                            </h1>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full border border-stone-200 overflow-hidden bg-stone-100">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentPost.author}`} alt={currentPost.author} />
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <span className="text-stone-900 font-bold">{currentPost?.author?.fullName}</span>
                                    <span className="text-stone-400">{currentPost.date}</span>
                                    <button className="text-stone-900 underline font-bold">
                                        {currentPost.category}
                                    </button>
                                </div>
                            </div>
                        </header>

                        {/* Markdown Body */}
                        <article className="markdown-content">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    blockquote: CalloutBlock,
                                    h1: ({ children }) => {
                                        const id = slugify(flattenChildren(children));
                                        return <h1 id={id} className="text-3xl font-black text-stone-900 mb-6 mt-12 font-sans tracking-tight scroll-mt-20">{children}</h1>;
                                    },
                                    h2: ({ children }) => {
                                        const id = slugify(flattenChildren(children));
                                        return <h2 id={id} className="text-2xl font-bold text-stone-900 mb-4 mt-10 font-sans tracking-tight scroll-mt-20">{children}</h2>;
                                    },
                                    h3: ({ children }) => {
                                        const id = slugify(flattenChildren(children));
                                        return <h3 id={id} className="text-xl font-bold text-stone-900 mb-3 mt-8 font-sans scroll-mt-20">{children}</h3>;
                                    },
                                    p: ({ children }) => <p className="text-[18px] leading-[1.6] text-stone-800 mb-6 font-sans">{children}</p>,
                                    ul: ({ children }) => <ul className="mb-6 space-y-2 list-none">{children}</ul>,
                                    ol: ({ children }) => <ol className="mb-6 space-y-2 list-decimal pl-6 marker:font-bold">{children}</ol>,
                                    li: ({ children }) => (
                                        <li className="text-[17px] leading-relaxed text-stone-800 flex items-start gap-3">
                                            <span className="mt-2.5 w-1 h-1 bg-stone-300 rounded-full shrink-0" />
                                            <div>{children}</div>
                                        </li>
                                    ),
                                    hr: () => <hr className="my-12 border-stone-100" />,
                                    img: ({ src, alt }) => (
                                        <div className="my-10 overflow-hidden rounded-sm border border-stone-200">
                                            <img src={src} alt={alt} className="w-full h-auto" />
                                        </div>
                                    ),
                                    a: ({ href, children }) => (
                                        <a href={href} className="text-stone-900 font-bold underline decoration-stone-200 underline-offset-4 hover:decoration-stone-900 transition-all">
                                            {children}
                                        </a>
                                    ),
                                    code({node, className, children, ...props}) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const value = String(children).replace(/\n$/, '');
                                        const isBlock = match || value.includes('\n');
                                        if (isBlock) return <CodeBlock language={match?.[1]} value={value} />;
                                        return <code className="bg-stone-50 px-1.5 py-0.5 rounded font-mono font-bold text-[14px] text-stone-900 border border-stone-100" {...props}>{children}</code>;
                                    }
                                }}
                            >
                                {currentPost.content || currentPost.excerpt}
                            </ReactMarkdown>
                        </article>

                        {/* Comments Section */}
                        <CommentSection blogId={numericBlogId} path={`/blog/${currentPost.id}`} />

                        {/* Footer Section */}
                        <footer className="mt-16 pt-8 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between text-[13px] font-bold text-stone-500 gap-4">
                            <div className="flex items-center gap-1">
                                Questions about this page? 
                                <button className="text-stone-900 underline ml-1">Ask PostHog AI</button> 
                                or 
                                <button className="text-stone-900 underline ml-1">post a community question</button>.
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="hover:text-stone-900 transition-colors"><Bookmark size={16} /></button>
                                <button className="hover:text-stone-900 transition-colors"><HelpCircle size={16} /></button>
                            </div>
                        </footer>
                    </div>
                </main>

                {/* --- RIGHT SIDEBAR: Table of Contents --- */}
                <motion.aside 
                    initial={false}
                    animate={{ 
                        width: showRightSidebar ? 288 : 0,
                        opacity: showRightSidebar ? 1 : 0
                    }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="border-l border-stone-300 bg-[#f4f1ea] overflow-hidden flex flex-col shrink-0"
                >
                    <div className="w-72 p-8 h-full overflow-y-auto">
                        <h4 className="text-[13px] font-black text-stone-900 uppercase tracking-widest mb-6">Jump to:</h4>
                        <nav className="space-y-3">
                            {headings.map((h, i) => (
                                <button
                                    key={i}
                                    onClick={() => scrollToHeading(h.id)}
                                    className={`block text-left leading-snug transition-all ${
                                        h.id === activeId 
                                        ? 'text-stone-900 font-bold translate-x-1' 
                                        : 'text-stone-500 hover:text-stone-900'
                                    } ${
                                        h.level === 1 ? 'text-[14px]' : 
                                        h.level === 2 ? 'pl-4 text-[13px]' : 'pl-8 text-[12px] italic'
                                    }`}
                                >
                                    {h.text}
                                </button>
                            ))}
                            {headings.length === 0 && (
                                <p className="text-xs text-stone-400 italic">No sections detected</p>
                            )}
                        </nav>
                    </div>
                </motion.aside>
            </div>
        </div>
    );
};
2