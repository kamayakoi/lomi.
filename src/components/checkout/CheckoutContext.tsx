import { createContext } from 'react'

interface CheckoutContextProps {
    selectedPaymentMethod: string
    setSelectedPaymentMethod: (method: string) => void
    customerDetails: {
        firstName: string
        lastName: string
        email: string
        phone: string
        address: string
        city: string
        state: string
        zipCode: string
        country: string
    }
    setCustomerDetails: (details: CheckoutContextProps['customerDetails']) => void
    orderStatus: 'idle' | 'processing' | 'success' | 'failure'
    setOrderStatus: (status: CheckoutContextProps['orderStatus']) => void
}

export const CheckoutContext = createContext<CheckoutContextProps | undefined>(undefined)
