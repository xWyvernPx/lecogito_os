/**
 * Environment flags for feature toggling.
 * Set VITE_USE_MOCK_API=true in .env.local to use mock API layer.
 */
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

/**
 * Base URL for the CDN / object storage (used to build public URLs from storage keys).
 * Set VITE_CDN_URL in .env — e.g. https://cdn.example.com
 * Falls back to stripping query params from the presigned upload URL if not set.
 */
export const CDN_BASE_URL = import.meta.env.VITE_CDN_URL as string | undefined;

/**
 * Given a presigned upload URL and its storage key, return the permanent public URL.
 * If CDN_BASE_URL is configured it is preferred; otherwise the presigned URL origin+path is used.
 */
export const getPublicUrl = (presignedUrl: string, key: string): string => {
    if (CDN_BASE_URL) {
        return `${CDN_BASE_URL.replace(/\/$/, '')}/${key}`;
    }
    try {
        const parsed = new URL(presignedUrl);
        return `${parsed.origin}${parsed.pathname}`;
    } catch {
        return presignedUrl;
    }
};
