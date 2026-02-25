/**
 * Tests for features/os/stores/system-store.ts
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useSystemStore } from '@/features/os/stores/system-store';

const resetStore = () =>
    useSystemStore.setState(useSystemStore.getInitialState());

describe('SystemStore', () => {
    beforeEach(resetStore);

    // ------ Initial state ------------------------------------------------
    describe('initial state', () => {
        it('starts with booting state', () => {
            expect(useSystemStore.getState().systemState).toBe('booting');
        });

        it('has default theme bone', () => {
            expect(useSystemStore.getState().theme).toBe('bone');
        });

        it('has english as default language', () => {
            expect(useSystemStore.getState().language).toBe('en');
        });

        it('has caffeineLevel at 100', () => {
            expect(useSystemStore.getState().caffeineLevel).toBe(100);
        });
    });

    // ------ Lifecycle actions -------------------------------------------
    describe('lifecycle', () => {
        it('bootSystem sets booting + resets caffeine', () => {
            useSystemStore.setState({ systemState: 'running', caffeineLevel: 20 });
            useSystemStore.getState().bootSystem();
            const s = useSystemStore.getState();
            expect(s.systemState).toBe('booting');
            expect(s.caffeineLevel).toBe(100);
            expect(s.lastBootTime).toBe(0);
        });

        it('completeBoot transitions to login + sets lastBootTime', () => {
            useSystemStore.getState().completeBoot();
            const s = useSystemStore.getState();
            expect(s.systemState).toBe('login');
            expect(s.lastBootTime).toBeGreaterThan(0);
        });

        it('shutdownSystem transitions to shutdown', () => {
            useSystemStore.getState().shutdownSystem();
            expect(useSystemStore.getState().systemState).toBe('shutdown');
        });

        it('rebootSystem transitions to booting + resets caffeine', () => {
            useSystemStore.setState({ systemState: 'shutdown', caffeineLevel: 10 });
            useSystemStore.getState().rebootSystem();
            const s = useSystemStore.getState();
            expect(s.systemState).toBe('booting');
            expect(s.caffeineLevel).toBe(100);
        });
    });

    // ------ Settings actions --------------------------------------------
    describe('settings', () => {
        it('setTheme updates theme', () => {
            useSystemStore.getState().setTheme('night');
            expect(useSystemStore.getState().theme).toBe('night');
        });

        it('setLanguage updates language', () => {
            useSystemStore.getState().setLanguage('vi');
            expect(useSystemStore.getState().language).toBe('vi');
        });

        it('setWorkspace updates currentWorkspace', () => {
            useSystemStore.getState().setWorkspace(3);
            expect(useSystemStore.getState().currentWorkspace).toBe(3);
        });

        it('setCalendarConnected updates flag', () => {
            useSystemStore.getState().setCalendarConnected(true);
            expect(useSystemStore.getState().isCalendarConnected).toBe(true);
        });

        it('setDesktopSideImage updates url', () => {
            useSystemStore.getState().setDesktopSideImage('https://example.com/img.png');
            expect(useSystemStore.getState().desktopSideImage).toBe(
                'https://example.com/img.png'
            );
        });
    });

    // ------ Caffeine (easter egg) ----------------------------------------
    describe('caffeine', () => {
        it('drinkCoffee resets to 100', () => {
            useSystemStore.setState({ caffeineLevel: 10 });
            useSystemStore.getState().drinkCoffee();
            expect(useSystemStore.getState().caffeineLevel).toBe(100);
        });

        it('decreaseCaffeine reduces by 0.01', () => {
            useSystemStore.setState({ caffeineLevel: 50 });
            useSystemStore.getState().decreaseCaffeine();
            expect(useSystemStore.getState().caffeineLevel).toBeCloseTo(
                49.99,
                2
            );
        });

        it('decreaseCaffeine floors at 0', () => {
            useSystemStore.setState({ caffeineLevel: 0.005 });
            useSystemStore.getState().decreaseCaffeine();
            expect(useSystemStore.getState().caffeineLevel).toBe(0);
        });
    });

    // ------ Hydration flag -----------------------------------------------
    describe('hydration', () => {
        it('setHasHydrated updates flag', () => {
            expect(useSystemStore.getState()._hasHydrated).toBe(false);
            useSystemStore.getState().setHasHydrated(true);
            expect(useSystemStore.getState()._hasHydrated).toBe(true);
        });
    });
});
