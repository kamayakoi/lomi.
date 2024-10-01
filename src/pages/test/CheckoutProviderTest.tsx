import { CheckoutProvider } from '@/components/checkout/CheckoutProvider'
import Checkout from '@/components/checkout/Checkout'

const CheckoutProviderTest = () => {
    return (
        <CheckoutProvider>
            <div className="p-4">
                <Checkout />
            </div>
        </CheckoutProvider>
    )
}

export default CheckoutProviderTest