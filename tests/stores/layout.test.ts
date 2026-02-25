/**
 * Tests for features/os/utils/layout.ts
 *
 * Pure functions — no mocking needed.
 */
import { describe, it, expect } from 'vitest';
import {
    clampPosition,
    calculateWindowPosition,
    repositionIconsInViewport,
    TOP_BAR_HEIGHT,
    ICON_GRID_W,
    ICON_GRID_H,
    ICON_START_X,
    ICON_START_Y,
    ICON_BOTTOM_MARGIN,
    VIEWPORT_PADDING,
    type ViewportDimensions,
} from '@/features/os/utils/layout';
import type { DesktopIconDef } from '@/types';

// ── Helpers ─────────────────────────────────────────────────────────
const vp = (width = 1920, height = 1080): ViewportDimensions => ({
    width,
    height,
});

const icon = (
    id: string,
    x: number,
    y: number,
    overrides?: Partial<DesktopIconDef>
): DesktopIconDef => ({
    id,
    label: id,
    type: 'file',
    x,
    y,
    ...overrides,
});

// ── clampPosition ───────────────────────────────────────────────────
describe('clampPosition', () => {
    it('returns unchanged position when inside viewport', () => {
        const result = clampPosition(100, 200, 400, 300, vp());
        expect(result).toEqual({ x: 100, y: 200 });
    });

    it('clamps negative x to 0', () => {
        const result = clampPosition(-50, 100, 400, 300, vp());
        expect(result.x).toBe(0);
    });

    it('clamps negative y to 0', () => {
        const result = clampPosition(100, -20, 400, 300, vp());
        expect(result.y).toBe(0);
    });

    it('clamps x when window exceeds right edge', () => {
        const viewport = vp(800, 600);
        const result = clampPosition(700, 100, 400, 300, viewport);
        expect(result.x).toBe(400); // 800 - 400
    });

    it('clamps y when window exceeds bottom edge', () => {
        const viewport = vp(800, 600);
        const result = clampPosition(100, 500, 400, 300, viewport);
        // maxY = 600 - 300 - 36 = 264
        expect(result.y).toBe(264);
    });

    it('handles window larger than viewport gracefully', () => {
        const viewport = vp(400, 300);
        const result = clampPosition(0, 0, 800, 600, viewport);
        // maxX = max(0, 400-800) = 0, maxY = max(0, 300-600-36) = 0
        expect(result).toEqual({ x: 0, y: 0 });
    });
});

// ── calculateWindowPosition ─────────────────────────────────────────
describe('calculateWindowPosition', () => {
    it('returns shouldMaximize=true on mobile widths', () => {
        const viewport = vp(500, 800);
        const result = calculateWindowPosition('test-app', viewport);
        expect(result.shouldMaximize).toBe(true);
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
    });

    it('returns shouldMaximize=true on short screens', () => {
        const viewport = vp(1200, 400);
        const result = calculateWindowPosition('test-app', viewport);
        expect(result.shouldMaximize).toBe(true);
    });

    it('clamps width to viewport', () => {
        const viewport = vp(600, 800);
        const result = calculateWindowPosition('test-app', viewport, {
            w: 2000,
        });
        expect(result.w).toBeLessThanOrEqual(
            viewport.width - VIEWPORT_PADDING
        );
    });

    it('positions chatbot bottom-right on desktop', () => {
        const viewport = vp(1920, 1080);
        const result = calculateWindowPosition('chatbot', viewport);
        expect(result.x).toBeGreaterThan(viewport.width / 2);
    });

    it('uses preset width when provided', () => {
        const viewport = vp(1920, 1080);
        const result = calculateWindowPosition('generic', viewport, {
            w: 500,
            h: 400,
        });
        expect(result.w).toBe(500);
        expect(result.h).toBe(400);
    });

    it('uses larger default for project windows', () => {
        const viewport = vp(1920, 1080);
        const result = calculateWindowPosition('project-xyz', viewport);
        // default for project is 1100×700
        expect(result.w).toBe(1100);
        expect(result.h).toBe(700);
    });
});

// ── repositionIconsInViewport ───────────────────────────────────────
describe('repositionIconsInViewport', () => {
    it('returns unchanged array when all icons are within bounds', () => {
        const icons = [icon('a', 20, 40), icon('b', 120, 40)];
        const result = repositionIconsInViewport(icons, vp(1920, 1080));
        expect(result).toBe(icons); // Same reference (early return)
    });

    it('repositions icons that exceed viewport width', () => {
        const icons = [icon('a', 2000, 40)]; // x > viewport width
        const result = repositionIconsInViewport(icons, vp(500, 800));
        expect(result[0].x).toBeLessThanOrEqual(500 - ICON_GRID_W);
    });

    it('repositions icons that exceed viewport height', () => {
        const icons = [icon('a', 20, 2000)]; // y > viewport height
        const result = repositionIconsInViewport(icons, vp(800, 400));
        expect(result[0].y).toBeLessThanOrEqual(400 - ICON_BOTTOM_MARGIN);
    });

    it('avoids overlapping existing safe icons', () => {
        const icons = [
            icon('safe', ICON_START_X, ICON_START_Y), // occupies first slot
            icon('unsafe', 5000, 5000), // needs repositioning
        ];
        const result = repositionIconsInViewport(icons, vp(800, 800));
        const fixedIcon = result.find(i => i.id === 'unsafe')!;
        const safeIcon = result.find(i => i.id === 'safe')!;
        // They should NOT overlap
        const dx = Math.abs(fixedIcon.x - safeIcon.x);
        const dy = Math.abs(fixedIcon.y - safeIcon.y);
        expect(dx >= 60 || dy >= 60).toBe(true);
    });

    it('handles very small viewport by placing at start position', () => {
        const icons = [icon('a', 5000, 5000)];
        // If maxCols/maxRows end up at 1 and that slot is the only option
        const result = repositionIconsInViewport(icons, vp(150, 200));
        expect(result[0].x).toBe(ICON_START_X);
        expect(result[0].y).toBe(ICON_START_Y);
    });
});
