import { useState } from 'react'
import ContentSection from '../../../../components/dashboard/content-section'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InfoIcon } from 'lucide-react'

export default function BillingStatements() {
    const [totalOutstanding] = useState(0)
    const [billingBalance, setBillingBalance] = useState(0)
    const [isTopUpOpen, setIsTopUpOpen] = useState(false)
    const [topUpAmount, setTopUpAmount] = useState('')

    const handleTopUp = () => {
        const amount = parseFloat(topUpAmount)
        if (!isNaN(amount) && amount > 0) {
            setBillingBalance(prev => prev + amount)
            setIsTopUpOpen(false)
            setTopUpAmount('')
        }
    }

    return (
        <ContentSection
            title="Billing Statements"
            desc="View your past bills and complete payment for any outstanding bills"
        >
            <div className="space-y-6">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Total Outstanding Bills</CardTitle>
                        <p className="text-2xl font-bold">XOF {totalOutstanding.toLocaleString()}</p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2 mb-4">
                            <p className="text-sm text-muted-foreground">
                                Billing Balance <span className="font-bold">XOF</span> {billingBalance.toLocaleString()}
                            </p>
                            <div className="relative group">
                                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-secondary text-secondary-foreground rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-64 text-xs pointer-events-none">
                                    Billing Balance contains funds that you keep aside to automatically pay any unpaid bills.
                                </div>
                            </div>
                        </div>
                        <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">Top Up Balance</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Top Up Billing Balance</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="top-up-method">Select Top-Up Method</Label>
                                        <div className="flex items-center space-x-2">
                                            <input type="radio" id="lomi-balance" name="top-up-method" checked readOnly />
                                            <Label htmlFor="lomi-balance">lomi Balance</Label>
                                            <span className="text-sm text-muted-foreground">
                                                Available: XOF {billingBalance.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="top-up-amount">Top-Up Amount</Label>
                                        <Input
                                            id="top-up-amount"
                                            placeholder="Enter amount"
                                            value={topUpAmount}
                                            onChange={(e) => setTopUpAmount(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Funds in your Billing Balance will be automatically deducted at 12:00 AM (GMT+0)
                                        to pay any unpaid bills.
                                    </p>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setIsTopUpOpen(false)}>Cancel</Button>
                                    <Button onClick={handleTopUp}>Top Up Now</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <div className="mt-6 pt-6 border-t border-border">
                            <h4 className="text-lg font-semibold mb-2 text-center">You don&apos;t have any bills yet</h4>
                            <p className="text-muted-foreground text-sm text-center">
                                Once you&apos;ve made transactions, your bills will be issued between the 5th or 7th of every month.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ContentSection>
    )
}