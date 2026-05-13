'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ReactNode } from 'react'

interface AuthFormProps {
    title: string
    description: string
    children: ReactNode
}

export function AuthForm({ title, description, children }: AuthFormProps) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 learning-bg">
            <Card className="w-full max-w-md glass-card rounded-2xl shadow-2xl border-border/40">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-3xl font-display font-semibold tracking-normal">
                        {title}
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {children}
                </CardContent>
            </Card>
        </div>
    )
}
