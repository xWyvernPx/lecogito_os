
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Volume2, Battery, Settings, Power, User, Coffee, MessageSquare, Layers, Globe, Keyboard } from 'lucide-react';
import { MenuDropdown, MenuItem, MenuDivider, Bluetooth } from '@/features/os/top-bar/components/MenuPrimitives';
import { useTranslation } from '@/features/os/hooks/use-translation';
import { WindowDef, UserProfile, Language } from '@/types';

interface SystemTrayProps {
  activeMenu: string | null;
  setActiveMenu: (menu: string | null) => void;
  currentWorkspace: number;
  setWorkspace: (num: number) => void;
  windows: WindowDef[];
  spawnWindow: (id: string) => void;
  caffeineLevel: number;
  drinkCoffee: () => void;
  logout: () => void;
  currentUser: UserProfile | null;
  toggleWindowDrawer: () => void;
  isWindowDrawerOpen: boolean;
  setLanguage: (lang: Language) => void;
  language: Language;
  toggleShortcuts: () => void;
  shutdownSystem: () => void;
}

export const SystemTray: React.FC<SystemTrayProps> = ({
  activeMenu, setActiveMenu, currentWorkspace, setWorkspace, windows,
  spawnWindow, caffeineLevel, drinkCoffee, logout, currentUser,
  toggleWindowDrawer, isWindowDrawerOpen, setLanguage, language,
  toggleShortcuts, shutdownSystem,
}) => {
  const { t } = useTranslation();

  // Caffeine Color Logic
  const getCaffeineColor = () => {
      if (caffeineLevel > 60) return 'text-os-muted';
      if (caffeineLevel > 30) return 'text-orange-500';
      return 'text-red-500 animate-pulse';
  };

  return (
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
               aria-label={`Switch to workspace ${num}`}
               aria-pressed={currentWorkspace === num}
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
                         <button 
                             className="flex flex-col items-center justify-center p-3 bg-os-accent text-white border-2 border-os-border shadow-retro-sm"
                             aria-label="WiFi enabled"
                             aria-pressed="true"
                         >
                             <Wifi size={16} />
                             <span className="text-[10px] font-bold mt-1">{t('system.wifi')}</span>
                         </button>
                         <button 
                             className="flex flex-col items-center justify-center p-3 bg-os-bg text-os-muted border-2 border-os-border"
                             aria-label="Bluetooth disabled"
                             aria-pressed="false"
                         >
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
  );
};
