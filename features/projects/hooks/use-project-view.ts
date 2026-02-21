import { useOSStore } from '../../os/stores/os-store';
import { useProjects, useProject } from './use-projects';
import { WindowDef } from '../../../types';
import { Block } from '../types';

// --- List View Logic ---
export const useProjectListLogic = (winId: string) => {
    const { navigateWindow } = useOSStore();
    const { data: projectResponse, isLoading, isError, refetch } = useProjects();
    
    const projects = projectResponse?.rows || [];
    const totalProjects = projectResponse?.pagination?.totalRows || 0;

    const navigateToDetail = (projectId: number, projectName: string) => {
        navigateWindow(winId, { 
            title: projectName, 
            content: [{ type: 'project-detail', projectId }] 
        });
    };

    const getProjectTypeColor = (type: string) => {
        switch (type) {
            case 'OFFICIAL': return 'bg-os-accent text-white';
            case 'SIDE_PROJECT': return 'bg-[#a855f7] text-white';
            case 'OPEN_SOURCE': return 'bg-[#22c55e] text-black';
            case 'INTERNAL': return 'bg-[#3b82f6] text-white';
            case 'CLOSED_SOURCE': return 'bg-stone-700 text-stone-100';
            case 'EXTENSION': return 'bg-[#eab308] text-black';
            default: return 'bg-white text-stone-800';
        }
    };

    return {
        projects,
        totalProjects,
        isLoading,
        isError,
        refetch,
        navigateToDetail,
        getProjectTypeColor
    };
};

// --- Detail View Logic ---
export const useProjectDetailLogic = (win: WindowDef, projectId?: number) => {
    const { navigateWindow, spawnWindow, goBack, goForward } = useOSStore();
    const { data: detailResponse, isLoading, isError } = useProject(projectId);
    
    const project = detailResponse?.data;

    // Navigation Flags
    const canGoBack = win.historyIndex > 0;
    const canGoForward = win.history && win.historyIndex < win.history.length - 1;

    // Parse Rich Text Blocks
    let blocks: Block[] = [];
    if (project?.detail) {
        try {
            blocks = JSON.parse(project.detail);
        } catch (e) {
            console.error("Failed to parse project detail blocks", e);
        }
    }

    // Generate Table of Contents
    const headings = blocks.filter(b => b.type === 'heading' && (b.props.level === 1 || b.props.level === 2));

    const handleBackToGallery = () => {
        spawnWindow('projects');
    };

    const handleNavigateSibling = (id: number, name: string) => {
         navigateWindow(win.id, { 
            title: name, 
            content: [{ type: 'project-detail', projectId: id }] 
        });
    };

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const getProjectTypeColor = (type: string) => {
        switch (type) {
            case 'OFFICIAL': return 'bg-os-accent text-white';
            case 'SIDE_PROJECT': return 'bg-[#a855f7] text-white';
            case 'OPEN_SOURCE': return 'bg-[#22c55e] text-black';
            case 'INTERNAL': return 'bg-[#3b82f6] text-white';
            case 'CLOSED_SOURCE': return 'bg-stone-700 text-stone-100';
            case 'EXTENSION': return 'bg-[#eab308] text-black';
            default: return 'bg-white text-stone-800';
        }
    };

    return {
        project,
        blocks,
        headings,
        isLoading,
        isError,
        canGoBack,
        canGoForward,
        goBack: () => goBack(win.id),
        goForward: () => goForward(win.id),
        handleBackToGallery,
        handleNavigateSibling,
        scrollToSection,
        getProjectTypeColor
    };
};