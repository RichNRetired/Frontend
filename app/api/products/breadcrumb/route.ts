import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const params = new URLSearchParams();

        const sectionId = searchParams.get('sectionId');
        const categoryId = searchParams.get('categoryId');
        const subCategoryId = searchParams.get('subCategoryId');

        if (sectionId) params.set('sectionId', sectionId);
        if (categoryId) params.set('categoryId', categoryId);
        if (subCategoryId) params.set('subCategoryId', subCategoryId);

        const result = await fetchBackendApi(`/products/breadcrumb${params.toString() ? `?${params.toString()}` : ''}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to fetch breadcrumb' },
            { status: 500 }
        );
    }
}
