import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const API_URL = process.env.API_URL;
    const response = await fetch(`${API_URL}/api/user/logout/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    });
    
    const res = NextResponse.json({}, {
        status: response.status,
    })
    await Promise.all([
        res.cookies.delete("streamx-auth-token"),
        res.cookies.delete("streamx-auth-refresh-token")
    ])
    return res;
}