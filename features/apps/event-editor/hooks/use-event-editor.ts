import { useState, useRef } from 'react';
import { EvidenceImage, NodeData } from '@/features/timeline/types';
import { useCreateNode } from '@/features/timeline/hooks/use-timeline';
import { WindowDef } from '@/types';
import { useOSStore } from '@/features/os/stores/os-store';
import { extractGPS } from '../utils';

interface UseEventEditorParams {
    win: WindowDef;
    onCancel?: () => void;
    onSuccess?: () => void;
}

export const useEventEditor = ({ win, onCancel, onSuccess }: UseEventEditorParams) => {
    const { mutate: createEvent, isPending } = useCreateNode();
    const { closeWindow } = useOSStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [year, setYear] = useState('2025');
    const [location, setLocation] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
    const [description, setDescription] = useState('');
    const [note, setNote] = useState('');
    const [status, setStatus] = useState<NodeData['status']>('CLASSIFIED');
    const [images, setImages] = useState<EvidenceImage[]>([]);
    
    // UI State
    const [isDragging, setIsDragging] = useState(false);
    const [processingImages, setProcessingImages] = useState(false);

    // Image Handling
    const processFiles = async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;

        setProcessingImages(true);
        const files = Array.from(fileList).filter(file => file.type.startsWith('image/'));
        const newImages: EvidenceImage[] = [];

        for (const file of files) {
            const gps = await extractGPS(file);
            newImages.push({
                url: URL.createObjectURL(file), 
                caption: file.name.split('.')[0],
                isHighlight: false,
                gps
            });
        }
        
        setImages(prev => [...prev, ...newImages]);
        setProcessingImages(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const toggleHighlight = (index: number) => {
        setImages(prev => prev.map((img, i) => {
            if (i === index) {
                // If turning Highlight ON and image has GPS, auto-fill coordinates
                if (!img.isHighlight && img.gps) {
                    setCoordinates(img.gps);
                }
                return { ...img, isHighlight: !img.isHighlight };
            }
            return img;
        }));
    };

    const useImageGPS = (index: number) => {
        const img = images[index];
        if (img.gps) {
            setCoordinates(img.gps);
        }
    };

    const updateCaption = (index: number, caption: string) => {
        setImages(prev => prev.map((img, i) => i === index ? { ...img, caption } : img));
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            closeWindow(win.id);
        }
    };

    const handleSubmit = () => {
        if (!title || !date) return;

        createEvent({
            title,
            year,
            fullDate: date,
            location: location || 'Unknown Sector',
            lat: coordinates.lat,
            lng: coordinates.lng,
            description,
            note: note || 'No intel provided.',
            status,
            color: status === 'SOLVED' ? '#3b82f6' : status === 'DECLASSIFIED' ? '#10b981' : '#ef4444',
            images,
            boardX: Math.random() * 800 + 50,
            boardY: Math.random() * 500 + 50
        }, {
            onSuccess: () => {
                if (onSuccess) {
                    onSuccess();
                    setTitle('');
                    setDescription('');
                    setImages([]);
                } else {
                    closeWindow(win.id);
                }
            }
        });
    };

    return {
        // Refs
        fileInputRef,
        // Form state
        title, setTitle,
        date, setDate,
        year, setYear,
        location, setLocation,
        coordinates, setCoordinates,
        description, setDescription,
        note, setNote,
        status, setStatus,
        images,
        // UI state
        isDragging,
        processingImages,
        isPending,
        // Handlers
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
    };
};
