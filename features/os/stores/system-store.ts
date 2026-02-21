/**
 * System store — lifecycle, theme, language, workspace, integrations, easter-eggs.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SystemState, Theme, Language } from '@/types';
import { idbStorage } from './idb-storage';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SystemStoreState {
    systemState: SystemState;
    lastBootTime: number;
    _hasHydrated: boolean;
    theme: Theme;
    language: Language;
    caffeineLevel: number;
    isCalendarConnected: boolean;
    desktopSideImage: string | null;
    currentWorkspace: number;
}

export interface SystemActions {
    setHasHydrated: (val: boolean) => void;
    bootSystem: () => void;
    completeBoot: () => void;
    shutdownSystem: () => void;
    rebootSystem: () => void;
    setWorkspace: (id: number) => void;
    setTheme: (theme: Theme) => void;
    setLanguage: (lang: Language) => void;
    setCalendarConnected: (connected: boolean) => void;
    setDesktopSideImage: (url: string | null) => void;
    drinkCoffee: () => void;
    decreaseCaffeine: () => void;
}

export type SystemStore = SystemStoreState & SystemActions;

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSystemStore = create<SystemStore>()(
    persist(
        (set) => ({
            // --- State ---
            systemState: 'booting',
            lastBootTime: 0,
            _hasHydrated: false,
            theme: 'bone',
            language: 'en',
            caffeineLevel: 100,
            isCalendarConnected: false,
            desktopSideImage: null,
            currentWorkspace: 1,

            // --- Actions ---

            setHasHydrated: (val) => set({ _hasHydrated: val }),

            bootSystem: () =>
                set({
                    systemState: 'booting',
                    lastBootTime: 0,
                    caffeineLevel: 100,
                }),

            completeBoot: () =>
                set({ systemState: 'login', lastBootTime: Date.now() }),

            shutdownSystem: () => set({ systemState: 'shutdown' }),

            rebootSystem: () =>
                set({ systemState: 'booting', caffeineLevel: 100 }),

            setWorkspace: (id) => set({ currentWorkspace: id }),
            setTheme: (theme) => set({ theme }),
            setLanguage: (lang) => set({ language: lang }),
            setCalendarConnected: (connected) =>
                set({ isCalendarConnected: connected }),
            setDesktopSideImage: (url) => set({ desktopSideImage: url }),

            drinkCoffee: () => set({ caffeineLevel: 100 }),
            decreaseCaffeine: () =>
                set(state => ({
                    caffeineLevel: Math.max(0, state.caffeineLevel - 0.01),
                })),
        }),
        {
            name: 'designeros-system',
            storage: createJSONStorage(() => idbStorage),
            partialize: state => ({
                systemState: state.systemState,
                lastBootTime: state.lastBootTime,
                theme: state.theme,
                language: state.language,
                caffeineLevel: state.caffeineLevel,
                isCalendarConnected: state.isCalendarConnected,
                desktopSideImage: state.desktopSideImage,
                currentWorkspace: state.currentWorkspace,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
