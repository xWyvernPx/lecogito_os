import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Scroll,
    X,
    Save,
    Check,
    Eye,
    EyeOff,
    FileText,
    Image as ImageIcon,
    Upload,
    Trash2,
} from 'lucide-react';
import { RetroButton } from '@/components/ui/retro-ui';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { CalloutBlock } from '@/components/ui/CalloutBlock';
import { EditorToolbar } from './components/EditorToolbar';
import { SuggestionPopup } from './components/SuggestionPopup';
import { useBlogEditor } from './hooks/use-blog-editor';
import { useOSStore } from '../../os/stores/os-store';

interface BlogEditorProps {
    onCancel: () => void;
    onPublish: () => void;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
    onCancel,
    onPublish,
}) => {
    const { currentUser } = useOSStore();
    const editor = useBlogEditor(onPublish);

    return (
        <div className="flex flex-col h-full bg-[#fdfdfd] relative">
            {/* Header bar */}
            <div className="h-14 border-b-2 border-stone-800 bg-[#e8e4d9] flex items-center justify-between px-4 shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                    <Scroll size={20} className="text-[#ff7e33]" />
                    <h2 className="font-bold text-lg font-serif tracking-tight text-stone-900">
                        The Scribe's Desk
                    </h2>
                    <div className="h-6 w-px bg-stone-400 mx-2" />

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-500 uppercase">School:</span>
                        <select
                            value={editor.category}
                            onChange={e => editor.setCategory(e.target.value)}
                            className="bg-white border border-stone-800 text-xs font-bold px-2 py-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#ff7e33]"
                        >
                            <option value="">(Select Category)</option>
                            {editor.categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-500 uppercase">Series:</span>
                        <select
                            value={editor.serieId}
                            onChange={e => editor.setSerieId(e.target.value)}
                            className="bg-white border border-stone-800 text-xs font-bold px-2 py-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#ff7e33] max-w-[150px]"
                        >
                            <option value="">(None)</option>
                            {editor.series.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <RetroButton variant="ghost" size="sm" onClick={onCancel} icon={<X size={14} />}>
                        Burn Scroll
                    </RetroButton>
                    <RetroButton variant="secondary" size="sm" onClick={() => editor.handleSave('draft')} icon={<Save size={14} />}>
                        Save Draft
                    </RetroButton>
                    <RetroButton variant="primary" size="sm" onClick={() => editor.handleSave('published')} icon={<Check size={14} />}>
                        Publish
                    </RetroButton>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Cover Image Upload */}
                <div
                    className={`relative w-full aspect-[3/1] md:aspect-[4/1] bg-stone-100 border-b border-stone-200 group transition-colors ${
                        editor.isDragging ? 'bg-orange-50 border-orange-300' : ''
                    }`}
                    onDragOver={editor.handleDragOver}
                    onDragLeave={editor.handleDragLeave}
                    onDrop={editor.handleDrop}
                >
                    {editor.thumbnail ? (
                        <>
                            <img src={editor.thumbnail} alt="Cover" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button
                                    onClick={() => editor.fileInputRef.current?.click()}
                                    className="bg-white text-stone-900 px-3 py-1.5 rounded-sm text-xs font-bold flex items-center gap-2 shadow-lg"
                                >
                                    <ImageIcon size={14} /> Change Cover
                                </button>
                                <button
                                    onClick={() => editor.setThumbnail(null)}
                                    className="bg-red-500 text-white px-3 py-1.5 rounded-sm text-xs font-bold flex items-center gap-2 shadow-lg"
                                >
                                    <Trash2 size={14} /> Remove
                                </button>
                            </div>
                        </>
                    ) : (
                        <div
                            onClick={() => editor.fileInputRef.current?.click()}
                            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-stone-400 hover:text-stone-600 hover:bg-stone-200/50 transition-colors"
                        >
                            <Upload size={32} className="mb-2 opacity-50" />
                            <p className="text-xs font-bold uppercase tracking-wider">Add Cover Image</p>
                            <p className="text-[10px] opacity-70 mt-1">Drag & drop or click to upload</p>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={editor.fileInputRef}
                        onChange={editor.handleThumbnailSelect}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                {/* Title */}
                <div className="px-6 py-4 border-b border-stone-200 bg-white">
                    <input
                        type="text"
                        placeholder="Enter the prophecy's title..."
                        className="w-full text-3xl font-black text-stone-900 placeholder:text-stone-300 outline-none font-serif bg-transparent"
                        value={editor.title}
                        onChange={e => editor.setTitle(e.target.value)}
                    />
                </div>

                {/* Toolbar */}
                <EditorToolbar
                    insertText={editor.insertText}
                    insertTable={editor.insertTable}
                    showPreview={editor.showPreview}
                    setShowPreview={editor.setShowPreview}
                    showTableTool={editor.showTableTool}
                    setShowTableTool={editor.setShowTableTool}
                    tableConfig={editor.tableConfig}
                    setTableConfig={editor.setTableConfig}
                />

                {/* Editor + Preview panes */}
                <div className="flex-1 flex overflow-hidden relative">
                    <div className={`flex-1 h-full relative ${editor.showPreview ? 'border-r border-stone-200' : ''}`}>
                        <textarea
                            ref={editor.textareaRef}
                            value={editor.markdown}
                            onChange={editor.handleInput}
                            onKeyDown={editor.handleKeyDown}
                            placeholder="Begin your incantation here..."
                            className="w-full h-full p-6 resize-none outline-none font-mono text-sm leading-relaxed text-stone-800 bg-white"
                            spellCheck={false}
                        />
                        <SuggestionPopup
                            suggestion={editor.suggestion}
                            filteredItems={editor.filteredItems}
                            selectedIndex={editor.selectedIndex}
                            insertItem={editor.insertItem}
                            setSelectedIndex={editor.setSelectedIndex}
                            maxLeft={editor.textareaRef.current?.offsetWidth || 500}
                        />
                    </div>

                    {editor.showPreview && (
                        <div className="flex-1 h-full overflow-y-auto bg-stone-50 p-8 prose prose-stone prose-sm max-w-none">
                            {editor.markdown ? (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        blockquote: CalloutBlock,
                                        code({ className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const value = String(children).replace(/\n$/, '');
                                            const isBlock = match || value.includes('\n');
                                            if (isBlock) return <CodeBlock language={match?.[1]} value={value} />;
                                            return (
                                                <code
                                                    className={`bg-stone-200 px-1 py-0.5 rounded text-[#c2410c] font-bold font-mono ${className || ''}`}
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                >
                                    {editor.markdown}
                                </ReactMarkdown>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-stone-300">
                                    <FileText size={48} className="mb-4 opacity-20" />
                                    <p className="font-mono text-xs">The parchment is blank...</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
