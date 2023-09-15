import { NextRequest, NextResponse } from "next/server";
import { refreshToken } from "../refresh-token/route";

export async function GET(request: NextRequest) {
    const API_URL = process.env.API_URL

    if (!request.cookies.get('streamx-auth-token')) {
        return NextResponse.json({
            error: 'Not authenticated'
        }, {
            status: 400
        })
    }

    const refData = await refreshToken(request.cookies.get('streamx-auth-refresh-token')!.value)

    const res = await fetch(`${API_URL}/api/user/user/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refData.access}`,
            'cache-control': 'no-cache'
        }
    })

    const data = await res.json();

    if (!res.ok) { // TODO: add checks for other errors
        console.log(data)
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

    response.cookies.delete('streamx-auth-token')

    response.cookies.set('streamx-auth-token', refData.access, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: true
    })

    return response
}