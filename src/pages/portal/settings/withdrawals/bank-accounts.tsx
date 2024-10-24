import { useState, useEffect, useCallback } from 'react'
import ContentSection from '@/components/dashboard/content-section'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon } from 'lucide-react'
import { AddBankButton } from '@/components/dashboard/add-bank-account'
import { supabase } from '@/utils/supabase/client'
import { useUser } from '@/lib/hooks/useUser'
import { BankAccount } from './types'
import BankAccountActions from './actions_bank_accounts'

export default function BankAccounts() {
    const [accounts, setAccounts] = useState<BankAccount[]>([])
    const { user } = useUser()
    const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null)
    const [isActionsOpen, setIsActionsOpen] = useState(false)

    const fetchBankAccounts = useCallback(async () => {
        if (user) {
            const { data, error } = await supabase.rpc('fetch_bank_accounts')

            if (error) {
                console.error('Error fetching bank accounts:', error)
            } else {
                setAccounts(data)
            }
        }
    }, [user])

    useEffect(() => {
        fetchBankAccounts()
    }, [fetchBankAccounts])

    const handleAddAccount = async (newAccount: BankAccount) => {
        setAccounts(prevAccounts => [...prevAccounts, newAccount])
    }

    const handleDeleteAccount = async (id: string) => {
        const { error } = await supabase.rpc('delete_bank_account', { p_bank_account_id: id })

        if (error) {
            console.error('Error deleting bank account:', error)
        } else {
            setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== id))
        }
    }

    const handleOpenActions = (bankAccount: BankAccount) => {
        setSelectedBankAccount(bankAccount)
        setIsActionsOpen(true)
    }

    return (
        <ContentSection
            title="Bank Accounts"
            desc="Add or delete bank accounts for withdrawals"
        >
            <div className="space-y-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Your bank accounts</CardTitle>
                        <AddBankButton onAddAccount={handleAddAccount} />
                    </CardHeader>
                    <CardContent>
                        {accounts.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">You don&apos;t have any bank account yet!</p>
                        ) : (
                            <div className="grid gap-2">
                                {accounts.slice(0, 3).map(account => (
                                    <Card key={account.id} className="p-4 cursor-pointer hover:bg-muted" onClick={() => handleOpenActions(account)}>
                                        <div className="flex items-center justify-between space-x-4">
                                            <div>
                                                <p className="text-base font-medium">{account.bank_name}</p>
                                                <p className="text-sm text-muted-foreground">{account.account_number}</p>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteAccount(account.id); }}>
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <p className="text-sm text-muted-foreground">
                    Contact help@lomi.africa if you need assistance with managing your bank accounts.
                </p>

                <BankAccountActions
                    bankAccount={selectedBankAccount}
                    isOpen={isActionsOpen}
                    onClose={() => setIsActionsOpen(false)}
                />
            </div>
        </ContentSection>
    )
}
