import React from 'react';
import { Calendar, MapPin, FileText, Map } from 'lucide-react';

interface CaseFileFormProps {
    title: string;
    setTitle: (v: string) => void;
    /** ISO date YYYY-MM-DD */
    fullDate: string;
    setFullDate: (v: string) => void;
    /** Derived from fullDate — display only */
    year: string;
    location: string;
    setLocation: (v: string) => void;
    coordinates: { lat: number; lng: number };
    setCoordinates: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
    description: string;
    setDescription: (v: string) => void;
    note: string;
    setNote: (v: string) => void;
    onOpenMapPicker: () => void;
}

export const CaseFileForm: React.FC<CaseFileFormProps> = ({
    title, setTitle,
    fullDate, setFullDate,
    year,
    location, setLocation,
    coordinates, setCoordinates,
    description, setDescription,
    note, setNote,
    onOpenMapPicker,
}) => {
    return (
        <div className="lg:col-span-8 space-y-8">
            
            {/* Title Section - Manila Tag Style */}
            <div className="relative group">
                <div className="absolute -top-3 left-4 bg-os-accent px-2 py-0.5 text-[9px] font-black text-black uppercase tracking-widest border border-black z-20 shadow-retro-sm rotate-[-1deg]">Subject ID</div>
                <div className="border-2 border-stone-800 bg-[#fdfaf5] p-6 shadow-retro-md transition-all group-focus-within:border-os-accent group-focus-within:-translate-y-0.5">
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
                    <div className="border-2 border-stone-800 bg-[#fdfaf5] p-5 shadow-retro-sm group-focus-within:border-os-accent transition-colors">
                        <div className="flex gap-4 items-center">
                            <Calendar size={18} className="text-stone-400 shrink-0" />
                            <input
                                type="date"
                                value={fullDate}
                                onChange={e => setFullDate(e.target.value)}
                                className="flex-1 outline-none font-mono text-sm font-bold uppercase bg-transparent cursor-pointer"
                            />
                            {year && (
                                <span className="text-[10px] font-black text-stone-400 font-mono border-l border-stone-300 pl-3">{year}</span>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Location Field */}
                <div className="relative group">
                    <div className="absolute -top-3 left-4 bg-stone-800 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-widest border border-black z-20 rotate-[-1deg]">Sector</div>
                    <div className="border-2 border-stone-800 bg-[#fdfaf5] p-5 shadow-retro-sm group-focus-within:border-os-accent transition-colors">
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
                <div className="border-2 border-stone-800 bg-[#fdfaf5] p-5 shadow-retro-sm group-focus-within:border-os-accent transition-colors">
                    <div className="flex gap-8 mb-3">
                        <div className="flex items-center gap-3 flex-1">
                            <span className="text-[10px] font-black text-stone-400 uppercase font-mono shrink-0">Latitude:</span>
                            <input
                                type="number"
                                value={coordinates.lat || ''}
                                onChange={e => setCoordinates(p => ({ ...p, lat: parseFloat(e.target.value) || 0 }))}
                                className="w-full outline-none font-mono text-sm font-bold bg-transparent border-b border-stone-200 focus:border-os-accent"
                                placeholder="0.000000"
                            />
                        </div>
                        <div className="flex items-center gap-3 flex-1">
                            <span className="text-[10px] font-black text-stone-400 uppercase font-mono shrink-0">Longitude:</span>
                            <input
                                type="number"
                                value={coordinates.lng || ''}
                                onChange={e => setCoordinates(p => ({ ...p, lng: parseFloat(e.target.value) || 0 }))}
                                className="w-full outline-none font-mono text-sm font-bold bg-transparent border-b border-stone-200 focus:border-os-accent"
                                placeholder="0.000000"
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onOpenMapPicker}
                        className="flex items-center gap-2 text-[10px] font-black text-stone-500 hover:text-os-accent transition-colors uppercase tracking-wider border border-stone-300 hover:border-os-accent px-3 py-1.5"
                    >
                        <Map size={12} />
                        Pick on Map
                    </button>
                </div>
            </div>

            {/* Briefing Report */}
            <div className="relative group">
                <div className="absolute -top-3 left-4 bg-stone-800 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-widest border border-black z-20 rotate-[0.5deg]">Intelligence Summary</div>
                <div className="border-2 border-stone-800 bg-white p-8 shadow-retro-md group-focus-within:border-os-accent min-h-[300px] transition-all">
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
    );
};
