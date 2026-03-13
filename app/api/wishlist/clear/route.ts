import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function DELETE(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: Missing authorization token' },
                { status: 401 }
            );
        }

        const result = await fetchBackendApi<{ success: boolean; message: string }>('/wishlist/clear', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            token,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('Clear wishlist error:', error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || 'Failed to clear wishlist',
            },
            { status: 500 }
        );
    }
}
