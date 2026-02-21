/**
 * File system store — virtual FS tree, file creation.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FileSystemNode } from '@/types';
import { LOCAL_FS } from '@/config/terminal';
import { idbStorage } from './idb-storage';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FileSystemState {
    fileSystem: FileSystemNode;
}

export interface FileSystemActions {
    createFile: (
        parentPath: string[],
        fileName: string,
        node: FileSystemNode
    ) => void;
}

export type FileSystemStore = FileSystemState & FileSystemActions;

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useFileSystemStore = create<FileSystemStore>()(
    persist(
        (set) => ({
            // --- State ---
            fileSystem: LOCAL_FS,

            // --- Actions ---

            createFile: (parentPath, fileName, node) =>
                set(state => {
                    const newFS = structuredClone(state.fileSystem);
                    let current = newFS;

                    for (const segment of parentPath) {
                        if (current.children?.[segment]) {
                            current = current.children[segment];
                        } else {
                            return state; // Path doesn't exist — abort
                        }
                    }

                    if (current.type === 'dir' && current.children) {
                        current.children[fileName] = node;
                    }

                    return { fileSystem: newFS };
                }),
        }),
        {
            name: 'designeros-filesystem',
            storage: createJSONStorage(() => idbStorage),
            partialize: state => ({
                fileSystem: state.fileSystem,
            }),
        }
    )
);
