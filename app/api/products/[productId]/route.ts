import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params;

        if (!productId) {
            return NextResponse.json(
                { message: 'Invalid product ID: ID is required' },
                { status: 400 }
            );
        }

        const idStr = String(productId).trim();

        if (!idStr) {
            return NextResponse.json(
                { message: 'Invalid product ID: ID cannot be empty' },
                { status: 400 }
            );
        }

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
