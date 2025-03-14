import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Payout, BankAccount } from './types'
import { Separator } from "@/components/ui/separator"
import { ArrowDownToLine, LifeBuoy, X, Copy } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchBankAccountDetails } from './support'
import { formatAmountForDisplay, formatPayoutStatus, formatDate } from '@/utils/currency-utils'
import { toast } from "@/lib/hooks/use-toast"

type PayoutActionsProps = {
    payout: Payout | null
    isOpen: boolean
    onClose: () => void
}

export default function PayoutActions({ payout, isOpen, onClose }: PayoutActionsProps) {
    const [bankAccount, setBankAccount] = useState<BankAccount | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    useEffect(() => {
        if (payout?.bank_account_id) {
            fetchBankAccountDetails(payout.bank_account_id).then(setBankAccount)
        }
    }, [payout?.bank_account_id])

    if (!payout) return null

    const handleDownloadReceipt = () => {
        setIsGenerating(true)
        // Simulate download delay
        setTimeout(() => {
            setIsGenerating(false)
            toast({
                description: "Receipt downloaded successfully",
            })
        }, 1000)
    }

    const handleContactSupport = () => {
        const subject = encodeURIComponent(`[Support] — Payout Issue: ${payout.payout_id}`)
        const mailtoLink = `mailto:hello@lomi.africa?subject=${subject}`
        window.location.href = mailtoLink
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-2xl w-full p-0 overflow-y-auto rounded-none">
                <Card className="border-0 shadow-none rounded-none h-full">
                    <CardHeader className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-medium">Payout Details</CardTitle>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground md:hidden">
                            <X className="h-4 w-4" />
                        </button>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4 overflow-auto">
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Payout ID</span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(payout.payout_id);
                                        toast({
                                            description: "Copied to clipboard",
                                        });
                                    }}
                                    className="font-mono text-xs text-blue-500 hover:text-blue-600 flex items-center"
                                >
                                    {payout.payout_id}
                                    <Copy className="ml-1 h-3 w-3" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <span className={`
                                    inline-block px-2 py-1 rounded-none text-xs font-normal
                                    ${payout.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                        payout.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}
                                `}>
                                    {formatPayoutStatus(payout.status)}
                                </span>
                            </div>

                            <Separator />

                            <div>
                                <span className="text-sm text-muted-foreground block">Amount</span>
                                <p className="text-sm font-medium mt-1">
                                    {payout.currency_code} {formatAmountForDisplay(payout.amount)}
                                </p>
                            </div>

                            <div>
                                <span className="text-sm text-muted-foreground block">Date</span>
                                <p className="text-sm mt-1">{formatDate(payout.created_at)}</p>
                            </div>

                            <Separator />

                            <section>
                                <h3 className="text-sm font-medium mb-2">Payment Method</h3>
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
                                    {!bankAccount && (
                                        <div className="col-span-2 text-muted-foreground">
                                            No bank account information available
                                        </div>
                                    )}
                                </div>
                            </section>

                            {payout.metadata && typeof payout.metadata === 'object' && 'notes' in payout.metadata && (
                                <>
                                    <Separator />
                                    <section>
                                        <h3 className="text-sm font-medium mb-2">Notes</h3>
                                        <p className="text-sm">{String(payout.metadata['notes'])}</p>
                                    </section>
                                </>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="border-t p-4 flex flex-col sm:flex-row justify-between gap-2">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto flex items-center space-x-2 rounded-none"
                            onClick={handleDownloadReceipt}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                                    <span>Download Receipt</span>
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto rounded-none"
                            onClick={handleContactSupport}
                        >
                            <LifeBuoy className="mr-2 h-4 w-4" />
                            Contact Support
                        </Button>
                    </CardFooter>
                </Card>
            </SheetContent>
        </Sheet>
    )
}
