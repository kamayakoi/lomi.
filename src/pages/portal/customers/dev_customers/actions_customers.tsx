import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Customer, Transaction } from './types'
import { Separator } from "@/components/ui/separator"
import { LifeBuoy, User, Mail, Phone, Globe, CalendarDays, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchTransactions, updateCustomer } from './support_customers.tsx'
import { cn } from '@/lib/actions/utils'
import { Input } from "@/components/ui/input"

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
        } catch (error) {
            console.error('Error updating customer type:', error)
        }
    }

    if (!customerData) return null

    const renderEditableField = (field: EditableField, icon: React.ReactNode, value: string) => {
        if (editingField === field) {
            return (
                <div className="flex items-center space-x-2">
                    {icon}
                    <div className="flex-1 flex items-center space-x-2">
                        <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-8 rounded-none"
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
                </div>
            )
        }

        return (
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => handleEdit(field)}>
                {icon}
                <span className="text-base group-hover:text-blue-500 transition-colors">{value}</span>
            </div>
        )
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                className="sm:max-w-2xl overflow-y-auto [&>button]:hidden"
            >
                <Card className="border-0 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Customer details</CardTitle>
                        <button
                            onClick={toggleBusinessStatus}
                            className={cn(
                                "px-3 py-1 text-xs font-medium transition-colors duration-200 cursor-pointer rounded-none",
                                customerData.is_business
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800"
                            )}
                        >
                            {customerData.is_business ? 'Business Customer' : 'Individual Customer'}
                        </button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                {renderEditableField('name', <User className="h-5 w-5 text-gray-400" />, customerData.name)}
                                {renderEditableField('email', <Mail className="h-5 w-5 text-gray-400" />, customerData.email)}
                                <div className="flex items-center space-x-3">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <span className="text-base">{customerData.phone_number}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Globe className="h-5 w-5 text-gray-400" />
                                    <span className="text-base">{customerData.country}</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center">
                                    Transactions
                                </h3>
                                {transactions.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">No transactions found for this customer.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {transactions.map((transaction) => (
                                            <div key={transaction.transaction_id}
                                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-none border border-gray-100 dark:border-gray-700">
                                                <div className="space-y-1">
                                                    <p className="font-medium">{transaction.description}</p>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <CalendarDays className="h-4 w-4 mr-1" />
                                                        {formatDate(transaction.created_at)}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">{formatCurrency(transaction.gross_amount, transaction.currency_code)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button variant="outline" className="w-full sm:w-auto rounded-none" onClick={handleContactSupport}>
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

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
