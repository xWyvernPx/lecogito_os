/**
 * Tests for features/os/stores/auth-store.ts
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore, AUTH_STORAGE_KEYS } from '@/features/os/stores/auth-store';

// Auth store uses localStorage directly — mock it.
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        get length() {
            return Object.keys(store).length;
        },
        key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
    };
})();

Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
});

const resetStore = () => {
    localStorageMock.clear();
    useAuthStore.setState({
        token: null,
        refreshToken: null,
        tokenExpires: null,
        user: null,
        isAuthenticated: false,
    });
};

describe('AuthStore', () => {
    beforeEach(resetStore);

    describe('login', () => {
        it('sets tokens and user, marks authenticated', () => {
            useAuthStore.getState().login({
                accessToken: 'tok123',
                refreshToken: 'ref456',
                user: {
                    id: '1',
                    email: 'a@b.com',
                    displayName: 'Test',
                    role: 'user',
                    avatar: null,
                    createdAt: '',
                    updatedAt: '',
                },
            });
            const s = useAuthStore.getState();
            expect(s.token).toBe('tok123');
            expect(s.refreshToken).toBe('ref456');
            expect(s.isAuthenticated).toBe(true);
            expect(s.tokenExpires).toBeGreaterThan(Date.now() - 1000);
        });

        it('persists to localStorage', () => {
            useAuthStore.getState().login({
                accessToken: 'tok',
                refreshToken: 'ref',
                user: {
                    id: '1',
                    email: 'a@b.com',
                    displayName: 'Test',
                    role: 'user',
                    avatar: null,
                    createdAt: '',
                    updatedAt: '',
                },
            });
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                AUTH_STORAGE_KEYS.TOKEN,
                'tok'
            );
        });
    });

    describe('logout', () => {
        it('clears state and localStorage', () => {
            useAuthStore.getState().login({
                accessToken: 'tok',
                refreshToken: 'ref',
                user: {
                    id: '1',
                    email: 'a@b.com',
                    displayName: 'Test',
                    role: 'user',
                    avatar: null,
                    createdAt: '',
                    updatedAt: '',
                },
            });
            useAuthStore.getState().logout();
            const s = useAuthStore.getState();
            expect(s.token).toBeNull();
            expect(s.isAuthenticated).toBe(false);
        });
    });

    describe('refresh', () => {
        it('updates tokens without clearing user', () => {
            useAuthStore.getState().login({
                accessToken: 'old',
                refreshToken: 'oldRef',
                user: {
                    id: '1',
                    email: 'a@b.com',
                    displayName: 'Test',
                    role: 'user',
                    avatar: null,
                    createdAt: '',
                    updatedAt: '',
                },
            });
            useAuthStore.getState().refresh({
                accessToken: 'new',
                refreshToken: 'newRef',
            });
            const s = useAuthStore.getState();
            expect(s.token).toBe('new');
            expect(s.refreshToken).toBe('newRef');
            expect(s.user).toBeDefined();
        });
    });

    describe('getters', () => {
        it('getToken returns current token', () => {
            useAuthStore.setState({ token: 'abc' });
            expect(useAuthStore.getState().getToken()).toBe('abc');
        });

        it('getRefreshToken returns current refresh token', () => {
            useAuthStore.setState({ refreshToken: 'ref' });
            expect(useAuthStore.getState().getRefreshToken()).toBe('ref');
        });

        it('checkAuth returns isAuthenticated', () => {
            useAuthStore.setState({ isAuthenticated: true });
            expect(useAuthStore.getState().checkAuth()).toBe(true);
        });
    });
});
