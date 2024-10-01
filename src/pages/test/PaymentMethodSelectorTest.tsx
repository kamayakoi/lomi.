import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector'
import { CheckoutProvider } from '@/components/checkout/CheckoutProvider'

const PaymentMethodSelectorTest = () => {
    return (
        <CheckoutProvider>
            <div className="p-4">
                <PaymentMethodSelector />
            </div>
        </CheckoutProvider>
    )
}

export default PaymentMethodSelectorTest