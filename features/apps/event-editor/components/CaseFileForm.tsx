import React from 'react';
import { Calendar, MapPin, Map } from 'lucide-react';
import { MarkdownEditor } from './MarkdownEditor';

// Typed as any — form type comes from useEventEditor, internal to this feature
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CaseFileFormProps {
    form: any;
    onOpenMapPicker: () => void;
}

export const CaseFileForm: React.FC<CaseFileFormProps> = ({ form, onOpenMapPicker }) => {
    return (
        <div className="lg:col-span-8 space-y-8">

            {/* Title */}
            <form.Field
                name="title"
                validators={{ onSubmit: ({ value }: { value: string }) => !value.trim() ? 'Title is required' : undefined }}
            >
                {(field: any) => (
                    <div className="relative group">
                        <div className="absolute -top-3 left-4 bg-os-accent px-2 py-0.5 text-[9px] font-black text-black uppercase tracking-widest border border-black z-20 shadow-retro-sm rotate-[-1deg]">
                            Subject ID
                        </div>
                        <div className={`border-2 ${field.state.meta.errors.length ? 'border-red-500' : 'border-stone-800'} bg-[#fdfaf5] p-6 shadow-retro-md transition-all group-focus-within:border-os-accent group-focus-within:-translate-y-0.5`}>
                            <input
                                type="text"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={e => field.handleChange(e.target.value)}
                                className="w-full text-3xl font-black text-stone-900 outline-none font-serif placeholder:text-stone-200 uppercase tracking-tighter bg-transparent"
                                placeholder="OPERATION: NAME_HERE"
                            />
                        </div>
                        {field.state.meta.isTouched && field.state.meta.errors.length ? (
                            <p className="mt-1 ml-1 text-[9px] font-black text-red-600 uppercase">{field.state.meta.errors[0]}</p>
                        ) : null}
                    </div>
                )}
            </form.Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Date */}
                <form.Field
                    name="fullDate"
                    validators={{ onSubmit: ({ value }: { value: string }) => !value ? 'Date is required' : undefined }}
                >
                    {(field: any) => (
                        <div className="relative group">
                            <div className="absolute -top-3 left-4 bg-stone-800 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-widest border border-black z-20 rotate-[1deg]">
                                Timestamp
                            </div>
                            <div className={`border-2 ${field.state.meta.errors.length ? 'border-red-500' : 'border-stone-800'} bg-[#fdfaf5] p-5 shadow-retro-sm group-focus-within:border-os-accent transition-colors`}>
                                <div className="flex gap-4 items-center">
                                    <Calendar size={18} className="text-stone-400 shrink-0" />
                                    <input
                                        type="date"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={e => field.handleChange(e.target.value)}
                                        className="flex-1 outline-none font-mono text-sm font-bold uppercase bg-transparent cursor-pointer"
                                    />
                                    {field.state.value && (
                                        <span className="text-[10px] font-black text-stone-400 font-mono border-l border-stone-300 pl-3">
                                            {field.state.value.slice(0, 4)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                                <p className="mt-1 ml-1 text-[9px] font-black text-red-600 uppercase">{field.state.meta.errors[0]}</p>
                            ) : null}
                        </div>
                    )}
                </form.Field>

                {/* Location */}
                <form.Field name="location">
                    {(field: any) => (
                        <div className="relative group">
                            <div className="absolute -top-3 left-4 bg-stone-800 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-widest border border-black z-20 rotate-[-1deg]">
                                Sector
                            </div>
                            <div className="border-2 border-stone-800 bg-[#fdfaf5] p-5 shadow-retro-sm group-focus-within:border-os-accent transition-colors">
                                <div className="flex items-center gap-4">
                                    <MapPin size={18} className="text-stone-400" />
                                    <input
                                        type="text"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={e => field.handleChange(e.target.value)}
                                        className="flex-1 outline-none font-mono text-sm font-bold uppercase bg-transparent"
                                        placeholder="TARGET_COORDINATES"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </form.Field>
            </div>

            {/* GPS Uplink */}
            <div className="relative group">
                <div className="absolute -top-3 left-4 bg-stone-800 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-widest border border-black z-20">
                    GPS Uplink
                </div>
                <div className="border-2 border-stone-800 bg-[#fdfaf5] p-5 shadow-retro-sm transition-colors">
                    <div className="flex gap-8 mb-3">
                        <form.Field name="lat">
                            {(field: any) => (
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-[10px] font-black text-stone-400 uppercase font-mono shrink-0">Lat:</span>
                                    <input
                                        type="number"
                                        value={field.state.value || ''}
                                        onChange={e => field.handleChange(parseFloat(e.target.value) || 0)}
                                        className="w-full outline-none font-mono text-sm font-bold bg-transparent border-b border-stone-200 focus:border-os-accent"
                                        placeholder="0.000000"
                                        step="any"
                                    />
                                </div>
                            )}
                        </form.Field>
                        <form.Field name="lng">
                            {(field: any) => (
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-[10px] font-black text-stone-400 uppercase font-mono shrink-0">Lng:</span>
                                    <input
                                        type="number"
                                        value={field.state.value || ''}
                                        onChange={e => field.handleChange(parseFloat(e.target.value) || 0)}
                                        className="w-full outline-none font-mono text-sm font-bold bg-transparent border-b border-stone-200 focus:border-os-accent"
                                        placeholder="0.000000"
                                        step="any"
                                    />
                                </div>
                            )}
                        </form.Field>
                    </div>
                    <button
                        type="button"
                        onClick={onOpenMapPicker}
                        className="flex items-center gap-2 text-[10px] font-black text-stone-500 hover:text-os-accent transition-colors uppercase tracking-wider border border-stone-300 hover:border-os-accent px-3 py-1.5"
                    >
                        <Map size={12} />
                        Pick on Map
                    </button>
                </div>
            </div>

            {/* Intelligence Summary — Markdown Editor */}
            <div className="relative">
                <div className="absolute -top-3 left-4 bg-stone-800 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-widest border border-black z-20 rotate-[0.5deg]">
                    Intelligence Summary
                </div>
                <form.Field name="description">
                    {(field: any) => (
                        <MarkdownEditor
                            value={field.state.value}
                            onChange={field.handleChange}
                            placeholder="Type official mission report details here... Markdown supported."
                        />
                    )}
                </form.Field>
            </div>

            {/* Sticky Note */}
            <form.Field name="note">
                {(field: any) => (
                    <div className="w-72 bg-[#fef08a] p-6 shadow-retro-md -rotate-2 border-2 border-stone-800 relative group transition-transform hover:rotate-0">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-600 rounded-full shadow-retro-sm z-10 border-2 border-red-900" />
                        <label className="block text-[9px] font-black text-stone-500 uppercase mb-2 tracking-tighter">Handwritten Intel</label>
                        <textarea
                            value={field.state.value}
                            onChange={e => field.handleChange(e.target.value)}
                            className="w-full bg-transparent outline-none font-handwriting text-blue-900 font-bold text-lg resize-none leading-tight"
                            placeholder="Jot down quick thoughts..."
                            rows={4}
                        />
                    </div>
                )}
            </form.Field>

        </div>
    );
};
