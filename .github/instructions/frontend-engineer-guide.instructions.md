---
applyTo: '**'
---

# Cogito OS — Front-End Engineer Guide

> **Purpose:** Single source of truth for any front-end engineer (human or AI agent) working on the Cogito OS codebase. Covers architecture overview, code conventions, component patterns, refactoring plans, and feature development guidelines.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure & Architecture](#3-folder-structure--architecture)
4. [Code Conventions & Style Guide](#4-code-conventions--style-guide)
5. [Component Architecture Patterns](#5-component-architecture-patterns)
6. [State Management](#6-state-management)
7. [API & Data Layer](#7-api--data-layer)
8. [Type System](#8-type-system)
9. [Styling Rules](#9-styling-rules)
10. [Performance Guidelines](#10-performance-guidelines)
11. [Current Codebase Health Report](#11-current-codebase-health-report)
12. [Refactoring Action Plan](#12-refactoring-action-plan)
13. [Adding New Features Checklist](#13-adding-new-features-checklist)
14. [Naming Conventions Reference](#14-naming-conventions-reference)
15. [Common Gotchas](#15-common-gotchas)

---

## 1. Project Overview

Cogito OS is a retro-styled (Windows 95-era) desktop OS simulation built as a React SPA. It functions as a portfolio/personal website where users interact with windows, desktop icons, widgets, and embedded applications (terminal, blog, project viewer, chatbot, etc.).

### System Lifecycle

```
booting → login → running → shutdown
                     ↑          |
                     └──────────┘ (reboot)
```

### Core Concepts

| Concept | Description |
|---------|-------------|
| **Window** | Draggable/resizable panel with navigation history (browser-like back/forward). Defined by `WindowDef`. |
| **App** | A React component registered in `APP_REGISTRY`, rendered inside a window. Implements `AppProps`. |
| **Content Item** | A declarative content block (`ContentItem`) — can be a primitive (h1, p, table) or an app reference. |
| **Desktop Icon** | Clickable icon that spawns a window via a preset. Defined by `DesktopIconDef`. |
| **Widget** | Floating desktop component (clock, music player). Defined by `WidgetDef`. |
| **Preset** | Pre-configured window definition in `config/apps.ts` mapping an ID to `{ title, content }`. |

---

## 2. Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Build | Vite | 6.x |
| Language | TypeScript | 5.8 |
| UI | React | 18.3 |
| State | Zustand (persisted to IndexedDB via `idb-keyval`) | 5.x |
| Async State | React Query (`@tanstack/react-query`) | 5.24 |
| Animation | Framer Motion | 11.x |
| Styling | Tailwind CSS (via design tokens) | — |
| Icons | Lucide React + custom hand-drawn SVGs | — |
| AI | Google GenAI SDK (`@google/genai`) | 1.33 |
| Terminal | xterm.js | 5.3 |
| Markdown | react-markdown + remark-gfm | — |
| HTTP | Axios (with auth interceptor) | 1.6 |
| Drag & Drop | `@hello-pangea/dnd` | 18.x |
| Toast | Sonner | 2.x |

### Path Aliases (tsconfig + vite)

```
@/*          → ./*           (project root)
@components/* → ./components/*
@services/*  → ./services/*
@lib/*       → ./lib/*
@types/*     → ./types/*
```

---

## 3. Folder Structure & Architecture

### Target Structure

```
├── App.tsx                        # Root shell — system lifecycle router
├── index.tsx                      # Entry point — React root + QueryClientProvider
├── types/                         # Global type definitions
│   ├── index.ts                   # Core OS types (Window, Icon, Widget, Content)
│   ├── api.ts                     # Backend API DTOs
│   └── ui/system.ts               # UI-specific types
├── config/                        # Static configuration (no runtime logic)
│   ├── apps.ts                    # Window presets (APP_PRESETS)
│   ├── desktop.ts                 # Initial icons, windows, widgets
│   ├── system.ts                  # Boot sequence config
│   ├── terminal.ts                # Virtual file system definitions
│   └── translations.ts            # i18n dictionaries
├── theme/
│   └── design-tokens.ts           # Static color/shadow/font tokens
├── lib/                           # Framework-agnostic utilities
│   ├── api-client.ts              # Axios instance with interceptors
│   └── query-client.ts            # React Query client factory
├── components/ui/                 # SHARED reusable UI primitives
│   ├── retro-ui.tsx               # RetroButton, RetroCard, RetroBadge, etc.
│   ├── hand-drawn-icons.tsx       # Custom SVG icon system
│   └── text-utils.tsx             # HighlightText
├── services/                      # Real backend API layer
│   ├── api/                       # API service modules (one per domain)
│   └── hooks/                     # React Query hooks (one per domain)
├── features/                      # Feature modules (vertical slices)
│   ├── os/                        # OS chrome (top bar, command palette, shortcuts)
│   │   ├── components/
│   │   ├── hooks/
│   │   └── stores/                # Zustand stores
│   ├── desktop/                   # Desktop surface (icons, wallpaper, widgets)
│   │   └── components/
│   ├── window-manager/            # Window frame, content rendering, drag/resize
│   │   ├── components/
│   │   └── hooks/
│   ├── system/                    # System lifecycle (boot, login, shutdown, theme)
│   │   └── components/
│   ├── apps/                      # Individual applications
│   │   ├── registry.ts            # APP_REGISTRY (lazy-loaded component map)
│   │   ├── <AppName>/             # One folder per app (see pattern below)
│   │   │   ├── <AppName>.tsx      # Container component
│   │   │   ├── components/        # Presentational sub-components
│   │   │   ├── hooks/             # App-specific hooks
│   │   │   └── types.ts           # App-specific types
│   │   └── ...
│   ├── projects/                  # Project data feature
│   ├── comments/                  # Comment system feature
│   ├── timeline/                  # Timeline/conspiracy-map data
│   └── search/                    # Unified search index
└── public/
    └── assets/icons/              # Static SVG icon assets
```

### Key Architecture Rules

1. **Vertical slices**: Each `features/` module is self-contained with its own components, hooks, stores, and types.
2. **Shared UI in `components/ui/`**: Only truly reusable, domain-agnostic primitives live here.
3. **Services layer (`services/`)**: All real API calls. Feature modules NEVER make HTTP calls directly.
4. **Config is static**: Files in `config/` export plain objects/arrays. No runtime logic, no React imports.
5. **Types are centralized**: Global types in `types/`. Feature-specific types in `features/<name>/types.ts`. Never duplicate type definitions.

---

## 4. Code Conventions & Style Guide

### 4.1 File Rules

| Rule | Standard |
|------|----------|
| **One component per file** | Every React component gets its own `.tsx` file. No exceptions. |
| **File naming** | Components: `PascalCase.tsx`. Hooks: `use-kebab-case.ts`. Utils: `kebab-case.ts`. Types: `types.ts`. |
| **Named exports only** | Never use `export default`. Always `export const ComponentName` or `export function hookName`. |
| **Barrel exports** | Use `index.ts` to re-export from folders. Keep imports clean. |
| **Max file length** | Target ≤ 200 lines per component file. Hard ceiling at 300 lines — if exceeded, decompose. |

### 4.2 Component Definition Order

Every component file MUST follow this exact internal order. Non-applicable sections are skipped, but the relative order never changes:

```tsx
// 1. Imports (external → internal → types → styles)
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';                    // external libs
import { useOSStore } from '@/features/os/stores/os-store'; // internal modules
import { SomeComponent } from './SomeComponent';            // local components
import type { SomeType } from './types';                    // types (use `type` keyword)

// 2. Constants (module-level, outside component)
const MAX_ITEMS = 10;

// 3. Types/Interfaces (if not in separate types.ts)
interface MyComponentProps {
  title: string;
  onClose: () => void;
}

// 4. Component Definition
export const MyComponent: React.FC<MyComponentProps> = ({ title, onClose }) => {
  // 4a. Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // 4b. Store hooks (Zustand)
  const { theme, spawnWindow } = useOSStore();

  // 4c. Query hooks (React Query)
  const { data, isLoading } = useMyData();

  // 4d. Local state (useState)
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 4e. Derived / computed values (useMemo)
  const filteredItems = useMemo(() => {
    return items.filter(i => i.active);
  }, [items]);

  // 4f. Side effects (useEffect)
  useEffect(() => {
    // subscriptions, event listeners, timers
    return () => { /* cleanup */ };
  }, [dependency]);

  // 4g. Callbacks (useCallback) — ordered by user interaction flow
  const handleClick = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleSubmit = useCallback((data: FormData) => {
    // ...
  }, []);

  // 4h. Early returns (loading, error, empty states)
  if (isLoading) return <LoadingState />;
  if (!data) return <ErrorState />;

  // 4i. JSX return
  return (
    <div ref={containerRef}>
      {/* ... */}
    </div>
  );
};
```

### 4.3 Import Order

Within the import section, organize groups separated by blank lines:

```tsx
// React & React ecosystem
import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

// External libraries
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Trash2 } from 'lucide-react';

// Internal modules (absolute paths with aliases)
import { useOSStore } from '@/features/os/stores/os-store';
import { RetroButton } from '@/components/ui/retro-ui';

// Local imports (relative paths)
import { SubComponent } from './SubComponent';
import { useMyHook } from './hooks/use-my-hook';

// Type-only imports
import type { MyProps } from './types';
```

### 4.4 Forbidden Patterns

| Pattern | Why it's banned | What to do instead |
|---------|-----------------|-------------------|
| `export default` | Inconsistent refactoring, rename-unfriendly | Always use named exports |
| `any` type | Defeats TypeScript's purpose | Use `unknown` + type guards, or define proper types |
| `@ts-ignore` / `@ts-expect-error` | Hides real bugs | Fix the type issue properly |
| `console.log` in production code | Leaks information, clutters output | Remove or use a logger utility with env-gating |
| `alert()` / `confirm()` / `prompt()` | Breaks retro aesthetic, blocks UI thread | Use custom modal/dialog components |
| Inline `style={{}}` for static values | Bypasses design system | Use Tailwind classes or CSS variables |
| `dangerouslySetInnerHTML` | XSS risk | Use safe alternatives (react-markdown, DOMPurify) |
| Magic numbers without constants | Unreadable, unmaintainable | Extract to named constants |
| `setTimeout` chains for sequencing | Fragile, unreadable | Use async/await, state machines, or animation libraries |
| Mutating state directly | Breaks React rendering | Use immutable updates: spread, `structuredClone()`, Immer |

---

## 5. Component Architecture Patterns

### 5.1 Container / Presenter Pattern (MANDATORY for apps)

Every app MUST separate business logic from UI rendering:

```
features/apps/<AppName>/
├── <AppName>.tsx           # Container: hooks + state + callbacks (no JSX beyond wrapper)
├── components/
│   ├── <AppName>View.tsx   # Presenter: pure UI, receives all data via props
│   ├── SubComponentA.tsx   # Extracted sub-component
│   └── SubComponentB.tsx   # Extracted sub-component
├── hooks/
│   └── use-<app-name>.ts   # Custom hook encapsulating app logic
└── types.ts                # App-specific types/interfaces
```

**Gold standard example — Chatbot:**

```tsx
// features/apps/chatbot/Chatbot.tsx (Container)
export const Chatbot: React.FC<AppProps> = ({ win }) => {
    const { messages, input, setInput, isLoading, sendMessage } = useChatbot();
    return (
        <ChatbotView
            messages={messages}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            onSend={sendMessage}
        />
    );
};
```

```tsx
// features/apps/chatbot/components/ChatbotView.tsx (Presenter)
interface ChatbotViewProps {
    messages: Message[];
    input: string;
    setInput: (val: string) => void;
    isLoading: boolean;
    onSend: () => void;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({ messages, input, setInput, isLoading, onSend }) => {
    // Only UI logic: scroll-to-bottom ref, keyboard handler
    // Zero business logic
    return ( /* JSX */ );
};
```

### 5.2 Shared Components (`components/ui/`)

Components in `components/ui/` must be:
- **Domain-agnostic**: No imports from `features/`, `services/`, or `config/`.
- **Fully controlled**: All data passed via props. No store access.
- **Documented with props interface**: Every prop has a TypeScript type and JSDoc comment if non-obvious.
- **Wrapped with `React.memo`** if they accept complex props or are used in lists.

Currently existing shared components:
- `RetroButton`, `RetroCard`, `RetroBadge`, `LoadingState`, `ErrorState` (in `retro-ui.tsx`)
- `HandDrawnIcon` (in `hand-drawn-icons.tsx`)
- `HighlightText` (in `text-utils.tsx`)

**Rule**: When a sub-component is used by 2+ features, elevate it to `components/ui/`. Otherwise, keep it in the feature's local `components/` folder.

### 5.3 App Registration

To add a new app:

1. Create folder: `features/apps/<app-name>/`
2. Create container: `<AppName>.tsx` implementing `AppProps`
3. Create presenter: `components/<AppName>View.tsx`
4. Register in `features/apps/registry.ts`:
   ```ts
   '<app-name>': {
     component: loadApp(() => import('./<app-name>/<AppName>'), '<AppName>'),
     hideToolbar: false,
     noPadding: false,
   }
   ```
5. Add preset in `config/apps.ts`:
   ```ts
   '<app-name>': {
     title: 'APP_NAME.EXE',
     content: [{ type: '<app-name>' }]
   }
   ```
6. Add `'<app-name>'` to the `ContentType` union in `types/index.ts`.
7. (Optional) Add desktop icon in `config/desktop.ts`.

### 5.4 Window Spawning

```tsx
const { spawnWindow } = useOSStore();

// Spawn from preset
spawnWindow('unique-id');

// Spawn with custom content
spawnWindow('unique-id', {
  title: 'WINDOW_TITLE.EXE',
  w: 800,
  h: 600,
  content: [{ type: 'my-app' }]
});

// Navigate within existing window
const { navigateWindow } = useOSStore();
navigateWindow(win.id, { title: 'New View', content: [...] });
```

---

## 6. State Management

### 6.1 Store Architecture (Target: Split Stores)

The current monolithic `os-store.ts` (540 lines, 22 state properties, 41 actions) MUST be decomposed into focused stores:

| Store | File | Responsibilities |
|-------|------|-----------------|
| `useWindowStore` | `features/os/stores/window-store.ts` | Window CRUD, focus, minimize, maximize, z-index, navigation history, clamping |
| `useDesktopStore` | `features/os/stores/desktop-store.ts` | Icons (select, move, remove, reposition), widgets (toggle, move) |
| `useSystemStore` | `features/os/stores/system-store.ts` | System lifecycle (boot/login/running/shutdown), theme, language, caffeine |
| `useUIStore` | `features/os/stores/ui-store.ts` | Transient UI state: active menus, command palette, window drawer, shortcuts sheet, context menu |
| `useUserStore` | `features/os/stores/user-store.ts` | Current user, known users, login/logout |
| `useFileSystemStore` | `features/os/stores/filesystem-store.ts` | Virtual file system tree, createFile |
| `useAuthStore` | `features/os/stores/auth-store.ts` | JWT tokens, refresh flow (already exists) |

**Legacy bridge**: During migration, maintain a `useOSStore()` facade hook that composes the split stores for backward compatibility:

```ts
// features/os/stores/os-store.ts (facade during migration)
export const useOSStore = () => ({
  ...useWindowStore(),
  ...useDesktopStore(),
  ...useSystemStore(),
  ...useUIStore(),
  ...useUserStore(),
  ...useFileSystemStore(),
});
```

### 6.2 Store Conventions

```ts
// Template for a focused store
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WindowState {
  // STATE — group by concern, document each property
  windows: WindowDef[];
  nextZIndex: number;
}

interface WindowActions {
  // ACTIONS — separate interface for clarity
  spawnWindow: (id: string, preset?: WindowPreset) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  // ...
}

type WindowStore = WindowState & WindowActions;

export const useWindowStore = create<WindowStore>()(
  persist(
    (set, get) => ({
      // Initial state
      windows: [],
      nextZIndex: 10,

      // Actions
      spawnWindow: (id, preset) => {
        // ...
      },
      closeWindow: (id) => set(state => ({
        windows: state.windows.filter(w => w.id !== id)
      })),
    }),
    {
      name: 'cogito-window-storage',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({
        windows: state.windows,
        nextZIndex: state.nextZIndex,
      }),
    }
  )
);
```

### 6.3 Store Rules

| Rule | Rationale |
|------|-----------|
| **No DOM access in stores** | Stores must be testable outside browsers. Extract `window.innerWidth` reads into utility functions passed as parameters. |
| **No cross-store mutations** | Store A must not call `useStoreB.getState().action()`. Use event-based coordination or React effects to sync. |
| **Separate persisted vs transient state** | Use `partialize` to persist only meaningful data. Never persist `isActive`, `zIndex`, `isMinimized`, or UI overlay state. |
| **No `any` type in store actions** | Every parameter and return type must be explicit. |
| **Extract complex logic into pure functions** | `spawnWindow()` should call `calculateWindowPosition(viewport, existingWindows)` — a pure, testable function in a utils file. |
| **Use `structuredClone()`** instead of `JSON.parse(JSON.stringify())` for deep cloning. |

---

## 7. API & Data Layer

### 7.1 Architecture

```
Component (UI)
    ↓ uses
Custom Hook (features/<name>/hooks/)
    ↓ calls
React Query Hook (services/hooks/)
    ↓ calls
API Service (services/api/)
    ↓ calls
Axios Instance (lib/api-client.ts)
    ↓
Backend
```

### 7.2 Real API Layer (`services/`)

The `services/` directory contains the production API layer:

- **`services/api/<domain>.api.ts`**: Pure functions calling `apiClient.get/post/put/delete`. No React. No hooks.
- **`services/hooks/use-<domain>.ts`**: React Query `useQuery` / `useMutation` wrappers. These are the ONLY hooks that call API services.

### 7.3 Mock API Layer (`features/<name>/api.ts`)

Mock APIs exist in `features/comments/api.ts`, `features/projects/api.ts`, and `features/timeline/api.ts`.

**Rule**: Mock APIs must be behind a feature flag:

```ts
// lib/env.ts
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// features/projects/hooks/use-projects.ts
import { USE_MOCK_API } from '@/lib/env';
import * as mockApi from '../api';
import { useProjects as useRealProjects } from '@/services/hooks/use-project';

export const useProjects = USE_MOCK_API
  ? () => useQuery({ queryKey: ['projects'], queryFn: mockApi.fetchProjects })
  : useRealProjects;
```

**Goal**: Both layers share the same hook interface. Components never know which backend they hit.

### 7.4 Hook Naming

To avoid collisions between mock and real API hooks:

| Layer | Convention | Example |
|-------|-----------|---------|
| `services/hooks/` | `use-<domain>.ts` → primary production hooks | `useProjects`, `useBlogSearch` |
| `features/<name>/hooks/` | `use-<name>-mock.ts` → mock-backed hooks (dev only) | `useProjectsMock` |
| `features/<name>/hooks/` | `use-<name>-logic.ts` → view-model / UI logic hooks | `useProjectListLogic`, `useProjectDetailLogic` |

### 7.5 API Client Rules

- **Never log tokens**: Remove `console.log("[ApiClient] accessToken:", token)` from `lib/api-client.ts`.
- **Remove dead code**: Clean up the ~130 lines of commented-out interceptor code.
- **Use the configured client**: Token refresh should use `apiClient` instance, not raw `axios.post`.
- **Handle auth failures gracefully**: Use store action to trigger logout UI instead of `window.location.href = "/"`.

---

## 8. Type System

### 8.1 Type Organization

| Location | Purpose | Rule |
|----------|---------|------|
| `types/index.ts` | Core OS types: SystemState, WindowDef, ContentItem, DesktopIconDef, etc. | Canonical. All OS-level types live here. |
| `types/api.ts` | Backend API DTOs: BlogDto, ProjectDto, CommentDto, UserDto, etc. | Canonical. All API response/request types live here. |
| `features/<name>/types.ts` | Feature-specific types not shared globally | Import from `types/` for shared types. Never duplicate. |

### 8.2 Critical Type Issues to Fix

1. **`UserProfile.id`**: Typed as `number` in `types/index.ts` but used as `string` in `LoginScreen.tsx` (e.g., `'guest-001'`). Pick one and be consistent — recommend `string`.
2. **Duplicate `Pagination`**: Defined in both `types/api.ts` and `features/projects/types.ts` with different shapes. Consolidate into `types/api.ts`.
3. **Duplicate `CommentDto`**: `types/api.ts` version has `blogPost?: BlogDto` field, `features/comments/types.ts` version doesn't. Use only `types/api.ts`.
4. **Duplicate `ProjectDto`**: Same issue. Single definition in `types/api.ts`.
5. **`ContentType` union**: Has 28 members and growing. Consider using a string literal with validation at registration time instead of a hardcoded union.

### 8.3 Type Rules

| Rule | Example |
|------|---------|
| Use `type` keyword for imports | `import type { WindowDef } from '@/types';` |
| Prefer interfaces for component props | `interface MyComponentProps { ... }` |
| Prefer type aliases for unions/intersections | `type ContentType = 'h1' \| 'p' \| 'terminal';` |
| Never use `as any` for type casting | Use type guards or proper generics |
| Use discriminated unions for variant types | `type Action = { type: 'SET_VALUE'; value: string } \| { type: 'RESET' };` |

---

## 9. Styling Rules

### 9.1 Design System

| Token | Tailwind Class | Purpose |
|-------|---------------|---------|
| Background | `bg-os-bg` | Page/desktop background (bone color) |
| Window | `bg-os-window` | Window body background (white) |
| Text | `text-os-text` | Primary text color |
| Accent | `text-os-accent` / `bg-os-accent` | Orange accent color |
| Border | `border-os-border border-2` | Hard black borders (mandatory for retro look) |
| Shadows | `shadow-retro-sm` / `shadow-retro-md` / `shadow-retro-lg` | Pixel-art drop shadows (defined in `design-tokens.ts`) |
| Font (system) | `font-mono` | Monospace for system text |
| Font (headings) | `font-sans` | Sans-serif for headings |

### 9.2 Styling Rules

| Rule | Rationale |
|------|-----------|
| **Tailwind classes only** for static styles | Keeps styling co-located and consistent |
| **Inline `style={{}}` only for** truly dynamic values (transform, calculated position, canvas dimensions) | Static styles in className, dynamic in style |
| **Never hardcode hex colors** in className or style | Use CSS variables: `var(--os-accent)`, `var(--os-bg)` |
| **Pixelated images**: `className="pixelated"` or `style={{ imageRendering: 'pixelated' }}` | Retro aesthetic for icons/avatars |
| **`border-2 border-os-border`** on all interactive surfaces | Maintains the hard-border retro look |

### 9.3 Theme Awareness

Themes are applied via CSS variables on `document.documentElement`. Components using Tailwind's `os-*` utilities automatically respond to theme changes. Components using static values from `design-tokens.ts` will NOT respond to theme changes — avoid using `DESIGN_TOKENS` for colors that should be theme-aware.

Available themes: `bone` (default beige), `night` (dark), `seraph` (white), `gruvbox` (retro warm).

---

## 10. Performance Guidelines

### 10.1 Memoization

| What | When | How |
|------|------|-----|
| **Expensive computations** | Filtering/sorting/transforming large lists | `useMemo(() => transform(data), [data])` |
| **Callbacks passed to children** | Any callback prop going to a child component | `useCallback(() => { ... }, [deps])` |
| **Presentational components** | Components receiving object/array props or rendered in lists | `React.memo(Component)` |
| **Sub-components defined in parent** | Helper components inside a file that don't need parent scope | Extract to separate file + `React.memo` |

### 10.2 Lazy Loading

All apps are already lazy-loaded via the registry. New apps MUST use the `loadApp()` helper:

```ts
component: loadApp(() => import('./<app-name>/<AppName>'), '<AppName>'),
```

### 10.3 Anti-Patterns to Avoid

- **Creating objects/arrays in render**: `<Component style={{ color: 'red' }} />` creates a new object every render. Extract to a constant.
- **`useMemo` for side effects**: `useMemo` is for derivation only. Side effects go in `useEffect`.
- **`setInterval` without cleanup**: Always return a cleanup function from `useEffect`.
- **Deep-cloning with `JSON.parse(JSON.stringify())`**: Use `structuredClone()`.
- **`Math.random()` in `useMemo`/render**: Creates different values every render. Use `useRef` or `useState(initializer)`.

---

## 11. Current Codebase Health Report

### 11.1 File Size Overview (Worst Offenders)

| File | Lines | Issue |
|------|-------|-------|
| `blog/BlogEditor.tsx` | 1,196 | MASSIVE god file: editor, toolbar, preview, suggestion engine, 4+ components |
| `FileManager.tsx` | 605 | God component: sidebar, grid, inspector, 7+ state vars, file type detection |
| `ConspiracyMap.tsx` | 591 | 5 components in one file, motion value anti-patterns |
| `os-store.ts` | 540 | God object: 22 state, 41 actions, 12+ responsibilities |
| `KanbanBoard.tsx` | 535 | Modal + board in one file, localStorage instead of store |
| `EventEditor.tsx` | 453 | 11 useState, EXIF logic inline, 200+ line render |
| `blog/BlogDetail.tsx` | 446 | 3-panel layout, IntersectionObserver, 8 useState |
| `blog/BlogArchive.tsx` | 443 | 7 useState for filters, manual dropdown management |
| `LoginScreen.tsx` | 442 | 3 views in one component, mixed auth logic |
| `SystemMonitor.tsx` | 402 | 3 components, simulated data generators |
| `TopBar.tsx` | 382 | Menus, widgets, workspace switch, caffeine drain |

### 11.2 Cross-Cutting Issues

| Issue | Severity | Impact |
|-------|----------|--------|
| **Duplicate type definitions** (Pagination, CommentDto, ProjectDto) across `types/api.ts` and feature modules | 🔴 High | Type divergence, confusing imports |
| **Duplicate hook names** (`useProjects`, `useCreateComment`) in both `features/*/hooks/` and `services/hooks/` | 🔴 High | Wrong API called silently |
| **Security: Access token logged to console** in `lib/api-client.ts:43` | 🔴 High | Token leak in prod |
| **God store** with 12+ mixed responsibilities | 🔴 High | Untestable, high coupling |
| **No `React.memo`** on any sub-component across entire codebase | 🟡 Medium | Unnecessary re-renders |
| **No `useCallback`** on callbacks passed as props | 🟡 Medium | Child re-renders |
| **Dead code**: `block-editor.tsx` (176 lines commented), `api-client.ts` (~130 lines commented) | 🟡 Medium | Maintenance burden |
| **Non-functional UI buttons** (Bold, Italic, Share, Run in Background) | 🟡 Medium | Misleading UX |
| **UserProfile.id type mismatch** (number vs string) | 🟡 Medium | Runtime errors |
| **Static design tokens don't respond to themes** | 🟢 Low | Theme-aware components need CSS vars |

### 11.3 Patterns Already Done Well

| Pattern | Where | Notes |
|---------|-------|-------|
| Container/Presenter | `Chatbot.tsx` + `ChatbotView.tsx` | Gold standard — replicate everywhere |
| View-model hooks | `use-project-view.ts` | Clean separation of UI logic from store |
| API service layer | `services/api/*.ts` | Consistent, focused, well-structured |
| React Query hooks | `services/hooks/*.ts` | Clean wrapper pattern |
| Lazy-loading registry | `features/apps/registry.ts` | Extensible, code-split by default |
| Thin wrapper components | `ShortcutsSheet.tsx` (16 lines) | Connects hook to view — no extra logic |
| Config-driven presets | `config/apps.ts` | Declarative window definitions |

---

## 12. Refactoring Action Plan

### Phase 1: Critical Fixes (Do First)

#### 1.1 Security & Bugs
- [ ] Remove `console.log("[ApiClient] accessToken:", token)` from `lib/api-client.ts:43`.
- [ ] Remove ~130 lines of commented-out code from `lib/api-client.ts`.
- [ ] Remove all dead code in `components/ui/block-editor.tsx` (either implement or delete the file).
- [ ] Fix `UserProfile.id` type: change to `string` in `types/index.ts` and update all usages.
- [ ] Fix `PixelPaint.tsx` stale closure bug: `isDrawing` should use `useRef` instead of `useState` for the drawing flag.
- [ ] Add `rel="noopener noreferrer"` to all `target="_blank"` links.

#### 1.2 Type Consolidation
- [ ] Delete `Pagination` from `features/projects/types.ts` — use `types/api.ts` version.
- [ ] Delete `CommentDto` from `features/comments/types.ts` — use `types/api.ts` version.
- [ ] Delete `BlogPost` from `features/apps/blog/data.ts` — use `BlogDto` from `types/api.ts` + a converter.
- [ ] Audit all `features/*/types.ts` files — anything duplicated in `types/` gets removed.

### Phase 2: Store Decomposition

Split `features/os/stores/os-store.ts` into focused stores (see Section 6.1 for target structure):

- [ ] Create `window-store.ts`: Extract all window CRUD, focus, minimize, maximize, navigation, clamping.
- [ ] Create `desktop-store.ts`: Extract icon and widget state + actions.
- [ ] Create `system-store.ts`: Extract system lifecycle, theme, language, caffeine.
- [ ] Create `ui-store.ts`: Extract transient UI (menus, command palette, drawer, shortcuts, context menu).
- [ ] Create `user-store.ts`: Extract user profile, known users, login/logout.
- [ ] Create `filesystem-store.ts`: Extract virtual FS + createFile.
- [ ] Create facade `useOSStore()` that composes all stores for backward compatibility.
- [ ] Extract `clampPosition`, `calculateWindowPosition`, `calculateIconGrid` into `features/os/utils/layout.ts` (pure functions, no DOM access — receive viewport dimensions as params).
- [ ] Remove `window.innerWidth`/`window.innerHeight` direct access from stores — pass as arguments.

### Phase 3: Component Decomposition (Worst Offenders)

#### 3.1 `blog/BlogEditor.tsx` (1,196 → 7+ files)
- [ ] Extract `MermaidRenderer` → `features/apps/blog/components/MermaidRenderer.tsx`
- [ ] Extract `CodeBlock` → `components/ui/CodeBlock.tsx` (shared — used by `BlogDetail.tsx` too)
- [ ] Extract `CalloutBlock` → `components/ui/CalloutBlock.tsx` (shared)
- [ ] Extract `CALLOUT_CONFIG` → `features/apps/blog/config.ts`
- [ ] Extract `gruvboxTheme` → `theme/syntax-theme.ts`
- [ ] Extract toolbar into `features/apps/blog/components/EditorToolbar.tsx`
- [ ] Extract suggestion popup into `features/apps/blog/components/SuggestionPopup.tsx`
- [ ] Extract editor logic into `features/apps/blog/hooks/use-blog-editor.ts`
- [ ] Container `BlogEditor.tsx` should be ≤ 50 lines.

#### 3.2 `FileManager.tsx` (605 → 5+ files)
- [ ] Extract `features/apps/file-manager/components/FileManagerSidebar.tsx`
- [ ] Extract `features/apps/file-manager/components/FileGrid.tsx`
- [ ] Extract `features/apps/file-manager/components/InspectorPanel.tsx`
- [ ] Extract `features/apps/file-manager/components/FileManagerToolbar.tsx`
- [ ] Extract `getFileIcon()` → `features/apps/file-manager/utils.ts`
- [ ] Extract `generateMetadata()` → `features/apps/file-manager/utils.ts` (make deterministic — no `Math.random()` in render)
- [ ] Create `features/apps/file-manager/hooks/use-file-manager.ts` for navigation/selection state

#### 3.3 `ConspiracyMap.tsx` (591 → 5+ files)
- [ ] Extract `CaseFile` → `features/apps/conspiracy-map/components/CaseFile.tsx`
- [ ] Extract `Lightbox` → `components/ui/Lightbox.tsx` (reusable)
- [ ] Extract `BoardConnectionLine` → `features/apps/conspiracy-map/components/BoardConnectionLine.tsx`
- [ ] Extract `MapConnectionLines` → `features/apps/conspiracy-map/components/MapConnectionLines.tsx`
- [ ] Fix: replace `useMemo` with side effects → proper `useEffect`
- [ ] Create `features/apps/conspiracy-map/hooks/use-conspiracy-map.ts`

#### 3.4 `KanbanBoard.tsx` (535 → 4+ files)
- [ ] Extract `TaskDetailModal` → `features/apps/kanban/components/TaskDetailModal.tsx`
- [ ] Extract `INITIAL_DATA` → `features/apps/kanban/config.ts`
- [ ] Replace `localStorage` persistence with Zustand persist or app-specific store
- [ ] Replace `confirm()` with custom retro dialog
- [ ] Create `features/apps/kanban/hooks/use-kanban.ts`

#### 3.5 `EventEditor.tsx` (453 → 4+ files)
- [ ] Extract EXIF utilities (`convertDMSToDD`, `extractGPS`) → `features/apps/event-editor/utils/exif.ts`
- [ ] Extract image gallery → `features/apps/event-editor/components/ImageGallery.tsx`
- [ ] Extract form fields → `features/apps/event-editor/components/EventForm.tsx`
- [ ] Create `features/apps/event-editor/hooks/use-event-editor.ts`

#### 3.6 `LoginScreen.tsx` (442 → 4+ files)
- [ ] Extract `features/system/components/login/UserSelectView.tsx`
- [ ] Extract `features/system/components/login/AuthMethodView.tsx`
- [ ] Extract `features/system/components/login/EmailFlowView.tsx`
- [ ] Create `features/system/hooks/use-login.ts`
- [ ] `LoginScreen.tsx` becomes a thin state-machine router ≤ 40 lines.

#### 3.7 `TopBar.tsx` (382 → 4+ files)
- [ ] Extract `features/os/components/topbar/ActivitiesMenu.tsx`
- [ ] Extract `features/os/components/topbar/SystemTray.tsx`
- [ ] Extract `features/os/components/topbar/WorkspaceSwitcher.tsx`
- [ ] Extract `features/os/components/topbar/CaffeineWidget.tsx`
- [ ] Remove inline `Bluetooth` SVG component — move to `components/ui/hand-drawn-icons.tsx`

#### 3.8 `WindowContentRenderer.tsx` (290 → strategy-pattern)
- [ ] Create a renderer registry: `Record<ContentType, React.FC<ContentItemProps>>`
- [ ] Each primitive type gets its own renderer component in `features/window-manager/components/renderers/`
- [ ] `WindowContentRenderer` becomes a simple lookup + render ≤ 30 lines.

### Phase 4: API Layer Cleanup

- [ ] Create `lib/env.ts` with `USE_MOCK_API` flag.
- [ ] Wire mock APIs in `features/*/api.ts` behind the flag.
- [ ] Ensure all feature hooks use the same interface regardless of mock/real backend.
- [ ] Resolve hook name collisions: rename mock hooks to `use-<name>-mock.ts`.
- [ ] Delete empty `services/hook/` directory.

### Phase 5: Polish & Consistency

- [ ] Add `React.memo` to all presentational sub-components used in lists or receiving object props.
- [ ] Add `useCallback` to all callbacks passed as props to child components.
- [ ] Replace all hardcoded `#ff7e33` with `var(--os-accent)` or `text-os-accent`.
- [ ] Extract all magic numbers into named constants (TOP_BAR_HEIGHT, ICON_GRID_SIZE, etc.).
- [ ] Remove all `alert()` / `confirm()` calls — use custom retro dialogs.
- [ ] Remove all unused imports (run `tsc --noUnusedLocals`).
- [ ] Ensure all files use named exports (find and replace `export default`).
- [ ] Update `ThemeManager.tsx` to be a hook (`useThemeManager`) instead of a render-null component.
- [ ] Add keyboard shortcut data to a config file instead of hardcoding in `ShortcutsView.tsx`.

---

## 13. Adding New Features Checklist

When implementing any new feature, follow this checklist:

### Before Coding
- [ ] Read this document fully.
- [ ] Identify which feature module the code belongs to.
- [ ] Check if similar patterns already exist (search codebase first).
- [ ] Define types in the appropriate `types.ts` file BEFORE writing components.

### Implementation
- [ ] Create files following the folder structure in Section 3.
- [ ] One component per file, named export only.
- [ ] Follow the definition order in Section 4.2 exactly.
- [ ] Container/Presenter split for any component with business logic.
- [ ] Custom hook for any non-trivial logic (3+ useState, API calls, effects with cleanup).
- [ ] Use Tailwind + design system tokens for all styling (Section 9).
- [ ] Wrap sub-components with `React.memo` if they receive object/array props.
- [ ] Wrap callbacks with `useCallback` if passed as props.
- [ ] Use `useMemo` for derived data from expensive computations.

### State
- [ ] Local state for UI-only concerns (dropdowns, form inputs).
- [ ] Zustand store for state shared across components or persisted.
- [ ] React Query for server/async state.
- [ ] Never mix these — each state category has one source of truth.

### API Integration
- [ ] API service: `services/api/<domain>.api.ts` (no React code).
- [ ] React Query hook: `services/hooks/use-<domain>.ts`.
- [ ] Feature hook: `features/<name>/hooks/use-<name>-logic.ts` for view-model concerns.

### Quality
- [ ] No `any`, `@ts-ignore`, `console.log`, `alert()`, or `export default`.
- [ ] No magic numbers — extract to constants.
- [ ] No inline styles for static values — use Tailwind classes.
- [ ] No `dangerouslySetInnerHTML` — use safe rendering methods.
- [ ] Component file ≤ 200 lines (hard ceiling: 300).
- [ ] All effects have proper cleanup functions.
- [ ] Props interfaces documented with types.

### Testing Readiness
- [ ] Business logic in hooks/utils is pure and testable without React rendering.
- [ ] Store actions don't access `window` or `document` directly.
- [ ] No side effects in `useMemo`.
- [ ] Mock API layer works identically to real API via feature flag.

---

## 14. Naming Conventions Reference

| Entity | Convention | Example |
|--------|-----------|---------|
| Component file | `PascalCase.tsx` | `TaskDetailModal.tsx` |
| Component name | `PascalCase` | `export const TaskDetailModal` |
| Hook file | `use-kebab-case.ts` | `use-kanban.ts` |
| Hook name | `useCamelCase` | `export const useKanban` |
| Store file | `kebab-case-store.ts` | `window-store.ts` |
| Store hook | `usePascalCaseStore` | `export const useWindowStore` |
| Utility file | `kebab-case.ts` | `layout-utils.ts` |
| Type file | `types.ts` | Fixed name per module |
| Config file | `kebab-case.ts` | `design-tokens.ts` |
| Constants | `UPPER_SNAKE_CASE` | `const MAX_WINDOWS = 10` |
| CSS class tokens | `kebab-case` with `os-` prefix | `bg-os-bg`, `shadow-retro-md` |
| App registry key | `kebab-case` | `'kanban-board'` |
| Window preset key | `kebab-case` | `'system-overview'` |
| Content type | `kebab-case` | `'project-list'` |
| Folder (feature) | `kebab-case` | `features/conspiracy-map/` |
| Folder (component) | `kebab-case` | `components/` |
| Event handlers | `handle` + `Event` | `handleClick`, `handleSubmit` |
| Callbacks in props | `on` + `Action` | `onClose`, `onSelect` |
| Boolean state | `is/has/should` prefix | `isOpen`, `hasError`, `shouldAnimate` |
| Boolean props | `is/has/should` prefix | `isDisabled`, `isLoading` |

---

## 15. Common Gotchas

1. **Hydration guard**: Always check `_hasHydrated` before rendering anything that depends on persisted state. The store hydrates asynchronously from IndexedDB.

2. **Lazy imports require named exports**: The `loadApp()` helper accesses `module[name]`, so the exported component MUST be a named export matching the string passed to `loadApp`.

3. **Window positions are absolute pixels**: All coordinates (windows, icons, widgets) are stored as `{ x, y }` in pixels. They need reclamping when viewport resizes.

4. **System state machine**: `booting → login → running → shutdown`. Components should handle all states they might encounter. The App shell handles the top-level routing.

5. **Theme changes are CSS variable swaps**: Components using `var(--os-*)` or Tailwind's `os-*` utilities auto-update on theme change. Components using hardcoded hex values will NOT update.

6. **Content type rendering**: `WindowContentRenderer` first checks `APP_REGISTRY` for custom components, then falls back to rendering primitive content types (h1, p, table, etc.). If you add a new content type but forget to register it in either place, it renders nothing silently.

7. **React Query + Zustand boundary**: Server state (API data) goes in React Query. Client state (UI, OS simulation) goes in Zustand. Never store API responses in Zustand.

8. **IndexedDB persistence**: The store key is `'designeros-storage'`. Changing the state shape without migration logic can break rehydration for returning users. Consider versioning the persist config.

9. **Path aliases**: Use `@/` for project root imports. The aliases are configured in both `tsconfig.json` (for IDE) and `vite.config.ts` (for bundler). They must stay in sync.

10. **Framer Motion exit animations**: Windows use `AnimatePresence` for mount/unmount animations. Components that conditionally render based on store state MUST be wrapped in `AnimatePresence` and have `key`, `initial`, `animate`, and `exit` props.

---

## Appendix A: File Inventory (Current State)

| Category | Files | Total Lines | Notes |
|----------|-------|-------------|-------|
| App Components | 18 | ~5,160 | 6 god files need decomposition |
| Blog Sub-System | 7 | ~2,462 | BlogEditor alone is 1,196 lines |
| OS Components | 7 | ~1,152 | TopBar (382) needs splitting |
| Desktop Components | 5 | ~467 | Reasonable sizes |
| Window Manager | 4 | ~718 | ContentRenderer (290) needs strategy pattern |
| System Components | 5 | ~811 | LoginScreen (442) needs splitting |
| Stores | 2 | ~720 | os-store is a god object |
| Services (API + Hooks) | 22 | ~770 | Clean and well-structured |
| Types | 3 | ~376 | Duplication issues |
| Config | 5 | ~769 | Clean |
| Shared UI | 4 | ~580 | block-editor is dead code |
| Lib | 2 | ~276 | Dead code in api-client |
| Feature Data Layers | 8 | ~430 | Mock/real API collision |
| **TOTAL** | **~95** | **~13,691** | |

---

*Last updated: 2026-02-21 — Generated from full codebase analysis.*
