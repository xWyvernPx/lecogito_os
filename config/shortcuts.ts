/**
 * Keyboard shortcut definitions for the ShortcutsView.
 * Each section has a title translation key and a list of shortcut entries.
 */

export interface ShortcutEntry {
    /** Translation key for the shortcut label */
    labelKey: string;
    /** Key cap labels to display */
    keys: string[];
}

export interface ShortcutSection {
    /** Translation key for the section title */
    titleKey: string;
    /** Shortcuts in this section */
    shortcuts: ShortcutEntry[];
}

export const SHORTCUT_SECTIONS: ShortcutSection[] = [
    {
        titleKey: 'shortcuts.nav',
        shortcuts: [
            { labelKey: 'shortcuts.open_search', keys: ['CTRL', 'K'] },
            { labelKey: 'shortcuts.open_ai', keys: ['Shift', '?'] },
            { labelKey: 'shortcuts.display', keys: [','] },
        ],
    },
    {
        titleKey: 'shortcuts.app',
        shortcuts: [
            { labelKey: 'shortcuts.cycle_wall', keys: ['Shift', '\\'] },
            { labelKey: 'shortcuts.saver', keys: ['Shift', 'Z'] },
            { labelKey: 'shortcuts.cycle_theme', keys: ['\\'] },
        ],
    },
    {
        titleKey: 'shortcuts.win',
        shortcuts: [
            { labelKey: 'shortcuts.show_active', keys: ['Shift', '<'] },
            { labelKey: 'shortcuts.focus_next', keys: ['Shift', '>'] },
            { labelKey: 'shortcuts.close_all', keys: ['Shift', 'X'] },
        ],
    },
    {
        titleKey: 'shortcuts.active',
        shortcuts: [
            { labelKey: 'shortcuts.close_win', keys: ['Shift', 'W'] },
            { labelKey: 'shortcuts.max_win', keys: ['Shift', '↑'] },
            { labelKey: 'shortcuts.min_win', keys: ['Shift', '↓'] },
            { labelKey: 'shortcuts.snap_left', keys: ['Shift', '←'] },
            { labelKey: 'shortcuts.snap_right', keys: ['Shift', '→'] },
        ],
    },
];
