
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, ChevronRight, Wifi, Volume2, Battery, Settings, Power, User, Monitor, Cpu, LayoutGrid, Calculator, Terminal, Folder, FileText, Coffee, MessageSquare, Layers, Globe, Keyboard, PackagePlus } from 'lucide-react';
import { useOSStore } from '../stores/os-store';
import { MenuItemDef } from '../../../types';
import { CalendarWidget } from '../../system/components/CalendarWidget';
import { useTranslation } from '../hooks/use-translation';

// --- Sub Components ---
interface MenuDropdownProps {
  children: React.ReactNode;
  align?: 'left' | 'right';
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({ children, align = 'left' }) => (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-64 bg-os-window border-2 border-os-border shadow-retro-md rounded-sm z-[200] flex flex-col py-1 overflow-visible max-h-[85vh] overflow-y-auto`}
    >
      {children}
    </motion.div>
  );
  
  const MenuItem: React.FC<MenuItemDef> = ({ icon, label, onClick, danger, shortcut, subItems }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
      >
          <button 
              onClick={onClick}
              className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-os-bg transition-colors ${danger ? 'text-red-600 hover:bg-red-50' : 'text-os-text'} ${isHovered && subItems ? 'bg-os-bg' : ''}`}
          >
              <div className="flex items-center gap-2">
                  {/* Cast to ReactElement<any> to allow injecting 'size' prop without TS errors */}
                  {icon && React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 14 }) : icon}
                  <span className="text-sm font-sans">{label}</span>
              </div>
              
              {/* Right side: Shortcut or Submenu Arrow */}
              <div className="flex items-center gap-2">
                  {shortcut && (
                      <div className="flex gap-1">
                          {shortcut.map((key, i) => (
                              <span key={i} className="text-[10px] border border-os-border rounded px-1.5 py-0.5 bg-os-window text-os-muted font-sans shadow-sm">
                                  {key}
                              </span>
                          ))}
                      </div>
                  )}
                  {subItems && <ChevronRight size={14} className="text-os-muted" />}
              </div>
          </button>
  
          {/* Nested Submenu */}
          <AnimatePresence>
              {isHovered && subItems && (
                  <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.1 }}
                      className="absolute left-full top-0 ml-1 w-56 bg-os-window border-2 border-os-border shadow-retro-md rounded-sm z-[201] flex flex-col py-1 max-h-[60vh] overflow-y-auto"
                  >
                      {subItems.map((item, idx) => (
                          <MenuItem 
                              key={idx} 
                              icon={item.icon} 
                              label={item.label} 
                              onClick={item.onClick}
                              shortcut={item.shortcut}
                              danger={item.danger}
                          />
                      ))}
                  </motion.div>
              )}
          </AnimatePresence>
      </div>
    );
  };
  
  const MenuDivider = () => <div className="h-px bg-os-border mx-0 my-1 opacity-20" />;


export const TopBar: React.FC = () => {
  const { activeMenu, setActiveMenu, currentWorkspace, setWorkspace, windows, spawnWindow, shutdownSystem, rebootSystem, caffeineLevel, decreaseCaffeine, drinkCoffee, logout, currentUser, toggleWindowDrawer, isWindowDrawerOpen, setLanguage, language, toggleShortcuts } = useOSStore();
  const [time, setTime] = useState(new Date());
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Caffeine drain logic
  useEffect(() => {
    if (caffeineLevel > 0) {
        // Decrease 1% every 3 seconds (5 minutes to drain completely)
        const timer = setInterval(decreaseCaffeine, 3000); 
        return () => clearInterval(timer);
    }
  }, [caffeineLevel, decreaseCaffeine]);

  const activeWindow = windows.find(w => w.isActive && w.workspace === currentWorkspace && !w.isMinimized);

  // Caffeine Color Logic
  const getCaffeineColor = () => {
      if (caffeineLevel > 60) return 'text-os-muted';
      if (caffeineLevel > 30) return 'text-orange-500';
      return 'text-red-500 animate-pulse';
  };

  return (
    <div className="h-9 bg-os-window border-b-2 border-os-border flex items-center justify-between px-3 relative z-50 shadow-sm shrink-0">
           
    {/* LEFT: Activities Menu */}
    <div className="flex items-center gap-4 h-full" onClick={(e) => e.stopPropagation()}>
       <div className="relative">
         <button 
             onClick={() => setActiveMenu(activeMenu === 'activities' ? null : 'activities')}
             className={`h-6 px-3 flex items-center gap-2 border border-transparent hover:bg-os-bg rounded transition-colors ${activeMenu === 'activities' ? 'bg-os-bg' : ''}`}
         >
             <Command size={14} className="text-os-accent" />
             <span className="font-bold text-xs text-os-text">{t('menu.activities')}</span>
         </button>
 
         <AnimatePresence>
             {activeMenu === 'activities' && (
                 <MenuDropdown>
                     <MenuItem icon={<User />} label={t('menu.my_computer')} subItems={[
                         { label: t('menu.system_overview'), icon: <Monitor />, onClick: () => spawnWindow('system-overview') },
                         { label: t('menu.storage'), icon: <Cpu />, onClick: () => spawnWindow('system-storage') },
                     ]} />
                     <MenuItem icon={<LayoutGrid />} label={t('menu.applications')} subItems={[
                         { label: t('app.calculator'), icon: <Calculator /> },
                         { label: t('app.terminal'), icon: <Terminal />, onClick: () => spawnWindow('terminal') },
                         { label: t('app.file_manager'), icon: <Folder />, onClick: () => spawnWindow('file-manager') },
                         { label: t('app.text_editor'), icon: <FileText />, onClick: () => spawnWindow('about') },
                         { label: t('app.ai_chat'), icon: <MessageSquare />, onClick: () => spawnWindow('chatbot') },
                         { label: 'App Studio', icon: <PackagePlus />, onClick: () => spawnWindow('app-creator') },
                     ]} />
                     <MenuItem icon={<Folder />} label={t('menu.recent_files')} subItems={[
                         { label: 'projects.mdx' },
                         { label: 'about.txt' },
                         { label: 'invoice_2024.pdf' },
                     ]} />
                     <MenuDivider />
                     <MenuItem 
                         label={t('menu.display_options')} 
                         shortcut={[',']} 
                         icon={<Monitor />} 
                         onClick={() => spawnWindow('display-settings')}
                     />
                     <MenuDivider />
                     <MenuItem icon={<Settings />} label={t('menu.system_settings')} subItems={[
                         { label: t('menu.appearance') },
                         { label: t('menu.network') },
                         { label: t('menu.sound') },
                     ]} />
                     <MenuItem icon={<Power />} label={t('menu.power')} danger subItems={[
                         { label: t('menu.sleep') },
                         { label: t('menu.restart'), onClick: () => rebootSystem() },
                         { label: t('menu.power_off'), danger: true, onClick: () => shutdownSystem() },
                     ]} />
                 </MenuDropdown>
             )}
         </AnimatePresence>
       </div>
 
       {/* Active App Indicator */}
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
 
    {/* RIGHT: System Status / Control Center */}
    <div className="relative h-full flex items-center" onClick={(e) => e.stopPropagation()}>
       
       {/* Chatbot Launcher */}
       <div className="mr-4 pr-4 border-r-2 border-os-border/20 h-1/2 flex items-center">
            <button 
                onClick={() => spawnWindow('chatbot')}
                className="text-os-text hover:text-os-accent transition-colors"
                title="Open AI Chat Assistant"
            >
                <MessageSquare size={16} />
            </button>
       </div>

       {/* Window Drawer Toggle */}
       <div className="mr-4 pr-4 border-r-2 border-os-border/20 h-1/2 hidden md:flex items-center">
            <button 
                onClick={toggleWindowDrawer}
                className={`text-os-text hover:text-os-accent transition-colors ${isWindowDrawerOpen ? 'text-os-accent' : ''}`}
                title={t('drawer.active_windows')}
            >
                <Layers size={16} />
                {windows.filter(w => !w.isMinimized).length > 0 && (
                    <span className="absolute top-2 ml-3 w-2 h-2 bg-green-500 rounded-full border border-os-window" />
                )}
            </button>
       </div>

       {/* Caffeine Widget */}
       <div className="mr-4 pr-4 border-r-2 border-os-border/20 h-1/2 hidden md:flex items-center">
            <button 
                onClick={drinkCoffee}
                className={`flex items-center gap-2 group ${getCaffeineColor()}`}
                title="Caffeine Level (Click to Refill)"
            >
                <div className="relative">
                    <Coffee size={14} />
                    {/* Steam animation if level is high */}
                    {caffeineLevel > 80 && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-full flex justify-center gap-[2px]">
                            <motion.div animate={{ y: [-2, -6], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-[1px] h-2 bg-os-text rounded-full" />
                            <motion.div animate={{ y: [-2, -6], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-[1px] h-2 bg-os-text rounded-full" />
                        </div>
                    )}
                </div>
                <div className="w-12 h-2 bg-os-bg rounded-full overflow-hidden border border-os-border relative">
                    <motion.div 
                        initial={{ width: '100%' }}
                        animate={{ width: `${caffeineLevel}%` }}
                        className={`h-full ${caffeineLevel > 30 ? 'bg-[#78350f]' : 'bg-red-500'}`}
                    />
                </div>
                {caffeineLevel < 30 && <span className="text-[10px] font-bold text-red-500 hidden md:block">LOW!</span>}
            </button>
       </div>

       {/* Workspace Switcher */}
       <div className="hidden lg:flex items-center gap-1 mr-4 pr-4 border-r-2 border-os-border/20 h-1/2">
          {[1, 2, 3, 4, 5].map(num => (
             <button
               key={num}
               onClick={() => setWorkspace(num)}
               className={`
                 w-6 h-6 flex items-center justify-center text-xs font-bold rounded-sm transition-all
                 ${currentWorkspace === num 
                     ? 'bg-os-accent border-2 border-os-border shadow-retro-sm translate-y-[-2px] text-white' 
                     : 'text-os-muted hover:bg-os-bg'}
               `}
             >
               {num}
             </button>
          ))}
       </div>
 
       <button 
         onClick={() => setActiveMenu(activeMenu === 'system' ? null : 'system')}
         className={`flex items-center gap-3 px-2 py-1 hover:bg-os-bg rounded border border-transparent text-os-text ${activeMenu === 'system' ? 'bg-os-bg' : ''}`}
       >
          <Wifi size={14} />
          <Volume2 size={14} />
          <div className="flex items-center gap-1">
              <span className="text-xs font-bold">90%</span>
              <Battery size={14} />
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 border border-os-border shadow-[1px_1px_0_0_rgba(0,0,0,0.2)]" />
       </button>
 
       <AnimatePresence>
         {activeMenu === 'system' && (
             <MenuDropdown align="right">
                 <div className="px-4 py-3">
                     <div className="flex justify-between items-center mb-4">
                         <span className="text-xs font-bold text-os-muted">
                            {currentUser ? currentUser.name : t('system.guest')}
                         </span>
                         {currentUser && (
                            <div className="w-5 h-5 rounded-full overflow-hidden border border-os-border">
                                <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                         )}
                     </div>
                     
                     {/* Toggles */}
                     <div className="grid grid-cols-2 gap-2 mb-4">
                         <button className="flex flex-col items-center justify-center p-3 bg-os-accent text-white border-2 border-os-border shadow-retro-sm">
                             <Wifi size={16} />
                             <span className="text-[10px] font-bold mt-1">{t('system.wifi')}</span>
                         </button>
                         <button className="flex flex-col items-center justify-center p-3 bg-os-bg text-os-muted border-2 border-os-border">
                             <Bluetooth size={16} /> 
                             <span className="text-[10px] font-bold mt-1">{t('system.bluetooth')}</span>
                         </button>
                     </div>
 
                     {/* Volume Slider */}
                     <div className="mb-2">
                         <div className="flex justify-between text-[10px] font-bold mb-1 text-os-text">
                             <span>{t('system.volume')}</span>
                             <span>75%</span>
                         </div>
                         <div className="h-2 w-full bg-os-bg border border-os-border relative">
                             <div className="absolute top-0 left-0 h-full w-3/4 bg-os-accent" />
                         </div>
                     </div>
                 </div>
                 
                 {/* Language Switcher Row */}
                 <div className="flex items-center justify-between px-4 py-2 border-t border-os-border/50 hover:bg-os-bg transition-colors">
                    <div className="flex items-center gap-2 text-sm text-os-text">
                        <Globe size={14} />
                        <span>{t('system.language')}</span>
                    </div>
                    <div className="flex gap-1">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setLanguage('en'); }}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${language === 'en' ? 'bg-os-accent text-white border-os-accent' : 'bg-white border-os-border text-os-muted'}`}
                        >
                            EN
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setLanguage('vi'); }}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${language === 'vi' ? 'bg-os-accent text-white border-os-accent' : 'bg-white border-os-border text-os-muted'}`}
                        >
                            VI
                        </button>
                    </div>
                 </div>

                 <MenuDivider />
                 <MenuItem 
                    label={t('system.shortcuts')} 
                    icon={<Keyboard />} 
                    shortcut={['?']} 
                    onClick={() => toggleShortcuts()} 
                 />
                 <MenuItem label={t('menu.system_settings')} icon={<Settings />} />
                 <MenuItem label={t('menu.logout')} icon={<User />} onClick={() => logout()} />
                 <MenuItem label={t('menu.shutdown')} danger icon={<Power />} onClick={() => shutdownSystem()} />
             </MenuDropdown>
         )}
       </AnimatePresence>
    </div>
 </div>
  );
};

// Simple mock for Bluetooth if not available, though Lucide usually has it.
const Bluetooth = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 7l10 10-5 5V2l5 5L7 17" />
    </svg>
);
