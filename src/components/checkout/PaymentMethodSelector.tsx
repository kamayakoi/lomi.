import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreditCard, Smartphone, Building, Apple } from 'lucide-react'
import { useCheckoutContext } from './useCheckoutContext'

interface PaymentMethod {
    id: string
    name: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    color: string
}

export default function PaymentMethodSelector() {
    const { selectedPaymentMethod, setSelectedPaymentMethod } = useCheckoutContext()
    const [paymentMethods] = useState<PaymentMethod[]>([
        {
            id: 'CREDIT_CARD',
            name: 'Credit Card',
            icon: CreditCard,
            color: 'bg-indigo-100 text-indigo-600',
        },
        {
            id: 'MOBILE_MONEY',
            name: 'Mobile Money',
            icon: Smartphone,
            color: 'bg-yellow-100 text-yellow-600',
        },
        {
            id: 'BANK_TRANSFER',
            name: 'Bank Transfer',
            icon: Building,
            color: 'bg-green-100 text-green-600',
        },
        {
            id: 'APPLE_PAY',
            name: 'Apple Pay',
            icon: Apple,
            color: 'bg-gray-100 text-gray-600',
        },
    ])

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={selectedPaymentMethod}
                    onValueChange={setSelectedPaymentMethod}
                    className="space-y-4"
                >
                    {paymentMethods.map((method) => (
                        <RadioGroupItem key={method.id} value={method.id} className="flex items-center space-x-3">
                            <div className={`p-2 rounded-md ${method.color}`}>
                                <method.icon className="h-6 w-6" />
                            </div>
                            <span>{method.name}</span>
                        </RadioGroupItem>
                    ))}
                </RadioGroup>
            </CardContent>
        </Card>
    )
}
