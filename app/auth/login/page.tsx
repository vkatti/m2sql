'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { AuthForm } from '../components/auth-form'
import { AuthError } from '../components/auth-error'
import { OAuthButtons } from '../components/oauth-buttons'
import { Checkbox } from '@/components/ui/checkbox'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                if (error.message.includes('Email not confirmed')) {
                    setError('Please verify your email address before logging in.')
                } else if (error.message.includes('Invalid login credentials')) {
                    setError('Invalid email or password. Please try again.')
                } else {
                    setError(error.message)
                }
                return
            }

            if (data.session) {
                router.push('/')
                router.refresh()
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthForm
            title="Welcome back"
            description="Sign in to your account to continue translating"
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
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            href="/auth/forgot-password"
                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="rounded-2xl bg-card/50 backdrop-blur-sm focus:ring-primary/40"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label
                        htmlFor="remember"
                        className="text-sm font-normal cursor-pointer"
                    >
                        Remember me
                    </Label>
                </div>

                <Button
                    type="submit"
                    className="w-full rounded-full hover:scale-105 transition-transform"
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign in'}
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
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-primary hover:text-primary/80 transition-colors font-medium">
                    Sign up
                </Link>
            </p>
        </AuthForm>
    )
}
