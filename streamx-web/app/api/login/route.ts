import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const API_URL = process.env.API_URL;
    const body = await request.json();

    try {
        const res = await fetch(`${API_URL}/api/user/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const data = await res.json();
            const errorMessage = data.non_field_errors ? data.non_field_errors[0] : 'An error occurred';

            return NextResponse.json({ error: errorMessage }, { status: res.status });
        }

        const data = await res.json();

        const response = NextResponse.json({ ...data }, { status: res.status });

        // Set cookies
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
        ]);

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}