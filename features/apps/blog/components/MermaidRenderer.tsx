import React, { useRef, useEffect } from 'react';
import mermaid from 'mermaid';
import { Hash } from 'lucide-react';

export const MermaidRenderer: React.FC<{ chart: string }> = ({ chart }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: {
                primaryColor: '#ebdbb2',
                primaryTextColor: '#282828',
                primaryBorderColor: '#fabd2f',
                lineColor: '#ebdbb2',
                secondaryColor: '#3c3836',
                tertiaryColor: '#504945',
                mainBkg: '#282828',
                nodeBorder: '#fabd2f',
                clusterBkg: '#3c3836',
                titleColor: '#ebdbb2',
                edgeLabelBackground: '#282828',
            },
        });

        const renderChart = async () => {
            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, chart);
                if (containerRef.current) {
                    containerRef.current.innerHTML = svg;
                }
            } catch {
                if (containerRef.current) {
                    containerRef.current.innerHTML =
                        '<div class="p-4 border border-red-900 bg-red-950 text-red-400 text-xs font-mono">Mermaid Syntax Error</div>';
                }
            }
        };

        renderChart();
    }, [chart]);

    return (
        <div className="flex flex-col my-8 border-2 border-stone-800 shadow-retro-md rounded-sm overflow-hidden bg-[#282828]">
            <div className="px-3 py-1.5 bg-[#3c3836] border-b border-stone-800 flex items-center gap-2">
                <Hash size={12} className="text-[#fabd2f]" />
                <span className="text-[10px] font-bold text-[#ebdbb2] uppercase font-mono tracking-widest">
                    Diagram Flow
                </span>
            </div>
            <div
                ref={containerRef}
                className="flex justify-center p-8 overflow-x-auto min-h-[150px]"
            />
        </div>
    );
};
