import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
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

        const { orderId } = await params;

        // Validate orderId
        if (!orderId || isNaN(Number(orderId))) {
            return NextResponse.json(
                { message: 'Invalid order ID' },
                { status: 400 }
            );
        }

        // Forward request to backend
        const result = await fetchBackendApi(`/orders/${orderId}/cancel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            token,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('Cancel order error:', error);

        return NextResponse.json(
            { message: error.message || 'Failed to cancel order' },
            { status: 500 }
        );
    }
}
