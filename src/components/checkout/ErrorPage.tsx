import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ErrorDetails {
    title: string
    message: string
    action: string
}

const errorTypes: { [key: string]: ErrorDetails } = {
    payment: {
        title: 'Payment Failed',
        message: 'We were unable to process your payment. Please check your payment details and try again.',
        action: 'Return to Checkout',
    },
    inventory: {
        title: 'Item Out of Stock',
        message: 'One or more items in your cart are no longer available. Please review your cart and try again.',
        action: 'Review Cart',
    },
    server: {
        title: 'Server Error',
        message: 'We\'re experiencing technical difficulties. Please try again later or contact customer support.',
        action: 'Return to Homepage',
    },
    default: {
        title: 'Oops! Something went wrong',
        message: 'An unexpected error occurred. Please try again or contact customer support if the problem persists.',
        action: 'Try Again',
    },
}

export default function ErrorPage() {
    const [errorDetails, setErrorDetails] = useState<ErrorDetails>(errorTypes.default)

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        const errorType = searchParams.get('errorType')
        if (errorType && errorType in errorTypes) {
            setErrorDetails(errorTypes[errorType as keyof typeof errorTypes])
        }
    }, [])

    const handleAction = () => {
        switch (errorDetails.action) {
            case 'Return to Checkout':
                window.location.href = '/checkout'
                break
            case 'Review Cart':
                window.location.href = '/cart'
                break
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