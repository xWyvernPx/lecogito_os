/**
 * Tests for features/os/stores/os-store.ts (facade hook)
 *
 * Verifies:
 * 1. Coordinated actions are module-level stable references
 * 2. They correctly orchestrate cross-store effects
 * 3. The facade exposes all expected state/actions
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOSStore } from '@/features/os/stores/os-store';
import { useWindowStore } from '@/features/os/stores/window-store';
import { useDesktopStore } from '@/features/os/stores/desktop-store';
import { useSystemStore } from '@/features/os/stores/system-store';
import { useUserStore } from '@/features/os/stores/user-store';
import { useUIStore } from '@/features/os/stores/ui-store';
import { useFileSystemStore } from '@/features/os/stores/filesystem-store';
import type { UserProfile } from '@/types';

const resetAll = () => {
    useWindowStore.setState(useWindowStore.getInitialState());
    useDesktopStore.setState(useDesktopStore.getInitialState());
    useSystemStore.setState(useSystemStore.getInitialState());
    useUserStore.setState(useUserStore.getInitialState());
    useUIStore.setState(useUIStore.getInitialState());
    useFileSystemStore.setState(useFileSystemStore.getInitialState());
};

describe('useOSStore (facade)', () => {
    beforeEach(resetAll);

    // ------ Reference stability (the infinite-loop fix) ------------------
    describe('coordinated action stability', () => {
        it('recenterWindows has the same reference across renders', () => {
            const { result, rerender } = renderHook(() => useOSStore());
            const ref1 = result.current.recenterWindows;
            rerender();
            const ref2 = result.current.recenterWindows;
            expect(ref1).toBe(ref2);
        });

        it('repositionIcons has the same reference across renders', () => {
            const { result, rerender } = renderHook(() => useOSStore());
            const ref1 = result.current.repositionIcons;
            rerender();
            expect(result.current.repositionIcons).toBe(ref1);
        });

        it('spawnWindow has the same reference across renders', () => {
            const { result, rerender } = renderHook(() => useOSStore());
            const ref1 = result.current.spawnWindow;
            rerender();
            expect(result.current.spawnWindow).toBe(ref1);
        });

        it('login has the same reference across renders', () => {
            const { result, rerender } = renderHook(() => useOSStore());
            const ref1 = result.current.login;
            rerender();
            expect(result.current.login).toBe(ref1);
        });

        it('logout has the same reference across renders', () => {
            const { result, rerender } = renderHook(() => useOSStore());
            const ref1 = result.current.logout;
            rerender();
            expect(result.current.logout).toBe(ref1);
        });
    });

    // ------ Coordinated action orchestration -----------------------------
    describe('spawnWindow', () => {
        it('creates a window and dismisses UI', () => {
            useUIStore.setState({ isWindowDrawerOpen: true, activeMenu: 'file' });
            const { result } = renderHook(() => useOSStore());
            act(() => {
                result.current.spawnWindow('test-app');
            });
            expect(useWindowStore.getState().windows.some(w => w.id === 'test-app')).toBe(true);
            expect(useUIStore.getState().isWindowDrawerOpen).toBe(false);
            expect(useUIStore.getState().activeMenu).toBeNull();
        });
    });

    describe('restoreWindow', () => {
        it('restores window and dismisses UI', () => {
            // Spawn then minimize
            useWindowStore.getState().spawnWindow('w1', undefined, 1, { width: 1920, height: 1080 });
            useWindowStore.getState().minimizeWindow('w1');
            useUIStore.setState({ isWindowDrawerOpen: true });

            const { result } = renderHook(() => useOSStore());
            act(() => {
                result.current.restoreWindow('w1');
            });
            const win = useWindowStore.getState().windows.find(w => w.id === 'w1')!;
            expect(win.isMinimized).toBe(false);
            expect(useUIStore.getState().isWindowDrawerOpen).toBe(false);
        });
    });

    describe('login', () => {
        it('sets user on user-store and hydrated on system-store', () => {
            const user: UserProfile = {
                id: '1',
                name: 'Test',
                avatar: '',
                type: 'user',
            };
            const { result } = renderHook(() => useOSStore());
            act(() => {
                result.current.login(user);
            });
            expect(useUserStore.getState().currentUser).toEqual(user);
            expect(useSystemStore.getState()._hasHydrated).toBe(true);
            expect(useSystemStore.getState().systemState).toBe('running');
        });
    });

    describe('logout', () => {
        it('clears user and transitions to login', () => {
            useUserStore.setState({
                currentUser: { id: '1', name: 'T', avatar: '', type: 'user' },
            });
            useSystemStore.setState({ systemState: 'running' });

            const { result } = renderHook(() => useOSStore());
            act(() => {
                result.current.logout();
            });
            expect(useUserStore.getState().currentUser).toBeNull();
            expect(useSystemStore.getState().systemState).toBe('login');
        });
    });

    describe('sortIcons', () => {
        it('delegates to desktop store', () => {
            useDesktopStore.setState({
                icons: [
                    { id: '1', label: 'Z', type: 'file', x: 0, y: 0 },
                    { id: '2', label: 'A', type: 'file', x: 0, y: 0 },
                ],
            });
            const { result } = renderHook(() => useOSStore());
            act(() => {
                result.current.sortIcons();
            });
            expect(useDesktopStore.getState().icons[0].label).toBe('A');
        });
    });

    describe('resetDesktop', () => {
        it('delegates to desktop store', () => {
            useDesktopStore.setState({ icons: [] });
            const { result } = renderHook(() => useOSStore());
            act(() => {
                result.current.resetDesktop();
            });
            expect(useDesktopStore.getState().icons.length).toBeGreaterThan(0);
        });
    });

    // ------ State passthrough -------------------------------------------
    describe('state passthrough', () => {
        it('exposes window state from window-store', () => {
            const { result } = renderHook(() => useOSStore());
            expect(result.current.windows).toBeDefined();
            expect(result.current.nextZIndex).toBeDefined();
        });

        it('exposes system state from system-store', () => {
            const { result } = renderHook(() => useOSStore());
            expect(result.current.systemState).toBe('booting');
            expect(result.current.theme).toBe('bone');
        });

        it('exposes UI state from ui-store', () => {
            const { result } = renderHook(() => useOSStore());
            expect(result.current.isWindowDrawerOpen).toBe(false);
            expect(result.current.contextMenu).toBeDefined();
        });
    });
});
