import { NextRequest, NextResponse } from "next/server";

export const refreshToken = async (refreshToken: string) => {
    const API_URL = process.env.API_URL
    const res = await fetch(`${API_URL}/api/user/token/refresh/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: refreshToken })
    })

    const data = await res.json();

    if (!res.ok) {
        return
    }

    return data
}

export async function GET(request: NextRequest) {

    if (!request.cookies.get('streamx-auth-token') || !request.cookies.get('streamx-auth-refresh-token')) {
        return NextResponse.json({
            error: 'Not authenticated'
        }, {
            status: 400
        })
    }

    const refData = await refreshToken(request.cookies.get('streamx-auth-refresh-token')!.value)

    const res = NextResponse.json({
        data: refData
    }, {
        status: 200
    })

    await Promise.all([
        res.cookies.delete('streamx-auth-token'),
        res.cookies.set('streamx-auth-token', refData.access, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: true
        })
    ])

    return res
}