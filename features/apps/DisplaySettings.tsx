
import React, { useState } from 'react';
import { Check, Monitor, Image as ImageIcon, Box, Upload } from 'lucide-react';
import { useOSStore } from '../os/stores/os-store';
import { Theme } from '../../types';
import { WidgetSelector } from './WidgetSelector';
import { RetroButton } from '../../components/ui/retro-ui';
import { useTranslation } from '../os/hooks/use-translation';

const PRESET_IMAGES = [
    { label: "Retro Computer", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop" },
    { label: "Greek Bust", url: "https://images.unsplash.com/photo-1555679427-1f6dfcce943b?q=80&w=600&auto=format&fit=crop" },
    { label: "Zen Plant", url: "https://images.unsplash.com/photo-1526394231295-88a2469d2f60?q=80&w=600&auto=format&fit=crop" },
    { label: "Abstract Shape", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" }
];

const ThemeCard: React.FC<{ 
    themeKey: Theme; 
    label: string; 
    previewColors: string[]; 
    active: boolean; 
    onClick: () => void 
}> = ({ themeKey, label, previewColors, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`
            relative flex flex-col items-center gap-3 p-4 border-2 transition-all group w-full text-left
            ${active 
                ? 'border-os-accent bg-os-window' 
                : 'border-os-border bg-os-window hover:border-os-accent'}
        `}
        style={{
            boxShadow: active ? '4px 4px 0 0 var(--os-accent)' : 'none',
        }}
    >
        <div className={`
            absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white border border-black shadow-sm transition-opacity
            ${active ? 'opacity-100' : 'opacity-0'}
        `} style={{ backgroundColor: 'var(--os-accent)' }}>
            <Check size={14} strokeWidth={3} />
        </div>
        
        {/* Preview Swatch */}
        <div className="w-full aspect-[16/9] border-2 border-os-border flex overflow-hidden rounded-sm">
            <div className="w-1/2 h-full" style={{ backgroundColor: previewColors[0] }}>
                <div className="w-full h-1/2" style={{ backgroundColor: previewColors[1] }} />
            </div>
            <div className="w-1/2 h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: previewColors[1] }}>
                    <div className="w-8 h-8 rounded-full border-2 border-black" style={{ backgroundColor: previewColors[2] }} />
                </div>
            </div>
        </div>

        <div className="w-full">
            <h3 className="font-bold text-sm uppercase tracking-wider text-os-text">{label}</h3>
            <p className="text-[10px] text-os-muted font-mono">{themeKey.toUpperCase()}_PRESET.CFG</p>
        </div>
    </button>
);

export const DisplaySettings: React.FC = () => {
    const { t } = useTranslation();
    const { theme, setTheme, desktopSideImage, setDesktopSideImage } = useOSStore();
    const [customUrl, setCustomUrl] = useState('');

    const handleCustomUrlSubmit = () => {
        if (customUrl.trim()) {
            setDesktopSideImage(customUrl.trim());
        }
    };

    return (
        <div className="flex flex-col h-full bg-os-bg">
            <div className="p-6 overflow-y-auto">
                {/* Theme Section */}
                <section className="mb-10">
                    <div className="flex items-center gap-2 mb-4 border-b-2 border-os-border pb-2">
                        <Monitor size={18} className="text-os-accent" />
                        <h2 className="font-black text-lg uppercase tracking-tight text-os-text">{t('disp.theme')}</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ThemeCard 
                            themeKey="bone" 
                            label="Cogito Bone" 
                            previewColors={['#e8e4d9', '#fdfdfd', '#ff7e33']}
                            active={theme === 'bone'}
                            onClick={() => setTheme('bone')}
                        />
                        <ThemeCard 
                            themeKey="night" 
                            label="Matrix Night" 
                            previewColors={['#000000', '#121212', '#22c55e']}
                            active={theme === 'night'}
                            onClick={() => setTheme('night')}
                        />
                        <ThemeCard 
                            themeKey="seraph" 
                            label="Seraph Vapor" 
                            previewColors={['#2e1065', '#4c1d95', '#f472b6']}
                            active={theme === 'seraph'}
                            onClick={() => setTheme('seraph')}
                        />
                        <ThemeCard 
                            themeKey="gruvbox" 
                            label="Gruvbox Retro" 
                            previewColors={['#282828', '#32302f', '#fe8019']}
                            active={theme === 'gruvbox'}
                            onClick={() => setTheme('gruvbox')}
                        />
                    </div>
                </section>

                {/* Decoration Section */}
                <section className="mb-10">
                    <div className="flex items-center gap-2 mb-4 border-b-2 border-os-border pb-2">
                        <ImageIcon size={18} className="text-os-accent" />
                        <h2 className="font-black text-lg uppercase tracking-tight text-os-text">{t('disp.wallpaper')}</h2>
                    </div>
                    
                    <div className="bg-os-window border-2 border-os-border p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                            {/* Default Option */}
                            <button
                                onClick={() => setDesktopSideImage(null)}
                                className={`flex flex-col items-center justify-center p-3 border-2 rounded-sm gap-2 transition-all ${!desktopSideImage ? 'border-os-accent bg-os-bg shadow-sm' : 'border-os-border bg-white hover:bg-stone-50'}`}
                            >
                                <Box size={24} className={!desktopSideImage ? 'text-os-accent' : 'text-stone-400'} />
                                <span className="text-[10px] font-bold uppercase">{t('disp.isometric')}</span>
                            </button>

                            {/* Presets */}
                            {PRESET_IMAGES.map((preset, i) => (
                                <button
                                    key={i}
                                    onClick={() => setDesktopSideImage(preset.url)}
                                    className={`relative aspect-square border-2 overflow-hidden group ${desktopSideImage === preset.url ? 'border-os-accent shadow-sm' : 'border-os-border'}`}
                                >
                                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    {desktopSideImage === preset.url && (
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                            <div className="bg-os-accent text-white rounded-full p-1"><Check size={12} strokeWidth={4} /></div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Custom URL Input */}
                        <div className="flex gap-2 items-center bg-os-bg p-2 border border-os-border rounded-sm">
                            <Upload size={16} className="text-os-muted" />
                            <input 
                                type="text" 
                                placeholder={t('disp.custom_url')} 
                                value={customUrl}
                                onChange={(e) => setCustomUrl(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-os-text placeholder:text-os-muted"
                            />
                            <RetroButton size="sm" onClick={handleCustomUrlSubmit} disabled={!customUrl.trim()}>{t('disp.set_custom')}</RetroButton>
                        </div>
                    </div>
                </section>

                {/* Widget Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4 border-b-2 border-os-border pb-2">
                        <h2 className="font-black text-lg uppercase tracking-tight text-os-text">{t('disp.widgets')}</h2>
                    </div>
                    <div className="bg-os-window border-2 border-os-border p-4">
                        <WidgetSelector />
                    </div>
                </section>
            </div>
        </div>
    );
};
