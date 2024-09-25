import { useState } from 'react'
import ContentSection from '../components/content-section'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRightIcon } from 'lucide-react'

export default function AutoWithdrawal() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const hasBankAccount = false // This should be set based on actual bank account data

    return (
        <ContentSection
            title="Auto-Withdrawal"
            desc="Configure and schedule your withdrawals"
        >
            <Card>
                <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Auto-Withdrawal</h2>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="link" className="text-blue-500 hover:text-blue-600">
                                    Learn more <ChevronRightIcon className="ml-1 h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Try automating your withdrawals!</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <img
                                        src="/autopayout.png"
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
                        {hasBankAccount
                            ? "Configure your auto-withdrawal settings."
                            : "Add a bank account before setting Auto-Withdrawal."}
                    </p>
                    <div className="mt-4">
                        <Button disabled={!hasBankAccount}>
                            Set up Auto-Withdrawal
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </ContentSection>
    )
}