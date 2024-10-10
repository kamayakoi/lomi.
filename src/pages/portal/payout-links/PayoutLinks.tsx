import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'

export default function PayoutLinksPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isTopUpOpen, setIsTopUpOpen] = useState(false)
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
    const [balance, setBalance] = useState(0)
    const [topUpAmount, setTopUpAmount] = useState("")
    const [withdrawAmount, setWithdrawAmount] = useState("")
    const [activeTab, setActiveTab] = useState("needs-validation")

    const handleTopUp = () => {
        const amount = parseFloat(topUpAmount)
        if (!isNaN(amount) && amount > 0) {
            setBalance(prevBalance => prevBalance + amount)
            setIsTopUpOpen(false)
            setTopUpAmount("")
        }
    }

    const handleWithdraw = () => {
        const amount = parseFloat(withdrawAmount)
        if (!isNaN(amount) && amount > 0 && amount <= balance) {
            setBalance(prevBalance => prevBalance - amount)
            setIsWithdrawOpen(false)
            setWithdrawAmount("")
        }
    }

    const topNav = [
        { title: 'Payout Links', href: '/portal/payout-links', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    return (
        <Layout fixed>
            <Layout.Header>
                <TopNav links={topNav} />
                <div className='ml-auto flex items-center space-x-4'>
                    <Notifications />
                    <UserNav />
                </div>
            </Layout.Header>

            <Separator className='my-0' />

            <Layout.Body>
                <div className="h-full overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="space-y-4 pb-8">
                        <h1 className="text-2xl font-bold tracking-tight">Payout Links | Disbursements</h1>

                        <Card className="mb-6">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-2xl font-bold">XOF {balance.toLocaleString()}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-2">
                                    <Button onClick={() => setIsTopUpOpen(true)}>Top Up</Button>
                                    <Button variant="outline" onClick={() => setIsWithdrawOpen(true)}>Withdraw</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-between items-center mb-6">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                                <TabsList>
                                    <TabsTrigger value="needs-validation">Needs Validation</TabsTrigger>
                                    <TabsTrigger value="needs-approval">Needs Approval</TabsTrigger>
                                    <TabsTrigger value="approved">Approved</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <Button onClick={() => setIsCreateOpen(true)}>Create</Button>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter (0)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex items-center space-x-2">
                                <span>0 selected</span>
                                <Button variant="outline" size="sm">Delete</Button>
                            </div>
                        </div>

                        <Tabs value={activeTab}>
                            <TabsContent value="needs-validation">
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center h-[300px] text-center">
                                        <h2 className="text-2xl font-semibold mb-2">You do not have any disbursements to validate</h2>
                                        <p className="text-muted-foreground">Come back after your uploader has uploaded one :)</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="needs-approval">
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center h-[300px] text-center">
                                        <h2 className="text-2xl font-semibold mb-2">No disbursements need approval</h2>
                                        <p className="text-muted-foreground">All current disbursements have been processed</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="approved">
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center h-[300px] text-center">
                                        <h2 className="text-2xl font-semibold mb-2">No approved disbursements</h2>
                                        <p className="text-muted-foreground">Approved disbursements will appear here</p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="flex justify-between items-center">
                                        <span>Single disbursement</span>
                                        <Button variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="bank">Recipient bank name</Label>
                                        <Select>
                                            <SelectTrigger id="bank">
                                                <SelectValue placeholder="Select..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="bank1">Bank 1</SelectItem>
                                                <SelectItem value="bank2">Bank 2</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="account">Recipient account number</Label>
                                        <div className="flex">
                                            <Input id="account" placeholder="527XXXXXX" className="rounded-r-none" />
                                            <Button variant="outline" className="rounded-l-none">Validate</Button>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="amount">Enter amount to send</Label>
                                        <Input id="amount" type="number" placeholder="0" />
                                        <p className="text-sm text-muted-foreground">XOF {balance.toLocaleString()} available</p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="reference">Reference</Label>
                                        <Input id="reference" placeholder="disb-01-ddmmy-hhmm" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Input id="description" placeholder="Payment" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Recipient email</Label>
                                        <Input id="email" type="email" placeholder="Receipt will be sent to the email address" />
                                        <p className="text-sm text-muted-foreground">Use comma to add another email</p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select>
                                            <SelectTrigger id="category">
                                                <SelectValue placeholder="Select..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="category1">Category 1</SelectItem>
                                                <SelectItem value="category2">Category 2</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                                    <Button>Create</Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Top Up Your Balance</DialogTitle>
                                    <DialogDescription>
                                        Enter the amount you want to add to your balance.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="top-up-amount" className="text-right">
                                            Amount
                                        </Label>
                                        <div className="col-span-3 flex">
                                            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                                                XOF
                                            </span>
                                            <Input
                                                id="top-up-amount"
                                                type="number"
                                                value={topUpAmount}
                                                onChange={(e) => setTopUpAmount(e.target.value)}
                                                className="rounded-l-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogDescription className="text-sm text-blue-500">
                                    Your top-up experience on live mode may be different
                                </DialogDescription>
                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={() => setIsTopUpOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleTopUp}>Top Up</Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Withdraw Funds</DialogTitle>
                                    <DialogDescription>
                                        Enter the amount you want to withdraw from your balance.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="withdraw-amount" className="text-right">
                                            Amount
                                        </Label>
                                        <div className="col-span-3 flex">
                                            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                                                XOF
                                            </span>
                                            <Input
                                                id="withdraw-amount"
                                                type="number"
                                                value={withdrawAmount}
                                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                                className="rounded-l-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={() => setIsWithdrawOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleWithdraw}>Withdraw</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    )
}