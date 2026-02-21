/**
 * Environment flags for feature toggling.
 * Set VITE_USE_MOCK_API=true in .env.local to use mock API layer.
 */
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';
