import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Customer, Transaction } from './Customers_types'
import { Separator } from "@/components/ui/separator"
import { LifeBuoy, CalendarDays, Check, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchTransactions, updateCustomer } from './support_customers'
import { cn } from '@/lib/actions/utils'
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

type CustomerActionsProps = {
    customer: Customer | null
    isOpen: boolean
    onClose: () => void
    onUpdate: () => void
}

type EditableField = 'name' | 'email'

export default function CustomerActions({ customer, isOpen, onClose, onUpdate }: CustomerActionsProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [editingField, setEditingField] = useState<EditableField | null>(null)
    const [editValue, setEditValue] = useState('')
    const [customerData, setCustomerData] = useState<Customer | null>(null)

    useEffect(() => {
        setCustomerData(customer)
    }, [customer])

    const handleContactSupport = () => {
        const subject = encodeURIComponent(`[Support] — Customer Issue: ${customerData?.customer_id} (id)`)
        const mailtoLink = `mailto:hello@lomi.africa?subject=${subject}`
        window.location.href = mailtoLink
    }

    useEffect(() => {
        if (customerData?.customer_id) {
            fetchTransactions(customerData.customer_id).then(setTransactions)
        }
    }, [customerData?.customer_id])

    const handleEdit = (field: EditableField) => {
        setEditingField(field)
        setEditValue(customerData?.[field] || '')
    }

    const handleSave = async () => {
        if (!customerData || !editingField) return

        try {
            const updatedData = {
                ...customerData,
                [editingField]: editValue
            }
            await updateCustomer(customerData.customer_id, updatedData)
            setCustomerData(updatedData)
            setEditingField(null)
            onUpdate()
        } catch (error) {
            console.error('Error updating customer:', error)
        }
    }

    const handleCancel = () => {
        setEditingField(null)
    }

    const toggleBusinessStatus = async () => {
        if (!customerData) return

        try {
            const updatedData = {
                ...customerData,
                is_business: !customerData.is_business
            }
            await updateCustomer(customerData.customer_id, updatedData)
            setCustomerData(updatedData)
            onUpdate()
        } catch (error) {
            console.error('Error updating customer type:', error)
        }
    }

    if (!customerData) return null

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent
                    className="sm:max-w-2xl w-full p-0 overflow-y-auto rounded-none"
                >
                    <Card className="border-0 shadow-none rounded-none h-full">
                        <CardHeader className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-medium">Customer details</CardTitle>
                            <button onClick={onClose} className="text-muted-foreground hover:text-foreground md:hidden">
                                <X className="h-4 w-4" />
                            </button>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4 overflow-auto">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Customer ID</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(customerData.customer_id);
                                            toast({
                                                description: "Copied to clipboard",
                                            });
                                        }}
                                        className="font-mono text-xs text-blue-500 hover:text-blue-500"
                                    >
                                        {customerData.customer_id}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Type</span>
                                    <button
                                        onClick={toggleBusinessStatus}
                                        className={cn(
                                            "px-2 py-0.5 text-xs font-medium transition-colors duration-200",
                                            customerData.is_business
                                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                                : "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:hover:bg-amber-800"
                                        )}
                                    >
                                        {customerData.is_business ? 'Business Customer' : 'Individual Customer'}
                                    </button>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm text-muted-foreground block">Name</span>
                                        {editingField === 'name' ? (
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Input
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="h-8 rounded-none text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                                                    autoFocus
                                                    onBlur={handleSave}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleSave()
                                                        } else if (e.key === 'Escape') {
                                                            handleCancel()
                                                        }
                                                    }}
                                                />
                                                <button onClick={handleSave} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-none">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-sm font-medium line-clamp-1 cursor-pointer hover:text-blue-500 mt-1" onClick={() => handleEdit('name')}>
                                                {customerData.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <span className="text-sm text-muted-foreground block">Email</span>
                                        {editingField === 'email' ? (
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Input
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="h-8 rounded-none text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                                                    autoFocus
                                                    onBlur={handleSave}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleSave()
                                                        } else if (e.key === 'Escape') {
                                                            handleCancel()
                                                        }
                                                    }}
                                                />
                                                <button onClick={handleSave} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-none">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-sm line-clamp-1 cursor-pointer hover:text-blue-500 mt-1" onClick={() => handleEdit('email')}>
                                                {customerData.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <span className="text-sm text-muted-foreground block">Phone</span>
                                        <p className="text-sm mt-1">{customerData.phone_number}</p>
                                    </div>

                                    <div>
                                        <span className="text-sm text-muted-foreground block">Country</span>
                                        <p className="text-sm mt-1">{customerData.country}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">Transactions</h3>
                                    {transactions.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No transactions found for this customer.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {transactions.map((transaction) => (
                                                <div key={transaction.transaction_id}
                                                    className="border rounded-none p-2 space-y-1">
                                                    <div className="font-medium text-sm">{transaction.description}</div>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <div className="flex items-center">
                                                            <CalendarDays className="h-4 w-4 mr-1" />
                                                            {formatDate(transaction.created_at)}
                                                        </div>
                                                        <span>{formatCurrency(transaction.gross_amount, transaction.currency_code)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <Button variant="outline" className="w-full sm:w-auto rounded-none" onClick={handleContactSupport}>
                                    <LifeBuoy className="mr-2 h-4 w-4" />
                                    Contact Support
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </SheetContent>
            </Sheet>
            <Toaster />
        </>
    )
}

function formatCurrency(amount: number, currency: string): string {
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })} ${currency}`;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
