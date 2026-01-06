
import { WindowDef, DesktopIconDef, WidgetDef } from '../types';
import { APP_PRESETS } from './apps';

// --- Initial Windows ---
export const INITIAL_WINDOWS: WindowDef[] = [
    {
        id: 'welcome',
        title: 'README.MD',
        x: 80, y: 80, w: 700, h: 500,
        zIndex: 10,
        isActive: false,
        isMinimized: false,
        isMaximized: false,
        workspace: 1,
        history: [{ title: 'README.MD', content: APP_PRESETS.welcome.content }],
        historyIndex: 0
    },
    {
        id: 'about',
        title: 'CHAR_SHEET.EXE',
        x: 120, y: 120, w: 800, h: 600,
        zIndex: 11,
        isActive: true,
        isMinimized: false,
        isMaximized: false,
        workspace: 1,
        history: [{ title: 'CHAR_SHEET.EXE', content: APP_PRESETS.about.content }],
        historyIndex: 0
    }
];

// --- Initial Icons ---
export const INITIAL_ICONS: DesktopIconDef[] = [
    { id: 'about', label: 'ABOUT.TXT', type: 'file', x: 20, y: 40 },
    { id: 'resume', label: 'RESUME.PDF', type: 'file', x: 20, y: 160 },
    { id: 'file-manager', label: 'COMPUTER', type: 'folder', x: 20, y: 280 },
    { id: 'trash', label: 'TRASH', type: 'trash', x: 20, y: 400 },
    
    { id: 'blog', label: 'CHRONICLES', type: 'news', x: 120, y: 40 }, 
    { id: 'paint', label: 'PAINT.EXE', type: 'file', x: 120, y: 160 }, 
    { id: 'contact', label: 'CONTACT', type: 'mail', x: 120, y: 280 },
    { id: 'projects', label: 'PROJECTS', type: 'folder', x: 120, y: 400 }, 

    { id: 'timeline', label: 'TIMELINE', type: 'folder', x: 220, y: 40 }, 
    { id: 'monitor', label: 'MONITOR', type: 'folder', x: 220, y: 160 },
    
    { id: 'event-editor', label: 'EVIDENCE_LOCKER', type: 'folder', x: 320, y: 40 },
    
    // New Kanban App Icon
    { id: 'kanban-board', label: 'FLOW', type: 'kanban', x: 320, y: 160 },
];

// --- Initial Widgets ---
export const INITIAL_WIDGETS: WidgetDef[] = [
    { id: 'widget-clock', type: 'clock', x: window.innerWidth - 300, y: 40, isOpen: false },
    { id: 'widget-player', type: 'player', x: window.innerWidth - 320, y: 180, isOpen: true }
];
