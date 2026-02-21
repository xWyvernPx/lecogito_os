
import React, { useState } from 'react';
import { User, Globe, Github, List, ChevronLeft, ChevronRight, Share2, Copy, Check } from 'lucide-react';
import { useProjects } from '../projects/hooks/use-projects'; 
import { useProjectDetailLogic } from '../projects/hooks/use-project-view';
import { RichTextRenderer } from '../projects/components/RichTextRenderer';
import { WindowDef, ContentItem } from '../../types';
import { RetroBadge, RetroButton, LoadingState, ErrorState } from '../../components/ui/retro-ui';
import { ShareDialog } from '../os/components/ShareDialog';

interface ProjectDetailProps {
    win: WindowDef;
    contentItem: ContentItem;
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center justify-center w-[42px] h-[42px] bg-white border-2 border-os-border shadow-retro-sm hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_#000] active:translate-y-[1px] active:shadow-none transition-all group"
            title="Copy URL to clipboard"
        >
            {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-stone-600 group-hover:text-stone-900" />}
        </button>
    );
};

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ win, contentItem }) => {
    // 1. Sidebar List Data (Separate Hook or keep here if simple)
    const { data: projectResponse } = useProjects();
    const sidebarProjects = projectResponse?.rows || [];
    const [isShareOpen, setIsShareOpen] = useState(false);

    // 2. Main Logic Hook
    const {
        project,
        blocks,
        headings,
        isLoading,
        isError,
        canGoBack,
        canGoForward,
        goBack,
        goForward,
        handleBackToGallery,
        handleNavigateSibling,
        scrollToSection,
        getProjectTypeColor
    } = useProjectDetailLogic(win, contentItem.projectId);

    if (isLoading) return <LoadingState message="LOADING PROJECT DATA..." />;
    if (isError || !project) return <ErrorState message="FAILED TO LOAD PROJECT" />;

    return (
        <div className="flex flex-col h-full bg-[#fdfdfd]">
            <ShareDialog 
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                meta={{
                    title: project.name,
                    description: project.description || `Check out ${project.name} on Cogito OS.`,
                    image: project.thumbnailUrl,
                    url: `https://designeros.app/projects/${project.id}`
                }}
            />

            {/* Custom Toolbar */}
            <div className="h-10 border-b border-stone-200 bg-stone-50 flex items-center justify-between px-3 select-none shrink-0 gap-4">
                 <div className="flex gap-2 shrink-0 items-center">
                     <button 
                        disabled={!canGoBack}
                        onClick={goBack}
                        className={`w-7 h-7 flex items-center justify-center rounded transition-all ${canGoBack ? 'bg-white border border-stone-300 hover:border-os-accent text-stone-600' : 'opacity-30 cursor-not-allowed'}`}
                     >
                        <ChevronLeft size={16} />
                     </button>
                     <button 
                        disabled={!canGoForward}
                        onClick={goForward}
                        className={`w-7 h-7 flex items-center justify-center rounded transition-all ${canGoForward ? 'bg-white border border-stone-300 hover:border-os-accent text-stone-600' : 'opacity-30 cursor-not-allowed'}`}
                     >
                        <ChevronRight size={16} />
                     </button>
                     <div className="w-px h-5 bg-stone-300 mx-2" />
                     <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">Project Viewer</span>
                 </div>
                 
                 <div className="flex items-center gap-4">
                     <button 
                         onClick={() => setIsShareOpen(true)}
                         className="text-xs font-bold text-stone-500 hover:text-os-accent flex items-center gap-1.5 transition-colors"
                     >
                        <Share2 size={12} /> Share
                     </button>
                     <button 
                         onClick={handleBackToGallery}
                         className="text-xs font-bold text-stone-600 hover:text-os-accent hover:underline"
                     >
                        Back to Gallery
                     </button>
                 </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-row flex-1 overflow-hidden">
                {/* LEFT SIDEBAR: Navigation */}
                <div className="w-64 border-r border-stone-200 bg-stone-50 overflow-y-auto hidden md:block flex-shrink-0">
                    <div className="p-4 pt-6">
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 px-2">Portfolio</h3>
                        <div className="space-y-1">
                            {sidebarProjects.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => p.id !== project.id && handleNavigateSibling(p.id, p.name)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                        p.id === project.id 
                                        ? 'bg-stone-200 font-bold text-stone-900' 
                                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                    }`}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CENTER: Main Content */}
                <div className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="max-w-4xl mx-auto p-8 pb-20">
                        
                        {/* Hero Image */}
                        {project.thumbnailUrl && (
                            <div className="w-full aspect-[2/1] rounded-lg overflow-hidden mb-8 border border-stone-200 shadow-sm">
                                <img src={project.thumbnailUrl} alt={project.name} className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Header */}
                        <div className="mb-10">
                            <h1 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight leading-[1.1] mb-6">
                                {project.name}
                            </h1>
                            
                            <div className="flex items-center gap-6 text-sm border-y border-stone-100 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-os-accent flex items-center justify-center text-white border border-black">
                                            <User size={16} />
                                        </div>
                                        <span className="font-bold text-stone-700">Design Team</span>
                                    </div>
                                    <span className="text-stone-300">|</span>
                                    <span className="text-stone-500">{new Date(project.lastModifiedDate || Date.now()).toLocaleDateString()}</span>
                                    <span className="text-stone-300">|</span>
                                    {project.type && (
                                        <RetroBadge 
                                            label={project.type.replace('_', ' ')} 
                                            colorClass={getProjectTypeColor(project.type)} 
                                        />
                                    )}
                            </div>
                        </div>

                        {/* Rich Text Content */}
                        <RichTextRenderer blocks={blocks} />
                        
                        {/* Footer Actions */}
                        <div className="mt-16 pt-8 border-t border-stone-200 flex flex-wrap gap-4">
                                {project.demoUrl && (
                                    <div className="flex gap-2">
                                        <RetroButton 
                                            onClick={() => window.open(project.demoUrl, '_blank')}
                                            icon={<Globe size={18} />}
                                        >
                                            View Live Demo
                                        </RetroButton>
                                        <CopyButton text={project.demoUrl} />
                                    </div>
                                )}
                                {project.sourceUrl && (
                                    <div className="flex gap-2">
                                        <RetroButton 
                                            variant="secondary"
                                            onClick={() => window.open(project.sourceUrl, '_blank')}
                                            icon={<Github size={18} />}
                                        >
                                            View Source Code
                                        </RetroButton>
                                        <CopyButton text={project.sourceUrl} />
                                    </div>
                                )}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR: Table of Contents */}
                <div className="w-72 hidden xl:block flex-shrink-0 pt-10 pr-8">
                    <div className="sticky top-10">
                        <h4 className="text-sm font-bold text-stone-900 mb-6 flex items-center gap-2">
                            <List size={16} className="text-os-accent" />
                            On this page
                        </h4>
                        <ul className="space-y-4 border-l-2 border-stone-200 pl-5">
                            {headings.map((h, i) => (
                                <li key={i}>
                                    <button 
                                        onClick={() => scrollToSection(h.id)}
                                        className="text-base text-stone-600 hover:text-os-accent hover:font-medium block leading-snug transition-all text-left"
                                    >
                                        {h.content?.[0]?.text || 'Untitled Section'}
                                    </button>
                                </li>
                            ))}
                            {headings.length === 0 && (
                                <li className="text-sm text-stone-400 italic">No sections detected</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
