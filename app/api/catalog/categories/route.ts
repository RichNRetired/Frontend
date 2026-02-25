import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const sectionId = searchParams.get('sectionId');

        if (!sectionId) {
            return NextResponse.json(
                { message: 'sectionId query parameter is required' },
                { status: 400 }
            );
        }

        // Forward request to backend
        const result = await fetchBackendApi(
            `/catalog/categories?sectionId=${sectionId}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }
        );

        return NextResponse.json(result, {
            status: 200,
            headers: {
                'Cache-Control': 'public, max-age=300, s-maxage=300',
            },
        });
    } catch (error: any) {
        console.error('[CatalogCategoriesAPI] Error:', error);

        return NextResponse.json(
            { message: error.message || 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
