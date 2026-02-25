/**
 * Tests for features/os/stores/desktop-store.ts
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useDesktopStore } from '@/features/os/stores/desktop-store';
import { INITIAL_ICONS, INITIAL_WIDGETS } from '@/config/desktop';

const resetStore = () =>
    useDesktopStore.setState(useDesktopStore.getInitialState());

describe('DesktopStore', () => {
    beforeEach(resetStore);

    // ------ selectIcon ---------------------------------------------------
    describe('selectIcon', () => {
        it('sets selectedIconId', () => {
            useDesktopStore.getState().selectIcon('my-icon');
            expect(useDesktopStore.getState().selectedIconId).toBe(
                'my-icon'
            );
        });

        it('clears selection with null', () => {
            useDesktopStore.getState().selectIcon('x');
            useDesktopStore.getState().selectIcon(null);
            expect(useDesktopStore.getState().selectedIconId).toBeNull();
        });
    });

    // ------ moveIcon -----------------------------------------------------
    describe('moveIcon', () => {
        it('updates position of the target icon', () => {
            const firstIcon = useDesktopStore.getState().icons[0];
            useDesktopStore.getState().moveIcon(firstIcon.id, 500, 600);
            const updated = useDesktopStore
                .getState()
                .icons.find(i => i.id === firstIcon.id)!;
            expect(updated.x).toBe(500);
            expect(updated.y).toBe(600);
        });

        it('does not affect other icons', () => {
            const [first, second] = useDesktopStore.getState().icons;
            const origX = second.x;
            useDesktopStore.getState().moveIcon(first.id, 999, 999);
            expect(
                useDesktopStore.getState().icons.find(i => i.id === second.id)!.x
            ).toBe(origX);
        });
    });

    // ------ removeIcon ---------------------------------------------------
    describe('removeIcon', () => {
        it('removes an icon by id', () => {
            const firstId = useDesktopStore.getState().icons[0].id;
            const origLen = useDesktopStore.getState().icons.length;
            useDesktopStore.getState().removeIcon(firstId);
            expect(useDesktopStore.getState().icons).toHaveLength(
                origLen - 1
            );
            expect(
                useDesktopStore.getState().icons.find(i => i.id === firstId)
            ).toBeUndefined();
        });
    });

    // ------ sortIcons ----------------------------------------------------
    describe('sortIcons', () => {
        it('sorts icons alphabetically by label', () => {
            // Set up unsorted icons
            useDesktopStore.setState({
                icons: [
                    { id: 'c', label: 'Zebra', type: 'file', x: 0, y: 0 },
                    { id: 'b', label: 'Apple', type: 'file', x: 0, y: 0 },
                    { id: 'a', label: 'Mango', type: 'file', x: 0, y: 0 },
                ],
            });
            useDesktopStore.getState().sortIcons();
            const labels = useDesktopStore
                .getState()
                .icons.map(i => i.label);
            expect(labels).toEqual(['Apple', 'Mango', 'Zebra']);
        });
    });

    // ------ resetDesktop -------------------------------------------------
    describe('resetDesktop', () => {
        it('restores icons to INITIAL_ICONS', () => {
            useDesktopStore.setState({ icons: [] });
            useDesktopStore.getState().resetDesktop();
            expect(useDesktopStore.getState().icons).toEqual(INITIAL_ICONS);
        });
    });

    // ------ toggleWidget -------------------------------------------------
    describe('toggleWidget', () => {
        it('toggles isOpen on the target widget', () => {
            const w = useDesktopStore.getState().widgets[0];
            const orig = w.isOpen;
            useDesktopStore.getState().toggleWidget(w.id);
            expect(
                useDesktopStore.getState().widgets.find(x => x.id === w.id)!
                    .isOpen
            ).toBe(!orig);
        });
    });

    // ------ moveWidget ---------------------------------------------------
    describe('moveWidget', () => {
        it('updates widget position', () => {
            const w = useDesktopStore.getState().widgets[0];
            useDesktopStore.getState().moveWidget(w.id, 300, 400);
            const updated = useDesktopStore
                .getState()
                .widgets.find(x => x.id === w.id)!;
            expect(updated.x).toBe(300);
            expect(updated.y).toBe(400);
        });
    });

    // ------ repositionIcons (delegates to layout util) --------------------
    describe('repositionIcons', () => {
        it('moves out-of-bounds icons into viewport', () => {
            useDesktopStore.setState({
                icons: [
                    {
                        id: 'oob',
                        label: 'OOB',
                        type: 'file',
                        x: 5000,
                        y: 5000,
                    },
                ],
            });
            useDesktopStore
                .getState()
                .repositionIcons({ width: 800, height: 600 });
            const icon = useDesktopStore.getState().icons[0];
            expect(icon.x).toBeLessThan(800);
            expect(icon.y).toBeLessThan(600);
        });
    });
});
