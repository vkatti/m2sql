'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface AuthErrorProps {
    message: string | null
}

export function AuthError({ message }: AuthErrorProps) {
    if (!message) return null

    return (
        <Alert variant="destructive" className="rounded-2xl bg-destructive/10 border-destructive/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    )
}
