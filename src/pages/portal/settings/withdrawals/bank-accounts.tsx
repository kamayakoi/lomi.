import { useState } from 'react'
import ContentSection from '@/components/dashboard/content-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { AddBankButton } from '@/components/dashboard/add-bank-account'

interface BankAccount {
    id: string
    bankName: string
    accountNumber: string
    country: string
}

export default function BankAccounts() {
    const [accounts, setAccounts] = useState<BankAccount[]>([])

    const handleAddAccount = (newAccount: BankAccount) => {
        setAccounts([...accounts, newAccount])
    }

    const handleDeleteAccount = (id: string) => {
        setAccounts(accounts.filter(account => account.id !== id))
    }

    return (
        <ContentSection
            title="Bank Accounts"
            desc="Add or delete bank accounts for withdrawals"
        >
            <div>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Your bank accounts</CardTitle>
                        <AddBankButton onAddAccount={handleAddAccount} />
                    </CardHeader>
                    <CardContent>
                        {accounts.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">You don&apos;t have any bank account yet!</p>
                        ) : (
                            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                                <div className="grid gap-4">
                                    {accounts.map(account => (
                                        <Card key={account.id}>
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium">{account.bankName}</CardTitle>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteAccount(account.id)}>
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription>{account.accountNumber}</CardDescription>
                                                <p className="text-xs text-muted-foreground mt-1">{account.country}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>

                <p className="text-sm text-muted-foreground mt-4">
                    Contact help@lomi.africa if you need assistance with managing your bank accounts.
                </p>
            </div>
        </ContentSection>
    )
}
