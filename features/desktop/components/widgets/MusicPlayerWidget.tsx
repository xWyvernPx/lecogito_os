
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Radio, Disc } from 'lucide-react';
import { motion } from 'framer-motion';

const TRACKS = [
    { title: 'Lofi Study', artist: 'Chillhop', src: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112762.mp3' },
    { title: 'Retro Wave', artist: 'Synth', src: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=synthwave-80s-110045.mp3' },
    { title: 'Coding Mode', artist: 'Focus', src: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-lofi-song-8444.mp3' },
];

export const MusicPlayerWidget: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackIndex, setTrackIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const currentTrack = TRACKS[trackIndex];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.log("Autoplay blocked:", e));
            }
        }
    }, [trackIndex, isPlaying]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        setTrackIndex((prev) => (prev + 1) % TRACKS.length);
    };

    const prevTrack = () => {
        setTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const formatTime = (time: number) => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-80 bg-os-window border-2 border-os-border shadow-[6px_6px_0_0_var(--os-border)] select-none font-sans overflow-hidden">
            {/* Audio Element */}
            <audio 
                ref={audioRef} 
                src={currentTrack.src} 
                onTimeUpdate={handleTimeUpdate}
                onEnded={nextTrack}
                muted={isMuted}
            />

            {/* Retro Title Bar */}
            <div className="bg-os-accent px-3 py-2 flex items-center justify-between border-b-2 border-os-border cursor-grab active:cursor-grabbing">
                <div className="flex items-center gap-2 text-white">
                    <Radio size={16} strokeWidth={2.5} className={isPlaying ? "animate-pulse" : ""} />
                    <span className="font-bold font-mono text-xs tracking-wider uppercase">Sonic_OS.exe</span>
                </div>
                {/* Decorative dots */}
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                </div>
            </div>

            <div className="p-5">
                {/* Display Area */}
                <div className="bg-[#121212] border-2 border-os-border p-4 relative overflow-hidden mb-5 shadow-inner">
                    {/* Visualizer Bars */}
                    <div className="flex items-end justify-between h-12 mb-3 gap-[2px]">
                        {Array.from({ length: 16 }).map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ height: isPlaying ? ['10%', '80%', '30%', '60%'] : '5%' }}
                                transition={{ 
                                    repeat: Infinity, 
                                    duration: 0.4 + Math.random() * 0.3,
                                    ease: "easeInOut",
                                    delay: i * 0.05
                                }}
                                className="w-full bg-os-accent"
                            />
                        ))}
                    </div>

                    {/* Track Info */}
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 border border-stone-600 flex items-center justify-center bg-stone-900 shrink-0 ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
                            <Disc size={16} className="text-stone-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[#fdfdfd] font-bold text-xs uppercase truncate tracking-tight">{currentTrack.title}</div>
                            <div className="text-os-accent font-mono text-[10px] uppercase truncate">{currentTrack.artist}</div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-5">
                    <div className="flex justify-between text-os-text font-mono text-[10px] font-bold mb-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <div 
                        className="h-3 w-full bg-os-bg border-2 border-os-border relative cursor-pointer hover:bg-os-border transition-colors"
                        onClick={(e) => {
                            if (!audioRef.current) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const percent = (e.clientX - rect.left) / rect.width;
                            audioRef.current.currentTime = percent * (audioRef.current.duration || 0);
                        }}
                    >
                        <div 
                            className="h-full bg-os-accent" 
                            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <button 
                            onClick={prevTrack} 
                            className="w-8 h-8 flex items-center justify-center bg-os-window border-2 border-os-border shadow-[2px_2px_0_0_var(--os-border)] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_var(--os-border)] active:translate-y-[2px] active:shadow-none transition-all text-os-text"
                        >
                            <SkipBack size={14} fill="currentColor" />
                        </button>
                        
                        <button 
                            onClick={togglePlay} 
                            className="w-10 h-10 flex items-center justify-center bg-os-accent border-2 border-os-border shadow-[2px_2px_0_0_var(--os-border)] hover:bg-os-accentHover hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_var(--os-border)] active:translate-y-[2px] active:shadow-none transition-all text-white"
                        >
                            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                        </button>
                        
                        <button 
                            onClick={nextTrack} 
                            className="w-8 h-8 flex items-center justify-center bg-os-window border-2 border-os-border shadow-[2px_2px_0_0_var(--os-border)] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_var(--os-border)] active:translate-y-[2px] active:shadow-none transition-all text-os-text"
                        >
                            <SkipForward size={14} fill="currentColor" />
                        </button>
                    </div>

                    <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-8 h-8 flex items-center justify-center border-2 border-transparent hover:bg-os-bg rounded transition-colors ${isMuted ? 'text-red-500' : 'text-os-muted'}`}
                    >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
