
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, User as UserIcon, Lock, Power, RefreshCw, Moon, Github, Mail } from 'lucide-react';
import { useOSStore } from '../../os/stores/os-store';
import { UserProfile } from '../../../types';
import { useTranslation } from '../../os/hooks/use-translation';

const MOCK_USERS: UserProfile[] = [
    {
        name: 'Guest User',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest&backgroundColor=e6e6e6',
        type: 'guest'
    },
    {
        name: 'Phong Le',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        type: 'admin',
        password: 'admin'
    }
];

export const LoginScreen: React.FC = () => {
    const { t } = useTranslation();
    const { login, shutdownSystem, rebootSystem } = useOSStore();
    const [selectedUser, setSelectedUser] = useState<UserProfile>(MOCK_USERS[0]);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = (e?: React.FormEvent) => {
        e?.preventDefault();
        setError(null);
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (selectedUser.type === 'admin') {
                const requiredPwd = selectedUser.password || '123456';
                if (password !== requiredPwd) {
                    setError(`${t('login.incorrect')} (${t('login.hint')}: ${requiredPwd})`);
                    setIsLoading(false);
                    return;
                }
            }
            login(selectedUser);
        }, 800);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9000] flex flex-col items-center justify-center text-white"
        >
            {/* Blurred Background Layer (handled by CSS in parent, but we add a dark overlay) */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />

            {/* Main Login Container */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-md p-8">
                
                {/* User Avatar */}
                <motion.div 
                    layoutId={`avatar-${selectedUser.name}`}
                    className="w-24 h-24 rounded-full bg-stone-200 border-4 border-white/20 shadow-xl overflow-hidden mb-6 relative"
                >
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                </motion.div>

                {/* Username */}
                <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-md tracking-tight">
                    {selectedUser.name}
                </h2>

                {/* Login Form */}
                <div className="w-full max-w-[280px] space-y-4">
                    
                    {selectedUser.type === 'guest' ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                             <button 
                                onClick={() => handleLogin()}
                                disabled={isLoading}
                                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full py-2 px-4 text-sm font-medium transition-all flex items-center justify-center gap-2 group"
                             >
                                {isLoading ? (
                                    <span className="animate-spin w-4 h-4 border-2 border-white/50 border-t-white rounded-full"/>
                                ) : (
                                    <>
                                        {t('login.guest')}
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                                    </>
                                )}
                             </button>
                             <div className="flex justify-center gap-3 mt-4">
                                <button className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors border border-white/10" title="Login with GitHub">
                                    <Github size={16} />
                                </button>
                                <button className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors border border-white/10" title="Login with Google">
                                    <Mail size={16} />
                                </button>
                             </div>
                        </motion.div>
                    ) : (
                        <motion.form 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleLogin} 
                            className="relative"
                        >
                            <input 
                                type="password" 
                                placeholder={t('login.password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/20 backdrop-blur-sm border border-white/20 rounded-full py-2 px-4 text-sm text-white placeholder:text-white/50 outline-none focus:bg-black/30 focus:border-white/40 transition-all text-center"
                                autoFocus
                            />
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="absolute right-1 top-1 h-8 w-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                {isLoading ? (
                                    <span className="animate-spin w-3 h-3 border-2 border-white/50 border-t-white rounded-full"/>
                                ) : (
                                    <ArrowRight size={16} />
                                )}
                            </button>
                            {error && (
                                <motion.p 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="text-xs text-red-300 text-center mt-2 font-medium drop-shadow-sm"
                                >
                                    {error}
                                </motion.p>
                            )}
                        </motion.form>
                    )}
                </div>

                {/* User Switcher (if multiple users) */}
                <div className="mt-12 flex gap-4">
                    {MOCK_USERS.map(user => (
                        <button 
                            key={user.name}
                            onClick={() => { setSelectedUser(user); setError(null); setPassword(''); }}
                            className={`flex flex-col items-center gap-2 transition-opacity ${selectedUser.name === user.name ? 'opacity-100 cursor-default pointer-events-none' : 'opacity-50 hover:opacity-100'}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-stone-300 overflow-hidden shadow-inner">
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[10px] font-medium tracking-wide">{user.name.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>

            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-8 flex flex-col items-center gap-2 z-10 text-white/60">
                <div className="flex items-center gap-6">
                    <button onClick={shutdownSystem} className="flex flex-col items-center gap-1 hover:text-white transition-colors group">
                        <div className="p-3 rounded-full bg-black/20 group-hover:bg-black/40 transition-colors border border-white/10">
                            <Power size={20} />
                        </div>
                        <span className="text-[10px] font-medium">{t('menu.power_off')}</span>
                    </button>
                    
                    <button onClick={rebootSystem} className="flex flex-col items-center gap-1 hover:text-white transition-colors group">
                        <div className="p-3 rounded-full bg-black/20 group-hover:bg-black/40 transition-colors border border-white/10">
                            <RefreshCw size={20} />
                        </div>
                        <span className="text-[10px] font-medium">{t('menu.restart')}</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 hover:text-white transition-colors group">
                        <div className="p-3 rounded-full bg-black/20 group-hover:bg-black/40 transition-colors border border-white/10">
                            <Moon size={20} />
                        </div>
                        <span className="text-[10px] font-medium">{t('menu.sleep')}</span>
                    </button>
                </div>
            </div>

        </motion.div>
    );
};
