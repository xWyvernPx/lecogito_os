// src/features/window-manager/hooks/use-window-frame.ts
import React, { useState } from 'react';
import { useDragControls } from 'framer-motion';
import { useOSStore } from '../../os/stores/os-store';
import { WindowDef } from '../../../types';
import { getAppDefinition } from '../../apps/registry';

export const useWindowFrame = (win: WindowDef) => {
    const controls = useDragControls();
    const { focusWindow, closeWindow, updateWindow, spawnWindow, goBack, goForward, toggleMaximize } = useOSStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Resolve current content from history
    const currentContent = win.history && win.history[win.historyIndex] ? win.history[win.historyIndex].content : [];

    // Check if the current view is a Registered App
    const primaryItem = currentContent.length > 0 ? currentContent[0] : null;
    const appDef = primaryItem ? getAppDefinition(primaryItem.type) : undefined;

    // Navigation State
    const canGoBack = win.historyIndex > 0;
    const canGoForward = win.history && win.historyIndex < win.history.length - 1;

    const toggleSearch = () => {
        if (isSearchOpen) {
            setIsSearchOpen(false);
            setSearchQuery(""); // Clear search on close
        } else {
            setIsSearchOpen(true);
        }
    };

    // Fix: Ensure React namespace is available for PointerEvent
    const handleResizePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startW = win.w;
        const startH = win.h;

        const onPointerMove = (moveEvent: PointerEvent) => {
            const newW = Math.max(300, startW + (moveEvent.clientX - startX));
            const newH = Math.max(200, startH + (moveEvent.clientY - startY));
            updateWindow(win.id, { w: newW, h: newH });
        };

        const onPointerUp = () => {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        };

        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
    };

    const getWindowStyles = () => {
        if (win.isMaximized) {
            return {
                x: 0,
                y: 0,
                width: '100%',
                height: '100%',
                zIndex: win.zIndex + 50, // Ensure maximized window is above others but below overlays
            };
        }
        return {
            x: win.x,
            y: win.y,
            width: win.w,
            height: win.h,
            zIndex: win.zIndex,
        };
    };

    return {
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
        actions: {
            focus: () => focusWindow(win.id),
            close: () => closeWindow(win.id),
            maximize: () => toggleMaximize(win.id),
            updatePosition: (x: number, y: number) => updateWindow(win.id, { x, y }),
            goBack: () => goBack(win.id),
            goForward: () => goForward(win.id),
            spawn: spawnWindow
        }
    };
};