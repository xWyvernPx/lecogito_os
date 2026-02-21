/**
 * Pure layout utility functions for window/icon positioning.
 * No DOM access — receive viewport dimensions as parameters.
 */
import type { DesktopIconDef } from '@/types';

// --- Constants ---
export const TOP_BAR_HEIGHT = 36;
export const ICON_GRID_W = 100;
export const ICON_GRID_H = 120;
export const ICON_START_X = 20;
export const ICON_START_Y = 40;
export const ICON_BOTTOM_MARGIN = 100;
export const ICON_OVERLAP_THRESHOLD = 60;
export const SPAWN_OFFSET_MAX = 50;
export const VIEWPORT_PADDING = 20;

export interface ViewportDimensions {
    width: number;
    height: number;
}

/**
 * Clamp a window position within viewport bounds.
 */
export const clampPosition = (
    x: number,
    y: number,
    w: number,
    h: number,
    viewport: ViewportDimensions
) => {
    const maxX = Math.max(0, viewport.width - w);
    const maxY = Math.max(0, viewport.height - h - TOP_BAR_HEIGHT);
    return {
        x: Math.max(0, Math.min(x, maxX)),
        y: Math.max(0, Math.min(y, maxY)),
    };
};

/**
 * Calculate the initial position and size for a new window.
 */
export const calculateWindowPosition = (
    id: string,
    viewport: ViewportDimensions,
    preset?: { w?: number; h?: number }
) => {
    const isMobileWidth = viewport.width < 768;
    const isShortScreen = viewport.height < 600;
    const shouldMaximize = isMobileWidth || isShortScreen;

    const isProject = id.startsWith('project-');
    const isChatbot = id === 'chatbot';

    let defaultW = preset?.w ?? (isProject ? 1100 : isChatbot ? 400 : 800);
    let defaultH = preset?.h ?? (isProject ? 700 : isChatbot ? 550 : 600);

    // Clamp initial size to viewport
    defaultW = Math.min(defaultW, viewport.width - VIEWPORT_PADDING);
    defaultH = Math.min(defaultH, viewport.height - SPAWN_OFFSET_MAX);

    const maxX = Math.max(0, viewport.width - defaultW);
    const maxY = Math.max(0, viewport.height - defaultH - TOP_BAR_HEIGHT);

    const randomX = Math.floor(Math.random() * Math.min(SPAWN_OFFSET_MAX, maxX));
    const randomY = Math.floor(Math.random() * Math.min(SPAWN_OFFSET_MAX, maxY));

    let spawnX = SPAWN_OFFSET_MAX + randomX;
    let spawnY = SPAWN_OFFSET_MAX + randomY;

    if (isChatbot && !isMobileWidth && !isShortScreen) {
        spawnX = viewport.width - defaultW - VIEWPORT_PADDING;
        spawnY = viewport.height - defaultH - (TOP_BAR_HEIGHT + 4);
    } else if (shouldMaximize) {
        spawnX = 0;
        spawnY = 0;
    }

    const { x, y } = clampPosition(spawnX, spawnY, defaultW, defaultH, viewport);

    return { x, y, w: defaultW, h: defaultH, shouldMaximize };
};

/**
 * Reposition icons that fall outside viewport bounds.
 */
export const repositionIconsInViewport = (
    icons: DesktopIconDef[],
    viewport: ViewportDimensions
): DesktopIconDef[] => {
    const maxX = viewport.width - ICON_GRID_W;
    const maxY = viewport.height - ICON_BOTTOM_MARGIN;

    const safeIcons = icons.filter(icon => icon.x <= maxX && icon.y <= maxY);
    const unsafeIcons = icons.filter(icon => icon.x > maxX || icon.y > maxY);

    if (unsafeIcons.length === 0) return icons;

    const isOccupied = (testX: number, testY: number, placed: DesktopIconDef[]) => {
        const all = [...safeIcons, ...placed];
        return all.some(
            icon =>
                Math.abs(icon.x - testX) < ICON_OVERLAP_THRESHOLD &&
                Math.abs(icon.y - testY) < ICON_OVERLAP_THRESHOLD
        );
    };

    const fixedIcons: DesktopIconDef[] = [];
    const maxCols = Math.max(1, Math.floor((viewport.width - ICON_START_X) / ICON_GRID_W));
    const maxRows = Math.max(
        1,
        Math.floor((viewport.height - ICON_START_Y - ICON_BOTTOM_MARGIN) / ICON_GRID_H)
    );

    unsafeIcons.forEach(icon => {
        let found = false;
        for (let c = 0; c < maxCols; c++) {
            for (let r = 0; r < maxRows; r++) {
                const testX = ICON_START_X + c * ICON_GRID_W;
                const testY = ICON_START_Y + r * ICON_GRID_H;
                if (!isOccupied(testX, testY, fixedIcons)) {
                    fixedIcons.push({ ...icon, x: testX, y: testY });
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
        if (!found) {
            fixedIcons.push({ ...icon, x: ICON_START_X, y: ICON_START_Y });
        }
    });

    return [...safeIcons, ...fixedIcons];
};
