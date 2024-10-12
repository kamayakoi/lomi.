import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Transaction, transaction_status, transaction_type, provider_code, subscription_status } from './types'

type TransactionActionsProps = {
    transaction: Transaction | null
    isOpen: boolean
    onClose: () => void
}

export default function TransactionActions({ transaction, isOpen, onClose }: TransactionActionsProps) {
    if (!transaction) return null

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-[600px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Transaction Details</SheetTitle>
                    <SheetDescription>
                        View and manage transaction information
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4 text-sm">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p><strong>Transaction ID:</strong> {transaction.transaction_id}</p>
                                <p><strong>Amount:</strong> {formatCurrency(transaction.gross_amount, transaction.currency)}</p>
                                <p><strong>Status:</strong> {formatTransactionStatus(transaction.status)}</p>
                                <p><strong>Type:</strong> {formatTransactionType(transaction.type)}</p>
                                <p><strong>Date:</strong> {formatDate(transaction.date)}</p>
                                <p><strong>Provider:</strong> {formatProviderCode(transaction.provider_code)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p><strong>Name:</strong> {transaction.customer_name}</p>
                                {transaction.customer_email && <p><strong>Email:</strong> {transaction.customer_email}</p>}
                                {transaction.customer_phone && <p><strong>Phone:</strong> {transaction.customer_phone}</p>}
                                {transaction.customer_country && <p><strong>Country:</strong> {transaction.customer_country}</p>}
                                {transaction.customer_city && <p><strong>City:</strong> {transaction.customer_city}</p>}
                                {transaction.customer_address && <p><strong>Address:</strong> {transaction.customer_address}</p>}
                                {transaction.customer_postal_code && <p><strong>Postal Code:</strong> {transaction.customer_postal_code}</p>}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {transaction.product_id ? (
                                    <>
                                        <p><strong>Product Name:</strong> {transaction.product_name}</p>
                                        <p><strong>Description:</strong> {transaction.product_description}</p>
                                        <p><strong>Price:</strong> {formatCurrency(transaction.product_price || 0, transaction.currency)}</p>
                                    </>
                                ) : transaction.subscription_id ? (
                                    <>
                                        <p><strong>Subscription Status:</strong> {formatSubscriptionStatus(transaction.subscription_status)}</p>
                                        <p><strong>Start Date:</strong> {formatDate(transaction.subscription_start_date || '')}</p>
                                        <p><strong>End Date:</strong> {formatDate(transaction.subscription_end_date || '')}</p>
                                        <p><strong>Next Billing Date:</strong> {formatDate(transaction.subscription_next_billing_date || '')}</p>
                                        <p><strong>Billing Frequency:</strong> {transaction.subscription_billing_frequency}</p>
                                        <p><strong>Amount:</strong> {formatCurrency(transaction.subscription_amount || 0, transaction.currency)}</p>
                                    </>
                                ) : (
                                    <p>No product or subscription details available.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <SheetFooter>
                    <div className="flex flex-col space-y-2">
                        <Button variant="outline">Download Receipt</Button>
                        {transaction.status !== 'refunded' && (
                            <Button variant="destructive">Refund Transaction</Button>
                        )}
                        <Button>Contact Support</Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

// Add the necessary formatting functions here
function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

function formatTransactionStatus(status: transaction_status): string {
    return status.charAt(0).toUpperCase() + status.slice(1)
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
