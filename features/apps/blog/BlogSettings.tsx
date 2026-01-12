
import { SystemConfigurationTab } from '@/types/ui/system';
import { motion } from 'framer-motion';
import {
    AlertCircle, CheckCircle2,
    ChevronLeft,
    Layers,
    Save,
    Tag, User
} from 'lucide-react';
import React, { useState } from 'react';
import { RetroButton } from '../../../components/ui/retro-ui';
import SystemSettingTabs from '../components/system-settings/system-setting-tabs';

interface BlogSettingsProps {
    onBack: () => void;
}



export const BlogSettings: React.FC<BlogSettingsProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<SystemConfigurationTab>('CATEGORIES');
    
    // UI States
    const [isSaved, setIsSaved] = useState(false);

    const triggerSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-[#f4f1ea] text-stone-800 font-sans">
            {/* Toolbar */}
            <div className="h-14 border-b border-stone-300 bg-[#e8e4d9] flex items-center justify-between px-4 shrink-0 select-none">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-1.5 hover:bg-stone-200 rounded text-stone-600 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex flex-col">
                        <span className="font-black text-sm uppercase tracking-wide">System Configuration</span>
                        <span className="text-[10px] text-stone-500 font-mono">CMS_ADMIN_PANEL_V1.0</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isSaved && (
                        <motion.div 
                            initial={{ opacity: 0, x: 10 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-1 text-green-600 text-xs font-bold mr-2"
                        >
                            <CheckCircle2 size={14} /> SAVED
                        </motion.div>
                    )}
                    <RetroButton variant="primary" size="sm" icon={<Save size={14} />} onClick={triggerSave}>
                        Save Changes
                    </RetroButton>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Tabs */}
                <div className="w-64 bg-stone-100 border-r border-stone-300 flex flex-col p-4 gap-2">
                    <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 px-2">Settings</div>
                    
                    <button 
                        onClick={() => setActiveTab('CATEGORIES')}
                        className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-bold transition-all ${activeTab === 'CATEGORIES' ? 'bg-white border border-stone-300 shadow-sm text-stone-900' : 'text-stone-500 hover:bg-stone-200'}`}
                    >
                        <Tag size={16} className={activeTab === 'CATEGORIES' ? 'text-[#ff7e33]' : 'text-stone-400'} />
                        Categories
                    </button>

                    <button 
                        onClick={() => setActiveTab('USERS')}
                        className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-bold transition-all ${activeTab === 'USERS' ? 'bg-white border border-stone-300 shadow-sm text-stone-900' : 'text-stone-500 hover:bg-stone-200'}`}
                    >
                        <User size={16} className={activeTab === 'USERS' ? 'text-[#ff7e33]' : 'text-stone-400'} />
                        User Management
                    </button>

                    <button 
                        onClick={() => setActiveTab('SERIES')}
                        className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-bold transition-all ${activeTab === 'SERIES' ? 'bg-white border border-stone-300 shadow-sm text-stone-900' : 'text-stone-500 hover:bg-stone-200'}`}
                    >
                        <Layers size={16} className={activeTab === 'SERIES' ? 'text-[#ff7e33]' : 'text-stone-400'} />
                        Series Manager
                    </button>

                    <div className="mt-auto p-4 bg-stone-200 rounded border border-stone-300">
                        <div className="flex items-center gap-2 text-stone-600 mb-2">
                            <AlertCircle size={16} />
                            <span className="text-xs font-bold">System Status</span>
                        </div>
                        <div className="text-[10px] text-stone-500 leading-tight">
                            Database connection stable. <br/>
                            Last backup: 2 mins ago.
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#fdfdfd]">
                    <div className="max-w-3xl mx-auto">
                        <SystemSettingTabs activeTab={activeTab} />
                    </div>
                </div>
            </div>
        </div>
    );
};
