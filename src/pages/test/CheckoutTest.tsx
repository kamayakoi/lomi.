import { CheckoutProvider } from '@/components/checkout/CheckoutProvider'
import Checkout from '@/components/checkout/Checkout'
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