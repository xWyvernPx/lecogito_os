import React, { Suspense } from 'react';
import { ContentItem, WindowDef } from '@/types';
import { useOSStore } from '@/features/os/stores/os-store';
import { getAppDefinition } from '@/features/apps/registry';
import { ModuleLoader } from './ModuleLoader';
import { PRIMITIVE_RENDERERS, ParagraphRenderer } from '../renderers';

interface WindowContentRendererProps {
    content: ContentItem[];
    searchQuery: string;
    win: WindowDef;
}

export const WindowContentRenderer: React.FC<WindowContentRendererProps> = ({ content, searchQuery, win }) => {
    const { spawnWindow } = useOSStore();

    return (
        <>
            {content.map((item, idx) => {
                const appDef = getAppDefinition(item.type);
                if (appDef) {
                    const AppComponent = appDef.component;
                    return <Suspense key={idx} fallback={<ModuleLoader />}><AppComponent win={win} contentItem={item} /></Suspense>;
                }
                const Renderer = PRIMITIVE_RENDERERS[item.type] ?? ParagraphRenderer;
                return <Renderer key={idx} item={item} searchQuery={searchQuery} spawnWindow={spawnWindow} />;
            })}
        </>
    );
};
