---
applyTo: '**'
---

# Cogito OS - AI Agent Instructions

## Project Overview
This is a retro-styled desktop OS simulation built in React + TypeScript, mimicking a Windows 95-era interface as a portfolio/personal website. Users interact with windows, icons, apps, and widgets in a nostalgic UI environment.

## Architecture

### State Management (Zustand + IndexedDB)
- **Central store**: [features/os/stores/os-store.ts](features/os/stores/os-store.ts) - manages entire OS state (windows, icons, widgets, system lifecycle, user session)
- Persisted to IndexedDB using `idb-keyval` for browser storage
- Access via `useOSStore()` hook throughout the app
- State includes: windows[], icons[], widgets[], systemState, theme, fileSystem, etc.

### App System
- **Registry pattern**: [features/apps/registry.ts](features/apps/registry.ts) - maps content types to lazy-loaded React components
- **Presets**: [config/apps.ts](config/apps.ts) - defines default window configurations with content arrays
- Apps use `APP_REGISTRY` with `hideToolbar` and `noPadding` flags to control window chrome
- Custom apps implement `AppProps` interface: `{ win: WindowDef; contentItem: ContentItem }`

### Window Management
- Windows are draggable, resizable, minimizable, and support workspace switching
- Each window has navigation history (back/forward) like a browser
- Content rendering: [features/window-manager/components/WindowContentRenderer.tsx](features/window-manager/components/WindowContentRenderer.tsx)
  - First checks `APP_REGISTRY` for custom components
  - Falls back to primitive content types (h1, p, table, hero, etc.)
- Windows auto-reposition/recenter on viewport resize

### Content Types System
All content is defined via `ContentItem[]` arrays (see [types.ts](types.ts)):
- **Primitives**: `h1`, `h2`, `p`, `list`, `table`, `line`, `button`, `spacer`, `stats`, `hero`
- **Apps**: `terminal`, `chatbot`, `browser`, `image-generator`, `file-manager`, `project-list`, etc.
- Custom apps are Suspense-wrapped lazy imports with loading fallback

## Key Conventions

### Styling
- **Retro aesthetic**: Use `shadow-retro-{sm|md|lg}` Tailwind utilities (defined in [theme/design-tokens.ts](theme/design-tokens.ts))
- Hard borders: always `border-2 border-os-border` (black)
- Color palette: `bg-os-bg` (bone), `bg-os-window` (white), `text-os-accent` (orange)
- Fonts: `font-mono` for system text, `font-sans` for headings
- Pixelated images: use `className="pixelated"` with `imageRendering: 'pixelated'`

### Component Patterns
- Icons use [components/ui/hand-drawn-icons.tsx](components/ui/hand-drawn-icons.tsx) for custom SVG artwork
- Motion: use `framer-motion` for window animations (`initial`, `animate`, `exit` patterns)
- Retro UI components in [components/ui/retro-ui.tsx](components/ui/retro-ui.tsx) (buttons, inputs, panels)

### File Organization
- **features/**: feature-based structure (apps/, desktop/, os/, window-manager/, etc.)
- **config/**: centralized configuration (apps.ts, desktop.ts, system.ts, terminal.ts, translations.ts)
- Each feature has: `components/`, `hooks/`, `stores/` (if needed), `types.ts`, `api.ts`
- Apps live in `features/apps/` with registry.ts managing imports

## Development Workflow

### Running Locally
```bash
pnpm install
pnpm dev  # Starts Vite dev server on port 3001
```

### Environment Setup
- Create `.env.local` with `GEMINI_API_KEY=your_key_here`
- API key accessed via `process.env.API_KEY` (Vite define in [vite.config.ts](vite.config.ts))
- Used by Chatbot and ImageGenerator apps via Google GenAI SDK

### Adding New Apps
1. Create component in `features/apps/YourApp.tsx` exporting named function
2. Register in `features/apps/registry.ts`:
   ```ts
   'your-app': {
     component: loadApp(() => import('./YourApp'), 'YourApp'),
     hideToolbar: true,  // optional
     noPadding: true     // optional
   }
   ```
3. Add preset to `config/apps.ts`:
   ```ts
   'your-preset': {
     title: 'YOUR_APP.EXE',
     content: [{ type: 'your-app' }]
   }
   ```
4. Update `ContentType` union in [types.ts](types.ts)

### Window Spawning
```ts
const { spawnWindow } = useOSStore();
spawnWindow('unique-id', {
  title: 'WINDOW_TITLE.EXE',
  w: 800, h: 600,
  content: [{ type: 'your-app' }]
});
```

### Icon Actions
Desktop icons trigger actions in `DesktopIcon.tsx` via `handleIconDoubleClick`:
- Maps icon IDs to spawn window presets
- Icon positions stored in store: `{ id, label, type, x, y }`

## Common Patterns

### Accessing Store Actions
```ts
const { spawnWindow, closeWindow, updateWindow, focusWindow } = useOSStore();
```

### Navigation History
```ts
const { navigateWindow, goBack, goForward } = useOSStore();
navigateWindow(win.id, { title: 'New View', content: [...] });
```

### Theme Switching
Themes defined in [features/system/components/ThemeManager.tsx](features/system/components/ThemeManager.tsx):
- `bone` (default beige), `night` (dark), `seraph` (white), `gruvbox` (retro)
- Applied via CSS variables to document root

### Keyboard Shortcuts
Global shortcuts in [App.tsx](App.tsx):
- `Cmd/Ctrl + K`: Command Palette
- `Shift + ?`: Shortcuts Sheet

## Tech Stack
- **Build**: Vite 6 + TypeScript 5.8
- **UI**: React 18, Framer Motion, Lucide icons
- **State**: Zustand (persisted to IndexedDB)
- **Styling**: Tailwind (via design tokens, no config file visible)
- **Data**: React Query (@tanstack/react-query) for async state
- **AI**: Google GenAI SDK (@google/genai)
- **Terminal**: xterm.js
- **Markdown**: react-markdown + remark-gfm

## Gotchas
- All positions (windows, icons, widgets) use absolute pixel coordinates
- Window clamping logic in `os-store.ts` ensures windows stay in viewport bounds
- Lazy imports require named exports wrapped with `loadApp()` helper
- `_hasHydrated` flag prevents hydration mismatches with persisted state
- System states: `booting` → `login` → `running` → `shutdown`
