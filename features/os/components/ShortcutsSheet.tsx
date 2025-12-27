
import React from 'react';
import { useShortcuts } from '../hooks/use-shortcuts';
import { ShortcutsView } from './ShortcutsView';

export const ShortcutsSheet: React.FC = () => {
    const { isOpen, onToggle, t } = useShortcuts();

    return (
        <ShortcutsView 
            isOpen={isOpen} 
            onClose={onToggle} 
            t={t} 
        />
    );
};
