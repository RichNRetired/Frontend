import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function POST(req: NextRequest) {
    try {
        // forward auth token
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        const url = new URL(req.url);
        const addressId = url.searchParams.get('addressId');
        const paymentMethod = url.searchParams.get('paymentMethod');

        // you could optionally validate parameters here
        const body = await req.json();

        // Build backend URL with query params
        let backendUrl = '/orders/place';
        const qp: string[] = [];
        if (addressId) qp.push(`addressId=${encodeURIComponent(addressId)}`);
        if (paymentMethod) qp.push(`paymentMethod=${encodeURIComponent(paymentMethod)}`);
        if (qp.length) backendUrl += `?${qp.join('&')}`;

        const result = await fetchBackendApi(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            token,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('Place order error:', error);

        return NextResponse.json(
            { message: error.message || 'Place order failed' },
            { status: 500 }
        );
    }
}
