import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function PUT(
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
        if (!orderId || Number.isNaN(Number(orderId))) {
            return NextResponse.json(
                { message: 'Invalid order ID' },
                { status: 400 }
            );
        }

        // Forward request to backend
        const result = await fetchBackendApi(`/admin/orders/${orderId}/cancel`, {
            method: 'PUT',
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
