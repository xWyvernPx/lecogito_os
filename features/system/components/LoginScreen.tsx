
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, User as UserIcon, Power, RefreshCw, Moon, Github, Mail, Plus, X, ChevronLeft, KeyRound, AlertCircle, ShieldCheck } from 'lucide-react';
import { useOSStore } from '../../os/stores/os-store';
import { useAuthStore } from '../../os/stores/auth-store';
import { UserProfile } from '../../../types';
import { useTranslation } from '../../os/hooks/use-translation';
import { useLogin, useVerifyToken } from '@/services';

type LoginView = 'USER_SELECT' | 'AUTH_METHOD' | 'EMAIL_FLOW';

const GUEST_USER: UserProfile = {
    id: 'guest-001',
    name: 'Guest',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest&backgroundColor=e6e6e6&clothing=blazerAndShirt',
    type: 'guest'
};

export const LoginScreen: React.FC = () => {
    const { t } = useTranslation();
    const { login, shutdownSystem, rebootSystem, knownUsers, removeKnownUser } = useOSStore();
    const { user: authUser, isAuthenticated } = useAuthStore();
    const authLogin = useAuthStore(state => state.login);
    
    // State
    const [view, setView] = useState<LoginView>('USER_SELECT');
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Email Flow State
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [emailStep, setEmailStep] = useState<'INPUT' | 'VERIFY'>('INPUT');

    // Auto-login if authenticated
    useEffect(() => {
        if (isAuthenticated && authUser) {
            const user: UserProfile = {
                id: authUser.id.toString(),
                name: authUser.fullName,
                email: authUser.email,
                avatar: authUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.email}&backgroundColor=ffdfbf`,
                type: authUser.role === 'ADMIN' ? 'admin' : 'user',
                role: authUser.role,
                provider: 'email'
            };
            login(user);
        }
    }, [isAuthenticated, authUser, login]);

    // Reset state when switching views
    useEffect(() => {
        setError(null);
        setIsLoading(false);
    }, [view, selectedUser]);

    // --- API Hooks ---
    const { mutateAsync: loginMutateAsync } = useLogin();
    const { mutateAsync: verifyMutateAsync } = useVerifyToken();

    // --- Handlers ---

    const handleUserClick = (user: UserProfile) => {
        setSelectedUser(user);
        if (user.type === 'guest') {
            // Guest logs in immediately
            handleLogin(user);
        } else if (user.email) {
            // Known user - trigger email verification flow
            setEmail(user.email);
            setView('EMAIL_FLOW');
            setEmailStep('INPUT');
            // Auto-submit to send verification code
            setTimeout(() => {
                handleEmailSubmitForKnownUser(user.email);
            }, 300);
        }
    };

    const handleEmailSubmitForKnownUser = async (userEmail: string) => {
        setError(null);
        setIsLoading(true);
        
        try {
            const response = await loginMutateAsync({ email: userEmail });
            
            if (response.success) {
                setIsLoading(false);
                setEmailStep('VERIFY');
            } else {
                setError(response.message || 'Failed to send verification code');
                setIsLoading(false);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send verification code');
            setIsLoading(false);
        }
    };

    const handleLogin = (user: UserProfile) => {
        setIsLoading(true);
        setTimeout(() => {
            login(user);
        }, 1200);
    };

    const handleSocialLogin = (provider: 'github' | 'google') => {
        setIsLoading(true);
        // Simulate OAuth - in real app, this would redirect to OAuth flow
        setTimeout(() => {
            const user: UserProfile = {
                id: `${provider}-${Date.now()}`,
                name: provider === 'github' ? 'Developer' : 'Google User',
                email: `user@${provider}.com`,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}&backgroundColor=b6e3f4`,
                type: 'user',
                role: 'USER',
                provider: provider
            };
            login(user);
        }, 1500);
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes('@')) {
            setError('Invalid email address');
            return;
        }
        
        setError(null);
        setIsLoading(true);
        
        try {
            const response = await loginMutateAsync({ email });
            
            if (response.success) {
                setIsLoading(false);
                setEmailStep('VERIFY');
            } else {
                setError(response.message || 'Failed to send verification code');
                setIsLoading(false);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send verification code');
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 6) {
            setError('Enter 6-digit code');
            return;
        }
        
        setError(null);
        setIsLoading(true);
        
        try {
            const response = await verifyMutateAsync({ email, code: otp });

            if (response.success) {
                // Store in auth store
                authLogin(response.data);
                
                // Create user profile for OS store
                const user: UserProfile = {
                    id: response.data.user.id.toString(),
                    name: response.data.user.fullName,
                    email: response.data.user.email,
                    avatar: response.data.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.data.user.email}&backgroundColor=ffdfbf`,
                    type: response.data.user.role === 'ADMIN' ? 'admin' : 'user',
                    role: response.data.user.role,
                    provider: 'email'
                };
                
                // Login to OS
                login(user);
            } else {
                setError(response.message || 'Invalid verification code');
                setIsLoading(false);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid verification code');
            setIsLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9000] flex flex-col items-center justify-center text-white font-sans"
        >
            <div className="absolute inset-0 bg-black/20" />

            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center min-h-[400px]">
                
                <AnimatePresence mode="wait">
                    {view === 'USER_SELECT' && (
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
                                                        <span className="text-[9px] font-black uppercase text-[#ff7e33] drop-shadow-sm flex items-center gap-1 bg-black/20 px-1 rounded">
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
                                        onClick={() => setView('AUTH_METHOD')}
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
                    )}

                    {view === 'AUTH_METHOD' && (
                        <motion.div 
                            key="auth-method"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col items-center w-80"
                        >
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                                <UserIcon size={32} className="text-white" />
                            </div>
                            <h2 className="text-xl font-bold mb-6">Sign In</h2>
                            
                            <div className="flex flex-col gap-3 w-full">
                                <button 
                                    onClick={() => handleSocialLogin('github')}
                                    className="flex items-center gap-3 bg-[#24292e] hover:bg-[#2f363d] p-3 rounded-lg transition-all font-bold text-sm shadow-lg border border-white/5"
                                >
                                    <Github size={18} /> Continue with GitHub
                                </button>
                                <button 
                                    onClick={() => handleSocialLogin('google')}
                                    className="flex items-center gap-3 bg-white hover:bg-gray-100 text-gray-900 p-3 rounded-lg transition-all font-bold text-sm shadow-lg"
                                >
                                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                                    Continue with Google
                                </button>
                                <div className="flex items-center gap-2 py-2 opacity-50">
                                    <div className="h-px bg-white flex-1" />
                                    <span className="text-[10px] font-bold">OR</span>
                                    <div className="h-px bg-white flex-1" />
                                </div>
                                <button 
                                    onClick={() => setView('EMAIL_FLOW')}
                                    className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 p-3 rounded-lg transition-all font-bold text-sm shadow-lg"
                                >
                                    <Mail size={18} /> Continue with Email
                                </button>
                            </div>

                            <button 
                                onClick={() => setView('USER_SELECT')}
                                className="mt-6 text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"
                            >
                                <ChevronLeft size={12} /> Back to Users
                            </button>
                        </motion.div>
                    )}

                    {view === 'EMAIL_FLOW' && (
                        <motion.div 
                            key="email-flow"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col items-center w-80"
                        >
                            <h2 className="text-xl font-bold mb-2">
                                {emailStep === 'INPUT' ? 'Your Email' : 'Check Inbox'}
                            </h2>
                            <p className="text-xs text-white/60 mb-6 text-center">
                                {emailStep === 'INPUT' 
                                    ? 'We will send a verification code.' 
                                    : `Enter the code sent to ${email}`}
                            </p>

                            <form onSubmit={emailStep === 'INPUT' ? handleEmailSubmit : handleOtpSubmit} className="w-full flex flex-col gap-4">
                                {emailStep === 'INPUT' ? (
                                    <div className="bg-black/20 border border-white/20 rounded-lg flex items-center px-3 py-2.5 focus-within:border-white/50 transition-colors">
                                        <Mail size={16} className="text-white/50 mr-2" />
                                        <input 
                                            type="email" 
                                            autoFocus
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-transparent outline-none text-sm w-full placeholder:text-white/20"
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-black/20 border border-white/20 rounded-lg flex items-center px-3 py-2.5 focus-within:border-white/50 transition-colors">
                                        <KeyRound size={16} className="text-white/50 mr-2" />
                                        <input 
                                            type="text" 
                                            autoFocus
                                            maxLength={6}
                                            placeholder="123456"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                            className="bg-transparent outline-none text-sm w-full placeholder:text-white/20 tracking-[0.5em] text-center font-mono font-bold"
                                        />
                                    </div>
                                )}

                                {error && (
                                    <div className="flex items-center gap-2 text-red-400 text-xs justify-center bg-red-500/10 p-2 rounded">
                                        <AlertCircle size={12} /> {error}
                                    </div>
                                )}

                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-white text-black font-bold py-2.5 rounded-lg hover:bg-white/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 mt-2"
                                >
                                    {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                                    {emailStep === 'INPUT' ? 'Send Code' : 'Verify & Login'}
                                </button>
                            </form>

                            <button 
                                onClick={() => {
                                    if (emailStep === 'VERIFY') {
                                        setEmailStep('INPUT');
                                        setOtp('');
                                        setError(null);
                                    } else {
                                        setView('AUTH_METHOD');
                                    }
                                }}
                                className="mt-6 text-xs text-white/50 hover:text-white transition-colors"
                            >
                                {emailStep === 'VERIFY' ? 'Change Email' : 'Back'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            <div className="absolute bottom-8 flex items-center gap-4 z-10 text-white/60">
                <div className="flex items-center gap-8 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/5">
                    <button onClick={shutdownSystem} className="flex flex-col items-center gap-1 hover:text-white transition-colors group">
                        <Power size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" />
                        <span className="text-[10px] font-medium tracking-wide">{t('menu.power_off')}</span>
                    </button>
                    
                    <div className="w-px h-8 bg-white/10" />

                    <button onClick={rebootSystem} className="flex flex-col items-center gap-1 hover:text-white transition-colors group">
                        <RefreshCw size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" />
                        <span className="text-[10px] font-medium tracking-wide">{t('menu.restart')}</span>
                    </button>

                    <div className="w-px h-8 bg-white/10" />

                    <button className="flex flex-col items-center gap-1 hover:text-white transition-colors group">
                        <Moon size={20} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" />
                        <span className="text-[10px] font-medium tracking-wide">{t('menu.sleep')}</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
