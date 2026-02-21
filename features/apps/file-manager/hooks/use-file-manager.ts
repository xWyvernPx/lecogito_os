import { useState, useMemo, useEffect, useRef } from 'react';
import { useOSStore } from '@/features/os/stores/os-store';
import { ContentItem, FileSystemNode } from '@/types';
import { generateMetadata } from '../utils';

export const useFileManager = (contentItem: ContentItem) => {
    const { spawnWindow, fileSystem } = useOSStore();

    // Path state
    const [currentPath, setCurrentPath] = useState<string[]>(
        contentItem.initialPath ? contentItem.initialPath.split('/').filter(Boolean) : []
    );
    const [selectedItemName, setSelectedItemName] = useState<string | null>(null);
    const [mood, setMood] = useState("Neutral");
    const [fsVersion, setFsVersion] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial check for screen size to set sidebar
    useEffect(() => {
        if (window.innerWidth > 768) {
            setIsSidebarOpen(true);
        }
    }, []);

    // Resolve current node
    const getCurrentNode = (): FileSystemNode | null => {
        let current = fileSystem;
        for (const segment of currentPath) {
            if (current.children && current.children[segment]) {
                current = current.children[segment];
            } else {
                return null;
            }
        }
        return current;
    };

    const currentNode = getCurrentNode();
    const children = currentNode && currentNode.children ? Object.entries(currentNode.children) : [];

    // Sort: Folders first
    const sortedItems = useMemo(() => {
        return children.sort((a, b) => {
            const [nameA, nodeA] = a;
            const [nameB, nodeB] = b;
            if (nodeA.type === nodeB.type) return nameA.localeCompare(nameB);
            return nodeA.type === 'dir' ? -1 : 1;
        });
    }, [children, fsVersion]);

    // Derived Selected Item Data
    const selectedItemNode = selectedItemName && currentNode?.children ? currentNode.children[selectedItemName] : null;
    const selectedMeta = useMemo(() =>
        selectedItemName && selectedItemNode ? generateMetadata(selectedItemName, selectedItemNode.type) : null,
        [selectedItemName, selectedItemNode]
    );

    // Random Mood Changer
    useEffect(() => {
        const moods = ["Grumpy", "Manic", "Bored", "Hungry", "Judging You", "Calculating Pi", "Asleep"];
        const interval = setInterval(() => {
            if (Math.random() > 0.8) {
                setMood(moods[Math.floor(Math.random() * moods.length)]);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleNavigate = (path: string[]) => {
        setCurrentPath(path);
        setSelectedItemName(null);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleOpenItem = (name: string, node: FileSystemNode) => {
        if (node.type === 'dir') {
            handleNavigate([...currentPath, name]);
        } else {
            if (node.appId) {
                const isSingleton = !node.src;
                const windowId = isSingleton ? node.appId : `${node.appId}-${name.replace(/[^a-zA-Z0-9]/g, '')}`;
                const preset = node.src ? {
                    title: name,
                    content: [{ type: node.appId === 'browser' ? 'browser' : 'image', src: node.src }]
                } : undefined;
                spawnWindow(windowId, preset as any);
            } else if (name.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
                spawnWindow(`img-${Date.now()}`, {
                    title: name,
                    content: [{ type: 'image', src: node.src || '', alt: name }]
                });
            } else if (name.match(/\.(mp4|webm|ogg|mov)$/i)) {
                spawnWindow(`vid-${Date.now()}`, {
                    title: name,
                    content: [{ type: 'video-player', src: node.src || '', alt: name }]
                });
            } else if (name.match(/\.(md|txt|json|js|ts)$/i)) {
                spawnWindow(`txt-${Date.now()}`, {
                    title: name,
                    content: [
                        { type: 'h2', text: name },
                        { type: 'line' },
                        { type: 'p', text: node.content || '(Empty file)' }
                    ]
                });
            } else {
                alert(`I refuse to open ${name}. It looks suspicious.`);
            }
        }
    };

    const goUp = () => {
        if (currentPath.length > 0) {
            handleNavigate(currentPath.slice(0, -1));
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const processFiles = (fileList: FileList | null) => {
        if (!fileList || !currentNode) return;

        if (!currentNode.children) {
            currentNode.children = {};
        }

        Array.from(fileList).forEach(file => {
            const name = file.name;

            if (currentNode.children![name]) {
                console.warn(`Skipping ${name}: Already exists.`);
                return;
            }

            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                const objectUrl = URL.createObjectURL(file);
                currentNode.children![name] = {
                    type: 'file',
                    src: objectUrl
                };
                setFsVersion(v => v + 1);
            } else {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const content = event.target?.result;
                    currentNode.children![name] = {
                        type: 'file',
                        content: typeof content === 'string' ? content : `[Binary Data: ${file.size} bytes]`
                    };
                    setFsVersion(v => v + 1);
                };
                reader.readAsText(file);
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    };

    return {
        currentPath,
        selectedItemName,
        setSelectedItemName,
        mood,
        isDragging,
        isSidebarOpen,
        setIsSidebarOpen,
        fileInputRef,
        currentNode,
        children,
        sortedItems,
        selectedItemNode,
        selectedMeta,
        handleNavigate,
        handleOpenItem,
        goUp,
        handleUploadClick,
        handleFileChange,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    };
};
