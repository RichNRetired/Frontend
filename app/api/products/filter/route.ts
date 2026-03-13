import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendApi } from '@/lib/backend-api';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const params = new URLSearchParams();

        for (const [key, value] of searchParams.entries()) {
            if (!value) continue;

            if (key === 'filter') {
                try {
                    const parsedFilter = JSON.parse(value);
                    if (parsedFilter && typeof parsedFilter === 'object') {
                        Object.entries(parsedFilter).forEach(([filterKey, filterValue]) => {
                            if (
                                filterValue === undefined ||
                                filterValue === null ||
                                filterValue === ''
                            ) {
                                return;
                            }

                            if (Array.isArray(filterValue)) {
                                filterValue.forEach((entry) => {
                                    if (entry !== undefined && entry !== null && entry !== '') {
                                        params.append(`filter.${filterKey}`, String(entry));
                                    }
                                });
                            } else if (typeof filterValue === 'object') {
                                return;
                            } else {
                                params.set(`filter.${filterKey}`, String(filterValue));
                            }
                        });
                        continue;
                    }
                } catch {
                    // ignore invalid JSON and continue to default behavior
                }
            }

            if (key.startsWith('filter.')) {
                params.set(key, value);
                continue;
            }

            params.set(`filter.${key}`, value);
        }

        const query = params.toString();
        const result = await fetchBackendApi(`/products/filter${query ? `?${query}` : ''}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to filter products' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const result = await fetchBackendApi('/products/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body || {}),
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to filter products' },
            { status: 500 }
        );
    }
}
