
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, X, GripHorizontal, Trash2, Layout, RefreshCw, Clock, AlertTriangle, ArrowUp, ArrowDown, FileText, ExternalLink, Save, Lock, PlusCircle } from 'lucide-react';
import { WindowDef, ContentItem } from '../../types';
import { RetroButton } from '../../components/ui/retro-ui';
import { useOSStore } from '../os/stores/os-store';
import { BLOG_POSTS } from './blog/data';

type Priority = 'High' | 'Medium' | 'Low';
type Severity = 'Critical' | 'Major' | 'Minor';

interface Task {
    id: string;
    content: string;
    description?: string;
    estimated?: string;
    priority: Priority;
    severity: Severity;
    linkedBlogId?: string;
}

interface Column {
    id: string;
    title: string;
    taskIds: string[];
}

interface BoardData {
    tasks: Record<string, Task>;
    columns: Record<string, Column>;
    columnOrder: string[];
}

const INITIAL_DATA: BoardData = {
    tasks: {
        'task-1': { 
            id: 'task-1', 
            content: 'Refactor centering div', 
            priority: 'High', 
            severity: 'Critical', 
            estimated: '4h',
            description: 'The main container is offset by 2px on mobile devices. This is unacceptable.',
            linkedBlogId: '1'
        },
        'task-2': { 
            id: 'task-2', 
            content: 'Drink coffee', 
            priority: 'Medium', 
            severity: 'Minor', 
            estimated: '15m',
            description: 'Refill caffeine levels to maintain optimal coding velocity.'
        },
        'task-3': { 
            id: 'task-3', 
            content: 'Contemplate existence', 
            priority: 'Low', 
            severity: 'Minor', 
            estimated: '∞',
            description: 'Why are we here? Just to suffer? Or to write React code?'
        },
        'task-4': { 
            id: 'task-4', 
            content: 'Update documentation', 
            priority: 'Medium', 
            severity: 'Major', 
            estimated: '2d',
            description: 'The API docs are outdated. Update the Swagger file and the README.'
        },
    },
    columns: {
        'col-1': { id: 'col-1', title: 'TO DO', taskIds: ['task-1', 'task-2', 'task-3'] },
        'col-2': { id: 'col-2', title: 'IN PROGRESS', taskIds: ['task-4'] },
        'col-3': { id: 'col-3', title: 'DONE', taskIds: [] },
    },
    columnOrder: ['col-1', 'col-2', 'col-3'],
};

const PRIORITY_COLORS: Record<Priority, string> = {
    High: 'text-red-600 bg-red-50 border-red-200',
    Medium: 'text-amber-600 bg-amber-50 border-amber-200',
    Low: 'text-blue-600 bg-blue-50 border-blue-200',
};

const SEVERITY_ICONS: Record<Severity, React.ReactNode> = {
    Critical: <AlertTriangle size={10} className="text-red-600" />,
    Major: <ArrowUp size={10} className="text-orange-500" />,
    Minor: <ArrowDown size={10} className="text-green-500" />,
};

// --- Sub-component: Task Detail Modal (Standalone to prevent focus loss) ---

interface ModalProps {
    taskId: string;
    data: BoardData;
    isReadOnly: boolean;
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<Task>) => void;
    onDelete: (id: string, colId: string) => void;
    onOpenBlog: (id: string) => void;
}

const TaskDetailModal: React.FC<ModalProps> = ({ taskId, data, isReadOnly, onClose, onUpdate, onDelete, onOpenBlog }) => {
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

// --- Main Application Component ---

interface KanbanBoardProps {
    win: WindowDef;
    contentItem: ContentItem;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ win }) => {
    const { currentUser, spawnWindow } = useOSStore();
    const [data, setData] = useState<BoardData>(INITIAL_DATA);
    const [newTaskContent, setNewTaskContent] = useState('');
    const [activeColInput, setActiveColInput] = useState<string | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    // Strict Permissions: Only 'admin' role can modify the board.
    const isAdmin = currentUser?.type === 'admin';
    const isReadOnly = !isAdmin;

    useEffect(() => {
        const saved = localStorage.getItem('flow_board_data');
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load board data", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('flow_board_data', JSON.stringify(data));
    }, [data]);

    const onDragEnd = (result: DropResult) => {
        if (isReadOnly) return; // Prevent drag and drop for non-admins

        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const start = data.columns[source.droppableId];
        const finish = data.columns[destination.droppableId];

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);
            setData(prev => ({
                ...prev,
                columns: { ...prev.columns, [start.id]: { ...start, taskIds: newTaskIds } },
            }));
            return;
        }

        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);

        setData(prev => ({
            ...prev,
            columns: {
                ...prev.columns,
                [start.id]: { ...start, taskIds: startTaskIds },
                [finish.id]: { ...finish, taskIds: finishTaskIds },
            },
        }));
    };

    const addTask = (columnId: string, content: string = newTaskContent) => {
        const val = content.trim();
        if (!val || isReadOnly) return;

        const newTaskId = `task-${Date.now()}`;
        const newTask: Task = { 
            id: newTaskId, 
            content: val, 
            priority: 'Medium',
            severity: 'Minor',
            description: '',
            estimated: ''
        };

        setData(prev => {
            const column = prev.columns[columnId];
            return {
                ...prev,
                tasks: { ...prev.tasks, [newTaskId]: newTask },
                columns: { ...prev.columns, [columnId]: { ...column, taskIds: [...column.taskIds, newTaskId] } },
            };
        });

        setNewTaskContent('');
        setActiveColInput(null);
    };

    const deleteTask = (taskId: string, columnId: string) => {
        if (isReadOnly) return;
        setData(prev => {
            const column = prev.columns[columnId];
            const newTaskIds = column.taskIds.filter(id => id !== taskId);
            const newTasks = { ...prev.tasks };
            delete newTasks[taskId];
            return {
                ...prev,
                tasks: newTasks,
                columns: { ...prev.columns, [columnId]: { ...column, taskIds: newTaskIds } },
            };
        });
        if (selectedTaskId === taskId) setSelectedTaskId(null);
    };

    const updateTask = (taskId: string, updates: Partial<Task>) => {
        if (isReadOnly) return;
        setData(prev => ({
            ...prev,
            tasks: { ...prev.tasks, [taskId]: { ...prev.tasks[taskId], ...updates } }
        }));
    };

    const resetBoard = () => {
        if (isReadOnly) return;
        if (confirm("Reset board to default? This will wipe your local changes.")) {
            setData(INITIAL_DATA);
        }
    };

    const openBlog = (blogId: string) => {
        const blog = BLOG_POSTS.find(p => p.id === blogId);
        if (blog) {
            spawnWindow('blog', { 
                title: blog.title, 
                content: [{ type: 'blog-news', postId: blog.id }] 
            });
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f4f1ea] font-sans overflow-hidden relative select-none">
            {/* Task Detail Modal */}
            <TaskDetailModal 
                taskId={selectedTaskId || ''} 
                data={data}
                isReadOnly={isReadOnly}
                onClose={() => setSelectedTaskId(null)}
                onUpdate={updateTask}
                onDelete={deleteTask}
                onOpenBlog={openBlog}
            />

            {/* Toolbar */}
            <div className="h-12 border-b-2 border-stone-800 bg-[#e8e4d9] flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
                <div className="flex items-center gap-2">
                    <Layout size={18} className="text-[#ff7e33]" />
                    <span className="font-black text-sm uppercase tracking-wider text-stone-900">Flow_Board.exe</span>
                    <div className="ml-3 flex items-center gap-2">
                         {isReadOnly ? (
                             <div className="bg-stone-300 px-2 py-0.5 border border-stone-400 rounded text-[10px] font-bold text-stone-600 flex items-center gap-1">
                                 <Lock size={10} /> READ_ONLY
                             </div>
                         ) : (
                             <div className="bg-[#22c55e]/20 px-2 py-0.5 border border-[#22c55e] rounded text-[10px] font-bold text-green-700 flex items-center gap-1">
                                 <PlusCircle size={10} /> ADMIN_ACCESS
                             </div>
                         )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!isReadOnly && (
                        <button 
                            onClick={() => addTask(data.columnOrder[0], 'New Task Entry')}
                            className="bg-stone-800 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest border border-black shadow-retro-sm hover:translate-y-px hover:shadow-none transition-all flex items-center gap-1"
                        >
                            <Plus size={14} /> New Card
                        </button>
                    )}
                    {!isReadOnly && (
                        <button 
                            onClick={resetBoard}
                            className="p-1.5 hover:bg-stone-200 rounded text-stone-600 transition-colors border border-transparent hover:border-stone-300"
                            title="Reset Local State"
                        >
                            <RefreshCw size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Board Area */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                    <div className="flex h-full gap-6 min-w-max">
                        {data.columnOrder.map((columnId) => {
                            const column = data.columns[columnId];
                            const tasks = column.taskIds.map(id => data.tasks[id]).filter(Boolean);

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
                                                    snapshot.isDraggingOver ? 'bg-[#ff7e33]/10 border-[#ff7e33]' : ''
                                                }`}
                                            >
                                                {tasks.map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={isReadOnly}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                onClick={() => setSelectedTaskId(task.id)}
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
                                                                        <div className="text-[#ff7e33]" title="Linked to Archive">
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
                                                        <div className="mt-2 bg-white p-3 border-2 border-[#ff7e33] shadow-md animate-in fade-in zoom-in duration-200">
                                                            <textarea 
                                                                autoFocus
                                                                placeholder="Type task..."
                                                                className="w-full text-xs font-mono outline-none resize-none bg-transparent mb-3 min-h-[60px]"
                                                                value={newTaskContent}
                                                                onChange={(e) => setNewTaskContent(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if(e.key === 'Enter' && !e.shiftKey) {
                                                                        e.preventDefault();
                                                                        addTask(column.id);
                                                                    }
                                                                }}
                                                            />
                                                            <div className="flex gap-2">
                                                                <RetroButton size="sm" onClick={() => addTask(column.id)} className="flex-1 text-[10px] py-1">Add Card</RetroButton>
                                                                <button onClick={() => setActiveColInput(null)} className="p-1 hover:bg-stone-100 rounded text-stone-500"><X size={16}/></button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => setActiveColInput(column.id)}
                                                            className="w-full py-2.5 mt-1 border-2 border-dashed border-stone-400 text-stone-400 font-bold text-[10px] uppercase hover:border-[#ff7e33] hover:text-[#ff7e33] hover:bg-white transition-all flex items-center justify-center gap-1"
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
                        })}
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
};
