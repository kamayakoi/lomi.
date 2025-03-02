import { createContext } from 'react'
import { Checkout } from './types'

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
    initiateCheckout: (checkoutData: Omit<Checkout, 'id'>) => Promise<Checkout>
}

export const CheckoutContext = createContext<CheckoutContextProps>({
    selectedPaymentMethod: '',
    setSelectedPaymentMethod: (method: string) => {
        console.warn('setSelectedPaymentMethod not implemented', method);
    },
    customerDetails: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    },
    setCustomerDetails: (details: CheckoutContextProps['customerDetails']) => {
        console.warn('setCustomerDetails not implemented', details);
    },
    orderStatus: 'idle',
    setOrderStatus: (status: CheckoutContextProps['orderStatus']) => {
        console.warn('setOrderStatus not implemented', status);
    },
    initiateCheckout: async () => {
        throw new Error('initiateCheckout not implemented');
    },
})
