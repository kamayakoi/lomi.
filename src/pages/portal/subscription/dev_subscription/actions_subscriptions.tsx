import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Subscription, Transaction, SubscriptionPlan, frequencyColors } from './types'
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { LifeBuoy, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchSubscriptionTransactions } from './support_subscriptions'
import { cn } from '@/lib/actions/utils'

type SubscriptionActionsProps = {
    subscription?: Subscription | null
    plan?: SubscriptionPlan | null
    isOpen: boolean
    onClose: () => void
}

export default function SubscriptionActions({ subscription, plan, isOpen, onClose }: SubscriptionActionsProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        if (subscription?.subscription_id) {
            fetchSubscriptionTransactions(subscription.subscription_id).then(setTransactions)
        }
    }, [subscription?.subscription_id])

    if (!subscription && !plan) return null

    return (
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
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Status</span>
                                        <Badge variant="secondary" className={cn(
                                            "rounded-none px-2 py-0.5 text-xs font-normal",
                                            plan.is_active
                                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                        )}>
                                            {plan.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>

                                    <div>
                                        <span className="text-muted-foreground text-xs">Name</span>
                                        <p className="mt-1 text-sm">{plan.name}</p>
                                    </div>

                                    {plan.description && (
                                        <div>
                                            <span className="text-muted-foreground text-xs">Description</span>
                                            <p className="mt-1 text-sm">{plan.description}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Amount</span>
                                        <span>{formatCurrency(plan.amount, plan.currency_code)}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Billing Frequency</span>
                                        <Badge variant="secondary" className={cn(
                                            "rounded-none px-2 py-0.5 text-xs font-normal",
                                            frequencyColors[plan.billing_frequency]
                                        )}>
                                            {formatBillingFrequency(plan.billing_frequency)}
                                        </Badge>
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
