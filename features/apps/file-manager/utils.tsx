import React from 'react';
import { FileSystemNode } from '@/types';
import { HandDrawnIcon } from '@/components/ui/hand-drawn-icons';

// --- Mock Metadata Generator ---
export const FLAVOR_TEXTS = [
    "Smells like old coffee",
    "Contains trace amounts of sarcasm",
    "Radioactive (Safe-ish)",
    "Haunted by a previous commit",
    "Optimized for 56k modems",
    "May contain nuts",
    "Not compliant with Galactic Law",
    "A bit dusty",
    "Vibrates when clicked",
    "Do not feed after midnight"
];

export interface FileMetadata {
    size: string;
    created: string;
    permissions: string;
    sector: string;
    owner: string;
    flavor: string;
}

export const generateMetadata = (name: string, type: 'file' | 'dir'): FileMetadata => {
    const isDir = type === 'dir';
    const randomSize = Math.floor(Math.random() * 5000);
    return {
        size: isDir ? '--' : `${randomSize} KB`,
        created: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
        permissions: isDir ? 'drwxr-xr-x' : '-rw-r--r--',
        sector: `SEC-${Math.floor(Math.random() * 999)}`,
        owner: 'guest',
        flavor: FLAVOR_TEXTS[Math.floor(Math.random() * FLAVOR_TEXTS.length)]
    };
};

export const getFileIcon = (name: string, node: FileSystemNode, size: number = 32): React.ReactNode => {
    if (node.type === 'dir') return <HandDrawnIcon type="folder" size={size} />;

    const ext = name.split('.').pop()?.toLowerCase();

    if (node.appId === 'browser') return <HandDrawnIcon type="browser" size={size} />;
    if (node.appId || name.endsWith('.exe')) return <HandDrawnIcon type="terminal" size={size} />;

    switch (ext) {
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'svg':
        case 'webp':
            return <HandDrawnIcon type="image" size={size} />;
        case 'mp3':
        case 'wav':
        case 'ogg':
            return <HandDrawnIcon type="music" size={size} />;
        case 'mp4':
        case 'mov':
        case 'avi':
        case 'mkv':
        case 'webm':
            return <HandDrawnIcon type="video" size={size} />;
        case 'js':
        case 'ts':
        case 'tsx':
        case 'jsx':
        case 'json':
        case 'css':
        case 'html':
        case 'md':
            return <HandDrawnIcon type="code" size={size} />;
        case 'zip':
        case 'rar':
        case 'tar':
        case 'gz':
        case '7z':
            return <HandDrawnIcon type="archive" size={size} />;
        default:
            return <HandDrawnIcon type="file" size={size} />;
    }
};
