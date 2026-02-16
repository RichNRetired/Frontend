import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function POST(req: NextRequest) {
    try {
        // Get the authorization token from the request
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        const body = await req.json();

        // Forward request to backend
        const result = await fetchBackendApi('/orders/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            token,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('Checkout error:', error);

        return NextResponse.json(
            { message: error.message || 'Checkout failed' },
            { status: 500 }
        );
    }
}
