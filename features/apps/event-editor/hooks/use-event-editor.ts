import { useState, useRef, useCallback } from 'react';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { EvidenceImage } from '@/features/timeline/types';
import { useCreateLifeEvent } from '@/services/hooks/use-life-event';
import { useCreateBatchPresignUpload } from '@/services/hooks/use-storage';
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
    previewUrl: string;
    uploadStatus: ImageUploadStatus;
    // Rich media metadata (populated after upload)
    objectKey?: string;
    name?: string;
    extension?: string;
    contentType?: string;
    size?: number;
}

export interface EventEditorFormValues {
    title: string;
    fullDate: string;
    location: string;
    lat: number;
    lng: number;
    description: string;
    note: string;
    status: EventStatus;
}

const STATUS_COLORS: Record<EventStatus, string> = {
    SOLVED: '#3b82f6',
    DECLASSIFIED: '#10b981',
    ONGOING: '#f59e0b',
    CLASSIFIED: '#ef4444',
};

export const useEventEditor = ({ win, onCancel, onSuccess }: UseEventEditorParams) => {
    const { mutateAsync: createEvent, isPending } = useCreateLifeEvent();
    const { mutateAsync: getBatchPresignedUrls } = useCreateBatchPresignUpload();
    const { closeWindow } = useOSStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Image state (outside form)
    const [images, setImages] = useState<UploadableImage[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);

    // ─── TanStack Form ──────────────────────────────────────────────
    const form = useForm({
        defaultValues: {
            title: '',
            fullDate: '',
            location: '',
            lat: 0,
            lng: 0,
            description: '',
            note: '',
            status: 'CLASSIFIED' as EventStatus,
        },
        onSubmit: async ({ value }) => {
            const readyImages = images.filter(img => img.uploadStatus === 'done');
            try {
                await createEvent({
                    title: value.title,
                    year: value.fullDate.slice(0, 4),
                    fullDate: value.fullDate,
                    location: value.location || 'Unknown Sector',
                    latitude: value.lat,
                    longitude: value.lng,
                    description: value.description,
                    note: value.note || 'No intel provided.',
                    status: value.status,
                    color: STATUS_COLORS[value.status],
                    mediaHighlights: readyImages.map(img => ({
                        url: img.url,
                        name: img.name ?? img.caption ?? '',
                        extension: img.extension ?? '',
                        contentType: img.contentType ?? '',
                        size: img.size ?? 0,
                        objectKey: img.objectKey ?? '',
                        highlight: img.isHighlight ?? false,
                        gps: img.gps ? { x: img.gps.lat, y: img.gps.lng } : undefined,
                    })),
                });
                toast.success('Report filed successfully');
                if (onSuccess) {
                    onSuccess();
                    form.reset();
                    setImages([]);
                } else {
                    closeWindow(win.id);
                }
            } catch {
                toast.error('Failed to file report. Please try again.');
            }
        },
    });

    // ─── Submit with validation toast ────────────────────────────────
    const handleSubmit = useCallback(async () => {
        if (isUploading) {
            toast.warning('Images still uploading', {
                description: 'Please wait for all uploads to complete.',
            });
            return;
        }
        await form.validateAllFields('submit');
        if (!form.state.isValid) {
            toast.error('Fill in the required fields', {
                description: 'Title and date must be filled to file a report.',
            });
            return;
        }
        await form.handleSubmit();
    }, [form, isUploading]);

    // ─── Upload Helpers ──────────────────────────────────────────────
    const uploadFiles = useCallback(
        async (files: File[], path: string): Promise<Array<{ url: string; key: string }>> => {
            const fileInfos = files.map(f => {
                const nameParts = f.name.split('.');
                const ext = nameParts.pop() ?? '';
                return {
                    name: nameParts.join('.') || f.name,
                    extension: ext,
                    contentType: f.type,
                    size: f.size,
                };
            });
            const presignResponse = await getBatchPresignedUrls({ files: fileInfos, path });
            const presignedDtos = presignResponse.data;
            await Promise.all(
                presignedDtos.map((dto, i) =>
                    fetch(dto.url, {
                        method: 'PUT',
                        body: files[i],
                        headers: { 'Content-Type': files[i].type, 'x-amz-tagging': dto.tags },
                    })
                )
            );
            return presignedDtos.map(dto => ({ url: getPublicUrl(dto.url, dto.key), key: dto.key }));
        },
        [getBatchPresignedUrls]
    );

    // ─── Image Handling ──────────────────────────────────────────────
    const processFiles = useCallback(async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;
        const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
        if (files.length === 0) return;
        setIsUploading(true);
        const drafts: UploadableImage[] = await Promise.all(
            files.map(async f => {
                const gps = await extractGPS(f).catch(() => undefined);
                const nameParts = f.name.split('.');
                const ext = nameParts.pop() ?? '';
                const baseName = nameParts.join('.') || f.name;
                return {
                    url: '',
                    previewUrl: URL.createObjectURL(f),
                    caption: baseName,
                    isHighlight: false,
                    gps,
                    uploadStatus: 'uploading' as ImageUploadStatus,
                    name: baseName,
                    extension: ext,
                    contentType: f.type,
                    size: f.size,
                };
            })
        );
        setImages(prev => [...prev, ...drafts]);
        try {
            const results = await uploadFiles(files, 'events');
            setImages(prev =>
                prev.map(img => {
                    const draftIdx = drafts.findIndex(d => d.previewUrl === img.previewUrl);
                    if (draftIdx !== -1 && img.uploadStatus === 'uploading') {
                        return { ...img, url: results[draftIdx].url, objectKey: results[draftIdx].key, uploadStatus: 'done' };
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
                if (!img.isHighlight && img.gps) {
                    form.setFieldValue('lat', img.gps.lat);
                    form.setFieldValue('lng', img.gps.lng);
                }
                return { ...img, isHighlight: !img.isHighlight };
            }
            return img;
        }));
    }, [form]);

    const useImageGPS = useCallback((index: number) => {
        const img = images[index];
        if (img?.gps) {
            form.setFieldValue('lat', img.gps.lat);
            form.setFieldValue('lng', img.gps.lng);
        }
    }, [images, form]);

    const updateCaption = useCallback((index: number, caption: string) => {
        setImages(prev => prev.map((img, i) => i === index ? { ...img, caption } : img));
    }, []);

    // ─── Map Picker ──────────────────────────────────────────────────
    const handleOpenMapPicker = useCallback(() => setIsMapPickerOpen(true), []);
    const handleCloseMapPicker = useCallback(() => setIsMapPickerOpen(false), []);
    const handleConfirmCoordinates = useCallback(
        (coords: { lat: number; lng: number }, locationName?: string) => {
            form.setFieldValue('lat', coords.lat);
            form.setFieldValue('lng', coords.lng);
            if (locationName && !form.state.values.location.trim()) {
                form.setFieldValue('location', locationName);
            }
            setIsMapPickerOpen(false);
        },
        [form]
    );

    // ─── Cancel ──────────────────────────────────────────────────────
    const handleCancel = useCallback(() => {
        if (onCancel) onCancel();
        else closeWindow(win.id);
    }, [onCancel, closeWindow, win.id]);

    return {
        form,
        fileInputRef,
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
