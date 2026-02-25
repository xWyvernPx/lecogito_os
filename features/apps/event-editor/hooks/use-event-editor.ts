import { useState, useRef, useCallback } from 'react';
import { EvidenceImage } from '@/features/timeline/types';
import { useCreateLifeEvent } from '@/services/hooks/use-life-event';
import { StorageApi } from '@/services/api/storage.api';
import { getPublicUrl } from '@/lib/env';
import { WindowDef } from '@/types';
import { useOSStore } from '@/features/os/stores/os-store';
import { extractGPS } from '../utils';
import type { EventStatus } from '@/types/api';

interface UseEventEditorParams {
    win: WindowDef;
    onCancel?: () => void;
    onSuccess?: () => void;
}

export type ImageUploadStatus = 'uploading' | 'done' | 'error';

export interface UploadableImage extends EvidenceImage {
    /** Blob URL for instant preview — always set from the moment the file is picked */
    previewUrl: string;
    uploadStatus: ImageUploadStatus;
}

const STATUS_COLORS: Record<EventStatus, string> = {
    SOLVED: '#3b82f6',
    DECLASSIFIED: '#10b981',
    ONGOING: '#f59e0b',
    CLASSIFIED: '#ef4444',
};

export const useEventEditor = ({ win, onCancel, onSuccess }: UseEventEditorParams) => {
    const { mutateAsync: createEvent, isPending } = useCreateLifeEvent();
    const { closeWindow } = useOSStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [title, setTitle] = useState('');
    /** ISO date: YYYY-MM-DD  (driven by <input type="date">) */
    const [fullDate, setFullDate] = useState('');
    const [location, setLocation] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
    const [description, setDescription] = useState('');
    const [note, setNote] = useState('');
    const [status, setStatus] = useState<EventStatus>('CLASSIFIED');
    const [images, setImages] = useState<UploadableImage[]>([]);
    const [published, setPublished] = useState(false);

    // UI State
    const [isDragging, setIsDragging] = useState(false);
    const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Derived year from fullDate
    const year = fullDate ? fullDate.slice(0, 4) : '';

    // ─── Upload Helpers ──────────────────────────────────────────────

    const uploadFiles = useCallback(async (files: File[]): Promise<string[]> => {
        // 1. Get batch presigned upload URLs
        const fileInfos = files.map(f => ({
            name: f.name.split('.').slice(0, -1).join('.') || f.name,
            extension: f.name.split('.').pop() ?? '',
            contentType: f.type,
            size: f.size,
        }));

        const presignResponse = await StorageApi.getBatchPresignedUrl(fileInfos);
        const presignedDtos = presignResponse.data;

        // 2. Upload each file directly to the presigned URL (plain fetch — no auth header for S3)
        await Promise.all(
            presignedDtos.map((dto, i) =>
                fetch(dto.url, {
                    method: 'PUT',
                    body: files[i],
                    headers: { 'Content-Type': files[i].type, 'x-amz-tagging': dto.tags },
                })
            )
        );

        // 3. Return permanent public URLs
        return presignedDtos.map(dto => getPublicUrl(dto.url, dto.key));
    }, []);

    // ─── Image Handling ──────────────────────────────────────────────

    const processFiles = useCallback(async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;

        const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
        if (files.length === 0) return;

        setIsUploading(true);

        // Add images immediately with preview blob URLs + 'uploading' status for live feedback
        const drafts: UploadableImage[] = await Promise.all(
            files.map(async f => {
                const gps = await extractGPS(f);
                return {
                    url: '',
                    previewUrl: URL.createObjectURL(f),
                    caption: f.name.split('.')[0],
                    isHighlight: false,
                    gps,
                    uploadStatus: 'uploading' as ImageUploadStatus,
                };
            })
        );

        setImages(prev => [...prev, ...drafts]);

        try {
            const publicUrls = await uploadFiles(files);

            // Match drafts by their previewUrl (stable, unique per blob) and update to final URL
            setImages(prev =>
                prev.map(img => {
                    const draftIdx = drafts.findIndex(d => d.previewUrl === img.previewUrl);
                    if (draftIdx !== -1 && img.uploadStatus === 'uploading') {
                        return { ...img, url: publicUrls[draftIdx], uploadStatus: 'done' };
                    }
                    return img;
                })
            );
        } catch {
            setImages(prev =>
                prev.map(img =>
                    drafts.some(d => d.previewUrl === img.previewUrl) && img.uploadStatus === 'uploading'
                        ? { ...img, uploadStatus: 'error' }
                        : img
                )
            );
        } finally {
            setIsUploading(false);
        }
    }, [uploadFiles]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
        e.target.value = '';
    }, [processFiles]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    }, [processFiles]);

    const removeImage = useCallback((index: number) => {
        setImages(prev => {
            const img = prev[index];
            if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl);
            return prev.filter((_, i) => i !== index);
        });
    }, []);

    const toggleHighlight = useCallback((index: number) => {
        setImages(prev => prev.map((img, i) => {
            if (i === index) {
                if (!img.isHighlight && img.gps) setCoordinates(img.gps);
                return { ...img, isHighlight: !img.isHighlight };
            }
            return img;
        }));
    }, []);

    const useImageGPS = useCallback((index: number) => {
        const img = images[index];
        if (img?.gps) setCoordinates(img.gps);
    }, [images]);

    const updateCaption = useCallback((index: number, caption: string) => {
        setImages(prev => prev.map((img, i) => i === index ? { ...img, caption } : img));
    }, []);

    // ─── Map Picker ──────────────────────────────────────────────────

    const handleOpenMapPicker = useCallback(() => setIsMapPickerOpen(true), []);
    const handleCloseMapPicker = useCallback(() => setIsMapPickerOpen(false), []);
    const handleConfirmCoordinates = useCallback((coords: { lat: number; lng: number }) => {
        setCoordinates(coords);
        setIsMapPickerOpen(false);
    }, []);

    // ─── Form actions ────────────────────────────────────────────────

    const handleCancel = useCallback(() => {
        if (onCancel) onCancel();
        else closeWindow(win.id);
    }, [onCancel, closeWindow, win.id]);

    const handleSubmit = useCallback(async () => {
        if (!title || !fullDate) return;

        const readyImages = images.filter(img => img.uploadStatus === 'done');

        await createEvent({
            title,
            year,
            fullDate,
            location: location || 'Unknown Sector',
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            description,
            note: note || 'No intel provided.',
            status,
            color: STATUS_COLORS[status],
            mediaUrls: readyImages.map(img => img.url),
            published,
        });

        if (onSuccess) {
            onSuccess();
            setTitle('');
            setFullDate('');
            setDescription('');
            setImages([]);
        } else {
            closeWindow(win.id);
        }
    }, [
        title, fullDate, year, location, coordinates, description,
        note, status, images, published, createEvent, onSuccess, closeWindow, win.id,
    ]);

    return {
        fileInputRef,
        title, setTitle,
        fullDate, setFullDate,
        year,
        location, setLocation,
        coordinates, setCoordinates,
        description, setDescription,
        note, setNote,
        status, setStatus,
        published, setPublished,
        images,
        isDragging,
        isUploading,
        isPending,
        isMapPickerOpen,
        handleFileSelect,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        removeImage,
        toggleHighlight,
        useImageGPS,
        updateCaption,
        handleCancel,
        handleSubmit,
        handleOpenMapPicker,
        handleCloseMapPicker,
        handleConfirmCoordinates,
    };
};
