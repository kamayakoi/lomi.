import Checkout from '@/components/checkout/Checkout'
import { CheckoutProvider } from '@/components/checkout/CheckoutProvider'

export default function CheckoutPage() {
    return (
        <CheckoutProvider>
            <Checkout />
        </CheckoutProvider>
    )
}
