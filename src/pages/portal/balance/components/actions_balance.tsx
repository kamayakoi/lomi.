import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Payout, payout_status, BankAccount } from './Balance_types'
import { Separator } from "@/components/ui/separator"
import { ArrowDownToLine, LifeBuoy } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchBankAccountDetails } from './support_balance'

type PayoutActionsProps = {
    payout: Payout | null
    isOpen: boolean
    onClose: () => void
}

export default function PayoutActions({ payout, isOpen, onClose }: PayoutActionsProps) {
    const [bankAccount, setBankAccount] = useState<BankAccount | null>(null)

    useEffect(() => {
        if (payout?.bank_account_id) {
            fetchBankAccountDetails(payout.bank_account_id).then(setBankAccount)
        }
    }, [payout?.bank_account_id])

    if (!payout) return null

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-2xl overflow-y-auto">
                <Card className="border-0 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Payout Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Payout Summary</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="font-medium">Payout ID:</div>
                                    <div>{payout.payout_id}</div>
                                    <div className="font-medium">Amount:</div>
                                    <div>{formatCurrency(payout.amount, payout.currency_code)}</div>
                                    <div className="font-medium">Status:</div>
                                    <div>{formatPayoutStatus(payout.status)}</div>
                                    <div className="font-medium">Date:</div>
                                    <div>{formatDate(payout.created_at)}</div>
                                </div>
                            </section>
                            <Separator />
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Payout Method</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {bankAccount?.account_number && (
                                        <>
                                            <div className="font-medium">Bank Account:</div>
                                            <div>{bankAccount.account_number}</div>
                                        </>
                                    )}
                                    {bankAccount?.bank_name && (
                                        <>
                                            <div className="font-medium">Bank Name:</div>
                                            <div>{bankAccount.bank_name}</div>
                                        </>
                                    )}
                                    {bankAccount?.bank_code && (
                                        <>
                                            <div className="font-medium">Bank Code:</div>
                                            <div>{bankAccount.bank_code}</div>
                                        </>
                                    )}
                                </div>
                            </section>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                        <Button variant="outline" className="w-full sm:w-auto">
                            <ArrowDownToLine className="mr-2 h-4 w-4" />
                            Download Receipt
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

function formatPayoutStatus(status: payout_status): string {
    switch (status) {
        case 'pending':
            return 'Pending'
        case 'processing':
            return 'Processing'
        case 'completed':
            return 'Completed'
        case 'failed':
            return 'Failed'
        default:
            return status
    }
}


function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
