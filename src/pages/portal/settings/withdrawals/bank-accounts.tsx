import { useState, useEffect, useCallback } from 'react'
import ContentSection from '@/components/portal/content-section'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon, ChevronRightIcon, CreditCard } from 'lucide-react'
import { AddBankButton } from '@/components/portal/add-bank-account'
import { supabase } from '@/utils/supabase/client'
import { useUser } from '@/lib/hooks/use-user'
import { BankAccount } from './types'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/lib/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BankAccounts() {
    const [accounts, setAccounts] = useState<BankAccount[]>([])
    const { user } = useUser()
    const [accountToDelete, setAccountToDelete] = useState<BankAccount | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isAutoWithdrawalDialogOpen, setIsAutoWithdrawalDialogOpen] = useState(false)
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
    const [withdrawalDay, setWithdrawalDay] = useState<number>(1)

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

    const handleDeleteAccount = async (account: BankAccount) => {
        if (account.is_default) {
            toast({
                title: "Warning",
                description: "You are about to delete your default bank account. This will affect auto-withdrawals.",
            })
        }
        setAccountToDelete(account)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!accountToDelete) return

        const { error } = await supabase.rpc('delete_bank_account', {
            p_bank_account_id: accountToDelete.id
        })

        if (error) {
            console.error('Error deleting bank account:', error)
            toast({
                title: "Error",
                description: "Failed to delete bank account. Please try again.",
                variant: "destructive",
            })
        } else {
            setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== accountToDelete.id))
            toast({
                title: "Success",
                description: "Bank account deleted successfully.",
            })
        }
        setIsDeleteDialogOpen(false)
        setAccountToDelete(null)
    }

    const handleSetDefault = async (account: BankAccount) => {
        if (account.is_default) return

        try {
            // Optimistically update UI
            const previousDefault = accounts.find(acc => acc.is_default);
            setAccounts(prevAccounts => prevAccounts.map(acc => ({
                ...acc,
                is_default: acc.id === account.id
            })))

            const { error } = await supabase.rpc('set_default_bank_account', {
                p_bank_account_id: account.id
            })

            if (error) {
                // Revert changes if there's an error
                setAccounts(prevAccounts => prevAccounts.map(acc => ({
                    ...acc,
                    is_default: acc.id === previousDefault?.id
                })))
                throw error
            }

            toast({
                title: "Success",
                description: "Default bank account updated successfully.",
            })
        } catch (error) {
            console.error('Error setting default bank account:', error)
            toast({
                title: "Error",
                description: "Failed to update default bank account. Please try again.",
                variant: "destructive",
            })
        }
    }

    const hasDefaultAccount = accounts.some(account => account.is_default)

    const handleAutoWithdrawalToggle = async (enabled: boolean) => {
        const defaultAccount = accounts.find(acc => acc.is_default)
        if (!defaultAccount) return

        try {
            const { error } = await supabase.rpc('update_auto_withdrawal_settings', {
                p_bank_account_id: defaultAccount.id,
                p_enabled: enabled,
                p_day: withdrawalDay
            })

            if (error) throw error

            setAccounts(prevAccounts => prevAccounts.map(acc => ({
                ...acc,
                auto_withdrawal_enabled: acc.is_default ? enabled : acc.auto_withdrawal_enabled,
                auto_withdrawal_day: acc.is_default ? withdrawalDay : acc.auto_withdrawal_day
            })))

            toast({
                title: "Success",
                description: `Auto-withdrawal ${enabled ? 'enabled' : 'disabled'} successfully.`,
            })
            setIsSettingsDialogOpen(false)
        } catch (error) {
            console.error('Error updating auto-withdrawal settings:', error)
            toast({
                title: "Error",
                description: "Failed to update auto-withdrawal settings. Please try again.",
                variant: "destructive",
            })
        }
    }

    const defaultAccount = accounts.find(acc => acc.is_default)
    const isAutoWithdrawalEnabled = defaultAccount?.auto_withdrawal_enabled || false

    return (
        <div style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: '100vh',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
        }}>
            <style>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <ContentSection
                title="Bank accounts"
                desc="Add or delete bank accounts for withdrawals."
            >
                <div className="space-y-6">
                    <Alert variant="info">
                        <AlertDescription>
                            You can add up to 3 bank accounts. Click on any account to set it as default for automatic withdrawals.
                        </AlertDescription>
                    </Alert>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">Your bank accounts</CardTitle>
                            <AddBankButton onAddAccount={handleAddAccount} disabled={accounts.length >= 3} hasDefaultAccount={hasDefaultAccount} />
                        </CardHeader>
                        <CardContent>
                            {accounts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                                        <CreditCard className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <p className="text-xl font-semibold text-gray-500 dark:text-gray-400 mt-4">
                                        No bank accounts yet
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center mt-2">
                                        Add a bank account to start receiving withdrawals.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {accounts.slice(0, 3).map(account => (
                                        <Card
                                            key={account.id}
                                            className={`rounded-none cursor-pointer transition-colors ${!account.is_default ? 'hover:bg-muted/50' : ''}`}
                                            onClick={() => handleSetDefault(account)}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-base font-medium">{account.bank_name}</p>
                                                            <button
                                                                className={`
                                                                    px-3 py-1 text-xs font-medium transition-colors duration-200
                                                                    ${account.is_default
                                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                                                        : 'bg-muted text-muted-foreground'
                                                                    }
                                                                `}
                                                            >
                                                                Default
                                                            </button>
                                                            {!account.is_valid && (
                                                                <button
                                                                    className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                                                >
                                                                    Pending verification
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{account.account_number}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDeleteAccount(account)
                                                        }}
                                                        className="h-8 w-8 p-0 rounded-none hover:bg-destructive/10"
                                                    >
                                                        <TrashIcon className="h-4 w-4 text-destructive hover:text-destructive" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </ContentSection>

            <div className="mt-6">
                <ContentSection
                    title="Auto-withdrawal"
                    desc="Configure and schedule your withdrawals"
                >
                    <Card className="rounded-none">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-medium">Auto-withdrawal</h2>
                                <Dialog open={isAutoWithdrawalDialogOpen} onOpenChange={setIsAutoWithdrawalDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="link" className="text-blue-600 hover:text-blue-600">
                                            Learn more <ChevronRightIcon className="ml-1 h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] rounded-none">
                                        <DialogHeader>
                                            <DialogTitle>Try automating your withdrawals!</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <img
                                                src="/autopayout.webp"
                                                alt="Auto-withdrawal illustration"
                                                className="w-full"
                                            />
                                            <DialogDescription>
                                                <ul className="list-disc pl-5 space-y-2">
                                                    <li>Schedule your withdrawals on a recurring basis: monthly, weekly, or daily. It&apos;s up to you!</li>
                                                    <li>Get a detailed withdrawal report directly through your email.</li>
                                                    <li>Only takes less than 3 mins to set up!</li>
                                                </ul>
                                            </DialogDescription>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <p className="text-muted-foreground mt-2">
                                {hasDefaultAccount
                                    ? isAutoWithdrawalEnabled
                                        ? `Auto-withdrawal is enabled for day ${defaultAccount?.auto_withdrawal_day} of each month.`
                                        : "Configure your auto-withdrawal settings."
                                    : "Add a bank account before setting Auto-withdrawal."}
                            </p>
                            <div className="mt-4">
                                <Button
                                    disabled={!hasDefaultAccount}
                                    className="rounded-none bg-blue-500 hover:bg-blue-600 text-white"
                                    onClick={() => {
                                        if (isAutoWithdrawalEnabled) {
                                            handleAutoWithdrawalToggle(false)
                                        } else {
                                            setWithdrawalDay(defaultAccount?.auto_withdrawal_day || 1)
                                            setIsSettingsDialogOpen(true)
                                        }
                                    }}
                                >
                                    {isAutoWithdrawalEnabled ? 'Disable' : 'Enable'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </ContentSection>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
                Contact <a href="mailto:help@lomi.africa" className="underline">help@lomi.africa</a> if you need assistance with managing your bank accounts.
            </p>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="rounded-none">
                    <DialogHeader>
                        <DialogTitle>Delete bank account</DialogTitle>
                        <DialogDescription>
                            {accountToDelete?.is_default ? (
                                <>
                                    <p className="text-red-500 mb-2 font-bold">You are about to delete your default bank account.</p>
                                    <p>This will disable auto-withdrawals and any scheduled payouts. Are you sure you want to proceed?</p>
                                </>
                            ) : (
                                "Are you sure you want to delete this bank account? This action cannot be undone."
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex space-x-2 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="rounded-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            className="rounded-none"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
                <DialogContent className="rounded-none sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Auto-withdrawal settings</DialogTitle>
                        <DialogDescription>
                            Choose a day between 1-30
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        <div className="space-y-2">
                            <Label>Payout day</Label>
                            <Input
                                type="number"
                                min={1}
                                max={30}
                                value={withdrawalDay}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value)
                                    if (value >= 1 && value <= 31) {
                                        setWithdrawalDay(value)
                                    }
                                }}
                                className="rounded-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                If the day doesn&apos;t exist in a month, withdrawal will occur on the last day of the month.
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsSettingsDialogOpen(false)}
                            className="rounded-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleAutoWithdrawalToggle(true)}
                            className="rounded-none bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            Enable auto-withdrawal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
