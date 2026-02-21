import React from 'react';
import { CALLOUT_CONFIG } from '@/features/apps/blog/config';

/**
 * Shared Obsidian-style callout / blockquote component.
 * Used by BlogEditor preview and BlogDetail.
 */
export const CalloutBlock: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const childrenArray = React.Children.toArray(children);
    const firstChild = childrenArray[0] as React.ReactElement<{ children: React.ReactNode }>;

    if (firstChild && firstChild.props && firstChild.props.children) {
        const textNodes = React.Children.toArray(firstChild.props.children);
        const firstText = textNodes[0] as string;

        if (typeof firstText === 'string' && firstText.startsWith('[!')) {
            const match = firstText.match(/^\[!(\w+)[+-]?]\s*(.*)$/);
            if (match) {
                const type = match[1].toLowerCase();
                const title = match[2] || CALLOUT_CONFIG[type]?.label || type;
                const config = CALLOUT_CONFIG[type] || CALLOUT_CONFIG.note;
                const IconComp = config.icon;

                const remainingFirstParaContent = textNodes.slice(1);

                return (
                    <div
                        className={`my-8 border-l-4 ${config.border} ${config.bg} rounded-sm shadow-sm overflow-hidden flex flex-col font-sans transition-all hover:shadow-md`}
                    >
                        <div
                            className={`px-4 py-2 flex items-center gap-3 font-bold ${config.color} border-b border-black/5 bg-black/[0.03]`}
                        >
                            <IconComp size={18} strokeWidth={2.5} />
                            <span className="text-[15px] tracking-tight">
                                {title}
                            </span>
                        </div>
                        <div className="px-5 py-4 prose prose-stone max-w-none text-stone-700 leading-relaxed text-[15px] prose-p:my-2 prose-code:bg-black/5 prose-code:px-1 prose-code:rounded prose-code:text-[#c2410c]">
                            {remainingFirstParaContent.length > 0 && (
                                <p>{remainingFirstParaContent}</p>
                            )}
                            {childrenArray.slice(1)}
                        </div>
                    </div>
                );
            }
        }
    }

    return (
        <blockquote className="border-l-4 border-os-accent/30 pl-6 py-2 my-6 italic text-stone-600 font-serif bg-stone-50/50 rounded-r-sm leading-relaxed">
            {children}
        </blockquote>
    );
};
