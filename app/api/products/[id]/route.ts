import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Extract and validate ID
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { message: 'Invalid product ID: ID is required' },
                { status: 400 }
            );
        }

        const idStr = String(id).trim();

        if (!idStr) {
            return NextResponse.json(
                { message: 'Invalid product ID: ID cannot be empty' },
                { status: 400 }
            );
        }

        // Forward request to backend (can be numeric ID or slug)
        const result = await fetchBackendApi(`/products/${idStr}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        return NextResponse.json(result, {
            status: 200,
            headers: {
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch (error: any) {
        console.error('[ProductAPI] Error:', error);

        // Determine if it's a 404 or other error
        const status = error.message?.includes('404') ? 404 : 500;
        const message =
            status === 404
                ? 'Product not found'
                : error.message || 'Failed to fetch product';

        return NextResponse.json(
            { message },
            { status }
        );
    }
}

