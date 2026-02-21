
import React, { useMemo } from 'react';
import { Coffee, Anchor, MessageSquare, Sparkles, ChevronRight, Info, HelpCircle, Layers } from 'lucide-react';
import { RetroButton, RetroBadge } from '../../../components/ui/retro-ui';
import { SLACK_FEED, LATEST_QUESTIONS } from './data';
import { useBlogSearch, useSeries } from '@/services';
import { blogDtoToPost, serieDtoToLocal, DEFAULT_SEARCH_REQUEST, DEFAULT_BLOG_CRITERIA, type BlogPost } from './utils';

interface BlogHomeProps {
    onNavigateToArchive: () => void;
    onPostClick: (post: BlogPost) => void;
}

export const BlogHome: React.FC<BlogHomeProps> = ({ onNavigateToArchive, onPostClick }) => {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  
  // Fetch data from API
  const { data: blogsData, isLoading: blogsLoading } = useBlogSearch(DEFAULT_BLOG_CRITERIA, DEFAULT_SEARCH_REQUEST);
  const { data: seriesData, isLoading: seriesLoading } = useSeries(DEFAULT_SEARCH_REQUEST);

  // Convert API data to local format
  const posts = useMemo(() => {
    return blogsData?.rows?.map(blogDtoToPost) || [];
  }, [blogsData]);

  const series = useMemo(() => {
    return seriesData?.rows?.map(serieDtoToLocal) || [];
  }, [seriesData]);

  const featuredPost = posts[0];

  const getSeriesName = (id?: string) => {
      if (!id) return null;
      return series.find(s => s.id === id)?.title;
  };

  // Loading state
  if (blogsLoading || seriesLoading) {
    return (
      <div className="flex flex-col h-full bg-[#f4f1ea] overflow-auto text-stone-900">
        <div className="border-b border-stone-300 bg-[#e8e4d9] px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0">
          <div className="text-[11px] font-medium text-stone-600 w-1/4 hidden md:block">{currentDate}</div>
          <div className="flex items-center gap-2 justify-center flex-1">
            <h1 className="text-xl md:text-2xl font-black tracking-tight font-serif uppercase">Community News</h1>
          </div>
          <div className="flex items-center gap-2 justify-end w-1/4 text-stone-500">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Loading...</span>
          </div>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-stone-400 font-mono text-sm">Loading posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f4f1ea] overflow-auto text-stone-900">
      {/* --- Editorial Header --- */}
      <div className="border-b border-stone-300 bg-[#e8e4d9] px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0">
        <div className="text-[11px] font-medium text-stone-600 w-1/4 hidden md:block">{currentDate}</div>
        <div className="flex items-center gap-2 justify-center flex-1">
             <div className="flex items-center gap-1 opacity-80">
                <div className="w-1.5 h-1.5 bg-black rotate-45" />
                <div className="w-1.5 h-1.5 bg-black rotate-45" />
                <div className="w-1.5 h-1.5 bg-black rotate-45" />
             </div>
             <h1 className="text-xl md:text-2xl font-black tracking-tight font-serif uppercase">Community News</h1>
        </div>
        <div className="flex items-center gap-2 justify-end w-1/4 text-stone-500">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider">All systems operational</span>
        </div>
      </div>

      {/* --- Main Newspaper Grid --- */}
      <div className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* LEFT COLUMN: THE INSIDER */}
            <div className="lg:col-span-3 flex flex-col gap-10 border-r border-stone-200 pr-10">
                {/* Editor Profile */}
                <section>
                    <h3 className="font-black text-sm mb-4 uppercase tracking-tighter border-b border-stone-900 pb-1">A note from the editor</h3>
                    <div className="flex flex-col gap-4">
                         <div className="flex items-start gap-4">
                            <div className="flex-1 text-[13px] leading-relaxed text-stone-600">
                                <p>Welcome to <em>Inside PostHog</em> - our community newspaper. Explore our latest posts, community questions, and everything else that's happening in the world of PostHog.</p>
                                <p className="mt-2 font-bold italic text-stone-800">- Andy, Editor-in-Chief</p>
                            </div>
                            <div className="w-16 h-16 rounded-full border-2 border-stone-800 overflow-hidden bg-stone-300 shrink-0 shadow-retro-sm">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Andy" alt="Editor" />
                            </div>
                         </div>
                    </div>
                </section>

                <div className="h-px bg-stone-300 w-full" />

                {/* Hedgehog Wisdom */}
                <section className="flex items-center gap-4 py-4">
                     <p className="flex-1 italic text-stone-500 text-[13px] leading-snug">
                        "Why scurry through life when you can forage? Take time to sniff the mealworms. When things feel overwhelming, just curl into a ball."
                        <span className="block mt-2 font-bold not-italic text-stone-700">- Max, our resident hedgehog</span>
                     </p>
                     <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=max" className="w-12 h-12 grayscale" alt="Hedgehog" />
                </section>

                <div className="h-px bg-stone-300 w-full" />

                {/* SERIES LIST */}
                <section>
                    <div className="flex items-center justify-between mb-4 border-b border-stone-900 pb-1">
                        <h3 className="font-black text-sm uppercase tracking-tighter flex items-center gap-1.5">
                            Curated Series <Layers size={14} className="text-stone-400" />
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {series.map(serie => (
                            <div key={serie.id} className="group cursor-pointer flex gap-3 items-start" onClick={onNavigateToArchive}>
                                <div className="w-12 h-12 shrink-0 bg-stone-200 border border-stone-300 rounded overflow-hidden">
                                    <img src={serie.coverUrl} alt={serie.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs leading-tight text-stone-800 group-hover:text-os-accent transition-colors mb-1">{serie.title}</h4>
                                    <p className="text-[10px] text-stone-500 leading-tight line-clamp-2">{serie.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={onNavigateToArchive} className="mt-4 w-full py-1.5 text-[10px] font-bold uppercase border border-stone-300 text-stone-500 hover:text-stone-900 hover:border-stone-900 transition-all">
                        View All Collections
                    </button>
                </section>
            </div>

            {/* CENTER COLUMN: MAIN STORIES */}
            <div className="lg:col-span-6 space-y-12">
                {/* Newsletter Featured */}
                {featuredPost ? (
                    <article onClick={() => onPostClick(featuredPost)} className="group cursor-pointer">
                        <div className="w-full aspect-[16/9] border-2 border-stone-900 shadow-retro-md mb-6 overflow-hidden bg-white relative">
                             <img src={featuredPost.thumbnail} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Newsletter</div>
                            {featuredPost.serieId && (
                                <span className="text-[10px] font-bold text-os-accent border border-os-accent/30 px-1.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wide">
                                    <Layers size={10} /> {getSeriesName(featuredPost.serieId)}
                                </span>
                            )}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-stone-900 leading-[1.1] mb-4 group-hover:text-os-accent transition-colors">{featuredPost.title}</h2>
                        <p className="text-stone-700 leading-relaxed text-base mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                    </article>
                ) : (
                    <div className="p-10 text-center text-stone-400">No posts available.</div>
                )}

                <div className="h-px bg-stone-200" />

                {/* Recent Feed */}
                <div className="space-y-10">
                    {posts.slice(1, 3).map(post => (
                        <article key={post.id} onClick={() => onPostClick(post)} className="grid grid-cols-1 md:grid-cols-12 gap-6 group cursor-pointer items-center">
                            <div className="md:col-span-8">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Blog</div>
                                    {post.serieId && (
                                        <span className="text-[9px] font-bold text-os-accent flex items-center gap-1 uppercase">
                                            <Layers size={8} /> Series
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-black text-stone-900 group-hover:text-os-accent leading-tight mb-2 uppercase">{post.title}</h3>
                            </div>
                            <div className="md:col-span-4 aspect-[4/3] bg-stone-200 border-2 border-stone-900 rounded shadow-retro-sm overflow-hidden">
                                 <img src={post.thumbnail} className="w-full h-full object-cover transition-all" alt={post.title} />
                            </div>
                        </article>
                    ))}
                </div>
                
                <div className="pt-4">
                    <button 
                        onClick={onNavigateToArchive}
                        className="w-full py-2 bg-white border-2 border-stone-900 font-black text-xs uppercase tracking-widest shadow-retro-sm hover:translate-y-px hover:shadow-none transition-all"
                    >
                        More posts
                    </button>
                </div>

                {/* Subscription CTA Section */}
                <div className="bg-stone-50 border border-stone-200 p-8 flex flex-col md:flex-row items-center gap-8 mt-12 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-24 h-24 bg-os-accent/5 rounded-full blur-2xl -translate-x-12 -translate-y-12" />
                    <div className="flex-1 text-center md:text-left z-10">
                        <div className="text-[10px] font-bold text-os-accent uppercase mb-1">Subscribe to our newsletter</div>
                        <h4 className="text-2xl font-black text-stone-900 mb-2">Product for Engineers</h4>
                        <p className="text-xs text-stone-500 font-medium">Read by 100,000+ founders and builders</p>
                    </div>
                    <div className="flex flex-col w-full md:w-64 gap-2 z-10">
                         <input type="email" placeholder="Email address" className="w-full text-sm p-3 border border-stone-300 rounded focus:border-stone-900 outline-none shadow-sm" />
                         <RetroButton variant="primary" size="sm" className="w-full">Subscribe</RetroButton>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: THE PULSE */}
            <div className="lg:col-span-3 flex flex-col gap-10 border-l border-stone-200 pl-10">
                {/* Questions Table */}
                <section>
                    <div className="flex items-center justify-between mb-4 border-b border-stone-900 pb-1">
                        <h3 className="font-black text-sm uppercase tracking-tighter flex items-center gap-1.5">
                            Latest questions <HelpCircle size={14} className="text-stone-400" />
                        </h3>
                        <button onClick={onNavigateToArchive} className="text-[10px] font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1">
                            View all <ChevronRight size={10} />
                        </button>
                    </div>
                    
                    <table className="w-full text-[11px] font-sans">
                        <thead>
                            <tr className="text-stone-400 uppercase tracking-widest text-[9px] border-b border-stone-100">
                                <th className="text-left py-2 font-bold">Topic</th>
                                <th className="text-right py-2 font-bold whitespace-nowrap">Last reply</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {LATEST_QUESTIONS.map((q, i) => (
                                <tr key={i} className="group cursor-pointer">
                                    <td className="py-3 pr-4 font-bold text-stone-700 leading-tight group-hover:text-os-accent line-clamp-2">{q.topic}</td>
                                    <td className="py-3 text-right text-stone-400 whitespace-nowrap align-top">{q.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Swag Card */}
                <section className="bg-[#fdfdfd] border border-stone-200 p-6 rounded-sm shadow-sm">
                    <p className="italic text-stone-500 text-[12px] mb-4 text-center leading-relaxed font-serif">
                        "This merch store has some of the best company swag I've ever seen"
                    </p>
                    <div className="aspect-[4/5] bg-stone-100 border border-stone-200 rounded overflow-hidden relative shadow-inner">
                         <img src="https://images.unsplash.com/photo-1621600411666-41717f185434?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Merch" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                </section>

                {/* CEO Musings */}
                <section>
                    <h3 className="font-black text-sm mb-4 uppercase tracking-tighter border-b border-stone-900 pb-1">Musings from the CEO</h3>
                    <div className="space-y-4 mb-6">
                        <div className="text-[12px] leading-relaxed text-stone-600">
                             <p className="mb-2">nobody will remember:</p>
                             <ul className="list-none pl-1 space-y-1">
                                <li className="before:content-['-'] before:mr-2">your salary</li>
                                <li className="before:content-['-'] before:mr-2">how “busy you were”</li>
                                <li className="before:content-['-'] before:mr-2">how many hours you worked</li>
                             </ul>
                        </div>
                        <div className="text-[12px] leading-relaxed text-stone-800">
                             <p className="mb-2 font-bold">people will remember:</p>
                             <ul className="list-none pl-1 space-y-1">
                                <li className="before:content-['-'] before:mr-2">if you hopped on a quick call</li>
                                <li className="before:content-['-'] before:mr-2">when you hopped on a quick call</li>
                                <li className="before:content-['-'] before:mr-2">how many quick calls you hopped on</li>
                                <li className="before:content-['-'] before:mr-2">how you made them feel when you hopped on a quick call</li>
                             </ul>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 border-t border-stone-100 pt-4 justify-end">
                         <div className="text-right">
                             <div className="text-[11px] font-black uppercase">James Hawkins</div>
                             <div className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Co-founder & CEO</div>
                         </div>
                         <div className="w-12 h-12 rounded-full border-2 border-stone-800 overflow-hidden bg-amber-200 shrink-0 shadow-retro-sm">
                             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=James&mouth=smile" alt="CEO" />
                         </div>
                    </div>
                </section>
            </div>
        </div>
      </div>
      
      {/* Footer System Credits */}
      <footer className="border-t border-stone-200 p-8 mt-12 text-center bg-stone-100/50">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-30 grayscale">
               <Anchor size={16} />
               <div className="h-px w-12 bg-black" />
               <Sparkles size={16} />
          </div>
          <p className="text-[10px] font-mono text-stone-400 uppercase tracking-[0.3em]">Cogito OS Publication Unit // 2025</p>
      </footer>
    </div>
  );
};
