import React from 'react';
import { WindowDef, ContentItem } from '@/types';
import { useEventEditor } from './event-editor/hooks/use-event-editor';
import { EventEditorHeader } from './event-editor/components/EventEditorHeader';
import { CaseFileForm } from './event-editor/components/CaseFileForm';
import { EvidencePanel } from './event-editor/components/EvidencePanel';

interface EventEditorProps {
    win: WindowDef;
    contentItem: ContentItem;
    onCancel?: () => void;
    onSuccess?: () => void;
}

export const EventEditor: React.FC<EventEditorProps> = ({ win, contentItem, onCancel, onSuccess }) => {
    const editor = useEventEditor({ win, onCancel, onSuccess });

    return (
        <div className="flex flex-col h-full bg-[#e8e4d9] relative overflow-hidden font-sans">
             {/* Textures */}
             <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]" />
             <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dust.png')]" />

             <EventEditorHeader
                 isPending={editor.isPending}
                 onCancel={editor.handleCancel}
                 onSubmit={editor.handleSubmit}
             />

             <div className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-hide">
                 <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                     <CaseFileForm
                         title={editor.title} setTitle={editor.setTitle}
                         date={editor.date} setDate={editor.setDate}
                         year={editor.year} setYear={editor.setYear}
                         location={editor.location} setLocation={editor.setLocation}
                         coordinates={editor.coordinates} setCoordinates={editor.setCoordinates}
                         description={editor.description} setDescription={editor.setDescription}
                         note={editor.note} setNote={editor.setNote}
                     />
                     <EvidencePanel
                         status={editor.status} setStatus={editor.setStatus}
                         images={editor.images}
                         isDragging={editor.isDragging}
                         processingImages={editor.processingImages}
                         fileInputRef={editor.fileInputRef}
                         handleFileSelect={editor.handleFileSelect}
                         handleDragOver={editor.handleDragOver}
                         handleDragLeave={editor.handleDragLeave}
                         handleDrop={editor.handleDrop}
                         removeImage={editor.removeImage}
                         toggleHighlight={editor.toggleHighlight}
                         useImageGPS={editor.useImageGPS}
                         updateCaption={editor.updateCaption}
                     />
                 </div>
             </div>
        </div>
    );
};