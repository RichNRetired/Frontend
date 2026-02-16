import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '10';
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const locationId = searchParams.get('locationId');



        // Build query string
        let queryString = `?page=${page}&size=${size}&sortBy=${sortBy}`;
        if (locationId) {
            queryString += `&locationId=${locationId}`;
        }

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

