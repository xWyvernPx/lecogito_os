import React from 'react';
import { WindowDef, ContentItem } from '@/types';
import { useTranslation } from '@/features/os/hooks/use-translation';
import { useFileManager } from './file-manager/hooks/use-file-manager';
import { FileManagerToolbar } from './file-manager/components/FileManagerToolbar';
import { FileManagerSidebar } from './file-manager/components/FileManagerSidebar';
import { FileGrid } from './file-manager/components/FileGrid';
import { InspectorPanel } from './file-manager/components/InspectorPanel';

interface FileManagerProps {
    win: WindowDef;
    contentItem: ContentItem;
}

export const FileManager: React.FC<FileManagerProps> = ({ win, contentItem }) => {
    const { t } = useTranslation();
    const fm = useFileManager(contentItem);

    return (
        <div className="flex flex-col h-full bg-[#e8e4d9] font-mono text-sm select-none relative overflow-hidden">
            <FileManagerToolbar
                currentPath={fm.currentPath}
                isSidebarOpen={fm.isSidebarOpen}
                setIsSidebarOpen={fm.setIsSidebarOpen}
                goUp={fm.goUp}
                handleNavigate={fm.handleNavigate}
                handleUploadClick={fm.handleUploadClick}
                handleFileChange={fm.handleFileChange}
                fileInputRef={fm.fileInputRef}
            />

            <div className="flex flex-1 overflow-hidden relative">
                <FileManagerSidebar
                    isSidebarOpen={fm.isSidebarOpen}
                    setIsSidebarOpen={fm.setIsSidebarOpen}
                    handleNavigate={fm.handleNavigate}
                />

                <FileGrid
                    sortedItems={fm.sortedItems}
                    selectedItemName={fm.selectedItemName}
                    setSelectedItemName={fm.setSelectedItemName}
                    handleOpenItem={fm.handleOpenItem}
                    isDragging={fm.isDragging}
                    handleDragOver={fm.handleDragOver}
                    handleDragLeave={fm.handleDragLeave}
                    handleDrop={fm.handleDrop}
                />

                <InspectorPanel
                    selectedItemName={fm.selectedItemName}
                    selectedItemNode={fm.selectedItemNode}
                    selectedMeta={fm.selectedMeta}
                    handleOpenItem={fm.handleOpenItem}
                />
            </div>

            {/* Footer Status Bar */}
            <div className="h-6 bg-stone-900 text-[#e8e4d9] flex items-center justify-between px-3 text-[10px] font-bold font-mono tracking-wider shrink-0 z-30">
                <div className="flex items-center gap-4">
                    <span>{t('fm.objects')}: {fm.children.length}</span>
                    <span className="hidden sm:inline">{t('fm.selected')}: {fm.selectedItemName ? 1 : 0}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-stone-500 hidden sm:inline">{t('fm.mood')}: <span className="text-[#ff7e33]">{fm.mood.toUpperCase()}</span></span>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>{t('common.online')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
