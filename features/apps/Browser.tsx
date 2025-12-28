
import React, { useState, useRef } from 'react';
import { RefreshCw, ArrowLeft, ArrowRight, Lock, Globe, AlertTriangle } from 'lucide-react';
import { WindowDef, ContentItem } from '../../types';

interface BrowserProps {
    win: WindowDef;
    contentItem: ContentItem;
}

export const Browser: React.FC<BrowserProps> = ({ win, contentItem }) => {
    const [url, setUrl] = useState(contentItem.src || 'https://www.google.com/webhp?igu=1');
    const [inputUrl, setInputUrl] = useState(contentItem.src || 'https://www.google.com/webhp?igu=1');
    const [isLoading, setIsLoading] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleNavigate = (e?: React.FormEvent) => {
        e?.preventDefault();
        let target = inputUrl;
        if (!target.startsWith('http://') && !target.startsWith('https://')) {
            target = 'https://' + target;
        }
        setUrl(target);
        setIsLoading(true);
    };

    const handleRefresh = () => {
        if (iframeRef.current) {
            setIsLoading(true);
            // Re-assigning src forces reload
            iframeRef.current.src = url;
        }
    };

    return (
        <div className="flex flex-col h-full bg-stone-100">
            {/* Browser Toolbar */}
            <div className="flex items-center gap-2 p-2 bg-stone-200 border-b border-stone-300 shrink-0">
                <div className="flex gap-1">
                    <button 
                        className="p-1.5 rounded hover:bg-stone-300 text-stone-600 disabled:opacity-30"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <button 
                        className="p-1.5 rounded hover:bg-stone-300 text-stone-600 disabled:opacity-30"
                        aria-label="Go forward"
                    >
                        <ArrowRight size={16} />
                    </button>
                    <button 
                        onClick={handleRefresh}
                        className="p-1.5 rounded hover:bg-stone-300 text-stone-600"
                        aria-label="Refresh page"
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>

                <form onSubmit={handleNavigate} className="flex-1">
                    <div className="flex items-center bg-white border border-stone-300 rounded-sm px-3 py-1.5 gap-2 focus-within:border-[#ff7e33] transition-colors shadow-inner">
                        {url.startsWith('https') ? <Lock size={12} className="text-green-600" /> : <Globe size={12} className="text-stone-400" />}
                        <input 
                            type="text" 
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-stone-800"
                        />
                    </div>
                </form>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative bg-white overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50 z-10">
                        <div className="w-8 h-8 border-4 border-stone-200 border-t-[#ff7e33] rounded-full animate-spin mb-4" />
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Connecting...</span>
                    </div>
                )}
                
                <iframe 
                    ref={iframeRef}
                    src={url}
                    className="w-full h-full border-none"
                    onLoad={() => setIsLoading(false)}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-pointer-lock"
                    title="Remote App"
                />

                {/* X-Frame-Options Warning Overlay (Visual only, can't detect real failure easily in cross-origin) */}
                <div className="absolute bottom-0 left-0 right-0 bg-yellow-100 border-t border-yellow-200 p-2 text-[10px] text-yellow-800 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                    <AlertTriangle size={12} />
                    <span>Note: Some websites may block embedding via X-Frame-Options headers.</span>
                </div>
            </div>
        </div>
    );
};
