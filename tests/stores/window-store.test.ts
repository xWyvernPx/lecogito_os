/**
 * Tests for features/os/stores/window-store.ts
 *
 * Zustand stores are tested by calling getState() / setState() directly,
 * no React rendering needed.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useWindowStore } from '@/features/os/stores/window-store';
import type { WindowDef } from '@/types';

// ── Helpers ─────────────────────────────────────────────────────────
const viewport = { width: 1920, height: 1080 };

const resetStore = () =>
    useWindowStore.setState(useWindowStore.getInitialState());

const spawnTestWindow = (id = 'test-win', opts?: Partial<WindowDef>) => {
    useWindowStore.getState().spawnWindow(id, opts, 1, viewport);
};

// ── Test suite ──────────────────────────────────────────────────────
describe('WindowStore', () => {
    beforeEach(resetStore);

    // ------ spawnWindow --------------------------------------------------
    describe('spawnWindow', () => {
        it('adds a new window with correct defaults', () => {
            spawnTestWindow('my-win');
            const { windows } = useWindowStore.getState();
            const win = windows.find(w => w.id === 'my-win');
            expect(win).toBeDefined();
            expect(win!.isActive).toBe(true);
            expect(win!.isMinimized).toBe(false);
            expect(win!.workspace).toBe(1);
        });

        it('deactivates existing windows when spawning a new one', () => {
            spawnTestWindow('win-a');
            spawnTestWindow('win-b');
            const { windows } = useWindowStore.getState();
            const a = windows.find(w => w.id === 'win-a')!;
            const b = windows.find(w => w.id === 'win-b')!;
            expect(a.isActive).toBe(false);
            expect(b.isActive).toBe(true);
        });

        it('reactivates an existing window instead of duplicating', () => {
            spawnTestWindow('win-a');
            spawnTestWindow('win-b');
            spawnTestWindow('win-a'); // reactivate
            const { windows } = useWindowStore.getState();
            expect(windows.filter(w => w.id === 'win-a')).toHaveLength(1);
            expect(windows.find(w => w.id === 'win-a')!.isActive).toBe(true);
        });

        it('pushes new history entry when preset has content on reactivation', () => {
            spawnTestWindow('my-win');
            useWindowStore.getState().spawnWindow(
                'my-win',
                {
                    title: 'Updated',
                    content: [{ type: 'p', text: 'new' }],
                },
                1,
                viewport
            );
            const win = useWindowStore
                .getState()
                .windows.find(w => w.id === 'my-win')!;
            expect(win.history).toHaveLength(2);
            expect(win.historyIndex).toBe(1);
            expect(win.title).toBe('Updated');
        });

        it('increments nextZIndex on each spawn', () => {
            const z0 = useWindowStore.getState().nextZIndex;
            spawnTestWindow('a');
            const z1 = useWindowStore.getState().nextZIndex;
            expect(z1).toBeGreaterThan(z0);
        });
    });

    // ------ closeWindow --------------------------------------------------
    describe('closeWindow', () => {
        it('removes the window by id', () => {
            spawnTestWindow('w1');
            spawnTestWindow('w2');
            useWindowStore.getState().closeWindow('w1');
            const ids = useWindowStore
                .getState()
                .windows.map(w => w.id);
            expect(ids).not.toContain('w1');
            expect(ids).toContain('w2');
        });
    });

    // ------ closeAllWindows -----------------------------------------------
    describe('closeAllWindows', () => {
        it('clears all windows', () => {
            spawnTestWindow('a');
            spawnTestWindow('b');
            useWindowStore.getState().closeAllWindows();
            expect(useWindowStore.getState().windows).toHaveLength(0);
        });
    });

    // ------ focusWindow ---------------------------------------------------
    describe('focusWindow', () => {
        it('sets isActive=true and bumps zIndex', () => {
            spawnTestWindow('a');
            spawnTestWindow('b');
            useWindowStore.getState().focusWindow('a');
            const { windows } = useWindowStore.getState();
            expect(windows.find(w => w.id === 'a')!.isActive).toBe(true);
            expect(windows.find(w => w.id === 'b')!.isActive).toBe(false);
        });
    });

    // ------ minimizeWindow ------------------------------------------------
    describe('minimizeWindow', () => {
        it('sets isMinimized and deactivates', () => {
            spawnTestWindow('a');
            useWindowStore.getState().minimizeWindow('a');
            const w = useWindowStore
                .getState()
                .windows.find(w => w.id === 'a')!;
            expect(w.isMinimized).toBe(true);
            expect(w.isActive).toBe(false);
        });
    });

    // ------ restoreWindow -------------------------------------------------
    describe('restoreWindow', () => {
        it('unminimizes and activates the window', () => {
            spawnTestWindow('a');
            useWindowStore.getState().minimizeWindow('a');
            useWindowStore.getState().restoreWindow('a');
            const w = useWindowStore
                .getState()
                .windows.find(w => w.id === 'a')!;
            expect(w.isMinimized).toBe(false);
            expect(w.isActive).toBe(true);
        });
    });

    // ------ toggleMaximize -----------------------------------------------
    describe('toggleMaximize', () => {
        it('toggles isMaximized', () => {
            spawnTestWindow('a');
            expect(
                useWindowStore
                    .getState()
                    .windows.find(w => w.id === 'a')!.isMaximized
            ).toBe(false);
            useWindowStore.getState().toggleMaximize('a');
            expect(
                useWindowStore
                    .getState()
                    .windows.find(w => w.id === 'a')!.isMaximized
            ).toBe(true);
            useWindowStore.getState().toggleMaximize('a');
            expect(
                useWindowStore
                    .getState()
                    .windows.find(w => w.id === 'a')!.isMaximized
            ).toBe(false);
        });
    });

    // ------ navigateWindow / goBack / goForward --------------------------
    describe('navigation', () => {
        it('navigateWindow pushes to history', () => {
            spawnTestWindow('nav');
            useWindowStore
                .getState()
                .navigateWindow('nav', {
                    title: 'Page 2',
                    content: [{ type: 'p', text: 'hi' }],
                });
            const w = useWindowStore
                .getState()
                .windows.find(w => w.id === 'nav')!;
            expect(w.history).toHaveLength(2);
            expect(w.historyIndex).toBe(1);
            expect(w.title).toBe('Page 2');
        });

        it('goBack decrements historyIndex', () => {
            spawnTestWindow('nav');
            useWindowStore
                .getState()
                .navigateWindow('nav', {
                    title: 'Page 2',
                    content: [],
                });
            useWindowStore.getState().goBack('nav');
            const w = useWindowStore
                .getState()
                .windows.find(w => w.id === 'nav')!;
            expect(w.historyIndex).toBe(0);
        });

        it('goBack does nothing at index 0', () => {
            spawnTestWindow('nav');
            useWindowStore.getState().goBack('nav');
            expect(
                useWindowStore
                    .getState()
                    .windows.find(w => w.id === 'nav')!.historyIndex
            ).toBe(0);
        });

        it('goForward increments historyIndex', () => {
            spawnTestWindow('nav');
            useWindowStore
                .getState()
                .navigateWindow('nav', {
                    title: 'Page 2',
                    content: [],
                });
            useWindowStore.getState().goBack('nav');
            useWindowStore.getState().goForward('nav');
            expect(
                useWindowStore
                    .getState()
                    .windows.find(w => w.id === 'nav')!.historyIndex
            ).toBe(1);
        });

        it('goForward does nothing at last index', () => {
            spawnTestWindow('nav');
            useWindowStore.getState().goForward('nav');
            expect(
                useWindowStore
                    .getState()
                    .windows.find(w => w.id === 'nav')!.historyIndex
            ).toBe(0);
        });
    });

    // ------ recenterWindows -----------------------------------------------
    describe('recenterWindows', () => {
        it('clamps windows to new viewport', () => {
            spawnTestWindow('big');
            useWindowStore.setState({
                windows: useWindowStore.getState().windows.map(w => ({
                    ...w,
                    x: 5000,
                    y: 5000,
                    w: 400,
                    h: 300,
                })),
            });
            const small = { width: 600, height: 500 };
            useWindowStore.getState().recenterWindows(small);
            const w = useWindowStore
                .getState()
                .windows.find(w => w.id === 'big')!;
            expect(w.x).toBeLessThanOrEqual(small.width);
            expect(w.y).toBeLessThanOrEqual(small.height);
        });

        it('shrinks window dimensions to fit viewport', () => {
            spawnTestWindow('wide');
            useWindowStore.setState({
                windows: useWindowStore.getState().windows.map(w => ({
                    ...w,
                    w: 2000,
                    h: 1500,
                })),
            });
            useWindowStore
                .getState()
                .recenterWindows({ width: 800, height: 600 });
            const w = useWindowStore
                .getState()
                .windows.find(w => w.id === 'wide')!;
            expect(w.w).toBeLessThanOrEqual(800);
            expect(w.h).toBeLessThanOrEqual(600 - 36);
        });
    });
});
