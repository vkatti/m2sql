'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AuthForm } from '../components/auth-form'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function VerifyEmailPage() {
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    useEffect(() => {
        if (error) {
            setStatus('error')
        } else {
            // If no error, assume success
            setStatus('success')
        }
    }, [error])

    if (status === 'verifying') {
        return (
            <AuthForm
                title="Verifying email"
                description="Please wait while we verify your email address"
            >
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                    <p className="text-muted-foreground">Verifying your email address...</p>
                </div>
            </AuthForm>
        )
    }

    if (status === 'error') {
        return (
            <AuthForm
                title="Verification failed"
                description="We couldn't verify your email address"
            >
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-destructive/20 p-3">
                            <XCircle className="h-12 w-12 text-destructive" />
                        </div>
                    </div>
                    <p className="text-muted-foreground">
                        {errorDescription || 'The verification link is invalid or has expired.'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Please request a new verification email or contact support if the problem persists.
                    </p>
                    <Link href="/auth/login">
                        <Button className="w-full rounded-full">
                            Back to login
                        </Button>
                    </Link>
                </div>
            </AuthForm>
        )
    }

    return (
        <AuthForm
            title="Email verified"
            description="Your email has been successfully verified"
        >
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="rounded-full bg-success/20 p-3">
                        <CheckCircle2 className="h-12 w-12 text-success" />
                    </div>
                </div>
                <p className="text-muted-foreground">
                    Your email address has been verified successfully.
                    You can now sign in to your account.
                </p>
                <Link href="/auth/login">
                    <Button className="w-full rounded-full">
                        Continue to login
                    </Button>
                </Link>
            </div>
        </AuthForm>
    )
}
