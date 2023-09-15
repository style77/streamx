import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const API_URL = process.env.API_URL
    const body = await request.json()

    const res = await fetch(`${API_URL}/api/user/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    const data = await res.json();
    
    if (!res.ok) {
        if (data.non_field_errors) {
            return NextResponse.json({
                error: data.non_field_errors[0]
            }, {
                status: res.status
            })
        }
    }

    const response = NextResponse.json(
        {
            data: data
        },
        {
            status: res.status
        }
    )
    
    await Promise.all([
        response.cookies.set('streamx-auth-token', data.access, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: true
        }),
        response.cookies.set('streamx-auth-refresh-token', data.refresh, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: true
        })
    ])

    return response
}