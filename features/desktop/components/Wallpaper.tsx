
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DESIGN_TOKENS } from '../../../theme/design-tokens';
import { useOSStore } from '../../os/stores/os-store';

const IsometricAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;

    const render = () => {
      frameRef.current++;
      // Handle resizing inside the render loop to always fit
      const w = canvas.width = window.innerWidth;
      const h = canvas.height = window.innerHeight;

      // Clear the canvas to let the CSS background show through
      ctx.clearRect(0, 0, w, h);

      // Grid Pattern
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      for (let i = 0; i < w; i += 4) {
        for (let j = 0; j < h; j += 4) {
          if (((i+j) % 9) === 0) ctx.fillRect(i, j, 1, 1);
        }
      }

      // Isometric Cubes Animation
      const float = Math.sin(frameRef.current * 0.02) * 5;
      ctx.save();
      ctx.translate(w - 250, h - 300 + float);
      
      const drawBlock = (x: number, y: number, cTop: string, cLeft: string, cRight: string) => {
         const s = 60;
         ctx.beginPath();
         ctx.moveTo(x, y); ctx.lineTo(x+s, y-s/2); ctx.lineTo(x+s*2, y); ctx.lineTo(x+s, y+s/2); ctx.closePath();
         ctx.fillStyle = cTop; ctx.fill(); ctx.stroke();
         ctx.beginPath();
         ctx.moveTo(x, y); ctx.lineTo(x+s, y+s/2); ctx.lineTo(x+s, y+s*1.5); ctx.lineTo(x, y+s); ctx.closePath();
         ctx.fillStyle = cLeft; ctx.fill(); ctx.stroke();
         ctx.beginPath();
         ctx.moveTo(x+s, y+s/2); ctx.lineTo(x+s*2, y); ctx.lineTo(x+s*2, y+s); ctx.lineTo(x+s, y+s*1.5); ctx.closePath();
         ctx.fillStyle = cRight; ctx.fill(); ctx.stroke();
      };
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = DESIGN_TOKENS.colors.os.border; // #121212
      
      // Bottom Block (Dark) - Base
      drawBlock(0, 60, '#46423b', '#35322d', '#262420'); 
      
      // Top Left Block (Green)
      drawBlock(0, 0, '#7da03e', '#607c2e', '#4d6325');
      
      // Top Right Block (Orange) - matching accent
      // Using hex manipulation or hardcoded matching tones for canvas
      drawBlock(60, 30, '#d97746', '#b56036', '#8c4828');

      ctx.restore();

      // Scanlines
      ctx.fillStyle = 'rgba(0,0,0,0.02)';
      for(let y=0; y<h; y+=3) ctx.fillRect(0,y,w,1);

      frameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />;
};

export const Wallpaper: React.FC = () => {
  const { desktopSideImage } = useOSStore();

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grain/Texture Overlay - Separated to allow base wallpaper color to show through */}
        <div 
          className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'url("https://res.cloudinary.com/dmukukwp6/image/upload/keyboard_garden_bg_dark_9ab088797a.png")',
            backgroundSize: '100px 100px', // Smaller resolution (finer grain)
            backgroundRepeat: 'repeat'
          }}
        />
        
        {/* Right Side Decoration */}
        <AnimatePresence mode="wait">
            {!desktopSideImage ? (
                <motion.div
                    key="isometric"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                >
                    <IsometricAnimation />
                </motion.div>
            ) : (
                <motion.div
                    key="custom-image"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute bottom-10 right-10 z-10 max-w-[400px] max-h-[500px]"
                >
                    <div className="relative group">
                        {/* Decorative Frame */}
                        <div className="absolute -inset-2 border-2 border-os-border bg-os-bg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="absolute top-0 right-0 p-1 bg-os-window border border-os-border shadow-sm z-20">
                            <div className="w-2 h-2 bg-os-accent rounded-full animate-pulse" />
                        </div>
                        
                        <img 
                            src={desktopSideImage} 
                            alt="Desktop Decoration" 
                            className="w-full h-auto object-contain drop-shadow-[10px_10px_0_rgba(0,0,0,0.2)] border-4 border-white transform rotate-[-2deg] transition-transform hover:rotate-0 hover:scale-105 duration-300"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};
