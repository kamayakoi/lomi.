import { CheckoutProvider } from '@/components/checkout/CheckoutProvider'
import Checkout from '@/components/checkout/Checkout'

const CheckoutTest = () => {
    return (
        <CheckoutProvider>
            <Checkout />
        </CheckoutProvider>
    )
}

export default CheckoutTest