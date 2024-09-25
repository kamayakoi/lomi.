import { useState } from 'react'
import ContentSection from '../components/content-section'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusIcon, TrashIcon } from 'lucide-react'

interface BankAccount {
    id: string
    bankName: string
    accountNumber: string
    country: string
}

export default function BankAccounts() {
    const [accounts, setAccounts] = useState<BankAccount[]>([])
    const [newAccount, setNewAccount] = useState<Partial<BankAccount>>({})
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleAddAccount = () => {
        if (newAccount.bankName && newAccount.accountNumber && newAccount.country) {
            setAccounts([...accounts, { ...newAccount, id: Date.now().toString() } as BankAccount])
            setNewAccount({})
            setIsDialogOpen(false)
        }
    }

    const handleDeleteAccount = (id: string) => {
        setAccounts(accounts.filter(account => account.id !== id))
    }

    return (
        <ContentSection
            title="Bank Accounts"
            desc="Add or delete bank accounts for withdrawals"
        >
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Your bank accounts</h2>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" /> Add bank
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
                                            <SelectItem value="france">France</SelectItem>
                                            <SelectItem value="other-europe">Other European Country</SelectItem>
                                            <SelectItem value="other-west-africa">Other West African Country</SelectItem>
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
                                <Button type="submit">Add Bank Account</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {accounts.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground">You don&apos;t have any bank account yet!</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
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
                )}

                <p className="text-sm text-muted-foreground">
                    Contact help@lomi.africa if you need assistance with managing your bank accounts.
                </p>
            </div>
        </ContentSection>
    )
}
