import React from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Github, Mail, ChevronLeft } from 'lucide-react';

interface AuthMethodViewProps {
    handleSocialLogin: (provider: 'github' | 'google') => void;
    onEmailClick: () => void;
    onBack: () => void;
}

export const AuthMethodView: React.FC<AuthMethodViewProps> = ({
    handleSocialLogin, onEmailClick, onBack,
}) => {
    return (
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
                    onClick={onEmailClick}
                    className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 p-3 rounded-lg transition-all font-bold text-sm shadow-lg"
                >
                    <Mail size={18} /> Continue with Email
                </button>
            </div>

            <button 
                onClick={onBack}
                className="mt-6 text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"
            >
                <ChevronLeft size={12} /> Back to Users
            </button>
        </motion.div>
    );
};
