/**
 * Tests for config/shortcuts.ts
 */
import { describe, it, expect } from 'vitest';
import { SHORTCUT_SECTIONS } from '@/config/shortcuts';

describe('SHORTCUT_SECTIONS', () => {
    it('is a non-empty array', () => {
        expect(SHORTCUT_SECTIONS.length).toBeGreaterThan(0);
    });

    it('every section has titleKey and non-empty shortcuts', () => {
        for (const section of SHORTCUT_SECTIONS) {
            expect(section.titleKey).toBeTruthy();
            expect(section.shortcuts.length).toBeGreaterThan(0);
        }
    });

    it('every shortcut has labelKey and at least one key', () => {
        for (const section of SHORTCUT_SECTIONS) {
            for (const shortcut of section.shortcuts) {
                expect(shortcut.labelKey).toBeTruthy();
                expect(shortcut.keys.length).toBeGreaterThan(0);
            }
        }
    });

    it('contains navigation section', () => {
        const nav = SHORTCUT_SECTIONS.find(s =>
            s.titleKey.includes('nav')
        );
        expect(nav).toBeDefined();
    });

    it('contains window section', () => {
        const win = SHORTCUT_SECTIONS.find(s =>
            s.titleKey.includes('win')
        );
        expect(win).toBeDefined();
    });
});
