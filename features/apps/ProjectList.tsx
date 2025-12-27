import React from 'react';
import { Briefcase, Globe, Github } from 'lucide-react';
import { WindowDef } from '../../types';
import { useProjectListLogic } from '../projects/hooks/use-project-view';
import { RetroCard, RetroBadge, RetroButton, LoadingState, ErrorState } from '../../components/ui/retro-ui';
import { HighlightText } from '../../components/ui/text-utils';

interface ProjectListProps {
    win: WindowDef;
}

export const ProjectList: React.FC<ProjectListProps> = ({ win }) => {
    const { 
        projects, 
        totalProjects, 
        isLoading, 
        isError, 
        refetch, 
        navigateToDetail, 
        getProjectTypeColor 
    } = useProjectListLogic(win.id);
    
    const searchQuery = ""; // Placeholder for future search integration

    return (
        <div className="my-2 p-6">
            {isLoading && <LoadingState message="FETCHING PROJECTS..." />}
            
            {isError && <ErrorState message="FAILED TO LOAD PROJECTS" onRetry={refetch} />}

            {!isLoading && !isError && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {projects.map((proj) => (
                        <RetroCard 
                            key={proj.id} 
                            hoverEffect
                            onClick={() => navigateToDetail(proj.id, proj.name)}
                            className="flex flex-col h-full"
                        >
                            {/* Thumbnail Container */}
                            <div className="aspect-video w-full bg-stone-100 border-b-2 border-black overflow-hidden relative group">
                                {proj.thumbnailUrl ? (
                                    <img 
                                        src={proj.thumbnailUrl} 
                                        alt={proj.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 gap-2">
                                        <Briefcase size={32} className="opacity-20" />
                                        <span className="text-[10px] font-bold opacity-40">NO PREVIEW</span>
                                    </div>
                                )}
                                
                                {/* Type Badge */}
                                {proj.type && (
                                    <div className="absolute top-2 right-2">
                                        <RetroBadge 
                                            label={proj.type.replace('_', ' ')} 
                                            colorClass={getProjectTypeColor(proj.type)} 
                                        />
                                    </div>
                                )}
                            </div>
                            
                            {/* Card Content */}
                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="font-bold text-lg leading-tight mb-2 text-stone-900 group-hover:text-[#ff7e33] transition-colors">
                                    <HighlightText text={proj.name} query={searchQuery} />
                                </h3>
                                
                                <p className="text-xs text-stone-600 line-clamp-3 mb-4 flex-1 leading-relaxed">
                                    <HighlightText text={proj.description} query={searchQuery} />
                                </p>
                                
                                {/* Footer Links */}
                                <div className="flex gap-2 mt-auto pt-3 border-t border-dashed border-stone-200">
                                    {proj.demoUrl && (
                                        <RetroButton 
                                            variant="secondary" 
                                            size="sm" 
                                            className="flex-1"
                                            onClick={(e) => { e.stopPropagation(); window.open(proj.demoUrl, '_blank'); }}
                                            icon={<Globe size={12} />}
                                        >
                                            Live Demo
                                        </RetroButton>
                                    )}
                                    {proj.sourceUrl && (
                                        <RetroButton 
                                            variant="secondary" 
                                            size="sm"
                                            className="flex-1"
                                            onClick={(e) => { e.stopPropagation(); window.open(proj.sourceUrl, '_blank'); }}
                                            icon={<Github size={12} />}
                                        >
                                            Source
                                        </RetroButton>
                                    )}
                                </div>
                            </div>
                        </RetroCard>
                    ))}
                </div>
            )}
            
            <div className="mt-4 flex justify-between text-[10px] text-stone-400 font-mono border-t border-dashed border-stone-300 pt-2">
                <span>FETCHED via @tanstack/react-query</span>
                <span>{totalProjects} ITEMS</span>
            </div>
        </div>
    );
};