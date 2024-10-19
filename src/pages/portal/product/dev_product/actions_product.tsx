import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Product, Transaction } from './types'
import { Separator } from "@/components/ui/separator"
import { ArrowDownToLine, LifeBuoy } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchProductTransactions } from './support_product'

type ProductActionsProps = {
    product: Product | null
    isOpen: boolean
    onClose: () => void
}

export default function ProductActions({ product, isOpen, onClose }: ProductActionsProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        if (product?.product_id) {
            fetchProductTransactions(product.product_id).then(setTransactions)
        }
    }, [product?.product_id])

    if (!product) return null

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-2xl overflow-y-auto">
                <Card className="border-0 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Product Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Product Information</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="font-medium">Name:</div>
                                    <div>{product.name}</div>
                                    <div className="font-medium">Description:</div>
                                    <div>{product.description}</div>
                                    <div className="font-medium">Price:</div>
                                    <div>{formatCurrency(product.price, product.currency_code)}</div>
                                    <div className="font-medium">Status:</div>
                                    <div>{product.is_active ? 'Active' : 'Inactive'}</div>
                                </div>
                            </section>
                            <Separator />
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Transactions</h3>
                                {transactions.length === 0 ? (
                                    <p className="text-sm text-gray-500">No transactions found for this product.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {transactions.map((transaction) => (
                                            <li key={transaction.transaction_id} className="border rounded p-2">
                                                <div className="font-medium">{transaction.description}</div>
                                                <div className="text-sm text-gray-500">{formatCurrency(transaction.gross_amount, transaction.currency_code)}</div>
                                                <div className="text-sm text-gray-500">{formatDate(transaction.created_at)}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                        <Button variant="outline" className="w-full sm:w-auto">
                            <ArrowDownToLine className="mr-2 h-4 w-4" />
                            Download Details
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <LifeBuoy className="mr-2 h-4 w-4" />
                            Contact Support
                        </Button>
                    </CardFooter>
                </Card>
            </SheetContent>
        </Sheet>
    )
}

function formatCurrency(amount: number, currency: string): string {
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })} ${currency}`;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
