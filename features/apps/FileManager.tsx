
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowUp, Home, HardDrive, 
    Search, Trash2, Info, Skull, Ghost, Upload, DownloadCloud, Menu, X
} from 'lucide-react';
import { useOSStore } from '../os/stores/os-store';
import { FileSystemNode, WindowDef, ContentItem } from '../../types';
import { HandDrawnIcon } from '../../components/ui/hand-drawn-icons';
import { RetroButton } from '../../components/ui/retro-ui';
import { useTranslation } from '../os/hooks/use-translation';

interface FileManagerProps {
    win: WindowDef;
    contentItem: ContentItem;
}

// --- Mock Metadata Generator ---
const FLAVOR_TEXTS = [
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

const generateMetadata = (name: string, type: 'file' | 'dir') => {
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

export const FileManager: React.FC<FileManagerProps> = ({ win, contentItem }) => {
    const { spawnWindow, fileSystem } = useOSStore();
    const { t } = useTranslation();
    
    // Path state
    const [currentPath, setCurrentPath] = useState<string[]>(
        contentItem.initialPath ? contentItem.initialPath.split('/').filter(Boolean) : []
    );
    const [selectedItemName, setSelectedItemName] = useState<string | null>(null);
    const [mood, setMood] = useState("Neutral");
    const [fsVersion, setFsVersion] = useState(0); // To force re-render on upload
    const [isDragging, setIsDragging] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
    
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
    }, [children, fsVersion]); // Depend on fsVersion to resort/render after upload

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
        if (window.innerWidth < 768) setIsSidebarOpen(false); // Close sidebar on mobile nav
    };

    const handleOpenItem = (name: string, node: FileSystemNode) => {
        if (node.type === 'dir') {
            handleNavigate([...currentPath, name]);
        } else {
            // File Handling Logic
            if (node.appId) {
                // Determine if this app should launch as a singleton or unique instance
                // If it has specific content source (src), we treat it as unique (like VS Code vs Spotify)
                const isSingleton = !node.src;
                const windowId = isSingleton ? node.appId : `${node.appId}-${name.replace(/[^a-zA-Z0-9]/g, '')}`;

                // If it's a browser app or specific app launch with content
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

        // Create children object if it doesn't exist
        if (!currentNode.children) {
            currentNode.children = {};
        }

        Array.from(fileList).forEach(file => {
            const name = file.name;
            
            // Check for duplicate (skip or overwrite? Let's skip with a log for now to be safe)
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
                // Basic text file handling attempt, otherwise dummy content
                const reader = new FileReader();
                reader.onload = (event) => {
                    const content = event.target?.result;
                    currentNode.children![name] = {
                        type: 'file',
                        content: typeof content === 'string' ? content : `[Binary Data: ${file.size} bytes]`
                    };
                    setFsVersion(v => v + 1); // Trigger update after read
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

    // Helper to get icon
    const getFileIcon = (name: string, node: FileSystemNode, size: number = 32) => {
        if (node.type === 'dir') return <HandDrawnIcon type="folder" size={size} />;
        
        // Check extensions for special icons
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

    return (
        <div className="flex flex-col h-full bg-[#e8e4d9] font-mono text-sm select-none relative overflow-hidden">
            
            {/* --- 1. Top Command Bar --- */}
            <div className="h-12 bg-[#d6cbb5] border-b-2 border-stone-800 flex items-center px-2 gap-2 shrink-0 z-20 shadow-sm">
                <div className="flex gap-1">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className={`w-8 h-8 flex md:hidden items-center justify-center border-2 border-stone-800 bg-[#e8e4d9] hover:bg-white active:translate-y-0.5 transition-all shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] ${isSidebarOpen ? 'bg-white text-[#ff7e33]' : ''}`}
                    >
                        <Menu size={16} />
                    </button>
                    <button 
                        onClick={goUp} 
                        disabled={currentPath.length === 0}
                        className={`w-8 h-8 flex items-center justify-center border-2 border-stone-800 bg-[#e8e4d9] hover:bg-white active:translate-y-0.5 transition-all shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] ${currentPath.length === 0 ? 'opacity-50 cursor-not-allowed shadow-none translate-y-[2px]' : ''}`}
                        title="Eject Parent Directory"
                        aria-label="Go up one level"
                    >
                        <ArrowUp size={16} />
                    </button>
                    <button 
                        onClick={() => handleNavigate([])}
                        className="w-8 h-8 flex items-center justify-center border-2 border-stone-800 bg-[#e8e4d9] hover:bg-white active:translate-y-0.5 transition-all shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]"
                        title="Go to Mothership"
                        aria-label="Go to home directory"
                    >
                        <Home size={16} />
                    </button>
                    <button 
                        onClick={handleUploadClick}
                        className="w-8 h-8 hidden sm:flex items-center justify-center border-2 border-stone-800 bg-[#e8e4d9] hover:bg-white active:translate-y-0.5 transition-all shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] ml-2"
                        title={t('common.upload')}
                    >
                        <Upload size={16} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        multiple
                        onChange={handleFileChange} 
                    />
                </div>

                {/* Address Input */}
                <div className="flex-1 border-2 border-stone-800 bg-white h-8 flex items-center px-3 shadow-inner relative group min-w-0">
                    <span className="text-[#ff7e33] font-bold mr-1 shrink-0 hidden sm:inline">dude@keyboard:</span>
                    <span className="text-[#ff7e33] font-bold mr-1 shrink-0 sm:hidden">~/:</span>
                    <div className="flex-1 overflow-hidden text-stone-600 font-bold whitespace-nowrap mask-linear-fade">
                        ~/{currentPath.join('/')}
                    </div>
                    <div className="w-2 h-4 bg-[#ff7e33] animate-pulse ml-1" />
                </div>

                <div className="w-8 h-8 border-2 border-stone-800 bg-stone-800 flex items-center justify-center group cursor-help shrink-0">
                    <Search size={16} className="text-[#e8e4d9] group-hover:scale-110 transition-transform" />
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                
                {/* --- 2. Sidebar (Responsive) --- */}
                <div className={`
                    absolute inset-y-0 left-0 z-30 w-64 bg-[#e0d8c3] border-r-2 border-stone-800 flex flex-col shadow-xl transform transition-transform duration-300 md:relative md:translate-x-0 md:w-56 md:shadow-none
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    {/* Close button for mobile */}
                    <button 
                        onClick={() => setIsSidebarOpen(false)} 
                        className="absolute top-2 right-2 p-1 md:hidden bg-white/50 rounded hover:bg-white"
                    >
                        <X size={16} />
                    </button>

                    {/* Decorative Header */}
                    <div className="px-3 py-2 bg-stone-800 text-[#e8e4d9] text-[10px] font-bold uppercase tracking-widest flex justify-between items-center shrink-0">
                        <span>{t('fm.places')}</span>
                        <HardDrive size={12} className="animate-spin duration-[10000ms]" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-6">
                        {/* Section: Drives */}
                        <div>
                            <div className="text-[9px] font-bold text-stone-500 uppercase mb-2 pl-2 border-l-2 border-[#ff7e33]">{t('fm.drives')}</div>
                            <div className="space-y-1">
                                <button onClick={() => handleNavigate([])} className="w-full text-left px-3 py-2 bg-[#fdfdfd] border-2 border-stone-400 hover:border-stone-800 hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.1)] transition-all flex items-center gap-2 group">
                                    <div className="w-3 h-3 rounded-full bg-green-500 border border-black group-hover:animate-ping" />
                                    <span className="font-bold">EXISTENCE (C:)</span>
                                </button>
                                <button className="w-full text-left px-3 py-2 bg-[#e8e4d9] border-2 border-transparent opacity-60 flex items-center gap-2 cursor-not-allowed group">
                                    <div className="w-3 h-3 rounded-full bg-red-500 border border-black" />
                                    <span className="font-bold line-through group-hover:no-underline group-hover:text-red-600">THE VOID (Z:)</span>
                                </button>
                            </div>
                        </div>

                        {/* Section: Quick Access */}
                        <div>
                            <div className="text-[9px] font-bold text-stone-500 uppercase mb-2 pl-2 border-l-2 border-blue-500">{t('fm.quick_access')}</div>
                            <div className="space-y-1">
                                {['Applications', 'Documents', 'Media'].map(dir => (
                                    <button 
                                        key={dir}
                                        onClick={() => handleNavigate([dir])}
                                        className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-white hover:text-[#ff7e33] transition-colors rounded-sm"
                                    >
                                        <HandDrawnIcon type="folder" size={14} />
                                        <span className="font-bold text-xs">{dir}</span>
                                    </button>
                                ))}
                                <button 
                                    onClick={() => alert("It's a trap!")}
                                    className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-red-100 hover:text-red-600 transition-colors rounded-sm"
                                >
                                    <Skull size={14} className="text-stone-600" />
                                    <span className="font-bold text-xs">Do Not Click</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Disk Usage Viz */}
                    <div className="p-4 border-t-2 border-stone-800 bg-[#d6cbb5]">
                        <div className="flex justify-between text-[9px] font-bold mb-1 uppercase">
                            <span>{t('fm.disk_usage')}</span>
                            <span>CRITICAL</span>
                        </div>
                        <div className="h-4 w-full border-2 border-stone-800 bg-white p-[2px]">
                            <div className="h-full w-[92%] bg-red-500 relative overflow-hidden animate-pulse">
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_25%,rgba(0,0,0,0.2)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.2)_75%,rgba(0,0,0,0.2))] bg-[length:4px_4px]" />
                            </div>
                        </div>
                        <div className="mt-2 text-[9px] font-mono text-stone-500 truncate">
                            /dev/brain • 2 Neurons Left
                        </div>
                    </div>
                </div>

                {/* Mobile Overlay for Sidebar */}
                <AnimatePresence>
                    {isSidebarOpen && window.innerWidth < 768 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                        />
                    )}
                </AnimatePresence>

                {/* --- 3. Main Content Grid (With Drop Zone) --- */}
                <div 
                    className="flex-1 bg-[#fdfdfd] relative flex flex-col overflow-hidden"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    {/* Drag & Drop Overlay */}
                    <AnimatePresence>
                        {isDragging && (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                className="absolute inset-2 z-50 border-4 border-dashed border-[#ff7e33] bg-[#ff7e33]/10 flex flex-col items-center justify-center pointer-events-none rounded-lg"
                            >
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }} 
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="bg-white p-4 rounded-full shadow-retro-md border-2 border-[#ff7e33] text-[#ff7e33] mb-4"
                                >
                                    <DownloadCloud size={48} />
                                </motion.div>
                                <h3 className="text-2xl font-black text-[#ff7e33] uppercase tracking-tighter bg-white px-4 py-1 border-2 border-[#ff7e33] shadow-sm">
                                    {t('fm.upload_zone')}
                                </h3>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div 
                        className="flex-1 overflow-y-auto p-4 md:p-6 content-start grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 auto-rows-min"
                        onClick={() => setSelectedItemName(null)}
                    >
                        {sortedItems.map(([name, node]) => (
                            <div
                                key={name}
                                onClick={(e) => { e.stopPropagation(); setSelectedItemName(name); }}
                                onDoubleClick={(e) => { e.stopPropagation(); handleOpenItem(name, node); }}
                                className="group relative flex flex-col items-center cursor-pointer"
                            >
                                {/* Visual Container - Stable layout but transformative visuals */}
                                <div className={`
                                    w-full flex flex-col items-center p-2 border-2 transition-all
                                    ${selectedItemName === name 
                                        ? 'bg-[#ff7e33] border-stone-900 shadow-[4px_4px_0_0_#121212] text-white z-10 scale-105 rotate-1' 
                                        : 'bg-white border-transparent hover:border-stone-300 hover:bg-stone-50 hover:shadow-sm text-stone-800'}
                                `}>
                                    <div className={`mb-3 transition-transform ${selectedItemName === name ? 'scale-110 drop-shadow-md' : 'group-hover:scale-105 group-hover:rotate-3'}`}>
                                        {getFileIcon(name, node, 48)}
                                    </div>
                                    <span className="text-xs font-bold font-mono text-center leading-tight break-all px-1 bg-inherit line-clamp-2">
                                        {name}
                                    </span>
                                </div>
                                
                                {selectedItemName === name && (
                                    <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full animate-ping z-20 pointer-events-none" />
                                )}
                            </div>
                        ))}
                        
                        {sortedItems.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-stone-300">
                                <Ghost size={64} className="mb-4 opacity-20 animate-bounce" />
                                <p className="font-mono text-xs font-bold uppercase tracking-widest mb-1">It's quiet...</p>
                                <p className="text-[10px] italic">Too quiet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- 4. Inspector Panel (Right) --- */}
                <AnimatePresence>
                    {selectedItemName && selectedItemNode && selectedMeta && (
                        <motion.div 
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 240, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="bg-stone-100 border-l-2 border-stone-800 flex-col overflow-hidden shrink-0 shadow-[-4px_0_15px_rgba(0,0,0,0.1)] z-10 hidden md:flex"
                        >
                            <div className="bg-stone-800 text-[#e8e4d9] px-3 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <Info size={12} />
                                {t('fm.inspector')}
                            </div>

                            <div className="p-6 flex flex-col items-center border-b-2 border-stone-300 bg-white">
                                <div className="w-20 h-20 flex items-center justify-center mb-4 relative">
                                    <div className="absolute inset-0 bg-stone-100 rounded-full animate-pulse opacity-50" />
                                    {getFileIcon(selectedItemName, selectedItemNode, 64)}
                                </div>
                                <h3 className="font-black text-sm text-center text-stone-900 break-all mb-1">{selectedItemName}</h3>
                                <span className="text-[10px] font-bold text-stone-500 uppercase bg-stone-200 px-2 py-0.5 rounded">
                                    {selectedItemNode.type === 'dir' ? 'Dimensional Pocket' : 'Frozen Data'}
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold text-stone-500 uppercase border-b border-stone-300 pb-1">
                                        <span>{t('fm.properties')}</span>
                                        <span>{t('fm.value')}</span>
                                    </div>
                                    {[
                                        ['Size', selectedMeta.size],
                                        ['Created', selectedMeta.created],
                                        ['Permissions', selectedMeta.permissions],
                                        ['Owner', selectedMeta.owner],
                                        ['Sector', selectedMeta.sector],
                                    ].map(([k, v]) => (
                                        <div key={k} className="flex justify-between text-xs font-mono">
                                            <span className="text-stone-600">{k}:</span>
                                            <span className="font-bold text-stone-900">{v}</span>
                                        </div>
                                    ))}
                                    
                                    <div className="mt-4 pt-2 border-t border-dashed border-stone-300">
                                        <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">{t('fm.analysis')}:</p>
                                        <p className="text-xs font-serif italic text-stone-700 leading-snug bg-yellow-100 p-2 border border-yellow-200 rounded">
                                            "{selectedMeta.flavor}"
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t-2 border-dashed border-stone-300">
                                    <RetroButton 
                                        variant="primary" 
                                        size="sm" 
                                        className="w-full mb-2"
                                        onClick={() => handleOpenItem(selectedItemName, selectedItemNode)}
                                    >
                                        {t('fm.action.proke')}
                                    </RetroButton>
                                    <RetroButton 
                                        variant="secondary" 
                                        size="sm" 
                                        className="w-full text-red-600 hover:text-white hover:bg-red-600 border-red-200"
                                        icon={<Trash2 size={12} />}
                                        onClick={() => alert("Nice try. This is a read-only reality.")}
                                    >
                                        {t('fm.action.vaporize')}
                                    </RetroButton>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- 5. Footer Status Bar --- */}
            <div className="h-6 bg-stone-900 text-[#e8e4d9] flex items-center justify-between px-3 text-[10px] font-bold font-mono tracking-wider shrink-0 z-30">
                <div className="flex items-center gap-4">
                    <span>{t('fm.objects')}: {children.length}</span>
                    <span className="hidden sm:inline">{t('fm.selected')}: {selectedItemName ? 1 : 0}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-stone-500 hidden sm:inline">{t('fm.mood')}: <span className="text-[#ff7e33]">{mood.toUpperCase()}</span></span>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>{t('common.online')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
