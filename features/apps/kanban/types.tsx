import React from 'react';
import { AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

export type Priority = 'High' | 'Medium' | 'Low';
export type Severity = 'Critical' | 'Major' | 'Minor';

export interface Task {
    id: string;
    content: string;
    description?: string;
    estimated?: string;
    priority: Priority;
    severity: Severity;
    linkedBlogId?: string;
}

export interface Column {
    id: string;
    title: string;
    taskIds: string[];
}

export interface BoardData {
    tasks: Record<string, Task>;
    columns: Record<string, Column>;
    columnOrder: string[];
}

export const INITIAL_DATA: BoardData = {
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

export const PRIORITY_COLORS: Record<Priority, string> = {
    High: 'text-red-600 bg-red-50 border-red-200',
    Medium: 'text-amber-600 bg-amber-50 border-amber-200',
    Low: 'text-blue-600 bg-blue-50 border-blue-200',
};

export const SEVERITY_ICONS: Record<Severity, React.ReactNode> = {
    Critical: <AlertTriangle size={10} className="text-red-600" />,
    Major: <ArrowUp size={10} className="text-orange-500" />,
    Minor: <ArrowDown size={10} className="text-green-500" />,
};
