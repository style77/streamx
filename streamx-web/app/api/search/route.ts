import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const API_URL = process.env.API_URL;
    const res = await fetch(
        `${API_URL}/api/user/search/?q=${request.nextUrl.searchParams.get("q")}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
    const data = await res.json()
    return NextResponse.json(
        {
            data: data
        },
        {
            status: 200
        }
    )
}