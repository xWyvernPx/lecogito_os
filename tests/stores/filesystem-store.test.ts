/**
 * Tests for features/os/stores/filesystem-store.ts
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useFileSystemStore } from '@/features/os/stores/filesystem-store';

const resetStore = () =>
    useFileSystemStore.setState(useFileSystemStore.getInitialState());

describe('FileSystemStore', () => {
    beforeEach(resetStore);

    describe('initial state', () => {
        it('has a root filesystem node', () => {
            const fs = useFileSystemStore.getState().fileSystem;
            expect(fs).toBeDefined();
            expect(fs.type).toBe('dir');
        });
    });

    describe('createFile', () => {
        it('creates a file in an existing directory', () => {
            const fs = useFileSystemStore.getState().fileSystem;
            // Find a directory path that exists in the FS
            const rootChildren = Object.keys(fs.children || {});
            if (rootChildren.length === 0) return; // Skip if no dirs

            // Find first child that's a dir
            const dirName = rootChildren.find(
                k => fs.children![k].type === 'dir'
            );
            if (!dirName) return;

            useFileSystemStore.getState().createFile(
                [dirName],
                'test.txt',
                { type: 'file', content: 'hello world' }
            );

            const updated = useFileSystemStore.getState().fileSystem;
            const dir = updated.children![dirName];
            expect(dir.children?.['test.txt']).toBeDefined();
            expect(dir.children!['test.txt'].content).toBe('hello world');
        });

        it('does not crash for non-existent parent path', () => {
            useFileSystemStore.getState().createFile(
                ['non', 'existent', 'path'],
                'test.txt',
                { type: 'file', content: 'x' }
            );
            // Should not throw — just aborts silently
            expect(useFileSystemStore.getState().fileSystem).toBeDefined();
        });

        it('creates multiple files in the same directory', () => {
            const fs = useFileSystemStore.getState().fileSystem;
            const rootChildren = Object.keys(fs.children || {});
            const dirName = rootChildren.find(
                k => fs.children![k].type === 'dir'
            );
            if (!dirName) return;

            useFileSystemStore.getState().createFile(
                [dirName],
                'a.txt',
                { type: 'file', content: 'A' }
            );
            useFileSystemStore.getState().createFile(
                [dirName],
                'b.txt',
                { type: 'file', content: 'B' }
            );

            const dir = useFileSystemStore.getState().fileSystem.children![dirName];
            expect(dir.children?.['a.txt']).toBeDefined();
            expect(dir.children?.['b.txt']).toBeDefined();
        });
    });
});
