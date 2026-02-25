import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const params = new URLSearchParams();

        for (const [key, value] of searchParams.entries()) {
            if (!value) continue;

            if (key.startsWith('filter.')) {
                params.set(key, value);
                continue;
            }

            params.set(`filter.${key}`, value);
        }

        const query = params.toString();
        const result = await fetchBackendApi(`/products/filter${query ? `?${query}` : ''}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to filter products' },
            { status: 500 }
        );
    }
}
