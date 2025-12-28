
import React from 'react';
import { Clock, ToggleLeft, ToggleRight, Music } from 'lucide-react';
import { useOSStore } from '../os/stores/os-store';

export const WidgetSelector: React.FC = () => {
    const { widgets, toggleWidget } = useOSStore();

    return (
        <div className="grid grid-cols-1 gap-4 p-6">
            {widgets.map(widget => (
                <div key={widget.id} className="flex items-center justify-between p-4 bg-os-window border-2 border-os-border shadow-[2px_2px_0_0_var(--os-border)]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center bg-os-bg border-2 border-os-border rounded-sm text-os-accent">
                            {widget.type === 'clock' && <Clock size={20} />}
                            {widget.type === 'player' && <Music size={20} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-sm uppercase text-os-text">{widget.type} WIDGET</h3>
                            <p className="text-xs text-os-muted">Show {widget.type} on desktop</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => toggleWidget(widget.id)}
                        className={`transition-colors ${widget.isOpen ? 'text-os-accent' : 'text-os-muted'}`}
                        aria-label={`Toggle ${widget.type} widget ${widget.isOpen ? 'off' : 'on'}`}
                    >
                        {widget.isOpen ? <ToggleRight size={40} strokeWidth={1.5} /> : <ToggleLeft size={40} strokeWidth={1.5} />}
                    </button>
                </div>
            ))}
            {widgets.length === 0 && <p className="text-os-muted italic">No widgets available.</p>}
        </div>
    );
};
