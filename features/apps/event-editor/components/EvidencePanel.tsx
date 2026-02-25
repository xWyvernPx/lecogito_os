import React from 'react';
import { Camera, Plus, Trash2, Upload, Image as ImageIcon, Crosshair, RefreshCw, AlertCircle } from 'lucide-react';
import { NodeData } from '@/features/timeline/types';
import type { UploadableImage } from '../hooks/use-event-editor';

interface EvidencePanelProps {
    status: NodeData['status'];
    setStatus: (s: NodeData['status']) => void;
    images: UploadableImage[];
    isDragging: boolean;
    isUploading: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleDragLeave: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    removeImage: (index: number) => void;
    toggleHighlight: (index: number) => void;
    useImageGPS: (index: number) => void;
    updateCaption: (index: number, caption: string) => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
    status, setStatus,
    images,
    isDragging, isUploading,
    fileInputRef,
    handleFileSelect,
    handleDragOver, handleDragLeave, handleDrop,
    removeImage, toggleHighlight, useImageGPS, updateCaption,
}) => {
    return (
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
                className={`relative border-2 border-stone-800 bg-[#fdfaf5] p-6 shadow-retro-md transition-all flex flex-col min-h-[400px] ${isDragging ? 'bg-os-accent/10 border-os-accent border-dashed scale-[1.02]' : ''}`}
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
                        className="flex items-center gap-1 text-[10px] font-black text-os-accent hover:text-stone-900 transition-colors uppercase"
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
                    {isUploading && images.every(img => img.uploadStatus !== 'uploading') && (
                        <div className="flex items-center justify-center gap-2 text-stone-500 py-4">
                            <RefreshCw size={16} className="animate-spin" />
                            <span className="text-[10px] font-black uppercase">Uploading to Storage...</span>
                        </div>
                    )}

                    {!isUploading && images.length === 0 && (
                        <div className={`border-2 border-dashed rounded h-48 flex flex-col items-center justify-center text-stone-400 transition-colors ${isDragging ? 'border-os-accent text-os-accent' : 'border-stone-300'}`}>
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
                                    <img
                                        src={img.previewUrl || img.url}
                                        className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-500"
                                        alt="evidence"
                                    />

                                    {/* Upload status overlay */}
                                    {img.uploadStatus === 'uploading' && (
                                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1">
                                            <RefreshCw size={20} className="text-white animate-spin" />
                                            <span className="text-[8px] font-black text-white uppercase">Uploading...</span>
                                        </div>
                                    )}
                                    {img.uploadStatus === 'error' && (
                                        <div className="absolute inset-0 bg-red-900/70 flex flex-col items-center justify-center gap-1">
                                            <AlertCircle size={20} className="text-red-300" />
                                            <span className="text-[8px] font-black text-red-300 uppercase">Upload Failed</span>
                                        </div>
                                    )}

                                    {img.gps && img.uploadStatus === 'done' && (
                                        <div className="absolute top-1 right-1 bg-green-500 text-white text-[8px] font-black px-1 py-0.5 shadow-sm flex items-center gap-1" title="GPS Data Found">
                                            <Crosshair size={8} /> GPS FOUND
                                        </div>
                                    )}
                                    {img.uploadStatus === 'done' && (
                                        <div className="absolute top-1 left-1 bg-stone-900/70 text-green-400 text-[7px] font-black px-1 py-0.5">✓ STORED</div>
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
    );
};
