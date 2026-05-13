'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { AuthForm } from '../components/auth-form'
import { AuthError } from '../components/auth-error'
import { CheckCircle2 } from 'lucide-react'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [validSession, setValidSession] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Check if user has a valid recovery session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setValidSession(true)
            } else {
                setError('Invalid or expired reset link. Please request a new one.')
            }
        })
    }, [supabase])

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
            const { error } = await supabase.auth.updateUser({
                password: password,
            })

            if (error) {
                setError(error.message)
                return
            }

            setSuccess(true)

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/auth/login')
            }, 3000)
        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <AuthForm
                title="Password updated"
                description="Your password has been successfully reset"
            >
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-success/20 p-3">
                            <CheckCircle2 className="h-12 w-12 text-success" />
                        </div>
                    </div>
                    <p className="text-muted-foreground">
                        Your password has been updated successfully.
                        You can now sign in with your new password.
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

    if (!validSession) {
        return (
            <AuthForm
                title="Invalid reset link"
                description="This password reset link is invalid or has expired"
            >
                <AuthError message={error} />
                <Link href="/auth/forgot-password">
                    <Button className="w-full rounded-full">
                        Request new reset link
                    </Button>
                </Link>
            </AuthForm>
        )
    }

    return (
        <AuthForm
            title="Set new password"
            description="Enter your new password below"
        >
            <AuthError message={error} />

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
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
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                    {loading ? 'Updating password...' : 'Update password'}
                </Button>
            </form>
        </AuthForm>
    )
}
