import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Transaction, transaction_status, transaction_type, provider_code, subscription_status } from './types'
import { ArrowDownToLine, RefreshCcw, LifeBuoy } from "lucide-react"
import { Separator } from "@/components/ui/separator"

type TransactionActionsProps = {
    transaction: Transaction | null
    isOpen: boolean
    onClose: () => void
}

export default function TransactionActions({ transaction, isOpen, onClose }: TransactionActionsProps) {
    if (!transaction) return null

    const canRefund = transaction.status !== 'failed' && transaction.status !== 'refunded' && transaction.status !== 'pending'

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-2xl overflow-y-auto">
                <Card className="border-0 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Transaction Summary</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="font-medium">Transaction ID:</div>
                                    <div>{transaction.transaction_id}</div>
                                    <div className="font-medium">Amount:</div>
                                    <div>{formatCurrency(transaction.gross_amount, transaction.currency)}</div>
                                    <div className="font-medium">Status:</div>
                                    <div>{formatTransactionStatus(transaction.status)}</div>
                                    <div className="font-medium">Type:</div>
                                    <div>{formatTransactionType(transaction.type)}</div>
                                    <div className="font-medium">Date:</div>
                                    <div>{formatDate(transaction.date)}</div>
                                    <div className="font-medium">Provider:</div>
                                    <div>{formatProviderCode(transaction.provider_code)}</div>
                                </div>
                            </section>
                            <Separator />
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="font-medium">Name:</div>
                                    <div>{transaction.customer_name}</div>
                                    {transaction.customer_email && (
                                        <>
                                            <div className="font-medium">Email:</div>
                                            <div>{transaction.customer_email}</div>
                                        </>
                                    )}
                                    {transaction.customer_phone && (
                                        <>
                                            <div className="font-medium">Phone:</div>
                                            <div>{transaction.customer_phone}</div>
                                        </>
                                    )}
                                    {transaction.customer_country && (
                                        <>
                                            <div className="font-medium">Country:</div>
                                            <div>{transaction.customer_country}</div>
                                        </>
                                    )}
                                </div>
                            </section>
                            {(transaction.product_id || transaction.subscription_id) && (
                                <>
                                    <Separator />
                                    <section>
                                        <h3 className="text-lg font-semibold mb-2">Details</h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            {transaction.product_id && (
                                                <>
                                                    <div className="font-medium">Product Name:</div>
                                                    <div>{transaction.product_name}</div>
                                                    <div className="font-medium">Description:</div>
                                                    <div>{transaction.product_description}</div>
                                                    <div className="font-medium">Price:</div>
                                                    <div>{formatCurrency(transaction.product_price || 0, transaction.currency)}</div>
                                                </>
                                            )}
                                            {transaction.subscription_id && (
                                                <>
                                                    <div className="font-medium">Subscription Name:</div>
                                                    <div>{transaction.subscription_name || 'N/A'}</div>
                                                    <div className="font-medium">Description:</div>
                                                    <div>{transaction.subscription_description || 'N/A'}</div>
                                                    <div className="font-medium">Subscription Status:</div>
                                                    <div>{formatSubscriptionStatus(transaction.subscription_status)}</div>
                                                    <div className="font-medium">Start Date:</div>
                                                    <div>{formatDate(transaction.subscription_start_date || '')}</div>
                                                    <div className="font-medium">End Date:</div>
                                                    <div>{formatDate(transaction.subscription_end_date || '')}</div>
                                                    <div className="font-medium">Next Billing Date:</div>
                                                    <div>{formatDate(transaction.subscription_next_billing_date || '')}</div>
                                                    <div className="font-medium">Billing Frequency:</div>
                                                    <div>{transaction.subscription_billing_frequency}</div>
                                                    <div className="font-medium">Amount:</div>
                                                    <div>{formatCurrency(transaction.subscription_amount || 0, transaction.currency)}</div>
                                                </>
                                            )}
                                        </div>
                                    </section>
                                </>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                        <Button variant="outline" className="w-full sm:w-auto">
                            <ArrowDownToLine className="mr-2 h-4 w-4" />
                            Download Receipt
                        </Button>
                        {canRefund && (
                            <Button variant="outline" className="w-full sm:w-auto">
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Refund Transaction
                            </Button>
                        )}
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

function formatTransactionStatus(status: transaction_status): string {
    switch (status) {
        case 'pending':
            return 'Pending'
        case 'completed':
            return 'Completed'
        case 'failed':
            return 'Failed'
        case 'refunded':
            return 'Refunded'
        default:
            return status
    }
}

function formatTransactionType(type: transaction_type): string {
    return type.charAt(0).toUpperCase() + type.slice(1)
}

function formatProviderCode(providerCode: provider_code): string {
    switch (providerCode) {
        case 'ORANGE':
            return 'Orange'
        case 'WAVE':
            return 'Wave'
        case 'ECOBANK':
            return 'Ecobank'
        case 'MTN':
            return 'MTN'
        case 'STRIPE':
            return 'Stripe'
        case 'OTHER':
            return 'Other'
        default:
            return providerCode
    }
}

function formatSubscriptionStatus(status: subscription_status | undefined): string {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : ''
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
