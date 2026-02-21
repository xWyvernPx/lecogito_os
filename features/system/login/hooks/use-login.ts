import React, { useState, useEffect } from 'react';
import { useOSStore } from '@/features/os/stores/os-store';
import { useAuthStore } from '@/features/os/stores/auth-store';
import { UserProfile } from '@/types';
import { useLogin, useVerifyToken } from '@/services';
import { LoginView } from '../constants';

export const useLoginScreen = () => {
    const { login, knownUsers, removeKnownUser } = useOSStore();
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

    const handleEmailFlowBack = () => {
        if (emailStep === 'VERIFY') {
            setEmailStep('INPUT');
            setOtp('');
            setError(null);
        } else {
            setView('AUTH_METHOD');
        }
    };

    return {
        view, setView,
        selectedUser,
        isLoading,
        error,
        email, setEmail,
        otp, setOtp,
        emailStep,
        knownUsers,
        removeKnownUser,
        handleUserClick,
        handleSocialLogin,
        handleEmailSubmit,
        handleOtpSubmit,
        handleEmailFlowBack,
    };
};
