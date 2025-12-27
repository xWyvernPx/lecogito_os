import React, { useState, useEffect } from 'react';

export const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Sync with seconds to ensure accurate minute updates
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format: WEDNESDAY
  const dayName = time.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  
  // Format: 03 AUGUST, 2022.
  const day = time.getDate().toString().padStart(2, '0');
  const month = time.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const year = time.getFullYear();
  const formattedDate = `${day} ${month}, ${year}.`;

  // Format: 17:41
  const formattedTime = time.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col items-center justify-center p-8 transition-all hover:bg-black/5 rounded-3xl select-none text-center cursor-default group whitespace-nowrap">
      
      {/* Day Name (WEDNESDAY) */}
      <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-[0.2em] drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]" 
              style={{ fontFamily: '"Inter", sans-serif' }}>
            {dayName}
          </h1>
          
          {/* Subtle horizontal cut line effect (Simulated) */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/10 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Date (03 AUGUST, 2022.) */}
      <div className="mt-4 text-sm md:text-lg font-bold text-white/90 tracking-[0.15em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] uppercase">
          {formattedDate}
      </div>

      {/* Time (- 17:41 -) */}
      <div className="mt-3 text-lg md:text-xl font-bold text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] opacity-80 group-hover:opacity-100 transition-opacity">
          - {formattedTime} -
      </div>
    </div>
  );
};