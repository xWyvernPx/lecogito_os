
import React from 'react';
import { motion } from 'framer-motion';
import { useOSStore } from '../../os/stores/os-store';
import { ClockWidget } from './widgets/ClockWidget';
import { MusicPlayerWidget } from './widgets/MusicPlayerWidget';

export const WidgetLayer: React.FC = () => {
  const { widgets, moveWidget } = useOSStore();
  const activeWidgets = widgets.filter(w => w.isOpen);

  if (activeWidgets.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[5]">
      {activeWidgets.map(widget => (
        <motion.div
          key={widget.id}
          drag
          dragMomentum={false}
          initial={{ x: widget.x, y: widget.y, opacity: 0, scale: 0.8 }}
          animate={{ x: widget.x, y: widget.y, opacity: 1, scale: 1 }}
          onDragEnd={(_e, info) => {
             moveWidget(widget.id, widget.x + info.offset.x, widget.y + info.offset.y);
          }}
          className="absolute pointer-events-auto cursor-grab active:cursor-grabbing"
        >
          {widget.type === 'clock' && <ClockWidget />}
          {widget.type === 'player' && <MusicPlayerWidget />}
        </motion.div>
      ))}
    </div>
  );
};
