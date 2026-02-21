import React from 'react';
import { ArrowUp, Home, Search, Upload, Menu } from 'lucide-react';
import { useTranslation } from '@/features/os/hooks/use-translation';

interface FileManagerToolbarProps {
    currentPath: string[];
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    goUp: () => void;
    handleNavigate: (path: string[]) => void;
    handleUploadClick: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const FileManagerToolbar: React.FC<FileManagerToolbarProps> = ({
    currentPath,
    isSidebarOpen,
    setIsSidebarOpen,
    goUp,
    handleNavigate,
    handleUploadClick,
    handleFileChange,
    fileInputRef,
}) => {
    const { t } = useTranslation();

    return (
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
    );
};
