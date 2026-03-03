import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, PenLine, Bold, Italic, List, Heading2, Code } from 'lucide-react';

interface MarkdownEditorProps {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    error?: string;
}

const TOOLBAR_ACTIONS = [
    { icon: Bold,     label: 'Bold',   wrap: ['**', '**'],  block: false },
    { icon: Italic,   label: 'Italic', wrap: ['_', '_'],    block: false },
    { icon: Code,     label: 'Code',   wrap: ['`', '`'],    block: false },
    { icon: Heading2, label: 'H2',     wrap: ['## ', ''],   block: true  },
    { icon: List,     label: 'List',   wrap: ['- ', ''],    block: true  },
] as const;

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    value,
    onChange,
    placeholder = 'Type markdown here...',
    error,
}) => {
    const [mode, setMode] = useState<'write' | 'preview'>('write');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const insertMarkdown = useCallback((wrap: [string, string], block: boolean) => {
        const el = textareaRef.current;
        if (!el) return;

        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selected = value.slice(start, end);
        const [before, after] = wrap;

        let newText: string;
        let cursorStart: number;
        let cursorEnd: number;

        if (block) {
            // Insert at beginning of line
            const lineStart = value.lastIndexOf('\n', start - 1) + 1;
            newText =
                value.slice(0, lineStart) +
                before +
                value.slice(lineStart, end) +
                after;
            cursorStart = lineStart + before.length;
            cursorEnd = cursorStart + (end - lineStart);
        } else {
            newText = value.slice(0, start) + before + selected + after + value.slice(end);
            cursorStart = start + before.length;
            cursorEnd = cursorStart + selected.length;
        }

        onChange(newText);
        // Re-focus and restore selection after React re-render
        requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(cursorStart, cursorEnd);
        });
    }, [value, onChange]);

    return (
        <div className={`flex flex-col border-2 ${error ? 'border-red-500' : 'border-stone-800'} bg-white shadow-retro-md transition-colors`}>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 py-2 border-b-2 border-stone-800 bg-[#f5f1e8]">
                {/* Formatting buttons — only in write mode */}
                <div className="flex items-center gap-1">
                    {mode === 'write' && TOOLBAR_ACTIONS.map(({ icon: Icon, label, wrap, block }) => (
                        <button
                            key={label}
                            type="button"
                            title={label}
                            onMouseDown={e => { e.preventDefault(); insertMarkdown(wrap as [string, string], block); }}
                            className="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200 border border-transparent hover:border-stone-400 transition-all"
                        >
                            <Icon size={12} />
                        </button>
                    ))}
                </div>

                {/* Mode toggle */}
                <div className="flex border border-stone-400 overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setMode('write')}
                        className={`flex items-center gap-1 px-2 py-1 text-[9px] font-black uppercase transition-all ${
                            mode === 'write'
                                ? 'bg-stone-900 text-white'
                                : 'bg-transparent text-stone-500 hover:bg-stone-100'
                        }`}
                    >
                        <PenLine size={10} /> Write
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('preview')}
                        className={`flex items-center gap-1 px-2 py-1 text-[9px] font-black uppercase transition-all ${
                            mode === 'preview'
                                ? 'bg-stone-900 text-white'
                                : 'bg-transparent text-stone-500 hover:bg-stone-100'
                        }`}
                    >
                        <Eye size={10} /> Preview
                    </button>
                </div>
            </div>

            {/* Editor / Preview */}
            {mode === 'write' ? (
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full min-h-[240px] p-5 outline-none font-mono text-sm leading-relaxed text-stone-800 resize-y bg-white placeholder:text-stone-200"
                />
            ) : (
                <div className="min-h-[240px] p-5 prose prose-sm max-w-none text-stone-800 prose-headings:font-black prose-headings:text-stone-900 prose-code:bg-stone-100 prose-code:px-1 prose-pre:bg-stone-900 prose-pre:text-green-400">
                    {value.trim()
                        ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
                        : <span className="text-stone-300 font-serif italic text-sm">Nothing to preview yet…</span>
                    }
                </div>
            )}

            {error && (
                <p className="px-3 py-1 text-[9px] font-black text-red-600 uppercase border-t border-red-200 bg-red-50">{error}</p>
            )}
        </div>
    );
};
