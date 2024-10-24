import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Subscription, Transaction, SubscriptionPlan } from './types'
import { Separator } from "@/components/ui/separator"
import { LifeBuoy } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchSubscriptionTransactions } from './support_subscriptions'

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
            <SheetContent className="sm:max-w-2xl overflow-y-auto">
                <Card className="border-0 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">
                            {subscription ? 'Subscription Details' : 'Plan Details'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <section>
                                <h3 className="text-lg font-semibold mb-2">
                                    {subscription ? 'Subscription Information' : 'Plan Information'}
                                </h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {subscription && (
                                        <>
                                            <div className="font-medium">Plan:</div>
                                            <div>{subscription.plan_name}</div>
                                            <div className="font-medium">Customer:</div>
                                            <div>{subscription.customer_name}</div>
                                            <div className="font-medium">Status:</div>
                                            <div>{formatSubscriptionStatus(subscription.status)}</div>
                                            <div className="font-medium">Start Date:</div>
                                            <div>{formatDate(subscription.start_date)}</div>
                                            {subscription.end_date && (
                                                <>
                                                    <div className="font-medium">End Date:</div>
                                                    <div>{formatDate(subscription.end_date)}</div>
                                                </>
                                            )}
                                            {subscription.next_billing_date && (
                                                <>
                                                    <div className="font-medium">Next Billing Date:</div>
                                                    <div>{formatDate(subscription.next_billing_date)}</div>
                                                </>
                                            )}
                                        </>
                                    )}
                                    {plan && (
                                        <>
                                            <div className="font-medium">Name:</div>
                                            <div>{plan.name}</div>
                                            <div className="font-medium">Description:</div>
                                            <div>{plan.description}</div>
                                            <div className="font-medium">Billing Frequency:</div>
                                            <div>{formatBillingFrequency(plan.billing_frequency)}</div>
                                            <div className="font-medium">Amount:</div>
                                            <div>{formatCurrency(plan.amount, plan.currency_code)}</div>
                                            <div className="font-medium">Failed Payment Action:</div>
                                            <div>{formatFailedPaymentAction(plan.failed_payment_action)}</div>
                                            <div className="font-medium">Charge Day:</div>
                                            <div>{plan.charge_day || '-'}</div>
                                            <div className="font-medium">Created At:</div>
                                            <div>{formatDate(plan.created_at)}</div>
                                            <div className="font-medium">Updated At:</div>
                                            <div>{formatDate(plan.updated_at)}</div>
                                        </>
                                    )}
                                </div>
                            </section>
                            {subscription && (
                                <>
                                    <Separator />
                                    <section>
                                        <h3 className="text-lg font-semibold mb-2">Transactions</h3>
                                        {transactions.length === 0 ? (
                                            <p className="text-sm text-gray-500">No transactions found for this subscription.</p>
                                        ) : (
                                            <ul className="space-y-2">
                                                {transactions.map((transaction) => (
                                                    <li key={transaction.transaction_id} className="border rounded p-2">
                                                        <div className="font-medium">{transaction.description}</div>
                                                        <div className="text-sm text-gray-500">{formatCurrency(transaction.gross_amount, transaction.currency_code)}</div>
                                                        <div className="text-sm text-gray-500">{formatDate(transaction.created_at)}</div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </section>
                                </>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button variant="outline" className="w-full sm:w-auto">
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
