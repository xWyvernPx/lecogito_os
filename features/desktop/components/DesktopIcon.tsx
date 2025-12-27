import React from 'react';
import { motion } from 'framer-motion';
import { HandDrawnIcon } from '../../../components/ui/hand-drawn-icons';
import { DesktopIconDef } from '../../../types';
import { useOSStore } from '../../os/stores/os-store';

interface DesktopIconProps extends DesktopIconDef {
  isSelected: boolean;
  onSelect: () => void;
  onOpen: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ 
  id, label, type, x, y, isSelected, onSelect, onOpen, onMove 
}) => {
  const { openContextMenu } = useOSStore();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(); // Select the icon when right-clicked
    openContextMenu(e.clientX, e.clientY, 'icon', id);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x, y }}
      animate={{ x, y }} // Sync with store state (grid snap happens here)
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, zIndex: 100, opacity: 0.8 }}
      onDragStart={() => onSelect()}
      onDragEnd={(_e, info) => {
        // Snap to grid (10px)
        const SNAP = 10;
        const newX = Math.round((x + info.offset.x) / SNAP) * SNAP;
        const newY = Math.round((y + info.offset.y) / SNAP) * SNAP;
        
        // Prevent dragging offscreen (basic)
        const boundedX = Math.max(0, Math.min(window.innerWidth - 80, newX));
        const boundedY = Math.max(0, Math.min(window.innerHeight - 80, newY));

        onMove(id, boundedX, boundedY);
      }}
      onClick={(e) => {
          e.stopPropagation();
          onSelect();
      }}
      onDoubleClick={(e) => {
          e.stopPropagation();
          onOpen(id);
      }}
      onContextMenu={handleContextMenu}
      className="absolute flex flex-col items-center justify-center w-24 cursor-pointer group pointer-events-auto"
      // Note: We use style={{ x, y }} implicitly via animate prop in framer-motion which handles the transform
    >
      <div className="relative drop-shadow-md">
         <HandDrawnIcon type={type} size={56} />
      </div>
      
      <span className={`
        mt-2 text-xs font-bold font-mono px-1.5 py-0.5 text-center leading-tight select-none border transition-colors
        ${isSelected 
            ? 'bg-os-accent text-white border-os-border shadow-retro-sm' 
            : 'bg-white/50 border-transparent group-hover:bg-white group-hover:border-os-border'}
      `}>
        {label}
      </span>
    </motion.div>
  );
};