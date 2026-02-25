import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params;
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '8';

        const result = await fetchBackendApi(
            `/products/${productId}/related?page=${page}&size=${size}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }
        );

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to fetch related products' },
            { status: 500 }
        );
    }
}
