import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusIcon } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from '@/utils/supabase/client'
import { useUser } from '@/lib/hooks/useUser'
import { BankAccount } from '@/pages/portal/settings/withdrawals/types'
import { countries } from '@/utils/data/onboarding'
import { cn } from '@/lib/actions/utils'

interface AddBankButtonProps {
    onAddAccount: (account: BankAccount) => Promise<void>
}

export function AddBankButton({ onAddAccount }: AddBankButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newAccount, setNewAccount] = useState<Partial<BankAccount>>({
        is_default: false
    })
    const [errors, setErrors] = useState<Partial<Record<keyof BankAccount, string>>>({})
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const { user } = useUser()
    const [selectedCountry, setSelectedCountry] = useState('')

    const validateForm = () => {
        const newErrors: Partial<Record<keyof BankAccount, string>> = {}
        if (!newAccount.country) newErrors.country = "Country is required"
        if (!newAccount.bank_name) newErrors.bank_name = "Bank name is required"
        if (!newAccount.account_number) newErrors.account_number = "Account number is required"
        else if (!/^\d{10,12}$/.test(newAccount.account_number)) newErrors.account_number = "Account number must be 10-12 digits"
        if (!newAccount.account_name) newErrors.account_name = "Account name is required"
        if (!newAccount.bank_code) newErrors.bank_code = "Bank code is required"
        if (!newAccount.branch_code) newErrors.branch_code = "Branch code is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleAddAccount = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm() && user) {
            setIsLoading(true)
            try {
                const { data, error } = await supabase.rpc('create_bank_account', {
                    p_account_number: newAccount.account_number,
                    p_account_name: newAccount.account_name,
                    p_bank_name: newAccount.bank_name,
                    p_bank_code: newAccount.bank_code,
                    p_branch_code: newAccount.branch_code,
                    p_country: selectedCountry,
                    p_is_default: newAccount.is_default
                })

                if (error) {
                    throw error
                }

                const createdAccount: BankAccount = {
                    ...newAccount as BankAccount,
                    id: data.bank_account_id,
                    is_valid: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }

                await onAddAccount(createdAccount)
                setNewAccount({ is_default: false })
                setIsDialogOpen(false)
                toast({
                    title: "Success",
                    description: "Bank account added successfully",
                })
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to add bank account. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon className="mr-2 h-4 w-4" /> Add bank account
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add a new bank account</DialogTitle>
                    <DialogDescription>
                        Enter the details of your bank account below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddAccount} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <select
                            id="country"
                            value={selectedCountry}
                            onChange={(e) => {
                                setSelectedCountry(e.target.value)
                                setNewAccount({ ...newAccount, country: e.target.value })
                            }}
                            className={cn(
                                "w-full mb-2 px-3 py-2 border rounded-md h-10",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                "appearance-none"
                            )}
                        >
                            <option value="">Select a country</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                        {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                            id="bankName"
                            value={newAccount.bank_name || ''}
                            onChange={(e) => setNewAccount({ ...newAccount, bank_name: e.target.value })}
                        />
                        {errors.bank_name && <p className="text-sm text-red-500">{errors.bank_name}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="bankCode">Bank Code</Label>
                        <Input
                            id="bankCode"
                            value={newAccount.bank_code || ''}
                            onChange={(e) => setNewAccount({ ...newAccount, bank_code: e.target.value })}
                        />
                        {errors.bank_code && <p className="text-sm text-red-500">{errors.bank_code}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="branchCode">Branch Code</Label>
                        <Input
                            id="branchCode"
                            value={newAccount.branch_code || ''}
                            onChange={(e) => setNewAccount({ ...newAccount, branch_code: e.target.value })}
                        />
                        {errors.branch_code && <p className="text-sm text-red-500">{errors.branch_code}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                            id="accountNumber"
                            value={newAccount.account_number || ''}
                            onChange={(e) => setNewAccount({ ...newAccount, account_number: e.target.value })}
                        />
                        {errors.account_number && <p className="text-sm text-red-500">{errors.account_number}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="accountName">Account Name</Label>
                        <Input
                            id="accountName"
                            value={newAccount.account_name || ''}
                            onChange={(e) => setNewAccount({ ...newAccount, account_name: e.target.value })}
                        />
                        {errors.account_name && <p className="text-sm text-red-500">{errors.account_name}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isDefault"
                            checked={newAccount.is_default}
                            onCheckedChange={(checked) => setNewAccount({ ...newAccount, is_default: checked as boolean })}
                        />
                        <Label htmlFor="isDefault">Set as default account</Label>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600" disabled={isLoading}>
                            {isLoading ? "Adding..." : "Add Account"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
