import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { BankAccount } from './Withdrawal_types'
import { LifeBuoy } from 'lucide-react'

type BankAccountActionsProps = {
    bankAccount: BankAccount | null
    isOpen: boolean
    onClose: () => void
}

export default function BankAccountActions({ bankAccount, isOpen, onClose }: BankAccountActionsProps) {
    if (!bankAccount) return null

    const handleContactSupport = () => {
        const subject = encodeURIComponent(`[Support] — Bank Account Issue: ${bankAccount.id}`)
        const mailtoLink = `mailto:hello@lomi.africa?subject=${subject}`
        window.location.href = mailtoLink
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-2xl overflow-y-auto">
                <Card className="border-0 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Bank Account Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="font-medium">Bank Name:</div>
                                    <div>{bankAccount.bank_name}</div>
                                    <div className="font-medium">Account Number:</div>
                                    <div>{bankAccount.account_number}</div>
                                    <div className="font-medium">Account Name:</div>
                                    <div>{bankAccount.account_name}</div>
                                    <div className="font-medium">Bank Code:</div>
                                    <div>{bankAccount.bank_code}</div>
                                    <div className="font-medium">Branch Code:</div>
                                    <div>{bankAccount.branch_code}</div>
                                    <div className="font-medium">Country:</div>
                                    <div>{bankAccount.country}</div>
                                    <div className="font-medium">Default Account:</div>
                                    <div>{bankAccount.is_default ? 'Yes' : 'No'}</div>
                                    <div className="font-medium">Account Verified:</div>
                                    <div>{bankAccount.is_valid ? 'Yes' : 'No'}</div>
                                </div>
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
