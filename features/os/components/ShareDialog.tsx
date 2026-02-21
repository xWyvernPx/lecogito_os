import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Twitter, Linkedin, Facebook, Link as LinkIcon } from 'lucide-react';
import { RetroButton } from '../../../components/ui/retro-ui';

interface ShareMeta {
    title: string;
    description: string;
    image?: string;
    url: string;
}

interface ShareDialogProps {
    isOpen: boolean;
    onClose: () => void;
    meta: ShareMeta;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, meta }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(meta.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSocialShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
        let shareUrl = '';
        const text = encodeURIComponent(meta.title);
        const url = encodeURIComponent(meta.url);

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
        }
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Window */}
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-[#fdfdfd] border-2 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-[#e8e4d9] border-b-2 border-black">
                            <div className="flex items-center gap-2">
                                <LinkIcon size={16} />
                                <span className="font-bold font-mono text-sm uppercase tracking-wider">Share Content</span>
                            </div>
                            <button onClick={onClose} className="hover:bg-black/10 p-1 rounded transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">Social Preview</h3>
                            
                            {/* OG Card Preview */}
                            <div className="border border-stone-200 rounded-lg overflow-hidden bg-white shadow-sm mb-6 group select-none">
                                <div className="aspect-[1.91/1] bg-stone-100 relative overflow-hidden border-b border-stone-100">
                                    {meta.image ? (
                                        <img src={meta.image} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400 font-bold">
                                            NO IMAGE
                                        </div>
                                    )}
                                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
                                </div>
                                <div className="p-3 bg-[#f0f2f5]">
                                    <div className="text-[10px] text-stone-500 uppercase font-bold mb-0.5 truncate">DESIGNEROS.APP</div>
                                    <div className="font-bold text-stone-900 leading-tight mb-1 line-clamp-1">{meta.title}</div>
                                    <div className="text-xs text-stone-600 line-clamp-2 leading-snug">{meta.description}</div>
                                </div>
                            </div>

                            {/* Share Actions */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <RetroButton 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={() => handleSocialShare('twitter')}
                                    className="!justify-start"
                                    icon={<Twitter size={14} fill="currentColor" className="text-stone-700" />}
                                >
                                    X / Twitter
                                </RetroButton>
                                <RetroButton 
                                    variant="secondary" 
                                    size="sm" 
                                    onClick={() => handleSocialShare('linkedin')}
                                    className="!justify-start"
                                    icon={<Linkedin size={14} fill="currentColor" className="text-stone-700" />}
                                >
                                    LinkedIn
                                </RetroButton>
                            </div>

                            {/* Copy Link Input */}
                            <div className="relative">
                                <input 
                                    readOnly 
                                    value={meta.url} 
                                    className="w-full bg-stone-100 border-2 border-stone-300 px-3 py-2 text-xs font-mono text-stone-600 rounded-sm outline-none focus:border-os-accent"
                                />
                                <button 
                                    onClick={handleCopy}
                                    className="absolute right-1 top-1 bottom-1 px-3 bg-white border border-stone-300 hover:border-stone-400 rounded-sm flex items-center justify-center transition-all"
                                >
                                    {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};