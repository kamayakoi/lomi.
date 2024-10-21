import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusIcon } from 'lucide-react'

interface BankAccount {
    id: string
    bankName: string
    accountNumber: string
    country: string
}

interface AddBankButtonProps {
    onAddAccount: (account: BankAccount) => void
}

export function AddBankButton({ onAddAccount }: AddBankButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newAccount, setNewAccount] = useState<Partial<BankAccount>>({})

    const handleAddAccount = () => {
        if (newAccount.bankName && newAccount.accountNumber && newAccount.country) {
            onAddAccount({ ...newAccount, id: Date.now().toString() } as BankAccount)
            setNewAccount({})
            setIsDialogOpen(false)
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon className="mr-2 h-4 w-4" /> Add bank account
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new bank account</DialogTitle>
                    <DialogDescription>
                        Enter the details of your bank account below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); handleAddAccount(); }} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="country">Country</Label>
                        <Select onValueChange={(value) => setNewAccount({ ...newAccount, country: value })}>
                            <SelectTrigger id="country">
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cote-divoire">Côte d&apos;Ivoire</SelectItem>
                                <SelectItem value="ghana">Ghana</SelectItem>
                                <SelectItem value="senegal">Senegal</SelectItem>
                                <SelectItem value="other-europe">European Country</SelectItem>
                                <SelectItem value="other-west-africa">West African Country</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                            id="bankName"
                            value={newAccount.bankName || ''}
                            onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                            id="accountNumber"
                            value={newAccount.accountNumber || ''}
                            onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600">Add</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}