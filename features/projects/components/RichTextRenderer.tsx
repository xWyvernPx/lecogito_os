import React from 'react';
import { Block, InlineContent, StyleProps } from '../types';

interface BlockRendererProps {
    blocks: Block[];
}

const getStyles = (styles?: StyleProps) => {
    if (!styles) return "";
    const classes = [];
    if (styles.bold) classes.push("font-bold");
    if (styles.italic) classes.push("italic");
    if (styles.underline) classes.push("underline");
    if (styles.textColor === 'blue') classes.push("text-blue-600");
    if (styles.textColor === 'purple') classes.push("text-purple-600");
    if (styles.textColor === 'red') classes.push("text-red-600");
    return classes.join(" ");
};

const InlineRenderer: React.FC<{ content: InlineContent[] }> = ({ content }) => {
    return (
        <>
            {content.map((item, idx) => {
                const className = getStyles(item.styles);
                if (item.type === 'link') {
                    return (
                        <a 
                            key={idx} 
                            href={item.href} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`text-os-accent underline hover:text-[#c2410c] transition-colors ${className}`}
                        >
                            <InlineRenderer content={item.content || []} />
                        </a>
                    );
                }
                return (
                    <span key={idx} className={className}>
                        {item.text}
                    </span>
                );
            })}
        </>
    );
};

export const RichTextRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
    return (
        <div className="space-y-6 font-sans text-stone-800 leading-7">
            {blocks.map((block) => {
                switch (block.type) {
                    case 'heading':
                        const Level = `h${block.props.level || 1}` as React.ElementType;
                        // Level 1 is title, usually handled outside, but if inside:
                        // Level 2 is Section Header
                        const sizeClass = 
                            block.props.level === 1 ? 'text-3xl font-bold text-stone-900 mt-8 mb-4' : 
                            block.props.level === 2 ? 'text-2xl font-bold text-stone-900 mt-8 mb-4 border-b border-stone-200 pb-2' : 
                            'text-xl font-bold text-stone-800 mt-6 mb-2';
                        
                        return (
                            <Level key={block.id} id={block.id} className={`${sizeClass} scroll-mt-20`}>
                                <InlineRenderer content={block.content} />
                            </Level>
                        );
                    
                    case 'paragraph':
                        // If empty content, might be a spacer
                        if (block.content.length === 0) return <div key={block.id} className="h-4" />;
                        return (
                            <p key={block.id} className="text-[16px] text-stone-700">
                                <InlineRenderer content={block.content} />
                            </p>
                        );

                    case 'bulletListItem':
                        return (
                            <div key={block.id} className="ml-2">
                                <div className="flex items-start gap-3">
                                    <span className="text-stone-400 mt-2 text-[8px]">●</span>
                                    <div className="flex-1 text-[16px] text-stone-700">
                                        <InlineRenderer content={block.content} />
                                    </div>
                                </div>
                                {/* Recursive children for nested lists */}
                                {block.children && block.children.length > 0 && (
                                    <div className="ml-4 mt-2 border-l-2 border-stone-100 pl-4 space-y-2">
                                        <RichTextRenderer blocks={block.children} />
                                    </div>
                                )}
                            </div>
                        );

                    case 'image':
                        return (
                            <div key={block.id} className="my-8">
                                <div className="rounded-md overflow-hidden bg-stone-50 border border-stone-200 shadow-sm">
                                    <img 
                                        src={block.props.url} 
                                        alt={block.props.caption || 'Project image'} 
                                        width={block.props.width}
                                        className="w-full h-auto block"
                                    />
                                </div>
                                {block.props.caption && (
                                    <p className="text-sm text-stone-500 mt-2 text-center italic">
                                        {block.props.caption}
                                    </p>
                                )}
                                {/* Render children if any */}
                                {block.children && block.children.length > 0 && (
                                     <div className="mt-4">
                                        <RichTextRenderer blocks={block.children} />
                                     </div>
                                )}
                            </div>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
};