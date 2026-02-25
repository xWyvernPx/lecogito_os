/**
 * Desktop store — icons, widgets, selection.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DesktopIconDef, WidgetDef } from '@/types';
import { INITIAL_ICONS, INITIAL_WIDGETS } from '@/config/desktop';
import { repositionIconsInViewport, type ViewportDimensions } from '../utils/layout';
import { idbStorage } from './idb-storage';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DesktopState {
    icons: DesktopIconDef[];
    widgets: WidgetDef[];
    selectedIconId: string | null;
}

export interface DesktopActions {
    selectIcon: (id: string | null) => void;
    moveIcon: (id: string, x: number, y: number) => void;
    removeIcon: (id: string) => void;
    repositionIcons: (viewport: ViewportDimensions) => void;
    sortIcons: () => void;
    resetDesktop: () => void;
    toggleWidget: (id: string) => void;
    moveWidget: (id: string, x: number, y: number) => void;
}

export type DesktopStore = DesktopState & DesktopActions;

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useDesktopStore = create<DesktopStore>()(
    persist(
        (set) => ({
            // --- State ---
            icons: INITIAL_ICONS,
            widgets: INITIAL_WIDGETS,
            selectedIconId: null,

            // --- Actions ---

            selectIcon: (id) => set({ selectedIconId: id }),

            moveIcon: (id, x, y) =>
                set(state => ({
                    icons: state.icons.map(icon =>
                        icon.id === id ? { ...icon, x, y } : icon
                    ),
                })),

            removeIcon: (id) =>
                set(state => ({
                    icons: state.icons.filter(icon => icon.id !== id),
                })),

            repositionIcons: (viewport) =>
                set(state => ({
                    icons: repositionIconsInViewport(state.icons, viewport),
                })),

            sortIcons: () =>
                set(state => ({
                    icons: [...state.icons].sort((a, b) =>
                        a.label.localeCompare(b.label)
                    ),
                })),

            resetDesktop: () =>
                set({ icons: INITIAL_ICONS }),

            toggleWidget: (id) =>
                set(state => ({
                    widgets: state.widgets.map(w =>
                        w.id === id ? { ...w, isOpen: !w.isOpen } : w
                    ),
                })),

            moveWidget: (id, x, y) =>
                set(state => ({
                    widgets: state.widgets.map(w =>
                        w.id === id ? { ...w, x, y } : w
                    ),
                })),
        }),
        {
            name: 'designeros-desktop',
            storage: createJSONStorage(() => idbStorage),
            partialize: state => ({
                icons: state.icons,
                widgets: state.widgets,
            }),
        }
    )
);
