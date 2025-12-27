
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Maximize, ExternalLink, X, ChevronRight } from 'lucide-react';
import { WindowDef, ContentItem } from '../../types';

interface VideoPlayerProps {
    win: WindowDef;
    contentItem: ContentItem;
}

const MOCK_SUGGESTIONS = [
    { title: "Next.js A/B tests", thumb: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=200&auto=format&fit=crop", source: "PostHog" },
    { title: "ClickHouse vs PostgreSQL", thumb: "https://images.unsplash.com/photo-1593642632823-8f78536709c7?q=80&w=200&auto=format&fit=crop", source: "Data Camp" },
    { title: "Feature flag benefits", thumb: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=200&auto=format&fit=crop", source: "DevRel" },
];

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ win, contentItem }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;
            setProgress((current / total) * 100);
            setDuration(total);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            const seekTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
            videoRef.current.currentTime = seekTime;
            setProgress(parseFloat(e.target.value));
        }
    };

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const changeSpeed = () => {
        const rates = [1, 1.5, 2, 0.5];
        const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
        setPlaybackRate(nextRate);
        if (videoRef.current) {
            videoRef.current.playbackRate = nextRate;
        }
    };

    return (
        <div 
            className="flex flex-col h-full bg-[#e8e4d9] relative select-none font-sans"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* Main Video Container */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                <video
                    ref={videoRef}
                    src={contentItem.src}
                    className="w-full h-full object-contain"
                    onClick={togglePlay}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    loop
                />

                {/* Overlay Title */}
                <div className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex justify-between items-start text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center border border-white/20">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-bold text-sm leading-tight shadow-black drop-shadow-md">{contentItem.alt || "Untitled Video"}</h2>
                                <p className="text-[10px] text-white/70">Cogito Media Player</p>
                            </div>
                        </div>
                        <button className="text-white/80 hover:text-white flex flex-col items-center gap-1">
                            <ExternalLink size={16} />
                            <span className="text-[9px]">Open</span>
                        </button>
                    </div>
                </div>

                {/* Suggestions Overlay */}
                {showSuggestions && (
                    <div className="absolute bottom-16 left-4 right-4 z-20">
                        <div className="bg-[#1d1d1d]/95 backdrop-blur-md text-white p-3 rounded-lg border border-white/10 shadow-2xl flex flex-col gap-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-stone-300">Video khác</span>
                                <button onClick={() => setShowSuggestions(false)} className="hover:bg-white/10 p-1 rounded">
                                    <X size={14} />
                                </button>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                                {MOCK_SUGGESTIONS.map((item, idx) => (
                                    <div key={idx} className="flex-shrink-0 w-32 group cursor-pointer">
                                        <div className="aspect-video bg-stone-800 rounded overflow-hidden mb-1 relative border border-white/10">
                                            <img src={item.thumb} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="bg-black/50 rounded-full p-1">
                                                    <Play size={12} fill="white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-bold leading-tight line-clamp-2">{item.title}</div>
                                        <div className="text-[9px] text-stone-400">{item.source}</div>
                                    </div>
                                ))}
                                <div className="flex-shrink-0 w-32 flex items-center justify-center bg-white rounded text-black font-bold text-xs p-2 gap-2 cursor-pointer hover:bg-stone-200">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">W</div>
                                    <div className="flex flex-col">
                                        <span>Try free</span>
                                        <span className="text-[8px] bg-blue-600 text-white px-1 rounded">Sign up</span>
                                    </div>
                                </div>
                            </div>
                            <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-l hover:bg-black">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Big Play Button (when paused) */}
                {!isPlaying && !showSuggestions && (
                    <button 
                        onClick={togglePlay}
                        className="absolute z-10 w-16 h-16 bg-black/50 hover:bg-[#ff7e33] rounded-full flex items-center justify-center transition-colors backdrop-blur-sm border-2 border-white/20"
                    >
                        <Play size={32} fill="white" className="text-white ml-1" />
                    </button>
                )}
            </div>

            {/* Controls Bar */}
            <div className="h-12 bg-[#e8e4d9] border-t-2 border-stone-300 flex items-center px-4 gap-4 shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] relative z-30">
                {/* Play/Pause */}
                <button 
                    onClick={togglePlay}
                    className="w-8 h-8 flex items-center justify-center bg-white border border-stone-300 rounded-full hover:border-[#ff7e33] hover:text-[#ff7e33] shadow-sm transition-all"
                >
                    {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2 group">
                    <button onClick={toggleMute} className="text-stone-600 hover:text-stone-900">
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <input 
                        type="range" 
                        min="0" max="1" step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setVolume(val);
                            if (videoRef.current) videoRef.current.volume = val;
                            if (val > 0) setIsMuted(false);
                        }}
                        className="w-16 h-1 bg-stone-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-stone-600 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-[#ff7e33]"
                    />
                </div>

                {/* Progress Bar */}
                <div className="flex-1 flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-stone-500 w-10 text-right">{formatTime(videoRef.current?.currentTime || 0)}</span>
                    <div className="relative flex-1 group">
                        <input 
                            type="range" 
                            min="0" max="100" 
                            value={progress}
                            onChange={handleSeek}
                            className="w-full h-1.5 bg-stone-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-stone-800 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                        />
                        <div 
                            className="absolute top-0 left-0 h-1.5 bg-[#ff7e33] rounded-l-lg pointer-events-none" 
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-stone-500 w-10">{formatTime(duration)}</span>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        <button className="p-1 hover:bg-stone-200 rounded text-stone-500"><SkipBack size={14}/></button>
                        <button className="p-1 hover:bg-stone-200 rounded text-stone-500"><SkipForward size={14}/></button>
                    </div>
                    
                    <button 
                        onClick={changeSpeed}
                        className="bg-white px-2 py-0.5 border border-stone-300 rounded text-[10px] font-bold text-stone-700 hover:bg-stone-100 min-w-[32px]"
                    >
                        {playbackRate}x
                    </button>

                    <button className="text-stone-500 hover:text-stone-900">
                        <Maximize size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
