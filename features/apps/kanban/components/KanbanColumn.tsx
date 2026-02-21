import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, X, GripHorizontal, Clock, FileText } from 'lucide-react';
import { RetroButton } from '@/components/ui/retro-ui';
import { Task, Column, PRIORITY_COLORS, SEVERITY_ICONS } from '../types';

export interface KanbanColumnProps {
    column: Column;
    tasks: Task[];
    isReadOnly: boolean;
    selectedTaskId: string | null;
    activeColInput: string | null;
    newTaskContent: string;
    onSelectTask: (taskId: string) => void;
    onSetActiveColInput: (colId: string | null) => void;
    onSetNewTaskContent: (content: string) => void;
    onAddTask: (columnId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
    column,
    tasks,
    isReadOnly,
    activeColInput,
    newTaskContent,
    onSelectTask,
    onSetActiveColInput,
    onSetNewTaskContent,
    onAddTask,
}) => {
    return (
        <div key={column.id} className="w-80 flex flex-col h-full">
            {/* Column Header */}
            <div className="bg-stone-800 text-white px-4 py-2 border-2 border-stone-900 shadow-retro-sm mb-4 flex justify-between items-center rotate-[-0.5deg] shrink-0">
                <h3 className="font-black text-xs uppercase tracking-widest">{column.title}</h3>
                <span className="text-[10px] font-mono bg-white/20 px-1.5 rounded">{tasks.length}</span>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={column.id} isDropDisabled={isReadOnly}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 bg-stone-200/40 border-2 border-stone-300 rounded-sm p-3 overflow-y-auto transition-colors ${
                            snapshot.isDraggingOver ? 'bg-os-accent/10 border-os-accent' : ''
                        }`}
                    >
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={isReadOnly}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        onClick={() => onSelectTask(task.id)}
                                        className={`bg-white p-3 mb-3 border-2 border-stone-300 shadow-sm group hover:border-stone-800 transition-all select-none relative cursor-pointer ${
                                            snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl z-50' : ''
                                        }`}
                                        style={provided.draggableProps.style}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className={`text-stone-300 ${!isReadOnly && 'group-hover:text-stone-500'}`}>
                                                <GripHorizontal size={14} />
                                            </div>
                                            {task.linkedBlogId && (
                                                <div className="text-os-accent" title="Linked to Archive">
                                                    <FileText size={12} />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <p className="text-sm font-bold text-stone-800 mb-3 leading-snug line-clamp-3">{task.content}</p>
                                        
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${PRIORITY_COLORS[task.priority]}`}>
                                                {task.priority}
                                            </span>
                                            <div className="flex items-center gap-1 text-[10px] text-stone-500 font-bold">
                                                {SEVERITY_ICONS[task.severity]}
                                            </div>
                                            {task.estimated && (
                                                <div className="flex items-center gap-1 text-[9px] text-stone-400 font-mono bg-stone-50 px-1 border border-stone-100 rounded">
                                                    <Clock size={8} /> {task.estimated}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {/* Inline Add Task (Admins Only) */}
                        {!isReadOnly && (
                            activeColInput === column.id ? (
                                <div className="mt-2 bg-white p-3 border-2 border-os-accent shadow-md animate-in fade-in zoom-in duration-200">
                                    <textarea 
                                        autoFocus
                                        placeholder="Type task..."
                                        className="w-full text-xs font-mono outline-none resize-none bg-transparent mb-3 min-h-[60px]"
                                        value={newTaskContent}
                                        onChange={(e) => onSetNewTaskContent(e.target.value)}
                                        onKeyDown={(e) => {
                                            if(e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                onAddTask(column.id);
                                            }
                                        }}
                                    />
                                    <div className="flex gap-2">
                                        <RetroButton size="sm" onClick={() => onAddTask(column.id)} className="flex-1 text-[10px] py-1">Add Card</RetroButton>
                                        <button onClick={() => onSetActiveColInput(null)} className="p-1 hover:bg-stone-100 rounded text-stone-500"><X size={16}/></button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => onSetActiveColInput(column.id)}
                                    className="w-full py-2.5 mt-1 border-2 border-dashed border-stone-400 text-stone-400 font-bold text-[10px] uppercase hover:border-os-accent hover:text-os-accent hover:bg-white transition-all flex items-center justify-center gap-1"
                                >
                                    <Plus size={12} strokeWidth={3} /> Add Task
                                </button>
                            )
                        )}
                    </div>
                )}
            </Droppable>
        </div>
    );
};
