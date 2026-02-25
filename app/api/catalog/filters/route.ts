import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const subCategoryId = searchParams.get('subCategoryId');

        if (!subCategoryId) {
            return NextResponse.json(
                { message: 'subCategoryId query parameter is required' },
                { status: 400 }
            );
        }

        // Forward request to backend
        const result = await fetchBackendApi(
            `/catalog/filters?subCategoryId=${subCategoryId}`,
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
        console.error('[CatalogFiltersAPI] Error:', error);

        return NextResponse.json(
            { message: error.message || 'Failed to fetch filters' },
            { status: 500 }
        );
    }
}
