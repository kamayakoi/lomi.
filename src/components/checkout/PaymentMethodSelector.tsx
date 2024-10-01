import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreditCard, Smartphone, Building, Apple } from 'lucide-react'
import { useCheckoutContext } from './useCheckoutContext'
import { supabase } from '@/utils/supabase/client'

interface PaymentMethod {
    id: string
    name: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    color: string
}

export default function PaymentMethodSelector() {
    const { selectedPaymentMethod, setSelectedPaymentMethod } = useCheckoutContext()
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])

    useEffect(() => {
        fetchPaymentMethods()
    },)

    const fetchPaymentMethods = async () => {
        try {
            const { data, error } = await supabase
                .from('payment_methods')
                .select('payment_method_code, provider_code')

            if (error) {
                console.error('Error fetching payment methods:', error)
                return
            }

            const methods: PaymentMethod[] = data.map((method) => ({
                id: method.payment_method_code,
                name: getPaymentMethodName(method.payment_method_code),
                icon: getPaymentMethodIcon(method.payment_method_code),
                color: getPaymentMethodColor(method.payment_method_code),
            }))

            setPaymentMethods(methods)
        } catch (error) {
            console.error('Error fetching payment methods:', error)
        }
    }

    const getPaymentMethodName = (code: string) => {
        switch (code) {
            case 'CREDIT_CARD':
            case 'DEBIT_CARD':
                return 'Card'
            case 'MOBILE_MONEY':
                return 'Mobile Money'
            case 'BANK_TRANSFER':
                return 'Bank Transfer'
            case 'APPLE_PAY':
                return 'Apple Pay'
            default:
                return code
        }
    }

    const getPaymentMethodIcon = (code: string): React.ComponentType<React.SVGProps<SVGSVGElement>> => {
        switch (code) {
            case 'CREDIT_CARD':
            case 'DEBIT_CARD':
                return CreditCard
            case 'MOBILE_MONEY':
                return Smartphone
            case 'BANK_TRANSFER':
                return Building
            case 'APPLE_PAY':
                return Apple
            default:
                return CreditCard // Return a default icon instead of null
        }
    }

    const getPaymentMethodColor = (code: string) => {
        switch (code) {
            case 'CREDIT_CARD':
            case 'DEBIT_CARD':
                return 'bg-indigo-100 text-indigo-600'
            case 'MOBILE_MONEY':
                return 'bg-yellow-100 text-yellow-600'
            case 'BANK_TRANSFER':
                return 'bg-green-100 text-green-600'
            case 'APPLE_PAY':
                return 'bg-gray-100 text-gray-600'
            default:
                return 'bg-blue-100 text-blue-600'
        }
    }

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
