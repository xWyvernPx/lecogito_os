import React from 'react';
import {
    Bold,
    Italic,
    Code,
    Link,
    Image as ImageIcon,
    AtSign,
    Eye,
    EyeOff,
    Terminal,
    Link2,
    Table as TableIcon,
    Plus,
    Minus,
    StickyNote,
} from 'lucide-react';

interface TableConfig {
    rows: number;
    cols: number;
}

interface EditorToolbarProps {
    insertText: (before: string, after?: string) => void;
    insertTable: () => void;
    showPreview: boolean;
    setShowPreview: (v: boolean) => void;
    showTableTool: boolean;
    setShowTableTool: (v: boolean) => void;
    tableConfig: TableConfig;
    setTableConfig: React.Dispatch<React.SetStateAction<TableConfig>>;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    insertText,
    insertTable,
    showPreview,
    setShowPreview,
    showTableTool,
    setShowTableTool,
    tableConfig,
    setTableConfig,
}) => (
    <div className="px-4 py-2 border-b border-stone-200 bg-stone-50 flex flex-wrap items-center gap-1 z-20 relative">
        <button
            onClick={() => insertText('**', '**')}
            className="p-1.5 hover:bg-stone-200 rounded text-stone-700"
            title="Empower (Bold)"
            aria-label="Bold"
        >
            <Bold size={16} />
        </button>
        <button
            onClick={() => insertText('*', '*')}
            className="p-1.5 hover:bg-stone-200 rounded text-stone-700"
            title="Italicize"
            aria-label="Italic"
        >
            <Italic size={16} />
        </button>
        <button
            onClick={() => insertText('`', '`')}
            className="p-1.5 hover:bg-stone-200 rounded text-stone-700"
            title="Rune (Inline Code)"
            aria-label="Inline code"
        >
            <Code size={16} />
        </button>
        <button
            onClick={() => insertText('\n```\n', '\n```\n')}
            className="p-1.5 hover:bg-stone-200 rounded text-stone-700"
            title="Chamber (Code Block)"
            aria-label="Code block"
        >
            <Terminal size={16} />
        </button>
        <div className="w-px h-5 bg-stone-300 mx-1" />
        <button
            onClick={() => insertText('[', '](url)')}
            className="p-1.5 hover:bg-stone-200 rounded text-stone-700"
            title="Link Portal"
        >
            <Link size={16} />
        </button>
        <button
            onClick={() => insertText('![alt](', ')')}
            className="p-1.5 hover:bg-stone-200 rounded text-stone-700"
            title="Illusion (Image)"
        >
            <ImageIcon size={16} />
        </button>

        {/* Table tool */}
        <div className="relative">
            <button
                onClick={() => setShowTableTool(!showTableTool)}
                className={`p-1.5 rounded text-stone-700 ${
                    showTableTool
                        ? 'bg-stone-300 text-stone-900'
                        : 'hover:bg-stone-200'
                }`}
                title="Construct Grid"
            >
                <TableIcon size={16} />
            </button>
            {showTableTool && (
                <div className="absolute top-full left-0 mt-2 p-3 bg-white border-2 border-stone-800 shadow-retro-md z-50 w-48 rounded-sm">
                    <h4 className="text-[10px] font-bold uppercase text-stone-500 mb-2">
                        Grid Dimensions
                    </h4>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono">Cols:</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    setTableConfig(p => ({
                                        ...p,
                                        cols: Math.max(1, p.cols - 1),
                                    }))
                                }
                                className="p-1 hover:bg-stone-100"
                            >
                                <Minus size={10} />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">
                                {tableConfig.cols}
                            </span>
                            <button
                                onClick={() =>
                                    setTableConfig(p => ({
                                        ...p,
                                        cols: Math.min(10, p.cols + 1),
                                    }))
                                }
                                className="p-1 hover:bg-stone-100"
                            >
                                <Plus size={10} />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono">Rows:</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    setTableConfig(p => ({
                                        ...p,
                                        rows: Math.max(1, p.rows - 1),
                                    }))
                                }
                                className="p-1 hover:bg-stone-100"
                            >
                                <Minus size={10} />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">
                                {tableConfig.rows}
                            </span>
                            <button
                                onClick={() =>
                                    setTableConfig(p => ({
                                        ...p,
                                        rows: Math.min(20, p.rows + 1),
                                    }))
                                }
                                className="p-1 hover:bg-stone-100"
                            >
                                <Plus size={10} />
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={insertTable}
                        className="w-full py-1 bg-[#ff7e33] text-white text-xs font-bold border border-black shadow-[1px_1px_0_0_#000] hover:translate-y-[1px] hover:shadow-none transition-all"
                    >
                        INSERT
                    </button>
                </div>
            )}
        </div>

        <div className="w-px h-5 bg-stone-300 mx-1" />
        <button
            onClick={() => insertText('> [!info] Title\n> ')}
            className="flex items-center gap-1 px-2 py-1 hover:bg-stone-200 rounded text-stone-700 text-xs font-bold"
            title="Insert Obsidian Callout"
        >
            <StickyNote size={14} /> Callout
        </button>
        <div className="w-px h-5 bg-stone-300 mx-1" />
        <button
            onClick={() => insertText('@')}
            className="flex items-center gap-1 px-2 py-1 hover:bg-stone-200 rounded text-stone-700 text-xs font-bold"
        >
            <AtSign size={14} /> Mention
        </button>
        <button
            onClick={() => insertText('[[')}
            className="flex items-center gap-1 px-2 py-1 hover:bg-stone-200 rounded text-stone-700 text-xs font-bold"
        >
            <Link2 size={14} /> Backlink
        </button>
        <div className="flex-1" />
        <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-bold ${
                showPreview
                    ? 'bg-stone-200 text-stone-900'
                    : 'text-stone-500 hover:bg-stone-100'
            }`}
        >
            {showPreview ? <Eye size={14} /> : <EyeOff size={14} />}
            <span className="hidden md:inline">
                {showPreview ? 'Vision On' : 'Vision Off'}
            </span>
        </button>
    </div>
);
