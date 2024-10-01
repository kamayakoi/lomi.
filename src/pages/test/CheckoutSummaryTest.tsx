import { CheckoutSummary } from '@/components/checkout/CheckoutSummary'

const products = [
    { id: '1', name: 'Product 1', price: 10, quantity: 2 },
    { id: '2', name: 'Product 2', price: 15, quantity: 1 },
    { id: '3', name: 'Product 3', price: 20, quantity: 3 },
]

const CheckoutSummaryTest = () => {
    return (
        <div className="p-4">
            <CheckoutSummary
                products={products}
                subtotal={95}
                tax={8.55}
                shipping={5}
                total={108.55}
            />
        </div>
    )
}

export default CheckoutSummaryTest
