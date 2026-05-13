'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { AuthForm } from '../components/auth-form'
import { AuthError } from '../components/auth-error'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            })

            if (error) {
                setError(error.message)
                return
            }

            setSuccess(true)
        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <AuthForm
                title="Check your email"
                description="We've sent you a password reset link"
            >
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-success/20 p-3">
                            <CheckCircle2 className="h-12 w-12 text-success" />
                        </div>
                    </div>
                    <p className="text-muted-foreground">
                        We sent a password reset link to <strong>{email}</strong>.
                        Click the link in the email to reset your password.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        The link will expire in 1 hour.
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
            title="Reset password"
            description="Enter your email to receive a reset link"
        >
            <AuthError message={error} />

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="rounded-2xl bg-card/50 backdrop-blur-sm focus:ring-primary/40"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full rounded-full hover:scale-105 transition-transform"
                    disabled={loading}
                >
                    {loading ? 'Sending link...' : 'Send reset link'}
                </Button>
            </form>

            <Link href="/auth/login">
                <Button
                    variant="ghost"
                    className="w-full rounded-full"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                </Button>
            </Link>
        </AuthForm>
    )
}
