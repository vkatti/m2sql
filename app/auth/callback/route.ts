import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (error) {
        // Redirect to verify-email page with error for display
        return NextResponse.redirect(
            new URL(`/auth/verify-email?error=${error}&error_description=${errorDescription}`, request.url)
        )
    }

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Check if this is an email verification or OAuth callback
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Successful authentication - redirect to app
                return NextResponse.redirect(new URL(next, request.url))
            }
        }
    }

    // If no code or error exchanging code, redirect to verify-email with error
    return NextResponse.redirect(
        new URL('/auth/verify-email?error=invalid_code&error_description=Invalid or expired verification code', request.url)
    )
}
