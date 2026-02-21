import { useState, useEffect } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { useOSStore } from '@/features/os/stores/os-store';
import { BLOG_POSTS } from '@/features/apps/blog/data';
import { BoardData, Task, INITIAL_DATA } from '../types';

export const useKanbanBoard = () => {
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

    return {
        data,
        newTaskContent,
        setNewTaskContent,
        activeColInput,
        setActiveColInput,
        selectedTaskId,
        setSelectedTaskId,
        isReadOnly,
        onDragEnd,
        addTask,
        deleteTask,
        updateTask,
        resetBoard,
        openBlog,
    };
};
