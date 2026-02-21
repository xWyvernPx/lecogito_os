import React from 'react';
import { Save, AlertTriangle } from 'lucide-react';
import { RetroButton } from '@/components/ui/retro-ui';

interface EventEditorHeaderProps {
    isPending: boolean;
    onCancel: () => void;
    onSubmit: () => void;
}

export const EventEditorHeader: React.FC<EventEditorHeaderProps> = ({ isPending, onCancel, onSubmit }) => {
    return (
        <div className="h-14 border-b-2 border-stone-800 bg-[#d6cbb5] flex items-center justify-between px-4 shrink-0 shadow-sm z-10 relative">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stone-900 flex items-center justify-center text-os-accent border-2 border-black rotate-[-2deg] shadow-retro-sm">
                    <AlertTriangle size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="font-black text-sm uppercase tracking-tighter text-stone-900">Evidence Locker</span>
                    <span className="text-[9px] text-stone-600 font-mono font-bold tracking-[0.2em]">DIRECTIVE_25_A // TOP_SECRET</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <RetroButton variant="secondary" size="sm" onClick={onCancel}>Discard</RetroButton>
                <RetroButton variant="primary" size="sm" onClick={onSubmit} loading={isPending} icon={<Save size={14} />}>
                    File Report
                </RetroButton>
            </div>
        </div>
    );
};
