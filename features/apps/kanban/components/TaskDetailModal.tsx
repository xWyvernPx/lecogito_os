import React from 'react';
import { X, Trash2, Clock, ExternalLink, Save, Lock } from 'lucide-react';
import { RetroButton } from '@/components/ui/retro-ui';
import { BLOG_POSTS } from '@/features/apps/blog/data';
import { BoardData, Task, Priority, Severity } from '../types';

export interface TaskDetailModalProps {
    taskId: string;
    data: BoardData;
    isReadOnly: boolean;
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<Task>) => void;
    onDelete: (id: string, colId: string) => void;
    onOpenBlog: (id: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ taskId, data, isReadOnly, onClose, onUpdate, onDelete, onOpenBlog }) => {
    const task = data.tasks[taskId];
    if (!task) return null;

    const columnId = Object.keys(data.columns).find(key => data.columns[key].taskIds.includes(task.id)) || '';

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white w-full max-w-lg border-2 border-stone-800 shadow-[12px_12px_0_0_rgba(0,0,0,0.5)] flex flex-col max-h-[90%] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Modal Header */}
                <div className="bg-[#e8e4d9] p-4 border-b-2 border-stone-800 flex justify-between items-start">
                    <div className="flex-1">
                        <input 
                            type="text" 
                            value={task.content}
                            onChange={(e) => onUpdate(task.id, { content: e.target.value })}
                            className="w-full bg-transparent font-black text-xl text-stone-900 outline-none placeholder:text-stone-300"
                            disabled={isReadOnly}
                        />
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-stone-500 uppercase">
                            <span>UID: {task.id}</span>
                            {isReadOnly && <span className="bg-stone-200 px-1.5 rounded text-stone-600 flex items-center gap-1"><Lock size={8}/> Restricted</span>}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-stone-500 hover:text-stone-900 p-1"><X size={20} /></button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#fdfdfd]">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-stone-400 block mb-1">Priority</label>
                            <select 
                                value={task.priority}
                                onChange={(e) => onUpdate(task.id, { priority: e.target.value as Priority })}
                                disabled={isReadOnly}
                                className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-xs font-bold rounded-sm outline-none focus:border-[#ff7e33] disabled:opacity-70"
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-stone-400 block mb-1">Severity</label>
                            <select 
                                value={task.severity}
                                onChange={(e) => onUpdate(task.id, { severity: e.target.value as Severity })}
                                disabled={isReadOnly}
                                className="w-full bg-stone-50 border border-stone-300 px-3 py-2 text-xs font-bold rounded-sm outline-none focus:border-[#ff7e33] disabled:opacity-70"
                            >
                                <option value="Critical">Critical</option>
                                <option value="Major">Major</option>
                                <option value="Minor">Minor</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-stone-400 block mb-1">Estimate</label>
                            <div className="flex items-center border border-stone-300 bg-stone-50 px-3 py-2 rounded-sm focus-within:border-[#ff7e33]">
                                <Clock size={12} className="text-stone-400 mr-2" />
                                <input 
                                    type="text" 
                                    value={task.estimated || ''}
                                    onChange={(e) => onUpdate(task.id, { estimated: e.target.value })}
                                    disabled={isReadOnly}
                                    placeholder="e.g. 2h"
                                    className="w-full bg-transparent text-xs font-mono outline-none disabled:opacity-70"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-stone-400 block mb-1">Linked Scroll</label>
                            <div className="flex gap-2">
                                <select 
                                    value={task.linkedBlogId || ''}
                                    onChange={(e) => onUpdate(task.id, { linkedBlogId: e.target.value })}
                                    disabled={isReadOnly}
                                    className="flex-1 bg-stone-50 border border-stone-300 px-2 py-2 text-[11px] rounded-sm outline-none focus:border-[#ff7e33] disabled:opacity-70 min-w-0"
                                >
                                    <option value="">(None)</option>
                                    {BLOG_POSTS.map(post => (
                                        <option key={post.id} value={post.id}>{post.title}</option>
                                    ))}
                                </select>
                                {task.linkedBlogId && (
                                    <button 
                                        onClick={() => onOpenBlog(task.linkedBlogId!)}
                                        className="px-2 bg-stone-200 border border-stone-300 rounded-sm hover:bg-stone-300 text-stone-600 transition-colors"
                                    >
                                        <ExternalLink size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase text-stone-400 block mb-2">Description</label>
                        <textarea 
                            value={task.description || ''}
                            onChange={(e) => onUpdate(task.id, { description: e.target.value })}
                            disabled={isReadOnly}
                            className="w-full min-h-[120px] p-3 bg-stone-50 border border-stone-300 rounded-sm outline-none text-sm text-stone-700 leading-relaxed resize-none focus:border-[#ff7e33] disabled:opacity-70"
                            placeholder="Add more details..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-between items-center">
                    {!isReadOnly ? (
                        <button 
                            onClick={() => onDelete(task.id, columnId)}
                            className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 uppercase transition-colors"
                        >
                            <Trash2 size={12} /> Delete Card
                        </button>
                    ) : (
                        <div className="flex items-center gap-1 text-[10px] text-stone-400 font-bold uppercase">
                            <Lock size={10} /> View Only Mode
                        </div>
                    )}
                    <RetroButton size="sm" onClick={onClose} icon={<Save size={14}/>}>
                        Close
                    </RetroButton>
                </div>
            </div>
        </div>
    );
};
