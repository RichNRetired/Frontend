import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Forward request to backend
        const result = await fetchBackendApi('/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('Logout error:', error);

        return NextResponse.json(
            { message: error.message || 'Logout failed' },
            { status: 500 }
        );
    }
}
