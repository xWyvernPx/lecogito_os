
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Command, User, Monitor, Cpu, LayoutGrid, Calculator, Terminal, Folder, FileText, MessageSquare, Settings, Power, PackagePlus } from 'lucide-react';
import { MenuDropdown, MenuItem, MenuDivider } from '@/features/os/top-bar/components/MenuPrimitives';
import { useTranslation } from '@/features/os/hooks/use-translation';

interface ActivitiesMenuProps {
  activeMenu: string | null;
  setActiveMenu: (menu: string | null) => void;
  spawnWindow: (id: string) => void;
  shutdownSystem: () => void;
  rebootSystem: () => void;
}

export const ActivitiesMenu: React.FC<ActivitiesMenuProps> = ({ activeMenu, setActiveMenu, spawnWindow, shutdownSystem, rebootSystem }) => {
  const { t } = useTranslation();

  return (
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
  );
};
