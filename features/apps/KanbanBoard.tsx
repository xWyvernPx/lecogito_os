import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Plus, Layout, RefreshCw, Lock, PlusCircle } from 'lucide-react';
import { WindowDef, ContentItem } from '../../types';
import { useKanbanBoard } from './kanban/hooks/use-kanban-board';
import { TaskDetailModal } from './kanban/components/TaskDetailModal';
import { KanbanColumn } from './kanban/components/KanbanColumn';

interface KanbanBoardProps { win: WindowDef; contentItem: ContentItem; }

export const KanbanBoard: React.FC<KanbanBoardProps> = () => {
    const {
        data, newTaskContent, setNewTaskContent, activeColInput, setActiveColInput,
        selectedTaskId, setSelectedTaskId, isReadOnly,
        onDragEnd, addTask, deleteTask, updateTask, resetBoard, openBlog,
    } = useKanbanBoard();

    return (
        <div className="flex flex-col h-full bg-[#f4f1ea] font-sans overflow-hidden relative select-none">
            <TaskDetailModal taskId={selectedTaskId || ''} data={data} isReadOnly={isReadOnly}
                onClose={() => setSelectedTaskId(null)} onUpdate={updateTask} onDelete={deleteTask} onOpenBlog={openBlog} />

            {/* Toolbar */}
            <div className="h-12 border-b-2 border-stone-800 bg-[#e8e4d9] flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
                <div className="flex items-center gap-2">
                    <Layout size={18} className="text-[#ff7e33]" />
                    <span className="font-black text-sm uppercase tracking-wider text-stone-900">Flow_Board.exe</span>
                    <div className="ml-3 flex items-center gap-2">
                         {isReadOnly
                             ? <div className="bg-stone-300 px-2 py-0.5 border border-stone-400 rounded text-[10px] font-bold text-stone-600 flex items-center gap-1"><Lock size={10} /> READ_ONLY</div>
                             : <div className="bg-[#22c55e]/20 px-2 py-0.5 border border-[#22c55e] rounded text-[10px] font-bold text-green-700 flex items-center gap-1"><PlusCircle size={10} /> ADMIN_ACCESS</div>
                         }
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!isReadOnly && <button onClick={() => addTask(data.columnOrder[0], 'New Task Entry')} className="bg-stone-800 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest border border-black shadow-retro-sm hover:translate-y-px hover:shadow-none transition-all flex items-center gap-1"><Plus size={14} /> New Card</button>}
                    {!isReadOnly && <button onClick={resetBoard} className="p-1.5 hover:bg-stone-200 rounded text-stone-600 transition-colors border border-transparent hover:border-stone-300" title="Reset Local State"><RefreshCw size={14} /></button>}
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
                                <KanbanColumn key={column.id} column={column} tasks={tasks} isReadOnly={isReadOnly}
                                    selectedTaskId={selectedTaskId} activeColInput={activeColInput} newTaskContent={newTaskContent}
                                    onSelectTask={setSelectedTaskId} onSetActiveColInput={setActiveColInput}
                                    onSetNewTaskContent={setNewTaskContent} onAddTask={addTask} />
                            );
                        })}
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
};
