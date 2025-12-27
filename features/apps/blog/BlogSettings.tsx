
import React, { useState } from 'react';
import { 
    ChevronLeft, Plus, Trash2, Tag, User, Shield, Save, 
    RefreshCw, AlertCircle, CheckCircle2, Layers, Image as ImageIcon
} from 'lucide-react';
import { RetroButton } from '../../../components/ui/retro-ui';
import { motion } from 'framer-motion';
import { useBlogStore } from './store';
import { Serie } from './data';

interface BlogSettingsProps {
    onBack: () => void;
}

type Tab = 'CATEGORIES' | 'USERS' | 'SERIES';

export const BlogSettings: React.FC<BlogSettingsProps> = ({ onBack }) => {
    const { 
        categories, addCategory, deleteCategory,
        authors, addAuthor, deleteAuthor,
        series, addSeries, deleteSeries
    } = useBlogStore();

    const [activeTab, setActiveTab] = useState<Tab>('CATEGORIES');
    
    // Form States
    const [newCat, setNewCat] = useState('');
    const [newAuthor, setNewAuthor] = useState('');
    const [role, setRole] = useState('Contributor');

    // Series Form State
    const [serieTitle, setSerieTitle] = useState('');
    const [serieDesc, setSerieDesc] = useState('');
    const [serieCover, setSerieCover] = useState('');

    // UI States
    const [isSaved, setIsSaved] = useState(false);

    const handleAddCategory = () => {
        if (newCat && !categories.includes(newCat)) {
            addCategory(newCat);
            setNewCat('');
            triggerSave();
        }
    };

    const handleAddAuthor = () => {
        if (newAuthor && !authors.includes(newAuthor)) {
            addAuthor(newAuthor);
            setNewAuthor('');
            triggerSave();
        }
    };

    const handleAddSeries = () => {
        if (!serieTitle || !serieDesc) return;
        
        const newSerie: Serie = {
            id: serieTitle.toLowerCase().replace(/\s+/g, '-'),
            title: serieTitle,
            description: serieDesc,
            coverUrl: serieCover || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop'
        };

        addSeries(newSerie);
        setSerieTitle('');
        setSerieDesc('');
        setSerieCover('');
        triggerSave();
    };

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
                        
                        {/* CATEGORIES TAB */}
                        {activeTab === 'CATEGORIES' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                                <div className="mb-8">
                                    <h2 className="text-2xl font-black mb-2">Taxonomy Management</h2>
                                    <p className="text-stone-500 text-sm">Organize scrolls into logical groupings for better retrieval.</p>
                                </div>

                                {/* Add New */}
                                <div className="flex gap-4 mb-8 p-4 bg-stone-50 border border-stone-200 rounded">
                                    <input 
                                        type="text" 
                                        placeholder="New Category Name..." 
                                        className="flex-1 bg-white border border-stone-300 px-4 py-2 outline-none focus:border-[#ff7e33] font-mono text-sm"
                                        value={newCat}
                                        onChange={(e) => setNewCat(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                    />
                                    <RetroButton onClick={handleAddCategory} icon={<Plus size={16} />}>Add Category</RetroButton>
                                </div>

                                {/* List */}
                                <div className="grid grid-cols-1 gap-3">
                                    {categories.map((cat) => (
                                        <div key={cat} className="flex items-center justify-between p-4 bg-white border-2 border-stone-100 hover:border-stone-300 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-stone-100 flex items-center justify-center text-stone-400">
                                                    <Tag size={16} />
                                                </div>
                                                <span className="font-bold text-stone-700">{cat}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-stone-400 font-mono">0 scrolls</span>
                                                <button 
                                                    onClick={() => deleteCategory(cat)}
                                                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* USERS TAB */}
                        {activeTab === 'USERS' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                                <div className="mb-8">
                                    <h2 className="text-2xl font-black mb-2">User Directory</h2>
                                    <p className="text-stone-500 text-sm">Manage access levels and profiles for contributors.</p>
                                </div>

                                {/* Add New */}
                                <div className="flex gap-4 mb-8 p-4 bg-stone-50 border border-stone-200 rounded items-end">
                                    <div className="flex-1 flex flex-col gap-1">
                                        <label className="text-[10px] font-bold uppercase text-stone-400">Username</label>
                                        <input 
                                            type="text" 
                                            placeholder="John Doe" 
                                            className="w-full bg-white border border-stone-300 px-4 py-2 outline-none focus:border-[#ff7e33] font-mono text-sm"
                                            value={newAuthor}
                                            onChange={(e) => setNewAuthor(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-48 flex flex-col gap-1">
                                        <label className="text-[10px] font-bold uppercase text-stone-400">Role</label>
                                        <select 
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full bg-white border border-stone-300 px-4 py-2 outline-none focus:border-[#ff7e33] text-sm h-[38px]"
                                        >
                                            <option>Contributor</option>
                                            <option>Editor</option>
                                            <option>Admin</option>
                                        </select>
                                    </div>
                                    <RetroButton onClick={handleAddAuthor} icon={<Plus size={16} />}>Create User</RetroButton>
                                </div>

                                {/* List */}
                                <div className="grid grid-cols-1 gap-3">
                                    {authors.map((author) => (
                                        <div key={author} className="flex items-center justify-between p-4 bg-white border-2 border-stone-100 hover:border-stone-300 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-stone-200 border border-stone-300 overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`} alt="avatar" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-stone-900">{author}</div>
                                                    <div className="text-xs text-stone-500 flex items-center gap-1">
                                                        <Shield size={10} className="text-[#ff7e33]" />
                                                        Contributor
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="px-2 py-1 bg-stone-100 text-[10px] font-mono border border-stone-200 rounded">
                                                    ID: {Math.floor(Math.random() * 9000) + 1000}
                                                </div>
                                                <button 
                                                    onClick={() => deleteAuthor(author)}
                                                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* SERIES TAB */}
                        {activeTab === 'SERIES' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                                <div className="mb-8">
                                    <h2 className="text-2xl font-black mb-2">Series Management</h2>
                                    <p className="text-stone-500 text-sm">Curate collections of posts into episodic content.</p>
                                </div>

                                {/* Add New Series */}
                                <div className="bg-stone-50 border border-stone-200 rounded p-6 mb-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <Layers size={100} />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-4 relative z-10">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold uppercase text-stone-400">Series Title</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. The Startup Chronicles" 
                                                className="w-full bg-white border border-stone-300 px-4 py-2 outline-none focus:border-[#ff7e33] font-bold text-stone-900"
                                                value={serieTitle}
                                                onChange={(e) => setSerieTitle(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold uppercase text-stone-400">Description</label>
                                            <input 
                                                type="text" 
                                                placeholder="Brief summary of this collection..." 
                                                className="w-full bg-white border border-stone-300 px-4 py-2 outline-none focus:border-[#ff7e33] text-sm"
                                                value={serieDesc}
                                                onChange={(e) => setSerieDesc(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1 flex flex-col gap-1">
                                                <label className="text-[10px] font-bold uppercase text-stone-400">Cover Image URL</label>
                                                <div className="flex items-center gap-2 bg-white border border-stone-300 px-3 py-2 focus-within:border-[#ff7e33]">
                                                    <ImageIcon size={14} className="text-stone-400" />
                                                    <input 
                                                        type="text" 
                                                        placeholder="https://..." 
                                                        className="w-full outline-none text-xs text-stone-600 bg-transparent"
                                                        value={serieCover}
                                                        onChange={(e) => setSerieCover(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-end">
                                                <RetroButton onClick={handleAddSeries} icon={<Plus size={16} />}>Create Series</RetroButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Series List */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {series.map((serie) => (
                                        <div key={serie.id} className="flex flex-col border-2 border-stone-200 bg-white rounded overflow-hidden hover:border-[#ff7e33] transition-colors group">
                                            <div className="h-24 bg-stone-100 relative overflow-hidden">
                                                <img src={serie.coverUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                                                    <h3 className="text-white font-bold text-sm leading-tight shadow-black drop-shadow-md">{serie.title}</h3>
                                                </div>
                                            </div>
                                            <div className="p-3 flex-1 flex flex-col">
                                                <p className="text-xs text-stone-500 line-clamp-2 mb-3">{serie.description}</p>
                                                <div className="mt-auto flex justify-between items-center border-t border-stone-100 pt-2">
                                                    <span className="text-[10px] font-mono text-stone-400">ID: {serie.id}</span>
                                                    <button 
                                                        onClick={() => deleteSeries(serie.id)}
                                                        className="text-stone-400 hover:text-red-500 transition-colors"
                                                        title="Delete Series"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};
