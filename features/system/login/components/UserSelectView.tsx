import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Plus, X, ShieldCheck } from 'lucide-react';
import { UserProfile } from '@/types';
import { GUEST_USER } from '../constants';

interface UserSelectViewProps {
    knownUsers: UserProfile[];
    selectedUser: UserProfile | null;
    isLoading: boolean;
    handleUserClick: (user: UserProfile) => void;
    removeKnownUser: (id: string) => void;
    onAddUser: () => void;
}

export const UserSelectView: React.FC<UserSelectViewProps> = ({
    knownUsers, selectedUser, isLoading, handleUserClick, removeKnownUser, onAddUser,
}) => {
    return (
        <motion.div 
            key="user-select"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center"
        >
            <div className="flex flex-wrap justify-center gap-10 mb-12">
                {[...knownUsers, GUEST_USER].map(user => {
                    const isSelected = selectedUser?.id === user.id;
                    const isGhost = selectedUser && !isSelected;

                    return (
                        <div key={user.id} className="relative flex flex-col items-center">
                            <button 
                                onClick={() => handleUserClick(user)}
                                className={`
                                    group flex flex-col items-center gap-4 transition-all duration-300
                                    ${isGhost ? 'opacity-30 scale-90 blur-[1px]' : 'opacity-100 scale-100'}
                                `}
                            >
                                <div className={`
                                    w-24 h-24 rounded-full bg-stone-200 shadow-2xl overflow-hidden border-4 transition-all duration-300 relative
                                    ${isSelected ? 'border-white ring-4 ring-white/20' : 'border-white/20 group-hover:border-white/50'}
                                `}>
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    {isLoading && isSelected && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                            <RefreshCw className="animate-spin text-white" size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="font-bold text-lg text-white drop-shadow-md tracking-tight">
                                        {user.name}
                                    </span>
                                    {user.type === 'admin' && (
                                        <span className="text-[9px] font-black uppercase text-os-accent drop-shadow-sm flex items-center gap-1 bg-black/20 px-1 rounded">
                                            <ShieldCheck size={10}/> Admin
                                        </span>
                                    )}
                                </div>
                            </button>

                            {/* Remove Button (Only for known users, when not selecting) */}
                            {!selectedUser && user.type !== 'guest' && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); removeKnownUser(user.id); }}
                                    className="absolute -top-1 -right-1 bg-stone-500/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                                >
                                    <X size={12} />
                                </button>
                            )}
                            
                            {/* Guest Loading State */}
                            {isSelected && user.type === 'guest' && isLoading && (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    className="absolute top-full mt-4 text-xs font-bold text-white/70"
                                >
                                    Logging in...
                                </motion.div>
                            )}
                        </div>
                    );
                })}

                {!selectedUser && (
                    <button 
                        onClick={() => onAddUser()}
                        className="flex flex-col items-center gap-4 opacity-70 hover:opacity-100 transition-opacity group"
                    >
                        <div className="w-24 h-24 rounded-full bg-black/20 border-4 border-white/10 flex items-center justify-center group-hover:bg-black/40 group-hover:border-white/30 transition-all shadow-xl backdrop-blur-sm">
                            <Plus size={32} className="text-white/80" />
                        </div>
                        <span className="font-bold text-lg text-white drop-shadow-md tracking-tight">Add User</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
};
