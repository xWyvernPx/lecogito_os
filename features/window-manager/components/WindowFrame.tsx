
import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlignLeft, Bold, Italic, Share2, Search, Minimize2, Square, ChevronLeft, ChevronRight, Minus } from 'lucide-react';
import { WindowDef } from '../../../types';
import { useWindowFrame } from '../hooks/use-window-frame';
import { WindowContentRenderer } from './WindowContentRenderer';
import { useOSStore } from '../../os/stores/os-store';

interface WindowFrameProps {
  win: WindowDef;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ win }) => {
  const {
      controls,
      searchQuery,
      setSearchQuery,
      isSearchOpen,
      toggleSearch,
      currentContent,
      appDef,
      canGoBack,
      canGoForward,
      handleResizePointerDown,
      getWindowStyles,
      actions
  } = useWindowFrame(win);
  
  const { minimizeWindow } = useOSStore();

  const constraintsRef = useRef(null);

  // Determine layout flags based on App Definition
  const hideToolbar = appDef?.hideToolbar || false;
  const noPadding = appDef?.noPadding || false;

  const contentContainerClass = noPadding 
    ? 'flex-1 overflow-hidden relative' 
    : 'flex-1 overflow-auto p-6 font-mono text-[15px] relative';

  const containerBgClass = appDef ? 'bg-os-window' : 'bg-os-window'; 

  // If minimized, we hide it but keep it mounted to preserve state (like iframe/canvas context)
  // We use style display: none for this.
  const baseStyles = getWindowStyles();
  const displayStyle = win.isMinimized ? 'none' : 'flex';

  return (
    <motion.div
      drag={!win.isMaximized}
      dragListener={false} 
      dragControls={controls}
      dragMomentum={false}
      dragElastic={0.05}
      // Clamping happens in the store onDragEnd, but constraints provide visual feedback
      dragConstraints={{ 
          top: 0, 
          left: 0, 
          right: window.innerWidth - win.w, 
          bottom: window.innerHeight - win.h - 36 
      }}
      onPointerDown={actions.focus}
      onDragEnd={(_e, info) => {
          if(!win.isMaximized) {
              actions.updatePosition(win.x + info.offset.x, win.y + info.offset.y);
          }
      }}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0, ...baseStyles }}
      exit={{ scale: 0.95, opacity: 0, filter: "blur(4px)", transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ position: 'absolute', display: displayStyle }} 
      className="flex-col pointer-events-auto shadow-2xl"
    >
      <div className={`absolute inset-0 bg-black translate-x-2 translate-y-2 pointer-events-none ${win.isMaximized ? 'hidden' : ''}`} />

      <div className={`relative flex-1 flex flex-col ${containerBgClass} border-2 border-os-border overflow-hidden h-full transition-shadow duration-300 ${!win.isMaximized ? 'hover:shadow-[0_0_25px_rgba(0,0,0,0.1)]' : ''}`}>
        {/* Title Bar */}
        <div 
          onPointerDown={(e) => {
              if(!win.isMaximized) controls.start(e);
          }}
          onDoubleClick={actions.maximize}
          className={`h-8 border-b-2 border-os-border flex items-center justify-between px-2 ${!win.isMaximized ? 'cursor-grab active:cursor-grabbing' : ''} select-none
            ${win.isActive ? 'bg-os-accent' : 'bg-stone-300'}
            relative overflow-hidden shrink-0
          `}
        >
           <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ backgroundImage: 'linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '4px 100%' }} 
           />
           <div className="flex items-center gap-2 z-10">
              <span className={`text-xs font-bold font-mono px-2 py-0.5 border border-os-border bg-white shadow-retro-sm`}>
                {win.title}
              </span>
           </div>
           
           <div className="flex items-center gap-1.5 z-10">
               <button 
                onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
                className="w-5 h-5 bg-white border border-os-border shadow-retro-sm hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] active:translate-y-[2px] active:shadow-none flex items-center justify-center transition-all"
                title="Minimize"
               >
                 <Minus size={10} strokeWidth={3} />
               </button>
               <button 
                onClick={(e) => { e.stopPropagation(); actions.maximize(); }}
                className="w-5 h-5 bg-white border border-os-border shadow-retro-sm hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] active:translate-y-[2px] active:shadow-none flex items-center justify-center transition-all"
                title={win.isMaximized ? "Restore" : "Maximize"}
               >
                 {win.isMaximized ? <Minimize2 size={10} /> : <Square size={10} />}
               </button>
               <button 
                 onClick={(e) => { e.stopPropagation(); actions.close(); }}
                 className="w-5 h-5 bg-red-500 border border-os-border shadow-retro-sm hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000] active:translate-y-[2px] active:shadow-none flex items-center justify-center transition-all ml-1"
                 title="Close"
               >
                 <X size={12} strokeWidth={4} color="white" />
               </button>
           </div>
        </div>

        {/* Standard Toolbar */}
        {!hideToolbar && (
            <div className="h-10 border-b border-stone-300 bg-stone-50 flex items-center justify-between px-3 select-none shrink-0 gap-4">
                 <div className="flex gap-2 shrink-0 items-center">
                     {/* Navigation Controls */}
                     <button 
                        disabled={!canGoBack}
                        onClick={actions.goBack}
                        className={`w-7 h-7 flex items-center justify-center rounded border transition-all ${canGoBack ? 'bg-white border-os-border shadow-retro-sm hover:translate-y-px hover:shadow-[1px_1px_0_0_#000] active:translate-y-[2px] active:shadow-none' : 'opacity-30 cursor-not-allowed border-transparent'}`}
                     >
                        <ChevronLeft size={16} />
                     </button>
                     <button 
                        disabled={!canGoForward}
                        onClick={actions.goForward}
                        className={`w-7 h-7 flex items-center justify-center rounded border transition-all ${canGoForward ? 'bg-white border-os-border shadow-retro-sm hover:translate-y-px hover:shadow-[1px_1px_0_0_#000] active:translate-y-[2px] active:shadow-none' : 'opacity-30 cursor-not-allowed border-transparent'}`}
                     >
                        <ChevronRight size={16} />
                     </button>

                     <div className="w-px h-5 bg-stone-300 mx-2" />

                     {/* Editor Controls */}
                     <button className="p-1 hover:bg-stone-200 rounded border border-transparent hover:border-stone-300"><AlignLeft size={14}/></button>
                     <button className="p-1 hover:bg-stone-200 rounded border border-transparent hover:border-stone-300"><Bold size={14}/></button>
                     <button className="p-1 hover:bg-stone-200 rounded border border-transparent hover:border-stone-300"><Italic size={14}/></button>
                 </div>

                 <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                    <button 
                        onClick={toggleSearch}
                        className={`p-1.5 rounded border transition-colors ${isSearchOpen ? 'bg-stone-200 border-stone-300' : 'border-transparent hover:bg-stone-200 hover:border-stone-300'}`}
                    >
                        <Search size={14} className="text-stone-600" />
                    </button>

                    <button className="bg-os-accent text-black text-xs font-bold px-3 py-1 border border-os-border shadow-retro-sm flex items-center gap-2 hover:translate-y-px hover:shadow-[1px_1px_0_0_#000] active:translate-y-[2px] active:shadow-none transition-all shrink-0">
                        <Share2 size={12} /> <span className="hidden sm:inline">Share</span>
                    </button>
                 </div>
            </div>
        )}

        {/* Search Popup Overlay */}
        {!hideToolbar && (
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-[76px] right-3 z-30 w-64 bg-os-window border-2 border-os-border shadow-retro-md flex items-center p-1 gap-1"
                    >
                        <div className="flex-1 flex items-center bg-white border border-stone-300 px-2 h-8 focus-within:border-os-accent focus-within:ring-1 focus-within:ring-os-accent transition-all">
                            <Search size={12} className="text-stone-400 shrink-0 mr-2" />
                            <input 
                                autoFocus
                                type="text" 
                                placeholder="Search this page..." 
                                className="bg-transparent border-none outline-none text-xs w-full placeholder:text-stone-400 font-sans h-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.stopPropagation()} 
                            />
                        </div>
                        <button 
                            onClick={toggleSearch}
                            className="w-8 h-8 flex items-center justify-center hover:bg-stone-100 text-stone-500"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        )}

        {/* Content Area */}
        <div className={contentContainerClass}>
            <WindowContentRenderer 
                content={currentContent} 
                searchQuery={searchQuery} 
                win={win}
            />
        </div>

        {/* Resize Handle - Hide if maximized */}
        {!win.isMaximized && (
            <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 flex items-end justify-end p-0.5"
                onPointerDown={handleResizePointerDown}
            >
                <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 fill-stone-400">
                    <path d="M10 10 L0 10 L10 0 Z" />
                </svg>
            </div>
        )}
      </div>
    </motion.div>
  );
};
