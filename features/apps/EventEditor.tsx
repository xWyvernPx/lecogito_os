import React, { useState } from 'react';
import { WindowDef, ContentItem } from '@/types';
import { useEventEditor } from './event-editor/hooks/use-event-editor';
import { EventEditorHeader } from './event-editor/components/EventEditorHeader';
import { CaseFileForm } from './event-editor/components/CaseFileForm';
import { EvidencePanel } from './event-editor/components/EvidencePanel';
import { CoordinatePicker } from './event-editor/components/CoordinatePicker';

interface EventEditorProps {
    win: WindowDef;
    contentItem: ContentItem;
    onCancel?: () => void;
    onSuccess?: () => void;
}

export const EventEditor: React.FC<EventEditorProps> = ({ win, contentItem, onCancel, onSuccess }) => {
    const editor = useEventEditor({ win, onCancel, onSuccess });
    const { values } = editor.form.state;
    const [published, setPublished] = useState(false);

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
                        form={editor.form}
                        onOpenMapPicker={editor.handleOpenMapPicker}
                    />
                    <EvidencePanel
                        status={values.status}
                        setStatus={(s) => editor.form.setFieldValue('status', s)}
                        published={published}
                        setPublished={setPublished}
                        images={editor.images}
                        isDragging={editor.isDragging}
                        isUploading={editor.isUploading}
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

            {editor.isMapPickerOpen && (
                <CoordinatePicker
                    initial={{ lat: values.lat, lng: values.lng }}
                    onConfirm={editor.handleConfirmCoordinates}
                    onClose={editor.handleCloseMapPicker}
                />
            )}
        </div>
    );
};