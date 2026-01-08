
import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { 
    Bold, Italic, Code, Link, Image as ImageIcon, AtSign, Save, X, Eye, EyeOff, 
    Scroll, FileText, Hash, Link2, Table as TableIcon, Plus, Minus, Copy, Check, 
    Terminal, Info, Lightbulb, CheckCircle2, HelpCircle, AlertTriangle, Zap, 
    XCircle, Bug, Quote, ClipboardList, MessageSquare, StickyNote, Pencil
} from 'lucide-react';
import { RetroButton } from '../../../components/ui/retro-ui';
import { BlogPost } from './data';
import { useOSStore } from '../../os/stores/os-store';
import { useBlogStore } from './store';
import { BlogDto, useBlog, useBlogSearch, useCategories, useCreateBlog, useSeries, useUsers } from '@/services';

interface BlogEditorProps {
    onCancel: () => void;
    onPublish: () => void;
}

type SuggestionType = 'mention' | 'backlink' | null;

interface SuggestionState {
    type: SuggestionType;
    query: string;
    top: number;
    left: number;
    triggerIdx: number;
}

// --- Obsidian-accurate Callout Config ---
const CALLOUT_CONFIG: Record<string, { icon: any, color: string, bg: string, border: string, label: string, iconColor: string }> = {
    note: { icon: Pencil, color: 'text-[#086ddd]', bg: 'bg-[#f0f7ff]', border: 'border-[#086ddd]', label: 'Note', iconColor: '#086ddd' },
    abstract: { icon: ClipboardList, color: 'text-[#00a8a8]', bg: 'bg-[#f0ffff]', border: 'border-[#00a8a8]', label: 'Abstract', iconColor: '#00a8a8' },
    info: { icon: Info, color: 'text-[#086ddd]', bg: 'bg-[#f0f7ff]', border: 'border-[#086ddd]', label: 'Info', iconColor: '#086ddd' },
    todo: { icon: CheckCircle2, color: 'text-[#086ddd]', bg: 'bg-[#f0f7ff]', border: 'border-[#086ddd]', label: 'Todo', iconColor: '#086ddd' },
    tip: { icon: Lightbulb, color: 'text-[#00a870]', bg: 'bg-[#f0fff4]', border: 'border-[#00a870]', label: 'Tip', iconColor: '#00a870' },
    success: { icon: CheckCircle2, color: 'text-[#00a870]', bg: 'bg-[#f0fff4]', border: 'border-[#00a870]', label: 'Success', iconColor: '#00a870' },
    question: { icon: HelpCircle, color: 'text-[#d86b00]', bg: 'bg-[#fff9f0]', border: 'border-[#d86b00]', label: 'Question', iconColor: '#d86b00' },
    warning: { icon: AlertTriangle, color: 'text-[#d86b00]', bg: 'bg-[#fff9f0]', border: 'border-[#d86b00]', label: 'Warning', iconColor: '#d86b00' },
    failure: { icon: XCircle, color: 'text-[#e93d3d]', bg: 'bg-[#fff5f5]', border: 'border-[#e93d3d]', label: 'Failure', iconColor: '#e93d3d' },
    danger: { icon: Zap, color: 'text-[#e93d3d]', bg: 'bg-[#fff5f5]', border: 'border-[#e93d3d]', label: 'Danger', iconColor: '#e93d3d' },
    bug: { icon: Bug, color: 'text-[#e93d3d]', bg: 'bg-[#fff5f5]', border: 'border-[#e93d3d]', label: 'Bug', iconColor: '#e93d3d' },
    example: { icon: Hash, color: 'text-[#785ad0]', bg: 'bg-[#f7f5ff]', border: 'border-[#785ad0]', label: 'Example', iconColor: '#785ad0' },
    quote: { icon: Quote, color: 'text-[#666666]', bg: 'bg-[#f8f8f8]', border: 'border-[#666666]', label: 'Quote', iconColor: '#666666' },
};

// --- Gruvbox Theme Definition for Prism ---
const gruvboxTheme: any = {
    'code[class*="language-"]': {
        color: '#ebdbb2',
        fontFamily: '"Courier Prime", monospace',
        fontSize: '13px',
        lineHeight: '1.6',
        direction: 'ltr',
        textAlign: 'left',
        whiteSpace: 'pre',
        wordSpacing: 'normal',
        wordBreak: 'normal',
        MozTabSize: '4',
        OTabSize: '4',
        tabSize: '4',
        WebkitHyphens: 'none',
        MozHyphens: 'none',
        msHyphens: 'none',
        hyphens: 'none',
    },
    'pre[class*="language-"]': {
        color: '#ebdbb2',
        fontFamily: '"Courier Prime", monospace',
        fontSize: '13px',
        lineHeight: '1.6',
        direction: 'ltr',
        textAlign: 'left',
        whiteSpace: 'pre',
        wordSpacing: 'normal',
        wordBreak: 'normal',
        MozTabSize: '4',
        OTabSize: '4',
        tabSize: '4',
        WebkitHyphens: 'none',
        MozHyphens: 'none',
        msHyphens: 'none',
        hyphens: 'none',
        padding: '20px',
        margin: '0',
        overflow: 'auto',
        background: 'transparent',
    },
    comment: { color: '#928374', fontStyle: 'italic' },
    prolog: { color: '#928374' },
    doctype: { color: '#928374' },
    cdata: { color: '#928374' },
    punctuation: { color: '#a89984' },
    namespace: { opacity: 0.7 },
    property: { color: '#fb4934' },
    keyword: { color: '#fb4934' },
    tag: { color: '#fb4934' },
    'class-name': { color: '#fabd2f' },
    boolean: { color: '#d3869b' },
    constant: { color: '#d3869b' },
    symbol: { color: '#fe8019' },
    deleted: { color: '#fb4934' },
    number: { color: '#d3869b' },
    selector: { color: '#b8bb26' },
    'attr-name': { color: '#fabd2f' },
    string: { color: '#b8bb26' },
    char: { color: '#b8bb26' },
    builtin: { color: '#fabd2f' },
    inserted: { color: '#b8bb26' },
    variable: { color: '#83a598' },
    operator: { color: '#fe8019' },
    entity: { color: '#fabd2f', cursor: 'help' },
    url: { color: '#fabd2f' },
    'attr-value': { color: '#b8bb26' },
    function: { color: '#b8bb26' },
    regex: { color: '#fe8019' },
    important: { color: '#fe8019', fontWeight: 'bold' },
    bold: { fontWeight: 'bold' },
    italic: { fontStyle: 'italic' },
};

// --- Mermaid Renderer Component ---
const MermaidRenderer: React.FC<{ chart: string }> = ({ chart }) => {
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
            }
        });

        const renderChart = async () => {
            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, chart);
                if (containerRef.current) {
                    containerRef.current.innerHTML = svg;
                }
            } catch (err) {
                console.error("Mermaid render error:", err);
                if (containerRef.current) {
                    containerRef.current.innerHTML = `<div class="p-4 border border-red-900 bg-red-950 text-red-400 text-xs font-mono">Mermaid Syntax Error</div>`;
                }
            }
        };

        renderChart();
    }, [chart]);

    return (
        <div className="flex flex-col my-8 border-2 border-stone-800 shadow-retro-md rounded-sm overflow-hidden bg-[#282828]">
            <div className="px-3 py-1.5 bg-[#3c3836] border-b border-stone-800 flex items-center gap-2">
                <Hash size={12} className="text-[#fabd2f]" />
                <span className="text-[10px] font-bold text-[#ebdbb2] uppercase font-mono tracking-widest">Diagram Flow</span>
            </div>
            <div ref={containerRef} className="flex justify-center p-8 overflow-x-auto min-h-[150px]" />
        </div>
    );
};

// --- Custom Code Block Component ---
export const CodeBlock: React.FC<{ language?: string; value: string }> = ({ language, value }) => {
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
                    {copied ? <Check size={12} className="text-[#b8bb26]" /> : <Copy size={12} />}
                </button>
            </div>
            <div className="relative">
                <SyntaxHighlighter language={language || 'plaintext'} style={gruvboxTheme} useInlineStyles={true} customStyle={{ background: 'transparent', padding: '20px', margin: 0 }}>
                    {value}
                </SyntaxHighlighter>
                <div className="absolute bottom-2 right-4 opacity-[0.03] select-none pointer-events-none text-6xl font-black text-white italic">{language?.toUpperCase()}</div>
            </div>
        </div>
    );
};

// --- Custom Blockquote / Callout Component ---
export const CalloutBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const childrenArray = React.Children.toArray(children);
    const firstChild = childrenArray[0] as any;

    if (firstChild && firstChild.props && firstChild.props.children) {
        const textNodes = React.Children.toArray(firstChild.props.children);
        const firstText = textNodes[0] as string;

        // obsidian callouts can have [-] for collapsible, we just ignore the - for now but capture the type
        if (typeof firstText === 'string' && firstText.startsWith('[!')) {
            const match = firstText.match(/^\[!(\w+)[+-]?\]\s*(.*)$/);
            if (match) {
                const type = match[1].toLowerCase();
                const title = match[2] || CALLOUT_CONFIG[type]?.label || type;
                const config = CALLOUT_CONFIG[type] || CALLOUT_CONFIG.note;
                const IconComp = config.icon;

                // Strip the pattern from the first paragraph's children
                const remainingFirstParaContent = textNodes.slice(1);
                
                // Construct the body: first paragraph (if any text remains) + rest of the paragraphs
                return (
                    <div className={`my-8 border-l-4 ${config.border} ${config.bg} rounded-sm shadow-sm overflow-hidden flex flex-col font-sans transition-all hover:shadow-md`}>
                        <div className={`px-4 py-2 flex items-center gap-3 font-bold ${config.color} border-b border-black/5 bg-black/[0.03]`}>
                            <IconComp size={18} strokeWidth={2.5} />
                            <span className="text-[15px] tracking-tight">{title}</span>
                        </div>
                        <div className="px-5 py-4 prose prose-stone max-w-none text-stone-700 leading-relaxed text-[15px] prose-p:my-2 prose-code:bg-black/5 prose-code:px-1 prose-code:rounded prose-code:text-[#c2410c]">
                            {remainingFirstParaContent.length > 0 && <p>{remainingFirstParaContent}</p>}
                            {childrenArray.slice(1)}
                        </div>
                    </div>
                );
            }
        }
    }

    return <blockquote className="border-l-4 border-[#ff7e33]/30 pl-6 py-2 my-6 italic text-stone-600 font-serif bg-stone-50/50 rounded-r-sm leading-relaxed">{children}</blockquote>;
};

export const BlogEditor: React.FC<BlogEditorProps> = ({ onCancel, onPublish }) => {
    const { currentUser } = useOSStore();
    // const { categories, authors, posts, series, addPost } = useBlogStore();
    const { data: categories } = useCategories({pageIndex: 0, pageSize: 100});
    const { data: series } = useSeries({ pageIndex: 0, pageSize: 100 });
    const { data: authors } = useUsers({ pageIndex: 0, pageSize: 100 });
    const { data: posts } = useBlogSearch({}, { pageIndex: 0, pageSize: 100 });
    const {mutateAsync: saveBlogPostAsync} = useCreateBlog();
    const {} = useCategories
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(() => categories?.[0]);
    const [serieId, setSerieId] = useState('');
    const [markdown, setMarkdown] = useState('');
    const [showPreview, setShowPreview] = useState(true);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const [suggestion, setSuggestion] = useState<SuggestionState>({ type: null, query: '', top: 0, left: 0, triggerIdx: -1 });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [showTableTool, setShowTableTool] = useState(false);
    const [tableConfig, setTableConfig] = useState({ rows: 3, cols: 3 });

    const updateCaretCoordinates = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const { selectionEnd } = textarea;
        const text = textarea.value.substring(0, selectionEnd);
        
        const div = document.createElement('div');
        const style = window.getComputedStyle(textarea);
        Array.from(style).forEach(prop => {
            // @ts-ignore
            div.style[prop] = style.getPropertyValue(prop);
        });
        
        div.style.position = 'absolute';
        div.style.visibility = 'hidden';
        div.style.whiteSpace = 'pre-wrap';
        div.textContent = text;
        
        const span = document.createElement('span');
        span.textContent = '|'; 
        div.appendChild(span);
        
        document.body.appendChild(div);
        
        const top = span.offsetTop - textarea.scrollTop;
        const left = span.offsetLeft - textarea.scrollLeft;
        
        document.body.removeChild(div);

        return { top, left };
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setMarkdown(newValue);
        
        const textarea = e.target;
        const cursor = textarea.selectionEnd;
        const textBeforeCursor = newValue.slice(0, cursor);
        
        const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
        const backlinkMatch = textBeforeCursor.match(/\[\[([^\]]*)$/);

        if (mentionMatch) {
            const coords = updateCaretCoordinates();
            if (coords) {
                setSuggestion({
                    type: 'mention',
                    query: mentionMatch[1],
                    top: coords.top + 24,
                    left: coords.left,
                    triggerIdx: mentionMatch.index!
                });
                setSelectedIndex(0);
                return;
            }
        } else if (backlinkMatch) {
            const coords = updateCaretCoordinates();
            if (coords) {
                setSuggestion({
                    type: 'backlink',
                    query: backlinkMatch[1],
                    top: coords.top + 24,
                    left: coords.left,
                    triggerIdx: backlinkMatch.index!
                });
                setSelectedIndex(0);
                return;
            }
        }

        setSuggestion({ type: null, query: '', top: 0, left: 0, triggerIdx: -1 });
    };

    const insertItem = (item: string, type: SuggestionType) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const before = markdown.substring(0, suggestion.triggerIdx);
        const after = markdown.substring(textarea.selectionEnd);
        
        let insertion = '';
        let cursorOffset = 0;

        if (type === 'mention') {
            insertion = `**@${item}** `;
            cursorOffset = insertion.length;
        } else if (type === 'backlink') {
            const post = posts?.rows.find(p => p.title === item);
            insertion = `[${item}](/scroll/${post?.id || '404'}) `;
            cursorOffset = insertion.length;
        }

        const newText = before + insertion + after;
        setMarkdown(newText);
        setSuggestion({ type: null, query: '', top: 0, left: 0, triggerIdx: -1 });

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(suggestion.triggerIdx + cursorOffset, suggestion.triggerIdx + cursorOffset);
        }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!suggestion.type) return;

        const filtered = getFilteredItems();
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filtered.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            if (filtered[selectedIndex]) {
                insertItem(filtered[selectedIndex], suggestion.type);
            }
        } else if (e.key === 'Escape') {
            setSuggestion({ type: null, query: '', top: 0, left: 0, triggerIdx: -1 });
        }
    };

    const insertText = (before: string, after: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const previousText = textarea.value;
        const selectedText = previousText.substring(start, end);

        const newText = previousText.substring(0, start) + before + selectedText + after + previousText.substring(end);
        setMarkdown(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    const insertTable = () => {
        let headerRow = '|';
        let dividerRow = '|';
        
        for (let c = 0; c < tableConfig.cols; c++) {
            headerRow += ` Header ${c + 1} |`;
            dividerRow += ' --- |';
        }

        let bodyRows = '';
        for (let r = 0; r < tableConfig?.rows; r++) {
            bodyRows += '\n|';
            for (let c = 0; c < tableConfig.cols; c++) {
                bodyRows += ` Cell ${r + 1}-${c + 1} |`;
            }
        }

        const tableMarkdown = `\n${headerRow}\n${dividerRow}${bodyRows}\n\n`;
        insertText(tableMarkdown);
        setShowTableTool(false);
    };

    const getFilteredItems = () => {
        if (suggestion.type === 'mention') {
            return authors?.rows.filter(a => a.fullName.toLowerCase().includes(suggestion.query.toLowerCase()));
        }
        if (suggestion.type === 'backlink') {
            return posts?.rows.map(p => p.title).filter(t => t.toLowerCase().includes(suggestion.query.toLowerCase()));
        }
        return [];
    };

    const filteredItems = getFilteredItems();

    const handleSave = () => {
        if (!title.trim() || !markdown.trim()) {
            alert("The scroll is empty! The ravens refuse to carry it.");
            return;
        }

        const newPost: BlogDto = {
            title,
            excerpt: markdown.substring(0, 100) + "...",
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            category: category as any,
            author: {id: currentUser.id},
            readTime: `${Math.ceil(markdown.split(' ').length / 200)} min`,
            content: markdown,
            serieId: serieId || undefined
        };

        saveBlogPostAsync(newPost);
        onPublish();
    };

    return (
        <div className="flex flex-col h-full bg-[#fdfdfd] relative">
            <div className="h-14 border-b-2 border-stone-800 bg-[#e8e4d9] flex items-center justify-between px-4 shrink-0 shadow-sm">
                 <div className="flex items-center gap-3">
                     <Scroll size={20} className="text-[#ff7e33]" />
                     <h2 className="font-bold text-lg font-serif tracking-tight text-stone-900">The Scribe's Desk</h2>
                     <div className="h-6 w-px bg-stone-400 mx-2" />
                     
                     <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-500 uppercase">School:</span>
                        <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="bg-white border border-stone-800 text-xs font-bold px-2 py-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#ff7e33]">
                            {categories?.rows.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                     </div>

                     <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-500 uppercase">Series:</span>
                        <select value={serieId} onChange={(e) => setSerieId(e.target.value)} className="bg-white border border-stone-800 text-xs font-bold px-2 py-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#ff7e33] max-w-[150px]">
                            <option value="">(None)</option>
                            {series?.rows.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                     </div>
                 </div>
                 <div className="flex items-center gap-2">
                     <RetroButton variant="ghost" size="sm" onClick={onCancel} icon={<X size={14} />}>Burn Scroll</RetroButton>
                     <RetroButton variant="primary" size="sm" onClick={handleSave} icon={<Save size={14} />}>Etch into Eternity</RetroButton>
                 </div>
            </div>

            <div className="px-6 py-4 border-b border-stone-200 bg-white">
                <input type="text" placeholder="Enter the prophecy's title..." className="w-full text-3xl font-black text-stone-900 placeholder:text-stone-300 outline-none font-serif bg-transparent" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="px-4 py-2 border-b border-stone-200 bg-stone-50 flex flex-wrap items-center gap-1 z-20 relative">
                <button onClick={() => insertText('**', '**')} className="p-1.5 hover:bg-stone-200 rounded text-stone-700" title="Empower (Bold)" aria-label="Bold"><Bold size={16}/></button>
                <button onClick={() => insertText('*', '*')} className="p-1.5 hover:bg-stone-200 rounded text-stone-700" title="Italicize" aria-label="Italic"><Italic size={16}/></button>
                <button onClick={() => insertText('`', '`')} className="p-1.5 hover:bg-stone-200 rounded text-stone-700" title="Rune (Inline Code)" aria-label="Inline code"><Code size={16}/></button>
                <button onClick={() => insertText('\n```\n', '\n```\n')} className="p-1.5 hover:bg-stone-200 rounded text-stone-700" title="Chamber (Code Block)" aria-label="Code block"><Terminal size={16}/></button>
                <div className="w-px h-5 bg-stone-300 mx-1" />
                <button onClick={() => insertText('[', '](url)')} className="p-1.5 hover:bg-stone-200 rounded text-stone-700" title="Link Portal"><Link size={16}/></button>
                <button onClick={() => insertText('![alt](', ')')} className="p-1.5 hover:bg-stone-200 rounded text-stone-700" title="Illusion (Image)"><ImageIcon size={16}/></button>
                <div className="relative">
                    <button onClick={() => setShowTableTool(!showTableTool)} className={`p-1.5 rounded text-stone-700 ${showTableTool ? 'bg-stone-300 text-stone-900' : 'hover:bg-stone-200'}`} title="Construct Grid">
                        <TableIcon size={16}/>
                    </button>
                    {showTableTool && (
                        <div className="absolute top-full left-0 mt-2 p-3 bg-white border-2 border-stone-800 shadow-retro-md z-50 w-48 rounded-sm">
                            <h4 className="text-[10px] font-bold uppercase text-stone-500 mb-2">Grid Dimensions</h4>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-mono">Cols:</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setTableConfig(p => ({...p, cols: Math.max(1, p.cols - 1)}))} className="p-1 hover:bg-stone-100"><Minus size={10}/></button>
                                    <span className="text-xs font-bold w-4 text-center">{tableConfig.cols}</span>
                                    <button onClick={() => setTableConfig(p => ({...p, cols: Math.min(10, p.cols + 1)}))} className="p-1 hover:bg-stone-100"><Plus size={10}/></button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-mono">Rows:</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setTableConfig(p => ({...p, rows: Math.max(1, p?.rows - 1)}))} className="p-1 hover:bg-stone-100"><Minus size={10}/></button>
                                    <span className="text-xs font-bold w-4 text-center">{tableConfig?.rows}</span>
                                    <button onClick={() => setTableConfig(p => ({...p, rows: Math.min(20, p?.rows + 1)}))} className="p-1 hover:bg-stone-100"><Plus size={10}/></button>
                                </div>
                            </div>
                            <button onClick={insertTable} className="w-full py-1 bg-[#ff7e33] text-white text-xs font-bold border border-black shadow-[1px_1px_0_0_#000] hover:translate-y-[1px] hover:shadow-none transition-all">INSERT</button>
                        </div>
                    )}
                </div>
                <div className="w-px h-5 bg-stone-300 mx-1" />
                <button onClick={() => insertText('> [!info] Title\n> ')} className="flex items-center gap-1 px-2 py-1 hover:bg-stone-200 rounded text-stone-700 text-xs font-bold" title="Insert Obsidian Callout">
                    <StickyNote size={14}/> Callout
                </button>
                <div className="w-px h-5 bg-stone-300 mx-1" />
                <button onClick={() => insertText('@')} className="flex items-center gap-1 px-2 py-1 hover:bg-stone-200 rounded text-stone-700 text-xs font-bold"><AtSign size={14}/> Mention</button>
                <button onClick={() => insertText('[[')} className="flex items-center gap-1 px-2 py-1 hover:bg-stone-200 rounded text-stone-700 text-xs font-bold"><Link2 size={14}/> Backlink</button>
                <div className="flex-1" />
                <button onClick={() => setShowPreview(!showPreview)} className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-bold ${showPreview ? 'bg-stone-200 text-stone-900' : 'text-stone-500 hover:bg-stone-100'}`}>
                    {showPreview ? <Eye size={14}/> : <EyeOff size={14}/>} 
                    <span className="hidden md:inline">{showPreview ? 'Vision On' : 'Vision Off'}</span>
                </button>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                <div className={`flex-1 h-full relative ${showPreview ? 'border-r border-stone-200' : ''}`}>
                    <textarea ref={textareaRef} value={markdown} onChange={handleInput} onKeyDown={handleKeyDown} placeholder="Begin your incantation here..." className="w-full h-full p-6 resize-none outline-none font-mono text-sm leading-relaxed text-stone-800 bg-white" spellCheck={false} />
                    {suggestion.type && (
                        <div className="absolute z-50 w-64 bg-white border-2 border-stone-800 shadow-retro-md overflow-hidden flex flex-col" style={{ top: suggestion.top, left: Math.min(suggestion.left, (textareaRef.current?.offsetWidth || 500) - 260) }}>
                            <div className="px-2 py-1 bg-stone-100 border-b border-stone-200 text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                                {suggestion.type === 'mention' ? <AtSign size={10}/> : <Link2 size={10}/>}
                                {suggestion.type === 'mention' ? 'Summon Author' : 'Link Scroll'}
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                                {filteredItems.length === 0 ? <div className="p-3 text-xs text-stone-400 italic text-center">No matches found.</div> : filteredItems.map((item, idx) => (
                                    <button key={idx} onClick={() => insertItem(item, suggestion.type)} onMouseEnter={() => setSelectedIndex(idx)} className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors ${idx === selectedIndex ? 'bg-[#ff7e33] text-white' : 'text-stone-700 hover:bg-stone-100'}`}>
                                        <UserAvatar name={item}/>
                                        <span className="truncate">{item}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {showPreview && (
                    <div className="flex-1 h-full overflow-y-auto bg-stone-50 p-8 prose prose-stone prose-sm max-w-none">
                         {markdown ? (
                             <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    blockquote: CalloutBlock,
                                    // Fix: Handle deprecated 'inline' prop and use language match/line count for block detection
                                    code({node, className, children, ...props}) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const value = String(children).replace(/\n$/, '');
                                        // Heuristic for block code: has language match OR contains newlines
                                        const isBlock = match || value.includes('\n');
                                        if (isBlock) return <CodeBlock language={match?.[1]} value={value} />;
                                        return <code className={`bg-stone-200 px-1 py-0.5 rounded text-[#c2410c] font-bold font-mono ${className || ''}`} {...props}>{children}</code>;
                                    }
                                }}
                             >
                                 {markdown}
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
    );
};

const UserAvatar = ({ name }: { name: string }) => {
    const bgColors = ['bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200'];
    const bg = bgColors[name.length % bgColors.length];
    return <div className={`w-5 h-5 rounded-full ${bg} border border-black/20 flex items-center justify-center text-[9px] font-bold`}>{name.charAt(0)}</div>;
};
