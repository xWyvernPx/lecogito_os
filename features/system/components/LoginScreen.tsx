import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoginScreen } from '@/features/system/login/hooks/use-login';
import { UserSelectView } from '@/features/system/login/components/UserSelectView';
import { AuthMethodView } from '@/features/system/login/components/AuthMethodView';
import { EmailFlowView } from '@/features/system/login/components/EmailFlowView';
import { PowerBar } from '@/features/system/login/components/PowerBar';

export const LoginScreen: React.FC = () => {
    const s = useLoginScreen();
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9000] flex flex-col items-center justify-center text-white font-sans">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center min-h-[400px]">
                <AnimatePresence mode="wait">
                    {s.view === 'USER_SELECT' && (
                        <UserSelectView key="user-select" knownUsers={s.knownUsers} selectedUser={s.selectedUser}
                            isLoading={s.isLoading} handleUserClick={s.handleUserClick}
                            removeKnownUser={s.removeKnownUser} onAddUser={() => s.setView('AUTH_METHOD')} />
                    )}
                    {s.view === 'AUTH_METHOD' && (
                        <AuthMethodView key="auth-method" handleSocialLogin={s.handleSocialLogin}
                            onEmailClick={() => s.setView('EMAIL_FLOW')} onBack={() => s.setView('USER_SELECT')} />
                    )}
                    {s.view === 'EMAIL_FLOW' && (
                        <EmailFlowView key="email-flow" email={s.email} setEmail={s.setEmail} otp={s.otp} setOtp={s.setOtp}
                            emailStep={s.emailStep} error={s.error} isLoading={s.isLoading}
                            handleEmailSubmit={s.handleEmailSubmit} handleOtpSubmit={s.handleOtpSubmit} onBack={s.handleEmailFlowBack} />
                    )}
                </AnimatePresence>
            </div>
            <PowerBar />
        </motion.div>
    );
};
