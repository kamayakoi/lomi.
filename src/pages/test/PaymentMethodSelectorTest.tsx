import PaymentMethodSelector from '@/api/checkout/PaymentMethodSelector'
import { CheckoutProvider } from '@/api/checkout/CheckoutProvider'

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