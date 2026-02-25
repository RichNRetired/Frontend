/**
 * Backend API Configuration
 * Uses EXTERNAL_API_URL from environment variables for server-side requests
 */

export function getBackendUrl(): string {
    const externalUrl = (process.env.EXTERNAL_API_URL || '').trim();
    const publicUrl = (process.env.NEXT_PUBLIC_API_URL || '').trim();
    const backendUrl = externalUrl || publicUrl || 'https://project-fnwy.onrender.com';

    if (!backendUrl) {
        throw new Error(
            'Backend URL not configured. Set EXTERNAL_API_URL or NEXT_PUBLIC_API_URL in .env'
        );
    }

    // Remove trailing slash for consistency
    return backendUrl.replace(/\/$/, '');
}

/**
 * Fetch from backend API
 * Handles authentication and error cases
 */
export async function fetchBackendApi<T>(
    endpoint: string,
    options?: RequestInit & { token?: string }
): Promise<T> {
    const backendUrl = getBackendUrl();
    const url = `${backendUrl}/api${endpoint}`;

    const headers = new Headers(options?.headers || {});

    if (options?.token) {
        headers.set('Authorization', `Bearer ${options.token}`);
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });
    if (!response.ok) {
        const error = await response.text();
        console.error('Backend API Error:', { url, status: response.status, error });
        throw new Error(`Backend API error: ${response.status} ${error}`);
    }

    const data = await response.json() as Promise<T>;
    return data;
}
