import { CheckoutProvider } from '@/api/checkout/CheckoutProvider'
import Checkout from '@/api/checkout/Checkout'
import { ModeToggle } from '@/components/landing/mode-toggle'

const CheckoutTest = () => {
    return (
        <CheckoutProvider>
            <ModeToggle />
            <Checkout />
        </CheckoutProvider>
    )
}

export default CheckoutTest