import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const params = new URLSearchParams();

        const locationId = searchParams.get('locationId');
        const categoryId = searchParams.get('categoryId');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const size = searchParams.get('size');
        const limit = searchParams.get('limit') || searchParams.get('size') || '20';
        const page = searchParams.get('page') || '0';
        const sortBy = searchParams.get('sortBy');
        const color = searchParams.get('color');
        const brand = searchParams.get('brand');

        if (locationId) params.set('locationId', locationId);
        if (categoryId) params.set('categoryId', categoryId);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (size && !searchParams.get('limit')) params.set('size', size);
        params.set('limit', limit);
        params.set('page', page);
        if (sortBy) params.set('sortBy', sortBy);
        if (color) params.set('color', color);
        if (brand) params.set('brand', brand);

        const queryString = params.toString() ? `?${params.toString()}` : '';

        // Forward request to backend
        const result = await fetchBackendApi(`/products${queryString}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        return NextResponse.json(result, {
            status: 200,
            headers: {
                'Cache-Control': 'public, max-age=300, s-maxage=300',
            },
        });
    } catch (error: any) {
        console.error('[ProductsListAPI] Error:', error);

        return NextResponse.json(
            { message: error.message || 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

