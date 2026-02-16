export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetcher<T>(url: string): Promise<T> {
    const res = await fetch(`${API_BASE}${url}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
}
