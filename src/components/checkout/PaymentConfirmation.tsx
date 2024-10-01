import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { useCheckoutContext } from './useCheckoutContext'

export default function PaymentConfirmation() {
    const router = useRouter()
    const { customerDetails, setOrderStatus } = useCheckoutContext()

    useEffect(() => {
        setOrderStatus('success')
    }, [setOrderStatus])

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <CardTitle>Payment Successful</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-semibold mb-4">Thank you for your purchase, {customerDetails.firstName}!</p>
                    <p>Your order has been successfully processed and a confirmation email has been sent to {customerDetails.email}.</p>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={() => router.push('/')}>Return to Homepage</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
