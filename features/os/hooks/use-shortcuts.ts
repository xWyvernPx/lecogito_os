
import { useEffect } from 'react';
import { useOSStore } from '../stores/os-store';
import { useTranslation } from './use-translation';

export const useShortcuts = () => {
    const { isShortcutsOpen, toggleShortcuts } = useOSStore();
    const { t } = useTranslation();

    // Handle Escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isShortcutsOpen && e.key === 'Escape') {
                toggleShortcuts();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isShortcutsOpen, toggleShortcuts]);

    return {
        isOpen: isShortcutsOpen,
        onToggle: toggleShortcuts,
        t
    };
};
