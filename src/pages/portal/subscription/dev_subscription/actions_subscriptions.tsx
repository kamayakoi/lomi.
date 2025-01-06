import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Subscription, Transaction, SubscriptionPlan, frequencyColors } from './types'
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { LifeBuoy, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { fetchSubscriptionTransactions, updateSubscriptionPlan } from './support_subscriptions'
import { cn } from '@/lib/actions/utils'
import { ImageIcon } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

type SubscriptionActionsProps = {
    subscription?: Subscription | null
    plan?: SubscriptionPlan | null
    isOpen: boolean
    onClose: () => void
    onUpdate?: () => void
}

export default function SubscriptionActions({ subscription, plan, isOpen, onClose, onUpdate }: SubscriptionActionsProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isEditingName, setIsEditingName] = useState(false)
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [editedName, setEditedName] = useState('')
    const [editedDescription, setEditedDescription] = useState('')
    const nameInputRef = useRef<HTMLInputElement>(null)
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (subscription?.subscription_id) {
            fetchSubscriptionTransactions(subscription.subscription_id).then(setTransactions)
        }
        if (plan) {
            setEditedName(plan.name || '')
            setEditedDescription(plan.description || '')
        }
    }, [subscription?.subscription_id, plan])

    const handleNameChange = async (newName: string) => {
        if (!plan) return
        setEditedName(newName)
        // Update plan immediately in UI
        plan.name = newName
        try {
            await updateSubscriptionPlan(plan.plan_id, {
                ...plan,
                name: newName
            })
            onUpdate?.()
        } catch (error) {
            console.error('Failed to update plan name:', error)
            setEditedName(plan.name || '')
            // Revert plan name on error
            plan.name = editedName
        }
    }

    const handleDescriptionChange = async (newDescription: string) => {
        if (!plan) return
        setEditedDescription(newDescription)
        // Update plan immediately in UI
        plan.description = newDescription
        try {
            await updateSubscriptionPlan(plan.plan_id, {
                ...plan,
                description: newDescription
            })
            onUpdate?.()
        } catch (error) {
            console.error('Failed to update plan description:', error)
            setEditedDescription(plan.description || '')
            // Revert plan description on error
            plan.description = editedDescription
        }
    }

    const handleToggleActive = async () => {
        if (!plan) return
        const newValue = !plan.is_active
        // Update UI immediately
        plan.is_active = newValue
        // Force re-render
        setTransactions([...transactions])

        try {
            await updateSubscriptionPlan(plan.plan_id, {
                name: plan.name,
                description: plan.description,
                billing_frequency: plan.billing_frequency,
                amount: plan.amount,
                failed_payment_action: plan.failed_payment_action,
                charge_day: plan.charge_day,
                metadata: plan.metadata,
                display_on_storefront: plan.display_on_storefront,
                image_url: plan.image_url
            })
            onUpdate?.()
        } catch (error) {
            // Revert on error
            plan.is_active = !newValue
            setTransactions([...transactions])
            console.error('Failed to toggle active status:', error)
        }
    }

    useEffect(() => {
        if (isEditingName && nameInputRef.current) {
            nameInputRef.current.focus()
        }
    }, [isEditingName])

    const handleStartEditingName = () => {
        setIsEditingName(true)
    }

    const handleStartEditingDescription = () => {
        setIsEditingDescription(true)
    }

    if (!subscription && !plan) return null

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="sm:max-w-2xl w-full p-0 overflow-y-auto rounded-none">
                    <Card className="border-0 shadow-none rounded-none h-full">
                        <CardHeader className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-medium">
                                {subscription ? 'Subscription details' : 'Plan details'}
                            </CardTitle>
                            <button onClick={onClose} className="text-muted-foreground hover:text-foreground md:hidden">
                                <X className="h-4 w-4" />
                            </button>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4 overflow-auto">
                            <div className="space-y-3 text-sm">
                                {plan && (
                                    <>
                                        <div className="flex gap-4">
                                            {plan.image_url ? (
                                                <div className="flex-shrink-0 self-stretch min-h-[140px] w-[140px]">
                                                    <img
                                                        src={plan.image_url}
                                                        alt={plan.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex-shrink-0 self-stretch min-h-[140px] w-[140px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                                    <ImageIcon className="h-12 w-12 text-gray-400" />
                                                </div>
                                            )}

                                            <div className="flex-grow min-h-[140px] flex flex-col">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-muted-foreground">Status</span>
                                                    <button
                                                        onClick={handleToggleActive}
                                                        className={cn(
                                                            "px-2 py-0.5 text-xs font-medium transition-colors duration-200",
                                                            plan.is_active
                                                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-800"
                                                                : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                                                        )}
                                                    >
                                                        {plan.is_active ? 'Active' : 'Inactive'}
                                                    </button>
                                                </div>

                                                <div className="space-y-2">
                                                    <div>
                                                        <span className="text-sm text-muted-foreground block">Name</span>
                                                        {isEditingName ? (
                                                            <input
                                                                ref={nameInputRef}
                                                                value={editedName}
                                                                onChange={(e) => handleNameChange(e.target.value)}
                                                                className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Escape') {
                                                                        setIsEditingName(false)
                                                                        setEditedName(plan.name || '')
                                                                    }
                                                                }}
                                                                onBlur={() => setIsEditingName(false)}
                                                            />
                                                        ) : (
                                                            <p
                                                                className="text-sm font-medium line-clamp-1 cursor-pointer hover:text-blue-500"
                                                                onClick={handleStartEditingName}
                                                            >
                                                                {plan.name}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <span className="text-sm text-muted-foreground block">Description</span>
                                                        {isEditingDescription ? (
                                                            <textarea
                                                                ref={descriptionInputRef}
                                                                value={editedDescription}
                                                                onChange={(e) => handleDescriptionChange(e.target.value)}
                                                                className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full resize-none"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Escape') {
                                                                        setIsEditingDescription(false)
                                                                        setEditedDescription(plan.description || '')
                                                                    }
                                                                }}
                                                                onBlur={() => setIsEditingDescription(false)}
                                                                rows={2}
                                                            />
                                                        ) : (
                                                            <p
                                                                className="text-sm line-clamp-2 cursor-pointer hover:text-blue-500"
                                                                onClick={handleStartEditingDescription}
                                                            >
                                                                {plan.description || 'Add a description...'}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Plan ID</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(plan.plan_id);
                                                    toast({
                                                        description: "Copied to clipboard",
                                                        duration: 1000
                                                    });
                                                }}
                                                className="font-mono text-xs text-blue-500 hover:text-blue-500"
                                            >
                                                {plan.plan_id}
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Amount</span>
                                            <span>{formatCurrency(plan.amount, plan.currency_code)}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Billing Frequency</span>
                                            <span className={cn(
                                                "px-2 py-0.5 text-xs font-medium pointer-events-none",
                                                frequencyColors[plan.billing_frequency]
                                            )}>
                                                {formatBillingFrequency(plan.billing_frequency)}
                                            </span>
                                        </div>

                                        {plan.failed_payment_action && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">Failed Payment Action</span>
                                                <span className="capitalize">{formatFailedPaymentAction(plan.failed_payment_action)}</span>
                                            </div>
                                        )}

                                        {plan.charge_day && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">Collection Day</span>
                                                <span>Day {plan.charge_day}</span>
                                            </div>
                                        )}
                                    </>
                                )}

                                {subscription && (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Status</span>
                                            <Badge variant="secondary" className={cn(
                                                "rounded-none px-2 py-0.5 text-xs font-normal",
                                                subscription.status === 'active' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300" :
                                                    subscription.status === 'pending' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                                                        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                            )}>
                                                {formatSubscriptionStatus(subscription.status)}
                                            </Badge>
                                        </div>

                                        <div>
                                            <span className="text-muted-foreground text-xs">Plan</span>
                                            <p className="mt-1 text-sm">{subscription.plan_name}</p>
                                        </div>

                                        <div>
                                            <span className="text-muted-foreground text-xs">Customer</span>
                                            <p className="mt-1 text-sm">{subscription.customer_name}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Start Date</span>
                                            <span>{formatDate(subscription.start_date)}</span>
                                        </div>

                                        {subscription.end_date && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">End Date</span>
                                                <span>{formatDate(subscription.end_date)}</span>
                                            </div>
                                        )}

                                        {subscription.next_billing_date && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">Next Billing Date</span>
                                                <span>{formatDate(subscription.next_billing_date)}</span>
                                            </div>
                                        )}

                                        <Separator />

                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium">Transactions</h3>
                                            {transactions.length === 0 ? (
                                                <p className="text-sm text-muted-foreground">No transactions found for this subscription.</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {transactions.map((transaction) => (
                                                        <div key={transaction.transaction_id} className="border rounded-none p-2 space-y-1">
                                                            <div className="font-medium text-sm">{transaction.description}</div>
                                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                                <span>{formatDate(transaction.created_at)}</span>
                                                                <span>{formatCurrency(transaction.gross_amount, transaction.currency_code)}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <Button variant="outline" className="w-full sm:w-auto rounded-none">
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

function formatBillingFrequency(frequency: string | undefined): string {
    if (!frequency) return '';
    switch (frequency) {
        case 'weekly':
            return 'Weekly';
        case 'bi-weekly':
            return 'Bi-weekly';
        case 'monthly':
            return 'Monthly';
        case 'bi-monthly':
            return 'Bi-monthly';
        case 'quarterly':
            return 'Quarterly';
        case 'semi-annual':
            return 'Semi-annual';
        case 'yearly':
            return 'Yearly';
        case 'one-time':
            return 'One-time';
        default:
            return frequency;
    }
}

function formatFailedPaymentAction(action: string | undefined): string {
    if (!action) return '';
    switch (action) {
        case 'pause':
            return 'Pause';
        case 'continue':
            return 'Continue';
        case 'cancel':
            return 'Cancel';
        default:
            return action;
    }
}

function formatSubscriptionStatus(status: string | undefined): string {
    if (!status) return '';
    switch (status) {
        case 'active':
            return 'Active';
        case 'pending':
            return 'Pending';
        case 'cancelled':
            return 'Cancelled';
        default:
            return status;
    }
}
