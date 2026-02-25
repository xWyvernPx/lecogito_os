/**
 * Tests for features/os/stores/idb-storage.ts
 *
 * The idb-keyval module is mocked in tests/setup.ts, so these tests
 * verify the adapter interface rather than actual IndexedDB access.
 */
import { describe, it, expect } from 'vitest';
import { idbStorage } from '@/features/os/stores/idb-storage';

describe('idbStorage adapter', () => {
    it('implements getItem', async () => {
        const result = await idbStorage.getItem('nonexistent');
        expect(result).toBeNull();
    });

    it('implements setItem + getItem round-trip', async () => {
        await idbStorage.setItem('test-key', '{"foo":"bar"}');
        const result = await idbStorage.getItem('test-key');
        expect(result).toBe('{"foo":"bar"}');
    });

    it('implements removeItem', async () => {
        await idbStorage.setItem('delete-me', 'value');
        await idbStorage.removeItem('delete-me');
        const result = await idbStorage.getItem('delete-me');
        expect(result).toBeNull();
    });
});
