
import React, { useRef, useState, useEffect } from 'react';
import { Pencil, Eraser, Trash2, Download, Undo, Palette, MousePointer2 } from 'lucide-react';
import { RetroButton } from '../../components/ui/retro-ui';

const COLORS = [
    '#000000', '#ffffff', '#ff7e33', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#eab308',
    '#78350f', '#57534e', '#d6d3d1', '#1e293b'
];

export const PixelPaint: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState('#000000');
    const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
    const [brushSize, setBrushSize] = useState(2);
    const isDrawingRef = useRef(false);

    // Initialize Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set white background initially
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(x, y);
        isDrawingRef.current = true;
        draw(e);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawingRef.current) return;
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        ctx.lineTo(x, y);
        ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
        ctx.lineWidth = brushSize * 2;
        ctx.lineCap = 'square'; // Pixel feel
        ctx.stroke();
    };

    const stopDrawing = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) ctx.closePath();
        isDrawingRef.current = false;
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    };

    const saveImage = () => {
        const link = document.createElement('a');
        link.download = `artwork_${Date.now()}.png`;
        link.href = canvasRef.current?.toDataURL() || '';
        link.click();
    };

    return (
        <div className="flex flex-col h-full bg-os-bg">
            {/* Toolbar */}
            <div className="p-2 border-b-2 border-os-border bg-os-window flex items-center justify-between shadow-sm shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex bg-os-bg border-2 border-os-border rounded-sm p-1 gap-1">
                        <button 
                            onClick={() => setTool('pencil')}
                            className={`p-1.5 rounded-sm border-2 transition-colors ${tool === 'pencil' ? 'bg-os-accent border-black text-white shadow-retro-sm' : 'border-transparent text-os-muted hover:bg-os-window'}`}
                            title="Pencil"
                        >
                            <Pencil size={16} />
                        </button>
                        <button 
                            onClick={() => setTool('eraser')}
                            className={`p-1.5 rounded-sm border-2 transition-colors ${tool === 'eraser' ? 'bg-stone-800 border-black text-white shadow-retro-sm' : 'border-transparent text-os-muted hover:bg-os-window'}`}
                            title="Eraser"
                        >
                            <Eraser size={16} />
                        </button>
                    </div>

                    <div className="h-8 w-px bg-os-border mx-1 opacity-50" />

                    <div className="flex gap-1 flex-wrap max-w-[160px]">
                        {COLORS.map(c => (
                            <button
                                key={c}
                                onClick={() => { setColor(c); setTool('pencil'); }}
                                className={`w-5 h-5 border-2 ${color === c && tool === 'pencil' ? 'border-black scale-110 shadow-sm z-10' : 'border-stone-400'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1 items-end mr-2">
                        <label className="text-[9px] font-black uppercase text-os-muted">Size</label>
                        <div className="flex gap-1">
                            {[1, 2, 4, 8].map(s => (
                                <button 
                                    key={s}
                                    onClick={() => setBrushSize(s)}
                                    className={`w-4 h-4 bg-black ${brushSize === s ? 'bg-os-accent' : 'bg-stone-400'} transition-colors`}
                                    style={{ transform: `scale(${0.5 + (s/10)})`}}
                                />
                            ))}
                        </div>
                    </div>
                    <RetroButton variant="secondary" size="sm" onClick={clearCanvas} icon={<Trash2 size={14}/>}>Clear</RetroButton>
                    <RetroButton variant="primary" size="sm" onClick={saveImage} icon={<Download size={14}/>}>Save</RetroButton>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-stone-300">
                <div className="border-4 border-white shadow-[0_0_20px_rgba(0,0,0,0.2)] bg-white cursor-crosshair">
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="touch-none block max-w-full h-auto"
                        style={{ imageRendering: 'pixelated' }}
                    />
                </div>
            </div>
            
            <div className="h-6 bg-os-window border-t border-os-border flex items-center px-2 text-[10px] font-mono text-os-muted justify-between select-none">
                <span>CANVAS: 800x600px</span>
                <span>TOOL: {tool.toUpperCase()} ({brushSize}px)</span>
            </div>
        </div>
    );
};
