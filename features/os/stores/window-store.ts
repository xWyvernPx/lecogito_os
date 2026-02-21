/**
 * Window management store — windows, z-index, focus, navigation, sizing.
 * Pure window logic; no UI-store side effects (coordinated by facade).
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WindowDef, ContentItem, WindowHistoryItem } from '@/types';
import { APP_PRESETS } from '@/config/apps';
import { INITIAL_WINDOWS } from '@/config/desktop';
import { idbStorage } from './idb-storage';
import {
    clampPosition,
    calculateWindowPosition,
    type ViewportDimensions,
} from '../utils/layout';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WindowState {
    windows: WindowDef[];
    nextZIndex: number;
}

export interface WindowActions {
    /**
     * Spawn or reactivate a window.
     * `currentWorkspace` and `viewport` are injected by the facade.
     */
    spawnWindow: (
        id: string,
        preset:
            | (Partial<Omit<WindowDef, 'history' | 'historyIndex'>> & {
                  content?: ContentItem[];
              })
            | undefined,
        currentWorkspace: number,
        viewport: ViewportDimensions
    ) => void;
    closeWindow: (id: string) => void;
    closeAllWindows: () => void;
    focusWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    /**
     * Restore a minimized window. UI-drawer dismissal handled by facade.
     */
    restoreWindow: (id: string) => void;
    updateWindow: (id: string, updates: Partial<WindowDef>) => void;
    recenterWindows: (viewport: ViewportDimensions) => void;
    navigateWindow: (id: string, view: WindowHistoryItem) => void;
    goBack: (id: string) => void;
    goForward: (id: string) => void;
    toggleMaximize: (id: string) => void;
}

export type WindowStore = WindowState & WindowActions;

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useWindowStore = create<WindowStore>()(
    persist(
        (set, get) => ({
            // --- State ---
            windows: INITIAL_WINDOWS,
            nextZIndex: 11,

            // --- Actions ---

            spawnWindow: (id, preset, currentWorkspace, viewport) => {
                const { windows, nextZIndex } = get();
                const existing = windows.find(w => w.id === id);

                if (existing) {
                    const updates: Partial<WindowDef> & Record<string, unknown> = {
                        zIndex: nextZIndex,
                        isActive: true,
                        isMinimized: false,
                        workspace: currentWorkspace,
                    };

                    if (preset?.content) {
                        const newHistoryItem = {
                            title: preset.title || existing.title,
                            content: preset.content,
                        };
                        updates.history = [...existing.history, newHistoryItem];
                        updates.historyIndex = existing.historyIndex + 1;
                        updates.title = preset.title || existing.title;
                    }

                    set({
                        windows: windows.map(w =>
                            w.id === id
                                ? { ...w, ...updates }
                                : { ...w, isActive: false }
                        ),
                        nextZIndex: nextZIndex + 1,
                    });
                    return;
                }

                // New window
                const appData = APP_PRESETS[id] || {
                    title: 'UNTITLED',
                    content: [],
                };
                const initialContent =
                    preset?.content || appData.content;
                const initialTitle =
                    preset?.title || appData.title;

                const { x, y, w, h, shouldMaximize } =
                    calculateWindowPosition(id, viewport, preset);

                const newWin: WindowDef = {
                    id,
                    title: initialTitle,
                    x,
                    y,
                    w,
                    h,
                    zIndex: nextZIndex,
                    isActive: true,
                    isMinimized: false,
                    isMaximized: shouldMaximize,
                    workspace: currentWorkspace,
                    history: [
                        {
                            title: initialTitle,
                            content: initialContent,
                        },
                    ],
                    historyIndex: 0,
                    ...preset,
                };

                set({
                    windows: [
                        ...windows.map(w => ({
                            ...w,
                            isActive: false,
                        })),
                        newWin,
                    ],
                    nextZIndex: nextZIndex + 1,
                });
            },

            closeWindow: id =>
                set(state => ({
                    windows: state.windows.filter(w => w.id !== id),
                })),

            closeAllWindows: () => set({ windows: [] }),

            focusWindow: id => {
                const { nextZIndex } = get();
                set(state => ({
                    windows: state.windows.map(w =>
                        w.id === id
                            ? {
                                  ...w,
                                  zIndex: nextZIndex,
                                  isActive: true,
                                  isMinimized: false,
                              }
                            : { ...w, isActive: false }
                    ),
                    nextZIndex: nextZIndex + 1,
                }));
            },

            minimizeWindow: id =>
                set(state => ({
                    windows: state.windows.map(w =>
                        w.id === id
                            ? { ...w, isMinimized: true, isActive: false }
                            : w
                    ),
                })),

            restoreWindow: id => {
                const { nextZIndex } = get();
                set(state => ({
                    windows: state.windows.map(w =>
                        w.id === id
                            ? {
                                  ...w,
                                  isMinimized: false,
                                  isActive: true,
                                  zIndex: nextZIndex,
                              }
                            : { ...w, isActive: false }
                    ),
                    nextZIndex: nextZIndex + 1,
                }));
            },

            updateWindow: (id, updates) =>
                set(state => ({
                    windows: state.windows.map(w => {
                        if (w.id !== id) return w;

                        const newW = updates.w ?? w.w;
                        const newH = updates.h ?? w.h;
                        const newX = updates.x ?? w.x;
                        const newY = updates.y ?? w.y;
                        const viewport: ViewportDimensions = {
                            width: window.innerWidth,
                            height: window.innerHeight,
                        };
                        const clamped = clampPosition(
                            newX,
                            newY,
                            newW,
                            newH,
                            viewport
                        );

                        return { ...w, ...updates, ...clamped };
                    }),
                })),

            recenterWindows: viewport =>
                set(state => ({
                    windows: state.windows.map(w => {
                        const safeW = Math.min(w.w, viewport.width);
                        const safeH = Math.min(
                            w.h,
                            viewport.height - 36
                        );
                        const { x, y } = clampPosition(
                            w.x,
                            w.y,
                            safeW,
                            safeH,
                            viewport
                        );
                        return { ...w, x, y, w: safeW, h: safeH };
                    }),
                })),

            navigateWindow: (id, view) =>
                set(state => ({
                    windows: state.windows.map(w => {
                        if (w.id !== id) return w;
                        const newHistory = w.history.slice(
                            0,
                            w.historyIndex + 1
                        );
                        return {
                            ...w,
                            history: [...newHistory, view],
                            historyIndex: newHistory.length,
                            title: view.title,
                        };
                    }),
                })),

            goBack: id =>
                set(state => ({
                    windows: state.windows.map(w => {
                        if (w.id !== id || w.historyIndex <= 0) return w;
                        const newIndex = w.historyIndex - 1;
                        return {
                            ...w,
                            historyIndex: newIndex,
                            title: w.history[newIndex].title,
                        };
                    }),
                })),

            goForward: id =>
                set(state => ({
                    windows: state.windows.map(w => {
                        if (
                            w.id !== id ||
                            w.historyIndex >= w.history.length - 1
                        )
                            return w;
                        const newIndex = w.historyIndex + 1;
                        return {
                            ...w,
                            historyIndex: newIndex,
                            title: w.history[newIndex].title,
                        };
                    }),
                })),

            toggleMaximize: id =>
                set(state => ({
                    windows: state.windows.map(w =>
                        w.id === id
                            ? { ...w, isMaximized: !w.isMaximized }
                            : w
                    ),
                })),
        }),
        {
            name: 'designeros-windows',
            storage: createJSONStorage(() => idbStorage),
            partialize: state => ({
                windows: state.windows,
                nextZIndex: state.nextZIndex,
            }),
        }
    )
);
