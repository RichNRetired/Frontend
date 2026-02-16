import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Forward request to backend
        const result = await fetchBackendApi('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('Register error:', error);

        return NextResponse.json(
            { message: error.message || 'Registration failed' },
            { status: 500 }
        );
    }
}
