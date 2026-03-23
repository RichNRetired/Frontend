import { NextRequest, NextResponse } from "next/server";
import { fetchBackendApi } from "@/lib/backend-api";

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization");
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized: Missing authorization token" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const result = await fetchBackendApi(`/orders/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            token,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to verify payment";

        console.error("Verify payment error:", error);

        return NextResponse.json(
            { message },
            { status: 500 }
        );
    }
}