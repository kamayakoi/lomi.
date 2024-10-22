import { useState } from 'react'
import { CheckoutContext } from './CheckoutContext'
import { Checkout } from './checkoutTypes'

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

    const initiateCheckout = async (checkoutData: Omit<Checkout, 'id'>) => {
        // Implement the initiateCheckout logic here
        // You can use the checkoutData to create a new checkout record
        // and initiate the payment process
        console.log('Initiating checkout with data:', checkoutData);
        // Add your implementation logic here
        throw new Error('initiateCheckout not implemented');
    }

    return (
        <CheckoutContext.Provider
            value={{
                selectedPaymentMethod,
                setSelectedPaymentMethod,
                customerDetails,
                setCustomerDetails,
                orderStatus,
                setOrderStatus,
                initiateCheckout,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    )
}
