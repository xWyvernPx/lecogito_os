
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, Loader2, Plus, LogOut } from 'lucide-react';
import { useOSStore } from '../../os/stores/os-store';
import { CalendarEvent } from '../../../types';

export const CalendarWidget: React.FC = () => {
    const { isCalendarConnected, setCalendarConnected } = useOSStore();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isSyncing, setIsSyncing] = useState(false);

    // Sync Simulation
    const handleSync = (provider: 'google' | 'apple') => {
        setIsSyncing(true);
        // Simulate OAuth Popup Flow
        setTimeout(() => {
            setIsSyncing(false);
            setCalendarConnected(true);
        }, 2000);
    };

    // Calendar Grid Logic
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun
    
    // Adjust for Monday start if preferred, currently Sunday start (0)
    const paddingDays = firstDayOfMonth; 

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const changeMonth = (delta: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
    };

    // Mock Events Generator
    const events: CalendarEvent[] = useMemo(() => {
        if (!isCalendarConnected) return [];
        
        // Generate pseudo-random events for the selected day for demo purposes
        const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();
        
        if (isToday) {
            return [
                { id: '1', title: 'Daily Standup', start: new Date(), end: new Date(), type: 'work' },
                { id: '2', title: 'Deploy to Production', start: new Date(), end: new Date(), type: 'work' },
                { id: '3', title: 'Lunch with Team', start: new Date(), end: new Date(), type: 'personal' }
            ];
        } else {
            // Random events for other days
            if (selectedDate.getDate() % 2 === 0) {
                return [
                    { id: '4', title: 'Code Review', start: new Date(), end: new Date(), type: 'work' },
                    { id: '5', title: 'Design Sync', start: new Date(), end: new Date(), type: 'work' }
                ];
            }
            return [];
        }
    }, [selectedDate, isCalendarConnected]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-10 left-1/2 -translate-x-1/2 w-80 md:w-96 bg-os-window border-2 border-os-border shadow-retro-lg z-[100] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-os-border bg-os-bg">
                <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-os-window rounded border border-transparent hover:border-os-border transition-all">
                    <ChevronLeft size={16} className="text-os-text" />
                </button>
                <div className="font-bold text-os-text uppercase tracking-wider text-sm flex items-center gap-2">
                    <CalendarIcon size={14} className="text-os-accent" />
                    {monthName} {year}
                </div>
                <button onClick={() => changeMonth(1)} className="p-1 hover:bg-os-window rounded border border-transparent hover:border-os-border transition-all">
                    <ChevronRight size={16} className="text-os-text" />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4 bg-os-window">
                {/* Weekdays */}
                <div className="grid grid-cols-7 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-center text-[10px] font-bold text-os-muted font-mono">{day}</div>
                    ))}
                </div>
                
                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: paddingDays }).map((_, i) => (
                        <div key={`pad-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        const isToday = date.toDateString() === new Date().toDateString();
                        
                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(date)}
                                className={`
                                    h-8 md:h-10 flex items-center justify-center text-xs font-mono rounded-sm transition-all relative
                                    ${isSelected ? 'bg-os-accent text-white font-bold shadow-sm' : 'hover:bg-os-bg text-os-text'}
                                    ${isToday && !isSelected ? 'border border-os-accent text-os-accent font-bold' : ''}
                                `}
                                aria-label={`${monthName} ${day}, ${year}`}
                                aria-pressed={isSelected}
                            >
                                {day}
                                {/* Event Indicator Dot (Random for visual) */}
                                {isCalendarConnected && (day % 3 === 0 || day === new Date().getDate()) && (
                                    <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-os-accent'}`} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Events / Sync Section */}
            <div className="border-t-2 border-os-border bg-os-bg p-4 flex-1 flex flex-col min-h-[160px]">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase text-os-muted tracking-widest">
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                    {isCalendarConnected && (
                        <button onClick={() => setCalendarConnected(false)} className="text-[10px] text-red-500 hover:underline flex items-center gap-1">
                            <LogOut size={10} /> Disconnect
                        </button>
                    )}
                </div>

                {!isCalendarConnected ? (
                    <div className="flex flex-col items-center justify-center flex-1 gap-3 py-4 text-center">
                        <p className="text-xs text-os-muted px-4">Connect your calendar to view upcoming meetings and deadlines directly in Cogito OS.</p>
                        
                        {isSyncing ? (
                            <div className="flex flex-col items-center gap-2 text-os-accent">
                                <Loader2 size={24} className="animate-spin" />
                                <span className="text-[10px] font-bold uppercase animate-pulse">Authenticating...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 w-full px-6">
                                <button 
                                    onClick={() => handleSync('google')}
                                    className="w-full flex items-center justify-center gap-2 bg-white border border-stone-300 py-2 rounded shadow-sm hover:border-os-accent text-xs font-bold text-stone-700 transition-colors"
                                >
                                    <svg viewBox="0 0 24 24" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
                                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.489 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.989 -25.464 56.619 L -21.484 53.529 Z"/>
                                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                                        </g>
                                    </svg>
                                    Sync with Google
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded shadow-sm hover:bg-stone-800 text-xs font-bold transition-colors">
                                    <svg viewBox="0 0 384 512" width="14" height="14" fill="currentColor">
                                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
                                    </svg>
                                    Sync with iCloud
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2 overflow-y-auto max-h-[200px] pr-1">
                        {events.length > 0 ? events.map((event) => (
                            <div key={event.id} className="flex gap-3 items-start group cursor-pointer hover:bg-os-window p-2 rounded transition-colors border border-transparent hover:border-os-border">
                                <div className={`w-1 h-full min-h-[30px] rounded-full mt-1 ${event.type === 'work' ? 'bg-blue-500' : event.type === 'personal' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                <div className="flex-1">
                                    <div className="font-bold text-xs text-os-text">{event.title}</div>
                                    <div className="text-[10px] text-os-muted font-mono mt-0.5 flex justify-between">
                                        <span>10:00 AM - 11:00 AM</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-6 text-os-muted text-xs italic">
                                No events scheduled for this day.
                            </div>
                        )}
                        <button className="w-full py-2 mt-2 border-2 border-dashed border-os-border text-os-muted text-[10px] font-bold uppercase hover:border-os-accent hover:text-os-accent transition-colors flex items-center justify-center gap-1">
                            <Plus size={12} /> Add Event
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
