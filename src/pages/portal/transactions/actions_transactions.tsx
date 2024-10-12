import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Transaction, transaction_status, transaction_type, provider_code } from './types'

type TransactionActionsProps = {
    transaction: Transaction | null
    isOpen: boolean
    onClose: () => void
}

export default function TransactionActions({ transaction, isOpen, onClose }: TransactionActionsProps) {
    if (!transaction) return null

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-[480px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Transaction Details</SheetTitle>
                    <SheetDescription>
                        View and manage transaction information
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
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
                                <p><strong>Name:</strong> {transaction.customer}</p>
                                {/* Add more customer details */}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {/* Add product details */}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <SheetFooter>
                    <div className="flex flex-col space-y-2">
                        <Button>Download Receipt</Button>
                        <Button variant="outline">Contact Support</Button>
                        {transaction.status !== 'refunded' && (
                            <Button variant="destructive">Refund Transaction</Button>
                        )}
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

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
