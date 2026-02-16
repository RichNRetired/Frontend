import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Forward request to backend
        const result = await fetchBackendApi('/auth/customer/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('Login error:', error);

        // If backend is unavailable, return fallback demo credentials
        if (error.message.includes('Backend API error') || error.message.includes('fetch')) {
            const { email, password } = await req.json();

            if (email === 'test@example.com' && password === 'password123') {
                return NextResponse.json({
                    accessToken: 'demo-token-' + Date.now(),
                    refreshToken: 'demo-refresh-' + Date.now(),
                    tokenType: 'Bearer',
                }, { status: 200 });
            }
        }

        return NextResponse.json(
            { message: error.message || 'Login failed' },
            { status: 500 }
        );
    }
}