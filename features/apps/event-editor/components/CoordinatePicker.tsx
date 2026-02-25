import React, { useState, useCallback } from 'react';
import { Map as PigeonMap, Overlay } from 'pigeon-maps';
import { MapPin, Check, X } from 'lucide-react';
import { RetroButton } from '@/components/ui/retro-ui';

interface Coordinates {
    lat: number;
    lng: number;
}

interface CoordinatePickerProps {
    initial: Coordinates;
    onConfirm: (coords: Coordinates) => void;
    onClose: () => void;
}

export const CoordinatePicker: React.FC<CoordinatePickerProps> = ({
    initial,
    onConfirm,
    onClose,
}) => {
    const hasInitial = initial.lat !== 0 || initial.lng !== 0;
    const [selected, setSelected] = useState<Coordinates>(
        hasInitial ? initial : { lat: 20, lng: 100 }
    );

    const defaultCenter: [number, number] = hasInitial
        ? [initial.lat, initial.lng]
        : [20, 100];

    const handleMapClick = useCallback(
        ({ latLng }: { event: MouseEvent; latLng: [number, number]; pixel: [number, number] }) => {
            setSelected({ lat: latLng[0], lng: latLng[1] });
        },
        []
    );

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-[780px] max-w-[95vw] border-2 border-stone-800 bg-[#0a0a0a] shadow-retro-lg flex flex-col" style={{ maxHeight: '85vh' }}>

                {/* Header */}
                <div className="h-12 bg-stone-900 border-b-2 border-stone-700 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-green-500" />
                        <span className="text-[11px] font-black text-green-400 uppercase tracking-widest font-mono">
                            SATELLITE UPLINK // SELECT COORDINATES
                        </span>
                    </div>
                    <button onClick={onClose} className="text-stone-500 hover:text-red-400 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Map */}
                <div className="relative" style={{ height: '480px' }}>
                    <PigeonMap
                        defaultCenter={defaultCenter}
                        defaultZoom={4}
                        dprs={[1, 2]}
                        onClick={handleMapClick}
                    >
                        <Overlay anchor={[selected.lat, selected.lng]} offset={[12, 28]}>
                            <div className="transform -translate-x-1/2 -translate-y-full pointer-events-none">
                                <div className="relative flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full border-2 border-os-accent bg-black/90 flex items-center justify-center text-os-accent shadow-[0_0_12px_rgba(255,126,51,0.6)] animate-pulse">
                                        <MapPin size={16} fill="currentColor" />
                                    </div>
                                    <div className="w-0.5 h-3 bg-os-accent/70" />
                                    <div className="bg-black/90 border border-os-accent/60 px-2 py-1 text-[9px] font-mono text-os-accent whitespace-nowrap">
                                        {selected.lat.toFixed(6)}, {selected.lng.toFixed(6)}
                                    </div>
                                </div>
                            </div>
                        </Overlay>
                    </PigeonMap>

                    {/* Scanline overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-15" />

                    {/* Click hint */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 border border-stone-700 px-3 py-1 text-[9px] font-mono text-stone-400 uppercase tracking-widest pointer-events-none">
                        Click on map to pin coordinates
                    </div>
                </div>

                {/* Footer */}
                <div className="h-14 bg-stone-900 border-t-2 border-stone-700 flex items-center justify-between px-4 shrink-0">
                    <div className="font-mono text-[11px] text-green-400">
                        <span className="text-stone-500 mr-2">LAT:</span>{selected.lat.toFixed(6)}
                        <span className="text-stone-500 mx-3">|</span>
                        <span className="text-stone-500 mr-2">LNG:</span>{selected.lng.toFixed(6)}
                    </div>
                    <div className="flex gap-2">
                        <RetroButton variant="secondary" size="sm" onClick={onClose}>
                            Cancel
                        </RetroButton>
                        <RetroButton
                            variant="primary"
                            size="sm"
                            onClick={() => onConfirm(selected)}
                            icon={<Check size={14} />}
                        >
                            Confirm
                        </RetroButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
