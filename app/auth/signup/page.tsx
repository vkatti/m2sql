'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { AuthForm } from '../components/auth-form'
import { AuthError } from '../components/auth-error'
import { OAuthButtons } from '../components/oauth-buttons'
import { CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        // Validate password strength
        if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) {
                if (error.message.includes('already registered')) {
                    setError('An account with this email already exists.')
                } else {
                    setError(error.message)
                }
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
                description="We've sent you a verification link"
            >
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-success/20 p-3">
                            <CheckCircle2 className="h-12 w-12 text-success" />
                        </div>
                    </div>
                    <p className="text-muted-foreground">
                        We sent a verification email to <strong>{email}</strong>.
                        Click the link in the email to verify your account.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Didn&apos;t receive the email? Check your spam folder.
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
            title="Create an account"
            description="Sign up to start translating your queries"
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

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="rounded-2xl bg-card/50 backdrop-blur-sm focus:ring-primary/40"
                    />
                    <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="rounded-2xl bg-card/50 backdrop-blur-sm focus:ring-primary/40"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full rounded-full hover:scale-105 transition-transform"
                    disabled={loading}
                >
                    {loading ? 'Creating account...' : 'Create account'}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>

            <OAuthButtons />

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                    Sign in
                </Link>
            </p>
        </AuthForm>
    )
}
