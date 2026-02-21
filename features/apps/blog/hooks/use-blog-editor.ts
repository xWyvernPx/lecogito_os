import { useState, useRef, useEffect, useMemo } from 'react';
import {
    useBlogSearch,
    useCategories,
    useCreateBlog,
    useSeries,
    useUsers,
    type BlogDto,
} from '@/services';
import { DEFAULT_SEARCH_REQUEST } from '../utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SuggestionType = 'mention' | 'backlink' | null;

export interface SuggestionState {
    type: SuggestionType;
    query: string;
    top: number;
    left: number;
    triggerIdx: number;
}

const EMPTY_SUGGESTION: SuggestionState = {
    type: null,
    query: '',
    top: 0,
    left: 0,
    triggerIdx: -1,
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useBlogEditor(onPublish: () => void) {
    // ── API data ────────────────────────────────────────────────────────
    const { data: categoriesData } = useCategories(DEFAULT_SEARCH_REQUEST);
    const { data: seriesData } = useSeries(DEFAULT_SEARCH_REQUEST);
    const { data: authorsData } = useUsers(DEFAULT_SEARCH_REQUEST);
    const { data: postsData } = useBlogSearch({}, DEFAULT_SEARCH_REQUEST);
    const { mutateAsync: createBlogAsync } = useCreateBlog();

    const categories = useMemo(
        () => categoriesData?.rows?.map(cat => cat.name) || [],
        [categoriesData]
    );
    const series = useMemo(() => seriesData?.rows || [], [seriesData]);
    const authors = useMemo(
        () => authorsData?.rows?.map(user => user.fullName) || [],
        [authorsData]
    );
    const posts = useMemo(() => postsData?.rows || [], [postsData]);

    // ── Form state ──────────────────────────────────────────────────────
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [serieId, setSerieId] = useState('');
    const [markdown, setMarkdown] = useState('');
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(true);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Suggestion state ────────────────────────────────────────────────
    const [suggestion, setSuggestion] = useState<SuggestionState>(EMPTY_SUGGESTION);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // ── Table tool state ────────────────────────────────────────────────
    const [showTableTool, setShowTableTool] = useState(false);
    const [tableConfig, setTableConfig] = useState({ rows: 3, cols: 3 });

    // ── Drag state ──────────────────────────────────────────────────────
    const [isDragging, setIsDragging] = useState(false);

    // Set default category when categories load
    useEffect(() => {
        if (categories.length > 0 && !category) {
            setCategory(categories[0]);
        }
    }, [categories, category]);

    // ── Helpers ─────────────────────────────────────────────────────────

    const updateCaretCoordinates = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const { selectionEnd } = textarea;
        const text = textarea.value.substring(0, selectionEnd);

        const div = document.createElement('div');
        const style = window.getComputedStyle(textarea);
        Array.from(style).forEach(prop => {
            // @ts-expect-error CSS style index access
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

    const getFilteredItems = (): string[] => {
        if (suggestion.type === 'mention') {
            return authors.filter(a =>
                a.toLowerCase().includes(suggestion.query.toLowerCase())
            );
        }
        if (suggestion.type === 'backlink') {
            return posts
                .map(p => p.title)
                .filter(t =>
                    t.toLowerCase().includes(suggestion.query.toLowerCase())
                );
        }
        return [];
    };

    // ── Handlers ────────────────────────────────────────────────────────

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
                    triggerIdx: mentionMatch.index!,
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
                    triggerIdx: backlinkMatch.index!,
                });
                setSelectedIndex(0);
                return;
            }
        }

        setSuggestion(EMPTY_SUGGESTION);
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
            const post = posts?.find(p => p.title === item);
            insertion = `[${item}](/scroll/${post?.id || '404'}) `;
            cursorOffset = insertion.length;
        }

        const newText = before + insertion + after;
        setMarkdown(newText);
        setSuggestion(EMPTY_SUGGESTION);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                suggestion.triggerIdx + cursorOffset,
                suggestion.triggerIdx + cursorOffset
            );
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
            setSelectedIndex(
                prev => (prev - 1 + filtered.length) % filtered.length
            );
        } else if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            if (filtered[selectedIndex]) {
                insertItem(filtered[selectedIndex], suggestion.type);
            }
        } else if (e.key === 'Escape') {
            setSuggestion(EMPTY_SUGGESTION);
        }
    };

    const insertText = (before: string, after: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const previousText = textarea.value;
        const selectedText = previousText.substring(start, end);

        const newText =
            previousText.substring(0, start) +
            before +
            selectedText +
            after +
            previousText.substring(end);
        setMarkdown(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + before.length,
                end + before.length
            );
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
        for (let r = 0; r < tableConfig.rows; r++) {
            bodyRows += '\n|';
            for (let c = 0; c < tableConfig.cols; c++) {
                bodyRows += ` Cell ${r + 1}-${c + 1} |`;
            }
        }

        const tableMarkdown = `\n${headerRow}\n${dividerRow}${bodyRows}\n\n`;
        insertText(tableMarkdown);
        setShowTableTool(false);
    };

    // ── Image handling ──────────────────────────────────────────────────

    const readFileAsDataURL = (file: File) => {
        const reader = new FileReader();
        reader.onload = ev => {
            if (ev.target?.result) {
                setThumbnail(ev.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleThumbnailSelect = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files?.[0]) {
            readFileAsDataURL(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                readFileAsDataURL(file);
            }
        }
    };

    // ── Save ────────────────────────────────────────────────────────────

    const handleSave = async (status: 'published' | 'draft') => {
        if (!title.trim() || !markdown.trim()) {
            // TODO: Replace alert with retro dialog (Phase 5)
            alert('The scroll is empty! The ravens refuse to carry it.');
            return;
        }

        const selectedCategory = categoriesData?.rows.find(
            c => c.name === category
        );
        const selectedSerie = seriesData?.rows.find(
            s => s.id?.toString() === serieId
        );

        const newBlog: Partial<BlogDto> = {
            title,
            description: markdown.substring(0, 200) + '...',
            content: markdown,
            contentType: 'MARKDOWN',
            status: status === 'published' ? 'PUBLIC' : 'DRAFT',
            published: status === 'published',
            category: selectedCategory,
            serie: selectedSerie || undefined,
            thumbnailUrl: thumbnail || undefined,
        };

        try {
            await createBlogAsync(newBlog);
            onPublish();
        } catch {
            // TODO: Replace alert with retro dialog (Phase 5)
            alert('Failed to save the scroll. Please try again.');
        }
    };

    const filteredItems = getFilteredItems();

    return {
        // Form state
        title,
        setTitle,
        category,
        setCategory,
        serieId,
        setSerieId,
        markdown,
        showPreview,
        setShowPreview,
        thumbnail,
        setThumbnail,
        textareaRef,
        fileInputRef,
        isDragging,

        // Suggestion state
        suggestion,
        selectedIndex,
        setSelectedIndex,
        filteredItems,

        // Table tool
        showTableTool,
        setShowTableTool,
        tableConfig,
        setTableConfig,

        // Data
        categories,
        series,

        // Handlers
        handleInput,
        handleKeyDown,
        insertText,
        insertTable,
        insertItem,
        handleSave,
        handleThumbnailSelect,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    };
}
