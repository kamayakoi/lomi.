import { useState } from 'react'
import { CheckoutContext } from './CheckoutContext'

export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
    const [customerDetails, setCustomerDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    })
    const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success' | 'failure'>('idle')

    return (
        <CheckoutContext.Provider
            value={{
                selectedPaymentMethod,
                setSelectedPaymentMethod,
                customerDetails,
                setCustomerDetails,
                orderStatus,
                setOrderStatus,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    )
}