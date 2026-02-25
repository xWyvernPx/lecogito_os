/**
 * Tests for features/os/stores/ui-store.ts
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '@/features/os/stores/ui-store';

const resetStore = () =>
    useUIStore.setState(useUIStore.getInitialState());

describe('UIStore', () => {
    beforeEach(resetStore);

    // ------ Initial state ------------------------------------------------
    describe('initial state', () => {
        it('has no active menu', () => {
            expect(useUIStore.getState().activeMenu).toBeNull();
        });

        it('has all drawers/palettes closed', () => {
            const s = useUIStore.getState();
            expect(s.isWindowDrawerOpen).toBe(false);
            expect(s.isCommandPaletteOpen).toBe(false);
            expect(s.isShortcutsOpen).toBe(false);
        });

        it('has context menu closed', () => {
            expect(useUIStore.getState().contextMenu.isOpen).toBe(false);
        });
    });

    // ------ setActiveMenu ------------------------------------------------
    describe('setActiveMenu', () => {
        it('sets the active menu', () => {
            useUIStore.getState().setActiveMenu('file');
            expect(useUIStore.getState().activeMenu).toBe('file');
        });

        it('clears the active menu with null', () => {
            useUIStore.getState().setActiveMenu('file');
            useUIStore.getState().setActiveMenu(null);
            expect(useUIStore.getState().activeMenu).toBeNull();
        });
    });

    // ------ Toggle actions -----------------------------------------------
    describe('toggles', () => {
        it('toggleWindowDrawer flips isWindowDrawerOpen', () => {
            expect(useUIStore.getState().isWindowDrawerOpen).toBe(false);
            useUIStore.getState().toggleWindowDrawer();
            expect(useUIStore.getState().isWindowDrawerOpen).toBe(true);
            useUIStore.getState().toggleWindowDrawer();
            expect(useUIStore.getState().isWindowDrawerOpen).toBe(false);
        });

        it('toggleCommandPalette flips isCommandPaletteOpen', () => {
            useUIStore.getState().toggleCommandPalette();
            expect(useUIStore.getState().isCommandPaletteOpen).toBe(true);
        });

        it('toggleShortcuts flips isShortcutsOpen', () => {
            useUIStore.getState().toggleShortcuts();
            expect(useUIStore.getState().isShortcutsOpen).toBe(true);
        });
    });

    // ------ setCommandPalette --------------------------------------------
    describe('setCommandPalette', () => {
        it('sets command palette to specific state', () => {
            useUIStore.getState().setCommandPalette(true);
            expect(useUIStore.getState().isCommandPaletteOpen).toBe(true);
            useUIStore.getState().setCommandPalette(false);
            expect(useUIStore.getState().isCommandPaletteOpen).toBe(false);
        });
    });

    // ------ Context menu -------------------------------------------------
    describe('context menu', () => {
        it('openContextMenu sets position, type, and isOpen', () => {
            useUIStore
                .getState()
                .openContextMenu(200, 300, 'desktop');
            const ctx = useUIStore.getState().contextMenu;
            expect(ctx.isOpen).toBe(true);
            expect(ctx.x).toBe(200);
            expect(ctx.y).toBe(300);
            expect(ctx.type).toBe('desktop');
        });

        it('openContextMenu with targetId', () => {
            useUIStore
                .getState()
                .openContextMenu(100, 100, 'icon', 'my-icon');
            expect(useUIStore.getState().contextMenu.targetId).toBe(
                'my-icon'
            );
        });

        it('closeContextMenu sets isOpen=false but keeps other data', () => {
            useUIStore
                .getState()
                .openContextMenu(200, 300, 'desktop');
            useUIStore.getState().closeContextMenu();
            const ctx = useUIStore.getState().contextMenu;
            expect(ctx.isOpen).toBe(false);
            expect(ctx.x).toBe(200); // Preserved
        });
    });

    // ------ dismissAll ---------------------------------------------------
    describe('dismissAll', () => {
        it('resets activeMenu, drawers, and palettes', () => {
            useUIStore.setState({
                activeMenu: 'file',
                isWindowDrawerOpen: true,
                isCommandPaletteOpen: true,
                isShortcutsOpen: true,
            });
            useUIStore.getState().dismissAll();
            const s = useUIStore.getState();
            expect(s.activeMenu).toBeNull();
            expect(s.isWindowDrawerOpen).toBe(false);
            expect(s.isCommandPaletteOpen).toBe(false);
            expect(s.isShortcutsOpen).toBe(false);
        });
    });
});
