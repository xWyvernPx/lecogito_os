import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Terminal, Copy, Check } from 'lucide-react';
import { gruvboxTheme } from '@/theme/syntax-theme';
import { MermaidRenderer } from '@/features/apps/blog/components/MermaidRenderer';

/**
 * Shared code block component with syntax highlighting, copy button, and Mermaid support.
 * Used by BlogEditor preview and BlogDetail.
 */
export const CodeBlock: React.FC<{ language?: string; value: string }> = ({
    language,
    value,
}) => {
    const [copied, setCopied] = useState(false);

    if (language === 'mermaid') {
        return <MermaidRenderer chart={value} />;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group relative my-8 rounded-sm border-2 border-stone-800 shadow-retro-md bg-[#282828] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-[#3c3836] border-b border-stone-900">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#fb4934] opacity-80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#fabd2f] opacity-80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#b8bb26] opacity-80" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Terminal size={12} className="text-[#a89984]" />
                        <span className="text-[10px] font-bold text-[#ebdbb2] uppercase font-mono tracking-wider">
                            {language || 'plaintext'}
                        </span>
                    </div>
                </div>
                <button
                    onClick={handleCopy}
                    className="p-1 hover:bg-[#504945] rounded transition-all text-[#a89984] hover:text-[#ebdbb2] border border-transparent hover:border-[#665c54]"
                >
                    {copied ? (
                        <Check size={12} className="text-[#b8bb26]" />
                    ) : (
                        <Copy size={12} />
                    )}
                </button>
            </div>
            <div className="relative">
                <SyntaxHighlighter
                    language={language || 'plaintext'}
                    style={gruvboxTheme}
                    useInlineStyles={true}
                    customStyle={{
                        background: 'transparent',
                        padding: '20px',
                        margin: 0,
                    }}
                >
                    {value}
                </SyntaxHighlighter>
                <div className="absolute bottom-2 right-4 opacity-[0.03] select-none pointer-events-none text-6xl font-black text-white italic">
                    {language?.toUpperCase()}
                </div>
            </div>
        </div>
    );
};
