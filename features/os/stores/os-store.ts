/**
 * Facade hook — composes all split stores for backward compatibility.
 *
 * Consumers continue to `const { spawnWindow, theme } = useOSStore();`
 * Coordinated actions (spawnWindow, login, logout, restoreWindow)
 * are wrapped here to orchestrate cross-store side effects.
 *
 * Individual stores can also be imported directly for tighter subscriptions:
 *   import { useWindowStore } from './window-store';
 *   import { useSystemStore } from './system-store';
 */
import type { WindowDef, ContentItem, UserProfile } from '@/types';
import { useWindowStore } from './window-store';
import { useDesktopStore } from './desktop-store';
import { useSystemStore } from './system-store';
import { useUserStore } from './user-store';
import { useUIStore } from './ui-store';
import { useFileSystemStore } from './filesystem-store';
import { useAuthStore } from './auth-store';

// ── Coordinated actions (module-level, stable references) ───────────
// These only use getState() — no reactive closures — so defining them
// at module level guarantees referential stability across renders.

/**
 * Spawn/reactivate a window, dismiss menus, inject workspace + viewport.
 * Signature kept identical to the old monolithic store.
 */
function spawnWindow(
    id: string,
    preset?: Partial<Omit<WindowDef, 'history' | 'historyIndex'>> & {
        content?: ContentItem[];
    }
) {
    const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
    };
    const workspace = useSystemStore.getState().currentWorkspace;
    useWindowStore.getState().spawnWindow(id, preset, workspace, viewport);
    useUIStore.getState().dismissAll();
}

/** Restore minimized window AND close the window drawer. */
function restoreWindow(id: string) {
    useWindowStore.getState().restoreWindow(id);
    useUIStore.getState().dismissAll();
}

/** Recenter all windows within current viewport. */
function recenterWindows() {
    const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
    };
    useWindowStore.getState().recenterWindows(viewport);
}

/** Reposition icons that fell outside the current viewport. */
function repositionIcons() {
    const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
    };
    useDesktopStore.getState().repositionIcons(viewport);
}

/** Login — set user session + transition system to 'running'. */
function login(user: UserProfile) {
    useUserStore.getState().login(user);
    useSystemStore.getState().setHasHydrated(true);
    useSystemStore.setState({ systemState: 'running' });
}

/** Logout — clear user session, auth tokens, system → login, dismiss menus. */
function logout() {
    useAuthStore.getState().logout();
    useUserStore.getState().logout();
    useSystemStore.setState({ systemState: 'login' });
    useUIStore.getState().setActiveMenu(null);
}

/** Sort desktop icons alphabetically. */
function sortIcons() {
    useDesktopStore.getState().sortIcons();
}

/** Reset desktop icons to default positions. */
function resetDesktop() {
    useDesktopStore.getState().resetDesktop();
}

export function useOSStore() {
    // Subscribe to every split store (same re-render granularity as old monolith)
    const windowStore = useWindowStore();
    const desktopStore = useDesktopStore();
    const systemStore = useSystemStore();
    const userStore = useUserStore();
    const uiStore = useUIStore();
    const fsStore = useFileSystemStore();

    return {
        // ── State (flat merge) ──────────────────────────────────────────
        // Window
        windows: windowStore.windows,
        nextZIndex: windowStore.nextZIndex,
        // Desktop
        icons: desktopStore.icons,
        widgets: desktopStore.widgets,
        selectedIconId: desktopStore.selectedIconId,
        // System
        systemState: systemStore.systemState,
        lastBootTime: systemStore.lastBootTime,
        _hasHydrated: systemStore._hasHydrated,
        theme: systemStore.theme,
        language: systemStore.language,
        caffeineLevel: systemStore.caffeineLevel,
        isCalendarConnected: systemStore.isCalendarConnected,
        desktopSideImage: systemStore.desktopSideImage,
        currentWorkspace: systemStore.currentWorkspace,
        // User
        currentUser: userStore.currentUser,
        knownUsers: userStore.knownUsers,
        // UI (transient)
        activeMenu: uiStore.activeMenu,
        isWindowDrawerOpen: uiStore.isWindowDrawerOpen,
        isCommandPaletteOpen: uiStore.isCommandPaletteOpen,
        isShortcutsOpen: uiStore.isShortcutsOpen,
        contextMenu: uiStore.contextMenu,
        // FileSystem
        fileSystem: fsStore.fileSystem,

        // ── Pass-through actions (no coordination needed) ───────────────
        closeWindow: windowStore.closeWindow,
        closeAllWindows: windowStore.closeAllWindows,
        focusWindow: windowStore.focusWindow,
        minimizeWindow: windowStore.minimizeWindow,
        updateWindow: windowStore.updateWindow,
        navigateWindow: windowStore.navigateWindow,
        goBack: windowStore.goBack,
        goForward: windowStore.goForward,
        toggleMaximize: windowStore.toggleMaximize,

        selectIcon: desktopStore.selectIcon,
        moveIcon: desktopStore.moveIcon,
        removeIcon: desktopStore.removeIcon,
        toggleWidget: desktopStore.toggleWidget,
        moveWidget: desktopStore.moveWidget,

        setHasHydrated: systemStore.setHasHydrated,
        bootSystem: systemStore.bootSystem,
        completeBoot: systemStore.completeBoot,
        shutdownSystem: systemStore.shutdownSystem,
        rebootSystem: systemStore.rebootSystem,
        setWorkspace: systemStore.setWorkspace,
        setTheme: systemStore.setTheme,
        setLanguage: systemStore.setLanguage,
        setCalendarConnected: systemStore.setCalendarConnected,
        setDesktopSideImage: systemStore.setDesktopSideImage,
        drinkCoffee: systemStore.drinkCoffee,
        decreaseCaffeine: systemStore.decreaseCaffeine,

        removeKnownUser: userStore.removeKnownUser,

        setActiveMenu: uiStore.setActiveMenu,
        toggleWindowDrawer: uiStore.toggleWindowDrawer,
        toggleCommandPalette: uiStore.toggleCommandPalette,
        toggleShortcuts: uiStore.toggleShortcuts,
        setCommandPalette: uiStore.setCommandPalette,
        openContextMenu: uiStore.openContextMenu,
        closeContextMenu: uiStore.closeContextMenu,

        createFile: fsStore.createFile,

        // ── Coordinated actions (stable module-level references) ────────
        spawnWindow,
        restoreWindow,
        recenterWindows,
        repositionIcons,
        login,
        logout,
        sortIcons,
        resetDesktop,
    };
}
