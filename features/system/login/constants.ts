import { UserProfile } from '@/types';

export type LoginView = 'USER_SELECT' | 'AUTH_METHOD' | 'EMAIL_FLOW';

export const GUEST_USER: UserProfile = {
    id: 'guest-001',
    name: 'Guest',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest&backgroundColor=e6e6e6&clothing=blazerAndShirt',
    type: 'guest'
};
