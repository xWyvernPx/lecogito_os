
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { MenuItemDef } from '@/types';

// --- MenuDropdown ---
interface MenuDropdownProps {
  children: React.ReactNode;
  align?: 'left' | 'right';
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({ children, align = 'left' }) => (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-64 bg-os-window border-2 border-os-border shadow-retro-md rounded-sm z-[200] flex flex-col py-1 overflow-visible `}
    >
      {children}
    </motion.div>
);

// --- MenuItem ---
export const MenuItem: React.FC<MenuItemDef> = ({ icon, label, onClick, danger, shortcut, subItems }) => {
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

// --- MenuDivider ---
export const MenuDivider = () => <div className="h-px bg-os-border mx-0 my-1 opacity-20" />;

// --- Bluetooth mock icon ---
// Simple mock for Bluetooth if not available, though Lucide usually has it.
export const Bluetooth = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 7l10 10-5 5V2l5 5L7 17" />
    </svg>
);
