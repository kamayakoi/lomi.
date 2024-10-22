import { useContext } from 'react'
import { CheckoutContext } from './CheckoutContext'
import { Checkout } from './checkoutTypes'

export const useCheckoutContext = () => {
    const context = useContext(CheckoutContext)
    if (!context) {
        throw new Error('useCheckoutContext must be used within a CheckoutProvider')
    }

    const initiateCheckout = async (checkoutData: Omit<Checkout, 'id'>) => {
        try {
            const checkout = await context.initiateCheckout(checkoutData);
            return checkout;
        } catch (error) {
            console.error('Error initiating checkout:', error);
            throw error;
        }
    };

    return {
        ...context,
        initiateCheckout,
    }
}
