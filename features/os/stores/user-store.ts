/**
 * User store — current user session, known users for quick login.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile } from '@/types';
import { idbStorage } from './idb-storage';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UserState {
    currentUser: UserProfile | null;
    knownUsers: UserProfile[];
}

export interface UserActions {
    /**
     * Login sets systemState indirectly — the facade coordinates with system-store.
     * This store only manages user data (currentUser/knownUsers).
     */
    login: (user: UserProfile) => void;
    /**
     * Logout clears user session. Auth-store logout & UI reset handled by facade.
     */
    logout: () => void;
    removeKnownUser: (id: string) => void;
}

export type UserStore = UserState & UserActions;

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            // --- State ---
            currentUser: null,
            knownUsers: [],

            // --- Actions ---

            login: (user) =>
                set(state => {
                    let newKnownUsers = state.knownUsers;
                    if (user.type !== 'guest') {
                        const exists = state.knownUsers.some(
                            u => u.id === user.id
                        );
                        if (!exists) {
                            newKnownUsers = [...state.knownUsers, user];
                        } else {
                            newKnownUsers = state.knownUsers.map(u =>
                                u.id === user.id ? user : u
                            );
                        }
                    }

                    return {
                        currentUser: user,
                        knownUsers: newKnownUsers,
                    };
                }),

            logout: () => set({ currentUser: null }),

            removeKnownUser: (id) =>
                set(state => ({
                    knownUsers: state.knownUsers.filter(u => u.id !== id),
                })),
        }),
        {
            name: 'designeros-user',
            storage: createJSONStorage(() => idbStorage),
            partialize: state => ({
                currentUser: state.currentUser,
                knownUsers: state.knownUsers,
            }),
        }
    )
);
