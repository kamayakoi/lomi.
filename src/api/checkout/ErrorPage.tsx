import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ErrorDetails {
    title: string
    message: string
    action: string
}

export default function ErrorPage() {
    const [errorDetails] = useState<ErrorDetails>({
        title: 'Oops! Something went wrong',
        message: 'An unexpected error occurred. Please try again or contact customer support if the problem persists.',
        action: 'Try Again',
    })

    const handleAction = () => {
        switch (errorDetails.action) {
            case 'Return to Homepage':
                window.location.href = '/'
                break
            default:
                window.location.reload()
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                        <CardTitle>{errorDetails.title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorDetails.message}</AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => window.location.href = '/'}>Return to Homepage</Button>
                    <Button onClick={handleAction}>{errorDetails.action}</Button>
                </CardFooter>
            </Card>
        </div>
    )
}