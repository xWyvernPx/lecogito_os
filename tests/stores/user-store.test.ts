/**
 * Tests for features/os/stores/user-store.ts
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '@/features/os/stores/user-store';
import type { UserProfile } from '@/types';

const resetStore = () =>
    useUserStore.setState(useUserStore.getInitialState());

const mockUser = (overrides?: Partial<UserProfile>): UserProfile => ({
    id: '1',
    name: 'Test User',
    avatar: 'https://example.com/avatar.png',
    type: 'user',
    ...overrides,
});

describe('UserStore', () => {
    beforeEach(resetStore);

    // ------ Initial state ------------------------------------------------
    describe('initial state', () => {
        it('starts with null currentUser', () => {
            expect(useUserStore.getState().currentUser).toBeNull();
        });

        it('starts with empty knownUsers', () => {
            expect(useUserStore.getState().knownUsers).toEqual([]);
        });
    });

    // ------ login --------------------------------------------------------
    describe('login', () => {
        it('sets currentUser', () => {
            const user = mockUser();
            useUserStore.getState().login(user);
            expect(useUserStore.getState().currentUser).toEqual(user);
        });

        it('adds new non-guest user to knownUsers', () => {
            const user = mockUser({ type: 'user' });
            useUserStore.getState().login(user);
            expect(useUserStore.getState().knownUsers).toContainEqual(user);
        });

        it('does NOT add guest to knownUsers', () => {
            const guest = mockUser({ type: 'guest' });
            useUserStore.getState().login(guest);
            expect(useUserStore.getState().knownUsers).toHaveLength(0);
        });

        it('updates existing user in knownUsers', () => {
            const user = mockUser({ id: '1', name: 'Old Name' });
            useUserStore.getState().login(user);
            const updated = mockUser({ id: '1', name: 'New Name' });
            useUserStore.getState().login(updated);
            const known = useUserStore.getState().knownUsers;
            expect(known).toHaveLength(1);
            expect(known[0].name).toBe('New Name');
        });

        it('does not duplicate users in knownUsers', () => {
            const user = mockUser({ id: '42' });
            useUserStore.getState().login(user);
            useUserStore.getState().login(user);
            expect(useUserStore.getState().knownUsers).toHaveLength(1);
        });
    });

    // ------ logout -------------------------------------------------------
    describe('logout', () => {
        it('clears currentUser', () => {
            useUserStore.getState().login(mockUser());
            useUserStore.getState().logout();
            expect(useUserStore.getState().currentUser).toBeNull();
        });

        it('preserves knownUsers after logout', () => {
            useUserStore.getState().login(mockUser());
            useUserStore.getState().logout();
            expect(useUserStore.getState().knownUsers).toHaveLength(1);
        });
    });

    // ------ removeKnownUser ----------------------------------------------
    describe('removeKnownUser', () => {
        it('removes user by id', () => {
            useUserStore.getState().login(mockUser({ id: '1' }));
            useUserStore.getState().login(mockUser({ id: '2', name: 'Other' }));
            useUserStore.getState().removeKnownUser('1');
            const ids = useUserStore.getState().knownUsers.map(u => u.id);
            expect(ids).not.toContain('1');
            expect(ids).toContain('2');
        });
    });
});
