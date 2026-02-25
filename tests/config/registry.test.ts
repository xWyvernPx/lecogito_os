/**
 * Tests for features/apps/registry.ts
 */
import { describe, it, expect } from 'vitest';
import { APP_REGISTRY, getAppDefinition } from '@/features/apps/registry';

describe('APP_REGISTRY', () => {
    it('has entries for all core apps', () => {
        const expectedApps = [
            'terminal',
            'image-generator',
            'project-list',
            'project-detail',
            'widget-selector',
            'display-settings',
            'blog-news',
            'conspiracy-map',
            'event-editor',
            'resume-viewer',
            'pixel-paint',
            'system-monitor',
            'file-manager',
            'chatbot',
            'video-player',
            'browser',
            'app-creator',
            'kanban-board',
        ];
        for (const app of expectedApps) {
            expect(APP_REGISTRY[app]).toBeDefined();
            expect(APP_REGISTRY[app].component).toBeDefined();
        }
    });

    it('terminal has hideToolbar and noPadding', () => {
        expect(APP_REGISTRY['terminal'].hideToolbar).toBe(true);
        expect(APP_REGISTRY['terminal'].noPadding).toBe(true);
    });

    it('chatbot does not hide toolbar', () => {
        expect(APP_REGISTRY['chatbot'].hideToolbar).toBe(false);
    });
});

describe('getAppDefinition', () => {
    it('returns the definition for a known app', () => {
        const def = getAppDefinition('terminal');
        expect(def).toBeDefined();
        expect(def!.hideToolbar).toBe(true);
    });

    it('returns undefined for an unknown app', () => {
        expect(getAppDefinition('does-not-exist')).toBeUndefined();
    });
});
