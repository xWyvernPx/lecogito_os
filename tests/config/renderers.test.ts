/**
 * Tests for features/window-manager/renderers/index.ts (PRIMITIVE_RENDERERS)
 */
import { describe, it, expect } from 'vitest';
import { PRIMITIVE_RENDERERS, ParagraphRenderer } from '@/features/window-manager/renderers';

describe('PRIMITIVE_RENDERERS', () => {
    const expectedTypes = [
        'hero',
        'quest-log',
        'collage',
        'stats',
        'image',
        'h1',
        'table',
        'h2',
        'list',
        'button',
        'spacer',
        'line',
        'p',
    ];

    it('has entries for all primitive content types', () => {
        for (const type of expectedTypes) {
            expect(PRIMITIVE_RENDERERS[type]).toBeDefined();
        }
    });

    it('every entry is a function (React component)', () => {
        for (const [key, renderer] of Object.entries(PRIMITIVE_RENDERERS)) {
            expect(typeof renderer).toBe('function');
        }
    });

    it('exports ParagraphRenderer as the default fallback', () => {
        expect(ParagraphRenderer).toBeDefined();
        expect(typeof ParagraphRenderer).toBe('function');
    });

    it('p renderer IS ParagraphRenderer', () => {
        expect(PRIMITIVE_RENDERERS['p']).toBe(ParagraphRenderer);
    });
});
