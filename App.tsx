
import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOSStore } from './features/os/stores/os-store';
import { Wallpaper } from './features/desktop/components/Wallpaper';
import { TopBar } from './features/os/components/TopBar';
import { DesktopIcon } from './features/desktop/components/DesktopIcon';
import { WindowFrame } from './features/window-manager/components/WindowFrame';
import { BootScreen } from './features/system/components/BootScreen';
import { ShutdownScreen } from './features/system/components/ShutdownScreen';
import { LoginScreen } from './features/system/components/LoginScreen';
import { ContextMenu } from './features/os/components/ContextMenu';
import { WidgetLayer } from './features/desktop/components/WidgetLayer';
import { ThemeManager } from './features/system/components/ThemeManager';
import { WindowDrawer } from './features/os/components/WindowDrawer';
import { CommandPalette } from './features/os/components/CommandPalette';
import { ShortcutsSheet } from './features/os/components/ShortcutsSheet';

export function App() {
  const { 
    systemState,
    lastBootTime,
    _hasHydrated,
    bootSystem,
    completeBoot,
    rebootSystem,
    windows, 
    icons, 
    selectedIconId, 
    currentWorkspace, 
    setActiveMenu, 
    spawnWindow,
    selectIcon,
    moveIcon,
    openContextMenu,
    closeContextMenu,
    caffeineLevel,
    recenterWindows,
    repositionIcons,
    toggleCommandPalette,
    toggleShortcuts
  } = useOSStore();

  const handleBackgroundClick = (e: React.MouseEvent) => {
    setActiveMenu(null);
    selectIcon(null);
    closeContextMenu();
  };

  const handleBackgroundContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, 'desktop');
  };

  // --- Auto-Recenter Logic ---
  useEffect(() => {
    if (!_hasHydrated) return;
    recenterWindows();
    repositionIcons();
    
    const handleResize = () => {
        recenterWindows();
        repositionIcons();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [_hasHydrated, recenterWindows, repositionIcons]);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (systemState === 'running') {
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;
      if (Date.now() - lastBootTime > ONE_DAY_MS) {
        bootSystem();
      }
    }
  }, [_hasHydrated, systemState, lastBootTime, bootSystem]);

  // --- Global Keyboard Shortcuts ---
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          // Command/Ctrl + K => Command Palette
          if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
              e.preventDefault();
              toggleCommandPalette();
          }
          // Shift + ? (which is technically just '?') => Shortcuts Sheet
          if (e.key === '?') {
              e.preventDefault();
              toggleShortcuts();
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette, toggleShortcuts]);

  if (!_hasHydrated) {
    return <div className="fixed inset-0 bg-black z-[10000]" />;
  }

  if (systemState === 'booting') {
    return <BootScreen onComplete={completeBoot} />;
  }

  if (systemState === 'shutdown') {
    return <ShutdownScreen onRestart={rebootSystem} />;
  }

  const isLogin = systemState === 'login';
  const grogginess = Math.max(0, 40 - caffeineLevel); 
  const blurAmount = isLogin ? 20 : (grogginess * 0.1); 
  const saturation = isLogin ? 120 : (100 - (grogginess * 2)); 
  const scale = isLogin ? 1.05 : 1;

  const bgStyle = {
    filter: `blur(${blurAmount}px) saturate(${saturation}%)`,
    transform: `scale(${scale})`,
    transition: 'all 0.8s ease-in-out',
    opacity: 1
  };

  return (
    <div 
      className="relative w-full h-[100dvh] overflow-hidden bg-os-bg text-os-text font-mono select-none" 
      onClick={handleBackgroundClick}
      onContextMenu={handleBackgroundContextMenu}
    >
      <ThemeManager />
      
      <div className="absolute inset-0 transition-all duration-700" style={bgStyle}>
          <Wallpaper />
          <WidgetLayer />
      </div>

      <AnimatePresence>
        {isLogin && <LoginScreen />}
      </AnimatePresence>

      <AnimatePresence>
        {!isLogin && (
          <div className="relative z-10 w-full h-full pointer-events-none">
            <div className="pointer-events-auto">
              <TopBar />
            </div>

            <div className="absolute inset-0 top-9 pointer-events-none">
               <div className="w-full h-full relative pointer-events-none">
                 {icons.map(icon => (
                   <DesktopIcon 
                     key={icon.id}
                     {...icon}
                     isSelected={selectedIconId === icon.id}
                     onSelect={() => selectIcon(icon.id)}
                     onOpen={(id) => spawnWindow(id)}
                     onMove={moveIcon}
                   />
                 ))}
               </div>
            </div>

            <div className="absolute inset-0 top-9 pointer-events-none overflow-hidden">
              <div className="relative w-full h-full pointer-events-none">
                <AnimatePresence>
                  {windows
                    .filter(w => w.workspace === currentWorkspace)
                    .map(win => (
                      <WindowFrame key={win.id} win={win} />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <ContextMenu />
            <WindowDrawer />
            <CommandPalette />
            <ShortcutsSheet />
            
            <div 
                className="pointer-events-none fixed inset-0 z-[9998] bg-black transition-opacity duration-1000"
                style={{ opacity: caffeineLevel < 10 ? 0.3 : 0 }} 
            />
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
