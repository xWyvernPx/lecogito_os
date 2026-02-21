import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw, Mail, KeyRound, AlertCircle } from 'lucide-react';

interface EmailFlowViewProps {
    email: string;
    setEmail: (v: string) => void;
    otp: string;
    setOtp: (v: string) => void;
    emailStep: 'INPUT' | 'VERIFY';
    error: string | null;
    isLoading: boolean;
    handleEmailSubmit: (e: React.FormEvent) => void;
    handleOtpSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
}

export const EmailFlowView: React.FC<EmailFlowViewProps> = ({
    email, setEmail, otp, setOtp, emailStep, error, isLoading,
    handleEmailSubmit, handleOtpSubmit, onBack,
}) => {
    return (
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
                onClick={onBack}
                className="mt-6 text-xs text-white/50 hover:text-white transition-colors"
            >
                {emailStep === 'VERIFY' ? 'Change Email' : 'Back'}
            </button>
        </motion.div>
    );
};
