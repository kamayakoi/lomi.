import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Customer, Transaction } from './types'
import { Separator } from "@/components/ui/separator"
import { LifeBuoy } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchTransactions } from './support_customers.tsx'

type CustomerActionsProps = {
    customer: Customer | null
    isOpen: boolean
    onClose: () => void
}

export default function CustomerActions({ customer, isOpen, onClose }: CustomerActionsProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])


    const handleContactSupport = () => {
        const subject = encodeURIComponent(`[Support] — Customer Issue: ${customer?.customer_id} (id)`)
        const mailtoLink = `mailto:hello@lomi.africa?subject=${subject}`
        window.location.href = mailtoLink
    }


    useEffect(() => {
        if (customer?.customer_id) {
            fetchTransactions(customer.customer_id).then(setTransactions)
        }
    }, [customer?.customer_id])

    if (!customer) return null

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-2xl overflow-y-auto">
                <Card className="border-0 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="font-medium">Name:</div>
                                    <div>{customer.name}</div>
                                    <div className="font-medium">Email:</div>
                                    <div>{customer.email}</div>
                                    <div className="font-medium">Phone:</div>
                                    <div>{customer.phone_number}</div>
                                    <div className="font-medium">Country:</div>
                                    <div>{customer.country}</div>
                                    <div className="font-medium">Type:</div>
                                    <div>{customer.is_business ? 'Business' : 'Individual'}</div>
                                </div>
                            </section>
                            <Separator />
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Transactions</h3>
                                {transactions.length === 0 ? (
                                    <p className="text-sm text-gray-500">No transactions found for this customer.</p>
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
                    <CardFooter className="flex justify-end">
                        <Button variant="outline" className="w-full sm:w-auto" onClick={handleContactSupport}>
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
