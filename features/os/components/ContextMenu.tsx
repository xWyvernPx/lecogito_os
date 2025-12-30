
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, FolderPlus, Settings, Trash2, ExternalLink, Edit2, Copy, Monitor, Clipboard, LayoutGrid, CheckSquare } from 'lucide-react';
import { useOSStore } from '../stores/os-store';

export const ContextMenu: React.FC = () => {
  const { contextMenu, closeContextMenu, spawnWindow, removeIcon, sortIcons, resetDesktop, selectIcon } = useOSStore();
  const { isOpen, x, y, type, targetId } = contextMenu;

  // Prevent menu from opening off-screen
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 400);

  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    closeContextMenu();
  };

  const DesktopItems = () => (
    <>
      <MenuItem 
        label="New Folder" 
        icon={<FolderPlus size={14} />} 
        onClick={() => handleAction(() => alert("Simulated: New Folder Created"))} 
        shortcut="Ctrl+N"
      />
      <MenuItem 
        label="Paste" 
        icon={<Clipboard size={14} />} 
        onClick={() => handleAction(() => alert("Simulated: Item Pasted"))} 
        shortcut="Ctrl+V"
      />
      <MenuItem 
        label="Select All" 
        icon={<CheckSquare size={14} />} 
        onClick={() => handleAction(() => {})} 
        shortcut="Ctrl+A"
      />
      <MenuDivider />
      <MenuItem 
        label="Sort Icons by Name" 
        icon={<LayoutGrid size={14} />} 
        onClick={() => handleAction(() => sortIcons())} 
      />
      <MenuItem 
        label="Restore Desktop Icons" 
        icon={<RefreshCw size={14} />} 
        onClick={() => handleAction(() => resetDesktop())} 
      />
      <MenuDivider />
      <MenuItem 
        label="Display Settings" 
        icon={<Monitor size={14} />} 
        onClick={() => handleAction(() => spawnWindow('display-settings'))} 
      />
      <MenuItem 
        label="System Properties" 
        icon={<Settings size={14} />} 
        onClick={() => handleAction(() => spawnWindow('about'))} 
      />
    </>
  );

  const IconItems = () => (
    <>
      <MenuItem 
        label="Open" 
        icon={<ExternalLink size={14} />} 
        onClick={() => handleAction(() => targetId && spawnWindow(targetId))} 
        bold
      />
      <MenuDivider />
      <MenuItem 
        label="Copy" 
        icon={<Copy size={14} />} 
        onClick={() => handleAction(() => {})} 
        shortcut="Ctrl+C"
      />
      <MenuItem 
        label="Rename" 
        icon={<Edit2 size={14} />} 
        onClick={() => handleAction(() => alert(`Rename ${targetId}`))} 
      />
      <MenuDivider />
      <MenuItem 
        label="Delete" 
        icon={<Trash2 size={14} />} 
        onClick={() => handleAction(() => targetId && removeIcon(targetId))} 
        danger
      />
    </>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          style={{ top: adjustedY, left: adjustedX }}
          className="fixed z-[9999] w-56 bg-[#fdfdfd] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] flex flex-col py-1 pointer-events-auto"
          onClick={(e) => e.stopPropagation()} 
          onContextMenu={(e) => e.preventDefault()}
        >
           {/* Retro Title Bar for Context Menu */}
           <div className="px-2 py-1 bg-stone-100 border-b border-stone-300 mb-1 flex justify-between items-center">
             <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
               {type === 'desktop' ? 'System' : 'Object'} Actions
             </span>
             <div className="flex gap-1">
               <div className="w-2 h-2 rounded-full bg-stone-300"></div>
               <div className="w-2 h-2 rounded-full bg-stone-300"></div>
             </div>
           </div>

           {type === 'desktop' && <DesktopItems />}
           {type === 'icon' && <IconItems />}

        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Sub-components ---

const MenuDivider = () => <div className="h-px bg-stone-200 mx-2 my-1" />;

interface MenuItemProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  shortcut?: string;
  danger?: boolean;
  bold?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, icon, onClick, shortcut, danger, bold }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`
        group relative flex items-center justify-between px-4 py-2 mx-1 rounded-sm
        hover:bg-[#ff7e33] hover:text-white transition-colors outline-none
        ${danger ? 'text-red-600 hover:bg-red-500' : 'text-stone-800'}
      `}
    >
      <div className="flex items-center gap-3">
        <span className={`group-hover:text-white ${danger ? 'text-red-500' : 'text-stone-500'}`}>
          {icon}
        </span>
        <span className={`text-sm ${bold ? 'font-bold' : 'font-sans'}`}>
          {label}
        </span>
      </div>
      {shortcut && (
        <span className="text-[10px] font-mono text-stone-400 group-hover:text-white/80">
          {shortcut}
        </span>
      )}
    </button>
  );
};
