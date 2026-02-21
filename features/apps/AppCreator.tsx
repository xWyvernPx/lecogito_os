
import React, { useState } from 'react';
import { PackagePlus, Globe, Layout, Type, Check, AlertCircle } from 'lucide-react';
import { RetroButton } from '../../components/ui/retro-ui';
import { useOSStore } from '../os/stores/os-store';
import { WindowDef, ContentItem } from '../../types';

interface AppCreatorProps {
    win: WindowDef;
    contentItem: ContentItem;
}

export const AppCreator: React.FC<AppCreatorProps> = ({ win }) => {
    const { createFile, closeWindow, spawnWindow } = useOSStore();
    const [appName, setAppName] = useState('');
    const [appUrl, setAppUrl] = useState('');
    const [category, setCategory] = useState('Remote Apps');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!appName || !appUrl) return;

        let formattedUrl = appUrl;
        if (!formattedUrl.startsWith('http')) {
            formattedUrl = 'https://' + formattedUrl;
        }

        const fileName = `${appName}.app`;
        
        // Add to file system
        createFile(
            category === 'Remote Apps' ? ['Applications', 'Remote Apps'] : ['Applications'], 
            fileName, 
            { 
                type: 'file', 
                appId: 'browser', 
                src: formattedUrl 
            }
        );

        setIsSuccess(true);
        setTimeout(() => {
            closeWindow(win.id);
            spawnWindow('file-manager', { initialPath: category === 'Remote Apps' ? 'Applications/Remote Apps' : 'Applications' });
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-[#f4f1ea] font-sans">
            <div className="p-4 border-b border-stone-300 bg-[#e8e4d9] flex items-center gap-3">
                <div className="w-10 h-10 bg-white border-2 border-stone-800 flex items-center justify-center shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
                    <PackagePlus size={20} className="text-os-accent" />
                </div>
                <div>
                    <h2 className="font-bold text-sm text-stone-900 uppercase tracking-wider">App Studio</h2>
                    <p className="text-[10px] text-stone-500 font-mono">Create new remote application shortcuts</p>
                </div>
            </div>

            <div className="flex-1 p-8 flex items-center justify-center">
                {isSuccess ? (
                    <div className="text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500 text-green-600">
                            <Check size={32} />
                        </div>
                        <h3 className="font-black text-xl text-stone-800 mb-1">APP CREATED!</h3>
                        <p className="text-stone-500 text-xs">Installing to /Applications...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                        <div className="bg-white p-6 border-2 border-stone-200 shadow-sm rounded-sm">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-stone-500 uppercase mb-1.5 flex items-center gap-2">
                                        <Type size={12} /> App Name
                                    </label>
                                    <input 
                                        type="text" 
                                        value={appName}
                                        onChange={(e) => setAppName(e.target.value)}
                                        placeholder="e.g. My Portfolio"
                                        className="w-full p-3 bg-stone-50 border-2 border-stone-200 rounded focus:border-os-accent outline-none font-bold text-stone-800 transition-colors"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-stone-500 uppercase mb-1.5 flex items-center gap-2">
                                        <Globe size={12} /> Target URL
                                    </label>
                                    <input 
                                        type="text" 
                                        value={appUrl}
                                        onChange={(e) => setAppUrl(e.target.value)}
                                        placeholder="e.g. https://vercel.com"
                                        className="w-full p-3 bg-stone-50 border-2 border-stone-200 rounded focus:border-os-accent outline-none font-mono text-xs text-stone-600 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-stone-500 uppercase mb-1.5 flex items-center gap-2">
                                        <Layout size={12} /> Install Location
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => setCategory('Remote Apps')}
                                            className={`p-2 border-2 text-xs font-bold rounded transition-all ${category === 'Remote Apps' ? 'border-os-accent bg-os-accent/10 text-os-accent' : 'border-stone-200 text-stone-400 hover:border-stone-300'}`}
                                        >
                                            /Remote Apps
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setCategory('Applications')}
                                            className={`p-2 border-2 text-xs font-bold rounded transition-all ${category === 'Applications' ? 'border-os-accent bg-os-accent/10 text-os-accent' : 'border-stone-200 text-stone-400 hover:border-stone-300'}`}
                                        >
                                            /Applications
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-stone-400 bg-blue-50 border border-blue-100 p-2 rounded">
                            <AlertCircle size={12} className="text-blue-400" />
                            <span>Note: Created apps will open in the internal browser window.</span>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <RetroButton 
                                type="button" 
                                variant="ghost" 
                                className="flex-1"
                                onClick={() => closeWindow(win.id)}
                            >
                                Cancel
                            </RetroButton>
                            <RetroButton 
                                type="submit" 
                                variant="primary" 
                                className="flex-1"
                                disabled={!appName || !appUrl}
                            >
                                Create App
                            </RetroButton>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
