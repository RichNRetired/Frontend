import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function GET(req: NextRequest) {
    try {
        // Get the authorization token from the request
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { message: 'Unauthorized: Missing authorization token' },
                { status: 401 }
            );
        }

        // Get pagination params from query string
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page') || '0';
        const limit = searchParams.get('limit') || '10';

        // Forward request to backend
        const result = await fetchBackendApi(`/orders/my-orders?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            token,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('Get orders error:', error);

        return NextResponse.json(
            { message: error.message || 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
