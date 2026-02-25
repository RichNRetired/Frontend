import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function GET(req: NextRequest) {
    try {
        // Forward request to backend
        const result = await fetchBackendApi('/catalog/sections', {
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
        console.error('[CatalogSectionsAPI] Error:', error);

        return NextResponse.json(
            { message: error.message || 'Failed to fetch sections' },
            { status: 500 }
        );
    }
}
