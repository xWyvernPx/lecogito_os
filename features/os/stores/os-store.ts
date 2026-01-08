
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import { WindowDef, ContentItem, DesktopIconDef, SystemState, ContextMenuState, ContextMenuType, WidgetDef, WindowHistoryItem, UserProfile, Theme, Language, FileSystemNode } from '../../../types';
import { APP_PRESETS } from '../../../config/apps';
import { INITIAL_ICONS, INITIAL_WIDGETS, INITIAL_WINDOWS } from '../../../config/desktop';
import { LOCAL_FS } from '../../../config/terminal';
import { useAuthStore } from './auth-store';

interface OSState {
  // System Lifecycle
  systemState: SystemState;
  lastBootTime: number;
  _hasHydrated: boolean;
  
  // User Session
  currentUser: UserProfile | null;
  knownUsers: UserProfile[]; // Persist users for quick login

  // Desktop State
  windows: WindowDef[];
  icons: DesktopIconDef[];
  widgets: WidgetDef[];
  fileSystem: FileSystemNode; // Dynamic File System
  nextZIndex: number;
  currentWorkspace: number;
  activeMenu: string | null;
  selectedIconId: string | null;
  theme: Theme;
  language: Language;
  isWindowDrawerOpen: boolean;
  isCommandPaletteOpen: boolean;
  isShortcutsOpen: boolean;
  desktopSideImage: string | null;
  
  // Integrations
  isCalendarConnected: boolean;
  
  // Easter Eggs
  caffeineLevel: number; // 0 to 100

  // Context Menu State
  contextMenu: ContextMenuState;

  // Lifecycle Actions
  setHasHydrated: (val: boolean) => void;
  bootSystem: () => void;
  completeBoot: () => void;
  shutdownSystem: () => void;
  rebootSystem: () => void;
  
  // Auth Actions
  login: (user: UserProfile) => void;
  logout: () => void;
  removeKnownUser: (id: number) => void;

  // Window Actions
  spawnWindow: (id: string, preset?: Partial<Omit<WindowDef, 'history' | 'historyIndex'>> & { content?: ContentItem[] }) => void;
  closeWindow: (id: string) => void;
  closeAllWindows: () => void; 
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void; 
  restoreWindow: (id: string) => void; 
  updateWindow: (id: string, updates: Partial<WindowDef>) => void;
  recenterWindows: () => void;
  repositionIcons: () => void;
  
  // Navigation & Sizing Actions
  navigateWindow: (id: string, view: WindowHistoryItem) => void;
  goBack: (id: string) => void;
  goForward: (id: string) => void;
  toggleMaximize: (id: string) => void;

  // System Actions
  setWorkspace: (id: number) => void;
  setActiveMenu: (menu: string | null) => void;
  toggleWindowDrawer: () => void;
  toggleCommandPalette: () => void;
  toggleShortcuts: () => void;
  setCommandPalette: (isOpen: boolean) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  setCalendarConnected: (connected: boolean) => void;
  setDesktopSideImage: (url: string | null) => void;
  
  // File System Actions
  createFile: (parentPath: string[], fileName: string, node: FileSystemNode) => void;
  
  // Icon Actions
  selectIcon: (id: string | null) => void;
  moveIcon: (id: string, x: number, y: number) => void;
  removeIcon: (id: string) => void;

  // Widget Actions
  toggleWidget: (id: string) => void;
  moveWidget: (id: string, x: number, y: number) => void;

  // Caffeine Actions
  drinkCoffee: () => void;
  decreaseCaffeine: () => void;

  // Context Menu Actions
  openContextMenu: (x: number, y: number, type: ContextMenuType, targetId?: string) => void;
  closeContextMenu: () => void;
}

const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

// --- Helper: Clamp Window Position ---
const clampPosition = (x: number, y: number, w: number, h: number) => {
    const TOP_BAR_HEIGHT = 36;
    const maxX = Math.max(0, window.innerWidth - w);
    const maxY = Math.max(0, window.innerHeight - h - TOP_BAR_HEIGHT);
    return {
        x: Math.max(0, Math.min(x, maxX)),
        y: Math.max(0, Math.min(y, maxY))
    };
};

export const useOSStore = create<OSState>()(
  persist(
    (set, get) => ({
      systemState: 'booting',
      lastBootTime: 0,
      _hasHydrated: false,
      currentUser: null,
      knownUsers: [],

      windows: INITIAL_WINDOWS,
      icons: INITIAL_ICONS,
      widgets: INITIAL_WIDGETS,
      fileSystem: LOCAL_FS, // Initialize with default config
      nextZIndex: 11,
      currentWorkspace: 1,
      activeMenu: null,
      selectedIconId: null,
      theme: 'bone',
      language: 'en',
      isWindowDrawerOpen: false,
      isCommandPaletteOpen: false,
      isShortcutsOpen: false,
      isCalendarConnected: false,
      desktopSideImage: null,
      
      caffeineLevel: 100,

      contextMenu: { isOpen: false, x: 0, y: 0, type: null },

      setHasHydrated: (val) => set({ _hasHydrated: val }),
      
      bootSystem: () => set({ systemState: 'booting', lastBootTime: 0, caffeineLevel: 100 }),
      completeBoot: () => set({ systemState: 'login', lastBootTime: Date.now() }),
      shutdownSystem: () => set({ systemState: 'shutdown' }),
      rebootSystem: () => set({ systemState: 'booting', caffeineLevel: 100 }),

      login: (user) => set(state => {
          // Add to known users if not guest and not already in list
          let newKnownUsers = state.knownUsers;
          if (user.type !== 'guest') {
              const exists = state.knownUsers.some(u => u.id === user.id);
              if (!exists) {
                  newKnownUsers = [...state.knownUsers, user];
              } else {
                  // Update existing user data (e.g. avatar change)
                  newKnownUsers = state.knownUsers.map(u => u.id === user.id ? user : u);
              }
          }
          
          return { 
              systemState: 'running', 
              currentUser: user,
              knownUsers: newKnownUsers
          };
      }),
      
      logout: () => {
          // Also logout from auth store
          const authLogout = useAuthStore.getState().logout;
          authLogout();
          
          set({ systemState: 'login', currentUser: null, activeMenu: null });
      },
      
      removeKnownUser: (id: number) => set(state => ({
          knownUsers: state.knownUsers.filter(u => u.id !== id)
      })),

      spawnWindow: (id, preset) => {
        const { windows, nextZIndex, currentWorkspace } = get();
        const existing = windows.find(w => w.id === id);

        if (existing) {
          const updates: any = { 
             zIndex: nextZIndex, 
             isActive: true, 
             isMinimized: false, 
             workspace: currentWorkspace 
          };

          if (preset?.content) {
             const newHistoryItem = { 
                 title: preset.title || existing.title, 
                 content: preset.content 
             };
             updates.history = [...existing.history, newHistoryItem];
             updates.historyIndex = existing.historyIndex + 1;
             updates.title = preset.title || existing.title;
          }

          set({
            windows: windows.map(w => w.id === id ? { ...w, ...updates } : { ...w, isActive: false }),
            nextZIndex: nextZIndex + 1,
            activeMenu: null,
            isWindowDrawerOpen: false,
            isCommandPaletteOpen: false,
            isShortcutsOpen: false
          });
          return;
        }

        const appData = APP_PRESETS[id] || { title: 'UNTITLED', content: [] };
        const initialContent = preset?.content || appData.content;
        const initialTitle = preset?.title || appData.title;

        // Mobile / Landscape Logic
        const isMobileWidth = window.innerWidth < 768;
        const isShortScreen = window.innerHeight < 600;
        const shouldMaximize = isMobileWidth || isShortScreen;

        const isProject = id.startsWith('project-');
        const isChatbot = id === 'chatbot';
        
        let defaultW = isProject ? 1100 : (isChatbot ? 400 : 800);
        let defaultH = isProject ? 700 : (isChatbot ? 550 : 600);

        // Clamp initial size to viewport
        defaultW = Math.min(defaultW, window.innerWidth - 20);
        defaultH = Math.min(defaultH, window.innerHeight - 50);

        const maxX = Math.max(0, window.innerWidth - defaultW);
        const maxY = Math.max(0, window.innerHeight - defaultH - 36);
        
        const randomX = Math.floor(Math.random() * Math.min(50, maxX));
        const randomY = Math.floor(Math.random() * Math.min(50, maxY));

        let spawnX = 50 + randomX;
        let spawnY = 50 + randomY;

        if (isChatbot && !isMobileWidth && !isShortScreen) {
            spawnX = window.innerWidth - defaultW - 20;
            spawnY = window.innerHeight - defaultH - 40; 
        } else if (shouldMaximize) {
            spawnX = 0;
            spawnY = 0;
        }

        const { x, y } = clampPosition(spawnX, spawnY, defaultW, defaultH);

        const newWin: WindowDef = {
          id,
          title: initialTitle,
          x,
          y,
          w: defaultW,
          h: defaultH,
          zIndex: nextZIndex,
          isActive: true,
          isMinimized: false,
          isMaximized: shouldMaximize, 
          workspace: currentWorkspace,
          history: [{ title: initialTitle, content: initialContent }],
          historyIndex: 0,
          ...preset
        };

        set({
          windows: [...windows.map(w => ({ ...w, isActive: false })), newWin],
          nextZIndex: nextZIndex + 1,
          activeMenu: null,
          isWindowDrawerOpen: false,
          isCommandPaletteOpen: false,
          isShortcutsOpen: false
        });
      },

      closeWindow: (id) => {
        set(state => ({
          windows: state.windows.filter(w => w.id !== id)
        }));
      },

      closeAllWindows: () => {
          set({ windows: [] });
      },

      focusWindow: (id) => {
        const { nextZIndex } = get();
        set(state => ({
          windows: state.windows.map(w => w.id === id 
            ? { ...w, zIndex: nextZIndex, isActive: true, isMinimized: false } 
            : { ...w, isActive: false }
          ),
          nextZIndex: nextZIndex + 1
        }));
      },

      minimizeWindow: (id) => {
          set(state => ({
              windows: state.windows.map(w => w.id === id ? { ...w, isMinimized: true, isActive: false } : w)
          }));
      },

      restoreWindow: (id) => {
          const { nextZIndex } = get();
          set(state => ({
              windows: state.windows.map(w => w.id === id 
                  ? { ...w, isMinimized: false, isActive: true, zIndex: nextZIndex } 
                  : { ...w, isActive: false }
              ),
              nextZIndex: nextZIndex + 1,
              isWindowDrawerOpen: false
          }));
      },

      updateWindow: (id, updates) => {
        set(state => ({
          windows: state.windows.map(w => {
              if (w.id !== id) return w;
              
              const newW = updates.w ?? w.w;
              const newH = updates.h ?? w.h;
              const newX = updates.x ?? w.x;
              const newY = updates.y ?? w.y;

              const clamped = clampPosition(newX, newY, newW, newH);

              return { ...w, ...updates, ...clamped };
          })
        }));
      },

      recenterWindows: () => {
          set(state => ({
              windows: state.windows.map(w => {
                  const safeW = Math.min(w.w, window.innerWidth);
                  const safeH = Math.min(w.h, window.innerHeight - 36);
                  
                  const { x, y } = clampPosition(w.x, w.y, safeW, safeH);
                  return { ...w, x, y, w: safeW, h: safeH };
              })
          }));
      },

      repositionIcons: () => {
        set(state => {
            const h = window.innerHeight;
            const w = window.innerWidth;
            const GRID_W = 100;
            const GRID_H = 120;
            const START_X = 20;
            const START_Y = 40;
            const BOTTOM_MARGIN = 100;
            const maxX = w - GRID_W;
            const maxY = h - BOTTOM_MARGIN;
            const icons = [...state.icons];
            const safeIcons = icons.filter(icon => icon.x <= maxX && icon.y <= maxY);
            const unsafeIcons = icons.filter(icon => icon.x > maxX || icon.y > maxY);
            if (unsafeIcons.length === 0) return { icons };
            const isOccupied = (testX: number, testY: number, placed: DesktopIconDef[]) => {
                const threshold = 60;
                const all = [...safeIcons, ...placed];
                return all.some(icon => Math.abs(icon.x - testX) < threshold && Math.abs(icon.y - testY) < threshold);
            };
            const fixedIcons: DesktopIconDef[] = [];
            unsafeIcons.forEach(icon => {
                let found = false;
                const maxCols = Math.max(1, Math.floor((w - START_X) / GRID_W));
                const maxRows = Math.max(1, Math.floor((h - START_Y - BOTTOM_MARGIN) / GRID_H));
                for (let c = 0; c < maxCols; c++) {
                    for (let r = 0; r < maxRows; r++) {
                        const testX = START_X + c * GRID_W;
                        const testY = START_Y + r * GRID_H;
                        if (!isOccupied(testX, testY, fixedIcons)) {
                            fixedIcons.push({ ...icon, x: testX, y: testY });
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
                if (!found) {
                    fixedIcons.push({ ...icon, x: START_X, y: START_Y });
                }
            });
            return { icons: [...safeIcons, ...fixedIcons] };
        })
      },

      navigateWindow: (id, view) => {
          set(state => ({
              windows: state.windows.map(w => {
                  if (w.id !== id) return w;
                  const newHistory = w.history.slice(0, w.historyIndex + 1);
                  return {
                      ...w,
                      history: [...newHistory, view],
                      historyIndex: newHistory.length,
                      title: view.title
                  };
              })
          }));
      },

      goBack: (id) => {
        set(state => ({
            windows: state.windows.map(w => {
                if (w.id !== id || w.historyIndex <= 0) return w;
                const newIndex = w.historyIndex - 1;
                return {
                    ...w,
                    historyIndex: newIndex,
                    title: w.history[newIndex].title
                };
            })
        }));
      },

      goForward: (id) => {
        set(state => ({
            windows: state.windows.map(w => {
                if (w.id !== id || w.historyIndex >= w.history.length - 1) return w;
                const newIndex = w.historyIndex + 1;
                return {
                    ...w,
                    historyIndex: newIndex,
                    title: w.history[newIndex].title
                };
            })
        }));
      },

      toggleMaximize: (id) => {
        set(state => ({
            windows: state.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
        }));
      },

      setWorkspace: (id) => set({ currentWorkspace: id }),
      setActiveMenu: (menu) => set({ activeMenu: menu }),
      toggleWindowDrawer: () => set(state => ({ isWindowDrawerOpen: !state.isWindowDrawerOpen })),
      toggleCommandPalette: () => set(state => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
      toggleShortcuts: () => set(state => ({ isShortcutsOpen: !state.isShortcutsOpen })),
      setCommandPalette: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (lang) => set({ language: lang }),
      setCalendarConnected: (connected) => set({ isCalendarConnected: connected }),
      setDesktopSideImage: (url) => set({ desktopSideImage: url }),

      createFile: (parentPath, fileName, node) => set(state => {
          const newFS = JSON.parse(JSON.stringify(state.fileSystem));
          let current = newFS;
          
          // Traverse to parent
          for (const segment of parentPath) {
              if (current.children && current.children[segment]) {
                  current = current.children[segment];
              } else {
                  // Path doesn't exist, abort or create? Abort for safety.
                  return state; 
              }
          }

          if (current.type === 'dir' && current.children) {
              current.children[fileName] = node;
          }

          return { fileSystem: newFS };
      }),

      selectIcon: (id) => set({ selectedIconId: id }),
      moveIcon: (id, x, y) => set(state => ({
        icons: state.icons.map(icon => icon.id === id ? { ...icon, x, y } : icon)
      })),
      removeIcon: (id) => set(state => ({
          icons: state.icons.filter(icon => icon.id !== id)
      })),

      toggleWidget: (id) => set(state => ({
        widgets: state.widgets.map(w => w.id === id ? { ...w, isOpen: !w.isOpen } : w)
      })),
      moveWidget: (id, x, y) => set(state => ({
        widgets: state.widgets.map(w => w.id === id ? { ...w, x, y } : w)
      })),

      drinkCoffee: () => set({ caffeineLevel: 100 }),
      decreaseCaffeine: () => set(state => ({
          caffeineLevel: Math.max(0, state.caffeineLevel - 1)
      })),

      openContextMenu: (x, y, type, targetId) => set({ contextMenu: { isOpen: true, x, y, type, targetId } }),
      closeContextMenu: () => set(state => ({ contextMenu: { ...state.contextMenu, isOpen: false } })),
    }),
    {
      name: 'designeros-storage',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        windows: state.windows,
        icons: state.icons,
        nextZIndex: state.nextZIndex,
        currentWorkspace: state.currentWorkspace,
        systemState: state.systemState,
        lastBootTime: state.lastBootTime,
        widgets: state.widgets,
        caffeineLevel: state.caffeineLevel,
        currentUser: state.currentUser,
        knownUsers: state.knownUsers, // Persist Known Users
        theme: state.theme,
        language: state.language,
        isCalendarConnected: state.isCalendarConnected,
        desktopSideImage: state.desktopSideImage,
        fileSystem: state.fileSystem // Persist File System changes
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
