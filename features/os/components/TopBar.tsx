import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOSStore } from '../stores/os-store';
import { CalendarWidget } from '../../system/components/CalendarWidget';
import { ActivitiesMenu } from '../top-bar/components/ActivitiesMenu';
import { SystemTray } from '../top-bar/components/SystemTray';

export const TopBar: React.FC = () => {
  const { activeMenu, setActiveMenu, currentWorkspace, setWorkspace, windows, spawnWindow, shutdownSystem, rebootSystem, caffeineLevel, decreaseCaffeine, drinkCoffee, logout, currentUser, toggleWindowDrawer, isWindowDrawerOpen, setLanguage, language, toggleShortcuts } = useOSStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Caffeine drain logic
  useEffect(() => {
    if (caffeineLevel > 0) {
        const timer = setInterval(decreaseCaffeine, 3000);
        return () => clearInterval(timer);
    }
  }, [caffeineLevel, decreaseCaffeine]);

  const activeWindow = windows.find(w => w.isActive && w.workspace === currentWorkspace && !w.isMinimized);

  return (
    <div className="h-9 bg-os-window border-b-2 border-os-border flex items-center justify-between px-3 relative z-50 shadow-sm shrink-0">
      {/* LEFT: Activities Menu */}
      <div className="flex items-center gap-4 h-full" onClick={(e) => e.stopPropagation()}>
        <ActivitiesMenu activeMenu={activeMenu} setActiveMenu={setActiveMenu} spawnWindow={spawnWindow} shutdownSystem={shutdownSystem} rebootSystem={rebootSystem} />
        {activeWindow && (
          <>
            <div className="h-4 w-px bg-os-border opacity-30" />
            <span className="text-xs font-bold text-os-text flex items-center gap-2 truncate max-w-[120px] md:max-w-none">
              {activeWindow.title}
            </span>
          </>
        )}
      </div>

      {/* CENTER: Clock / Calendar Trigger */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setActiveMenu(activeMenu === 'calendar' ? null : 'calendar')}
          className={`font-bold text-sm select-none text-os-text px-3 py-1 rounded transition-colors ${activeMenu === 'calendar' ? 'bg-os-bg border border-os-border' : 'hover:bg-os-bg border border-transparent'}`}
        >
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </button>
        <AnimatePresence>
          {activeMenu === 'calendar' && <CalendarWidget />}
        </AnimatePresence>
      </div>

      {/* RIGHT: System Tray */}
      <SystemTray
        activeMenu={activeMenu} setActiveMenu={setActiveMenu} currentWorkspace={currentWorkspace}
        setWorkspace={setWorkspace} windows={windows} spawnWindow={spawnWindow}
        caffeineLevel={caffeineLevel} drinkCoffee={drinkCoffee} logout={logout}
        currentUser={currentUser} toggleWindowDrawer={toggleWindowDrawer}
        isWindowDrawerOpen={isWindowDrawerOpen} setLanguage={setLanguage} language={language}
        toggleShortcuts={toggleShortcuts} shutdownSystem={shutdownSystem}
      />
    </div>
  );
};
