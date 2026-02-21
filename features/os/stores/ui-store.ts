/**
 * UI store — transient UI state (menus, drawers, command palette, shortcuts, context menu).
 * NOT persisted — resets on page reload.
 */
import { create } from 'zustand';
import type { ContextMenuState, ContextMenuType } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UIState {
    activeMenu: string | null;
    isWindowDrawerOpen: boolean;
    isCommandPaletteOpen: boolean;
    isShortcutsOpen: boolean;
    contextMenu: ContextMenuState;
}

export interface UIActions {
    setActiveMenu: (menu: string | null) => void;
    toggleWindowDrawer: () => void;
    toggleCommandPalette: () => void;
    toggleShortcuts: () => void;
    setCommandPalette: (isOpen: boolean) => void;
    openContextMenu: (
        x: number,
        y: number,
        type: ContextMenuType,
        targetId?: string
    ) => void;
    closeContextMenu: () => void;
    /** Dismiss all menus, drawers, palettes — used by facade for cross-store coordination. */
    dismissAll: () => void;
}

export type UIStore = UIState & UIActions;

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useUIStore = create<UIStore>()((set) => ({
    // --- State ---
    activeMenu: null,
    isWindowDrawerOpen: false,
    isCommandPaletteOpen: false,
    isShortcutsOpen: false,
    contextMenu: { isOpen: false, x: 0, y: 0, type: null },

    // --- Actions ---

    setActiveMenu: (menu) => set({ activeMenu: menu }),

    toggleWindowDrawer: () =>
        set(state => ({
            isWindowDrawerOpen: !state.isWindowDrawerOpen,
        })),

    toggleCommandPalette: () =>
        set(state => ({
            isCommandPaletteOpen: !state.isCommandPaletteOpen,
        })),

    toggleShortcuts: () =>
        set(state => ({ isShortcutsOpen: !state.isShortcutsOpen })),

    setCommandPalette: (isOpen) => set({ isCommandPaletteOpen: isOpen }),

    openContextMenu: (x, y, type, targetId) =>
        set({ contextMenu: { isOpen: true, x, y, type, targetId } }),

    closeContextMenu: () =>
        set(state => ({
            contextMenu: { ...state.contextMenu, isOpen: false },
        })),

    dismissAll: () =>
        set({
            activeMenu: null,
            isWindowDrawerOpen: false,
            isCommandPaletteOpen: false,
            isShortcutsOpen: false,
        }),
}));
