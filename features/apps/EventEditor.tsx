import React, { useState, useRef } from 'react';
import { Save, X, MapPin, Calendar, Camera, FileText, Plus, Trash2, AlertTriangle, Upload, Image as ImageIcon, Crosshair, RefreshCw } from 'lucide-react';
import { RetroButton } from '../../components/ui/retro-ui';
import { EvidenceImage, NodeData } from '../timeline/types';
import { useCreateNode } from '../timeline/hooks/use-timeline';
import { WindowDef, ContentItem } from '../../types';
import { useOSStore } from '../os/stores/os-store';
// @ts-ignore
import EXIF from 'exif-js';

interface EventEditorProps {
    win: WindowDef;
    contentItem: ContentItem;
    onCancel?: () => void;
    onSuccess?: () => void;
}

// Helper to convert EXIF DMS to Decimal
const convertDMSToDD = (dms: number[], ref: string) => {
    let dd = dms[0] + dms[1] / 60 + dms[2] / 3600;
    if (ref === "S" || ref === "W") {
        dd = dd * -1;
    }
    return dd;
};

const extractGPS = (file: File): Promise<{ lat: number, lng: number } | undefined> => {
    return new Promise((resolve) => {
        EXIF.getData(file as any, function(this: any) {
            try {
                const latData = EXIF.getTag(this, "GPSLatitude");
                const latRef = EXIF.getTag(this, "GPSLatitudeRef");
                const lngData = EXIF.getTag(this, "GPSLongitude");
                const lngRef = EXIF.getTag(this, "GPSLongitudeRef");

                if (latData && latRef && lngData && lngRef) {
                    const lat = convertDMSToDD(latData, latRef);
                    const lng = convertDMSToDD(lngData, lngRef);
                    resolve({ lat, lng });
                } else {
                    resolve(undefined);
                }
            } catch (e) {
                console.error("EXIF Parsing Error", e);
                resolve(undefined);
            }
        });
    });
};

export const EventEditor: React.FC<EventEditorProps> = ({ win, contentItem, onCancel, onSuccess }) => {
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

    return (
        <div className="flex flex-col h-full bg-[#e8e4d9] relative overflow-hidden font-sans">
             {/* Textures */}
             <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]" />
             <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dust.png')]" />

             {/* Header */}
             <div className="h-14 border-b-2 border-stone-800 bg-[#d6cbb5] flex items-center justify-between px-4 shrink-0 shadow-sm z-10 relative">
                 <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-stone-900 flex items-center justify-center text-[#ff7e33] border-2 border-black rotate-[-2deg] shadow-retro-sm">
                        <AlertTriangle size={20} />
                     </div>
                     <div className="flex flex-col">
                         <span className="font-black text-sm uppercase tracking-tighter text-stone-900">Evidence Locker</span>
                         <span className="text-[9px] text-stone-600 font-mono font-bold tracking-[0.2em]">DIRECTIVE_25_A // TOP_SECRET</span>
                     </div>
                 </div>
                 <div className="flex items-center gap-2">
                     <RetroButton variant="secondary" size="sm" onClick={handleCancel}>Discard</RetroButton>
                     <RetroButton variant="primary" size="sm" onClick={handleSubmit} loading={isPending} icon={<Save size={14} />}>
                        File Report
                     </RetroButton>
                 </div>
             </div>

             <div className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-hide">
                 <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                     
                     {/* LEFT COLUMN: THE CASE FILE */}
                     <div className="lg:col-span-8 space-y-8">
                         
                         {/* Title Section - Manila Tag Style */}
                         <div className="relative group">
                             <div className="absolute -top-3 left-4 bg-[#ff7e33] px-2 py-0.5 text-[9px] font-black text-black uppercase tracking-widest border border-black z-20 shadow-retro-sm rotate-[-1deg]">Subject ID</div>
                             <div className="border-2 border-stone-800 bg-[#fdfaf5] p-6 shadow-retro-md transition-all group-focus-within:border-[#ff7e33] group-focus-within:-translate-y-0.5">
                                 <input 
                                    type="text" 
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full text-3xl font-black text-stone-900 outline-none font-serif placeholder:text-stone-200 uppercase tracking-tighter bg-transparent"
                                    placeholder="OPERATION: NAME_HERE"
                                 />
                             </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Date Field */}
                            <div className="relative group">
                                <div className="absolute -top-3 left-4 bg-stone-800 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-widest border border-black z-20 rotate-[1deg]">Timestamp</div>
                                <div className="border-2 border-stone-800 bg-[#fdfaf5] p-5 shadow-retro-sm group-focus-within:border-[#ff7e33] transition-colors">
                                    <div className="flex gap-4 items-center">
                                        <Calendar size={18} className="text-stone-400" />
                                        <input 
                                            type="text" 
                                            value={date}
                                            onChange={e => setDate(e.target.value)}
                                            className="flex-1 outline-none font-mono text-sm font-bold uppercase bg-transparent"
                                            placeholder="DAY MONTH"
                                        />
                                        <div className="w-px h-6 bg-stone-300" />
                                        <input 
                                            type="text" 
                                            value={year}
                                            onChange={e => setYear(e.target.value)}
                                            className="w-16 outline-none font-mono text-sm font-bold text-stone-500 bg-transparent"
                                            placeholder="YEAR"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Location Field */}
                            <div className="relative group">
                                <div className="absolute -top-3 left-4 bg-stone-800 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-widest border border-black z-20 rotate-[-1deg]">Sector</div>
                                <div className="border-2 border-stone-800 bg-[#fdfaf5] p-5 shadow-retro-sm group-focus-within:border-[#ff7e33] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <MapPin size={18} className="text-stone-400" />
                                        <input 
                                            type="text" 
                                            value={location}
                                            onChange={e => setLocation(e.target.value)}
                                            className="flex-1 outline-none font-mono text-sm font-bold uppercase bg-transparent"
                                            placeholder="TARGET_COORDINATES"
                                        />
                                    </div>
                                </div>
                            </div>
                         </div>

                         {/* Geospatial Data Field */}
                         <div className="relative group">
                                <div className="absolute -top-3 left-4 bg-stone-800 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-widest border border-black z-20">GPS Uplink</div>
                                <div className="border-2 border-stone-800 bg-[#fdfaf5] p-5 shadow-retro-sm group-focus-within:border-[#ff7e33] transition-colors">
                                    <div className="flex gap-8">
                                        <div className="flex items-center gap-3 flex-1">
                                            <span className="text-[10px] font-black text-stone-400 uppercase font-mono">Latitude:</span>
                                            <input 
                                                type="number" 
                                                value={coordinates.lat}
                                                onChange={e => setCoordinates(p => ({...p, lat: parseFloat(e.target.value)}))}
                                                className="w-full outline-none font-mono text-sm font-bold bg-transparent border-b border-stone-200 focus:border-[#ff7e33]"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 flex-1">
                                            <span className="text-[10px] font-black text-stone-400 uppercase font-mono">Longitude:</span>
                                            <input 
                                                type="number" 
                                                value={coordinates.lng}
                                                onChange={e => setCoordinates(p => ({...p, lng: parseFloat(e.target.value)}))}
                                                className="w-full outline-none font-mono text-sm font-bold bg-transparent border-b border-stone-200 focus:border-[#ff7e33]"
                                            />
                                        </div>
                                    </div>
                                </div>
                         </div>

                         {/* Briefing Report */}
                         <div className="relative group">
                             <div className="absolute -top-3 left-4 bg-stone-800 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-widest border border-black z-20 rotate-[0.5deg]">Intelligence Summary</div>
                             <div className="border-2 border-stone-800 bg-white p-8 shadow-retro-md group-focus-within:border-[#ff7e33] min-h-[300px] transition-all">
                                 <textarea 
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full h-full min-h-[250px] outline-none font-serif text-xl leading-relaxed text-stone-800 resize-none bg-transparent placeholder:text-stone-100"
                                    placeholder="Type official mission report details here..."
                                 />
                                 <div className="absolute bottom-4 right-6 pointer-events-none opacity-5">
                                     <FileText size={120} />
                                 </div>
                             </div>
                         </div>
                         
                         {/* Sticky Note */}
                         <div className="w-72 bg-[#fef08a] p-6 shadow-retro-md -rotate-2 border-2 border-stone-800 relative group transition-transform hover:rotate-0">
                             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-600 rounded-full shadow-retro-sm z-10 border-2 border-red-900" />
                             <label className="block text-[9px] font-black text-stone-500 uppercase mb-2 tracking-tighter">Handwritten Intel</label>
                             <textarea 
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                className="w-full bg-transparent outline-none font-handwriting text-blue-900 font-bold text-lg resize-none leading-tight"
                                placeholder="Jot down quick thoughts..."
                                rows={4}
                             />
                         </div>

                     </div>

                     {/* RIGHT COLUMN: EVIDENCE LOCKER */}
                     <div className="lg:col-span-4 space-y-10">
                         
                         {/* Classification Stamp */}
                         <div className="bg-[#d6cbb5] p-6 border-2 border-stone-800 shadow-retro-sm rotate-[1deg]">
                             <label className="block text-[10px] font-black text-stone-700 uppercase mb-4 tracking-widest border-b border-stone-400 pb-1">Security Clearance</label>
                             <div className="grid grid-cols-1 gap-2">
                                 {(['CLASSIFIED', 'DECLASSIFIED', 'ONGOING', 'SOLVED'] as const).map(s => (
                                     <button
                                        key={s}
                                        onClick={() => setStatus(s)}
                                        className={`px-4 py-3 text-xs font-black border-2 transition-all tracking-tighter ${
                                            status === s 
                                            ? s === 'CLASSIFIED' ? 'bg-red-600 border-red-900 text-white shadow-retro-sm scale-[1.02]' : 
                                              s === 'SOLVED' ? 'bg-blue-600 border-blue-900 text-white shadow-retro-sm scale-[1.02]' :
                                              'bg-stone-900 border-black text-white shadow-retro-sm scale-[1.02]'
                                            : 'bg-[#e8e4d9]/50 border-stone-400 text-stone-500 hover:border-stone-600 hover:bg-[#e8e4d9]'
                                        }`}
                                     >
                                         {s}
                                     </button>
                                 ))}
                             </div>
                         </div>

                         {/* Evidence Album Drop Zone */}
                         <div 
                            className={`relative border-2 border-stone-800 bg-[#fdfaf5] p-6 shadow-retro-md transition-all flex flex-col min-h-[400px] ${isDragging ? 'bg-[#ff7e33]/10 border-[#ff7e33] border-dashed scale-[1.02]' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                         >
                             <div className="flex items-center justify-between mb-6 border-b-2 border-stone-800 pb-2">
                                 <div className="flex items-center gap-2">
                                     <Camera size={16} />
                                     <label className="text-xs font-black text-stone-900 uppercase tracking-tighter">Evidence Photos</label>
                                 </div>
                                 <button 
                                    onClick={() => fileInputRef.current?.click()} 
                                    className="flex items-center gap-1 text-[10px] font-black text-[#ff7e33] hover:text-stone-900 transition-colors uppercase"
                                 >
                                     <Plus size={14} strokeWidth={3} /> Upload
                                 </button>
                                 <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    multiple 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleFileSelect}
                                 />
                             </div>

                             <div className="flex-1 space-y-6">
                                 {processingImages && (
                                     <div className="flex items-center justify-center gap-2 text-stone-500 py-4">
                                         <RefreshCw size={16} className="animate-spin" />
                                         <span className="text-[10px] font-black uppercase">Analyzing EXIF Data...</span>
                                     </div>
                                 )}

                                 {!processingImages && images.length === 0 && (
                                     <div className={`border-2 border-dashed rounded h-48 flex flex-col items-center justify-center text-stone-400 transition-colors ${isDragging ? 'border-[#ff7e33] text-[#ff7e33]' : 'border-stone-300'}`}>
                                         {isDragging ? <Upload size={40} className="animate-bounce" /> : <ImageIcon size={40} className="opacity-20 mb-3" />}
                                         <span className="text-[10px] font-black uppercase text-center px-4">
                                             {isDragging ? 'Release to attach evidence' : 'Drag & Drop photos or click Upload'}
                                         </span>
                                     </div>
                                 )}
                                 
                                 {images.map((img, idx) => (
                                     <div key={idx} className="relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
                                         {/* Polaroid Style */}
                                         <div className="bg-white p-3 pb-10 border border-stone-300 shadow-md rotate-[1deg] hover:rotate-0 transition-transform group-hover:shadow-lg">
                                             <div className="aspect-square bg-stone-100 overflow-hidden border border-stone-200 relative">
                                                 <img src={img.url} className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-500" alt="evidence" />
                                                 {img.gps && (
                                                     <div className="absolute top-1 right-1 bg-green-500 text-white text-[8px] font-black px-1 py-0.5 shadow-sm flex items-center gap-1" title="GPS Data Found">
                                                         <Crosshair size={8} /> GPS FOUND
                                                     </div>
                                                 )}
                                             </div>
                                             
                                             <div className="absolute bottom-2 left-3 right-3 flex flex-col">
                                                 <input 
                                                    type="text" 
                                                    value={img.caption || ''} 
                                                    onChange={(e) => updateCaption(idx, e.target.value)}
                                                    className="text-[10px] font-bold text-stone-600 outline-none border-b border-transparent focus:border-stone-200 w-full mb-1 font-mono uppercase bg-transparent"
                                                    placeholder="Untitled Evidence"
                                                 />
                                                 <div className="flex items-center justify-between">
                                                     <div className="flex items-center gap-2">
                                                         <button 
                                                            onClick={() => toggleHighlight(idx)}
                                                            className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm border transition-all ${img.isHighlight ? 'bg-yellow-400 border-black text-black' : 'bg-stone-50 border-stone-200 text-stone-400'}`}
                                                         >
                                                             {img.isHighlight ? '★ KEY EVIDENCE' : '☆ MARK KEY'}
                                                         </button>
                                                         {img.gps && (
                                                             <button 
                                                                onClick={() => useImageGPS(idx)}
                                                                className="text-[8px] font-black px-1.5 py-0.5 rounded-sm border border-stone-200 bg-stone-50 text-stone-500 hover:bg-green-50 hover:text-green-600 transition-colors"
                                                                title="Use this image's coordinates"
                                                             >
                                                                 USE GPS
                                                             </button>
                                                         )}
                                                     </div>
                                                     <button onClick={() => removeImage(idx)} className="text-stone-300 hover:text-red-600 transition-colors">
                                                         <Trash2 size={12} />
                                                     </button>
                                                 </div>
                                             </div>
                                         </div>
                                         {/* "Tape" decoration */}
                                         <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-stone-200/40 border border-stone-300/30 rotate-[-5deg] z-20 pointer-events-none" />
                                     </div>
                                 ))}
                             </div>
                         </div>
                     </div>

                 </div>
             </div>
        </div>
    );
};