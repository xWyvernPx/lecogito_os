import '@testing-library/jest-dom/vitest';

// Stub idb-keyval — stores use IndexedDB persistence which is unavailable in JSDOM.
// Provide a simple in-memory mock so Zustand `persist` initialises synchronously.
vi.mock('idb-keyval', () => {
    const store = new Map<string, unknown>();
    return {
        get: vi.fn(async (key: string) => store.get(key) ?? null),
        set: vi.fn(async (key: string, value: unknown) => {
            store.set(key, value);
        }),
        del: vi.fn(async (key: string) => {
            store.delete(key);
        }),
    };
});

// Reset all Zustand stores between tests to prevent state leakage.
afterEach(() => {
    vi.restoreAllMocks();
});
