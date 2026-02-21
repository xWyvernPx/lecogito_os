import React from 'react';
import { Power, RefreshCw, Moon } from 'lucide-react';
import { useOSStore } from '@/features/os/stores/os-store';
import { useTranslation } from '@/features/os/hooks/use-translation';

export const PowerBar: React.FC = () => {
    const { t } = useTranslation();
    const { shutdownSystem, rebootSystem } = useOSStore();

    return (
        <div className="absolute bottom-8 flex items-center gap-4 z-10 text-white/60">
            <div className="flex items-center gap-8 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/5">
                <button onClick={shutdownSystem} className="flex flex-col items-center gap-1 hover:text-white transition-colors group">
                    <Power size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" />
                    <span className="text-[10px] font-medium tracking-wide">{t('menu.power_off')}</span>
                </button>
                
                <div className="w-px h-8 bg-white/10" />

                <button onClick={rebootSystem} className="flex flex-col items-center gap-1 hover:text-white transition-colors group">
                    <RefreshCw size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" />
                    <span className="text-[10px] font-medium tracking-wide">{t('menu.restart')}</span>
                </button>

                <div className="w-px h-8 bg-white/10" />

                <button className="flex flex-col items-center gap-1 hover:text-white transition-colors group">
                    <Moon size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" />
                    <span className="text-[10px] font-medium tracking-wide">{t('menu.sleep')}</span>
                </button>
            </div>
        </div>
    );
};
