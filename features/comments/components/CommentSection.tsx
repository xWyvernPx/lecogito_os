
import React, { useState, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageSquare, Send, User, AtSign, Loader2, Trash2, Terminal, Bold, Italic, Code, Link as LinkIcon, Image as ImageIcon, Eye, EyeOff, FileText, Reply, CornerDownRight } from 'lucide-react';
import { useComments, useCreateComment, useDeleteComment } from '../hooks/use-comments';
import { RetroButton } from '../../../components/ui/retro-ui';
import { useOSStore } from '../../os/stores/os-store';
import type { CommentDto } from '@/types/api';

interface CommentSectionProps {
    blogId: number; // The API uses Int64 IDs
    path: string;
}

interface CommentFormProps {
    blogId: number;
    path: string;
    parentId?: number | null;
    onCancel?: () => void;
    onSuccess?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ blogId, path, parentId, onCancel, onSuccess }) => {
    const { mutate: postComment, isPending } = useCreateComment();
    const { currentUser } = useOSStore();
    
    // Initial state based on logged in user or empty
    const [author, setAuthor] = useState(currentUser ? currentUser.name : '');
    const [email, setEmail] = useState('');
    const [content, setContent] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!author || !content) return;

        postComment({
            author,
            email: email || 'anonymous@void.net',
            content,
            blogPostId: blogId,
            path,
            parentId
        }, {
            onSuccess: () => {
                setContent('');
                if (onSuccess) onSuccess();
            }
        });
    };

    const insertFormat = (before: string, after: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const previousText = textarea.value;
        const selectedText = previousText.substring(start, end);
        
        const newText = previousText.substring(0, start) + before + selectedText + after + previousText.substring(end);
        setContent(newText);
        
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 mb-8">
            {/* Identity Section - Only if not fully authenticated or just always allow override */}
            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                    <div className={`flex items-center gap-2 border border-stone-300 px-3 py-2 transition-colors ${currentUser ? 'bg-stone-100 cursor-not-allowed' : 'bg-white focus-within:border-os-accent'}`}>
                        <User size={14} className="text-stone-400" />
                        <input 
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            placeholder="Codename (Required)"
                            className="w-full text-xs font-bold outline-none font-mono bg-transparent disabled:text-stone-500"
                            required
                            disabled={!!currentUser}
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 bg-white border border-stone-300 px-3 py-2 focus-within:border-os-accent transition-colors">
                        <AtSign size={14} className="text-stone-400" />
                        <input 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Signal Freq/Email (Optional)"
                            className="w-full text-xs font-bold outline-none font-mono bg-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Editor Container */}
            <div className={`border-2 border-stone-300 bg-white rounded-sm shadow-sm overflow-hidden group focus-within:border-os-accent transition-colors relative ${parentId ? 'border-l-4 border-l-os-accent' : ''}`}>
                {/* Toolbar */}
                <div className="flex items-center gap-1 p-1.5 border-b border-stone-200 bg-stone-50 select-none">
                    <button type="button" onClick={() => insertFormat('**', '**')} className="p-1.5 hover:bg-stone-200 rounded text-stone-600" title="Bold"><Bold size={14} strokeWidth={2.5} /></button>
                    <button type="button" onClick={() => insertFormat('*', '*')} className="p-1.5 hover:bg-stone-200 rounded text-stone-600" title="Italic"><Italic size={14} strokeWidth={2.5} /></button>
                    <button type="button" onClick={() => insertFormat('`', '`')} className="p-1.5 hover:bg-stone-200 rounded text-stone-600" title="Code"><Code size={14} strokeWidth={2.5} /></button>
                    <div className="w-px h-4 bg-stone-300 mx-1" />
                    <button type="button" onClick={() => insertFormat('[', '](url)')} className="p-1.5 hover:bg-stone-200 rounded text-stone-600" title="Link"><LinkIcon size={14} strokeWidth={2.5} /></button>
                    <button type="button" onClick={() => insertFormat('![alt](', ')')} className="p-1.5 hover:bg-stone-200 rounded text-stone-600" title="Image"><ImageIcon size={14} strokeWidth={2.5} /></button>
                    
                    <div className="flex-1" />
                    <button 
                        type="button" 
                        onClick={() => setIsPreview(!isPreview)} 
                        className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide transition-colors ${isPreview ? 'bg-os-accent text-white' : 'text-stone-500 hover:bg-stone-200'}`}
                    >
                        {isPreview ? <EyeOff size={12} /> : <Eye size={12} />}
                        {isPreview ? 'Edit' : 'Preview'}
                    </button>
                </div>

                {/* Text Area */}
                <div className="relative bg-white min-h-[140px]">
                    {isPreview ? (
                        <div className="p-4 prose prose-sm max-w-none text-stone-800 prose-p:my-2 prose-a:text-os-accent prose-code:bg-stone-100 prose-code:px-1 prose-code:rounded prose-code:text-[#c2410c] prose-img:rounded-md border-b-4 border-transparent h-full">
                            {content ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                            ) : (
                                <span className="text-stone-400 italic text-xs">Nothing to preview...</span>
                            )}
                        </div>
                    ) : (
                        <textarea 
                            ref={textareaRef}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder={parentId ? "Drafting reply..." : "Transmit your thoughts..."}
                            className="w-full h-full min-h-[140px] resize-y outline-none text-sm text-stone-800 bg-transparent p-4 font-sans leading-relaxed placeholder:text-stone-400"
                            required
                            maxLength={2000}
                            autoFocus={!!parentId}
                        />
                    )}
                </div>

                {/* Footer Bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-stone-50 border-t border-stone-200">
                    <div className="flex items-center gap-2">
                        {onCancel && (
                            <RetroButton 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={onCancel}
                            >
                                CANCEL
                            </RetroButton>
                        )}
                        <RetroButton 
                            type="submit" 
                            size="sm" 
                            disabled={isPending}
                            className={currentUser ? '' : 'bg-[#fcd34d] hover:bg-[#fbbf24] text-stone-900 border-stone-900'} 
                            icon={isPending ? <Loader2 size={12} className="animate-spin"/> : <Send size={12} />}
                        >
                            {isPending ? 'TRANSMITTING...' : parentId ? 'SEND REPLY' : currentUser ? 'POST COMMENT' : 'POST AS GUEST'}
                        </RetroButton>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold font-mono text-stone-400">
                        <span>{content.length} / 2000</span>
                        <div className="border border-stone-300 px-1 rounded flex items-center justify-center bg-white" title="Markdown Supported">
                            <span className="text-[8px] tracking-tighter text-stone-600">M↓</span>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

// Recursive Data Structure
interface CommentNode extends CommentDto {
    children: CommentNode[];
}

const CommentItem: React.FC<{ comment: CommentNode; blogId: number; path: string }> = ({ comment, blogId, path }) => {
    const { currentUser } = useOSStore(); 
    const { mutate: deleteComment } = useDeleteComment();
    const [isReplying, setIsReplying] = useState(false);

    return (
        <div className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Thread Line for nested comments */}
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded bg-stone-200 border border-stone-300 overflow-hidden shrink-0 shadow-sm relative z-10">
                    <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author}`} 
                        alt={comment.author} 
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Vertical Line if children exist */}
                {comment.children.length > 0 && (
                    <div className="w-px flex-1 bg-stone-300 my-2" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="bg-white border border-stone-200 p-0 shadow-sm relative rounded-sm rounded-tl-none overflow-hidden">
                    {/* Comment Header */}
                    <div className="flex justify-between items-center px-4 py-2 bg-stone-50 border-b border-stone-100">
                        <div className="flex items-baseline gap-2">
                            <span className="font-bold text-sm text-stone-900">{comment.author}</span>
                            <span className="text-[10px] font-mono text-stone-400">
                                {new Date(comment.createdDate || '').toLocaleDateString()} at {new Date(comment.createdDate || '').toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {currentUser?.type === 'admin' && (
                                <button 
                                    onClick={() => deleteComment(comment.id)}
                                    className="text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Message"
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Comment Body */}
                    <div className="p-4 prose prose-sm max-w-none text-stone-700 leading-relaxed prose-p:my-1 prose-a:text-os-accent prose-a:no-underline hover:prose-a:underline prose-code:bg-stone-100 prose-code:px-1 prose-code:rounded prose-code:text-[#c2410c] prose-code:text-xs prose-pre:bg-stone-900 prose-pre:text-stone-100 prose-img:rounded-md">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {comment.content}
                        </ReactMarkdown>
                    </div>

                    {/* Actions */}
                    <div className="px-4 py-2 border-t border-stone-100 bg-stone-50/50 flex justify-end">
                        <button 
                            onClick={() => setIsReplying(!isReplying)}
                            className={`flex items-center gap-1 text-[10px] font-bold uppercase transition-colors ${isReplying ? 'text-os-accent' : 'text-stone-400 hover:text-stone-600'}`}
                        >
                            <Reply size={10} /> {isReplying ? 'Cancel Reply' : 'Reply'}
                        </button>
                    </div>
                </div>

                {/* Reply Form */}
                {isReplying && (
                    <div className="mt-4 flex gap-4">
                        <div className="w-10 flex justify-center">
                            <CornerDownRight size={24} className="text-stone-300" />
                        </div>
                        <div className="flex-1">
                            <CommentForm 
                                blogId={blogId} 
                                path={path} 
                                parentId={comment.id}
                                onCancel={() => setIsReplying(false)}
                                onSuccess={() => setIsReplying(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Nested Children */}
                {comment.children.length > 0 && (
                    <div className="mt-6 space-y-6">
                        {comment.children.map(child => (
                            <CommentItem key={child.id} comment={child} blogId={blogId} path={path} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export const CommentSection: React.FC<CommentSectionProps> = ({ blogId, path }) => {
    const { data, isLoading } = useComments(blogId);
    
    // Transform flat list to tree
    const commentTree = useMemo(() => {
        const rawComments = data?.rows || [];
        const nodes: Record<number, CommentNode> = {};
        
        // 1. Initialize nodes
        rawComments.forEach(c => {
            nodes[c.id] = { ...c, children: [] };
        });

        const roots: CommentNode[] = [];

        // 2. Build Hierarchy
        rawComments.forEach(c => {
            const node = nodes[c.id];
            if (c.parentId && nodes[c.parentId]) {
                nodes[c.parentId].children.push(node);
            } else {
                roots.push(node);
            }
        });

        // 3. Sort Roots (Newest First) and Children (Oldest First for conversation flow)
        roots.sort((a, b) => new Date(b.createdDate!).getTime() - new Date(a.createdDate!).getTime());
        
        // Recursive Sort for children
        const sortChildren = (node: CommentNode) => {
            if (node.children.length > 0) {
                node.children.sort((a, b) => new Date(a.createdDate!).getTime() - new Date(b.createdDate!).getTime());
                node.children.forEach(sortChildren);
            }
        };
        roots.forEach(sortChildren);

        return roots;
    }, [data?.rows]);

    return (
        <div className="mt-16 max-w-3xl mx-auto border-t-2 border-dashed border-stone-300 pt-10">
            <div className="flex items-center gap-3 mb-8">
                <MessageSquare size={20} className="text-os-accent" />
                <h3 className="text-xl font-black uppercase tracking-tight text-stone-900">Comms Log ({data?.pagination.totalRows || 0})</h3>
            </div>

            {/* Main Input */}
            <CommentForm blogId={blogId} path={path} />

            {/* Comment List */}
            <div className="space-y-8 mb-12">
                {isLoading && (
                    <div className="flex justify-center p-8">
                        <Loader2 className="animate-spin text-stone-400" />
                    </div>
                )}

                {!isLoading && commentTree.length === 0 && (
                    <div className="text-center p-8 border-2 border-stone-200 border-dashed rounded bg-stone-50/50">
                        <Terminal size={32} className="mx-auto text-stone-300 mb-2" />
                        <p className="text-stone-500 font-mono text-xs">No signals detected. Be the first to transmit.</p>
                    </div>
                )}

                {commentTree.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} blogId={blogId} path={path} />
                ))}
            </div>
        </div>
    );
};
