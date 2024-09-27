import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Search, InfoIcon } from 'lucide-react'
import { format } from 'date-fns'
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import ThemeSwitch from '@/components/dashboard/theme-switch'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'

export default function BalancePage() {
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [isTopUpOpen, setIsTopUpOpen] = useState(false)
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
    const [topUpAmount, setTopUpAmount] = useState("")
    const [withdrawAmount, setWithdrawAmount] = useState("")
    const [balance, setBalance] = useState(0)

    const topNav = [
        { title: 'Balance', href: '/portal/balance', isActive: true },
        { title: 'Settings', href: '/portal/settings', isActive: false },
    ]

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

    return (
        <Layout fixed>
            <Layout.Header>
                <TopNav links={topNav} />
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <UserNav />
                </div>
            </Layout.Header>

            <Separator className='my-0' />

            <Layout.Body>
                <h1 className="text-2xl font-bold tracking-tight mb-4">Balance</h1>

                <div className="grid gap-4 md:grid-cols-2 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                            <div className="relative group">
                                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-secondary text-secondary-foreground rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-64 text-xs pointer-events-none">
                                    Available Balance represents the funds that are currently accessible for transactions or withdrawal.
                                    <br />
                                    Upcoming withdrawal or disbursement might affect this amount.
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold mb-2">XOF {balance.toLocaleString()}</div>
                            <div className="flex space-x-2">
                                <Button onClick={() => setIsTopUpOpen(true)}>Top Up</Button>
                                <Button variant="outline" onClick={() => setIsWithdrawOpen(true)}>Withdraw</Button>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Auto-Withdrawal</CardTitle>
                            <Button variant="link" className="text-xs">Learn more</Button>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">Add a bank account before setting Auto-Withdrawal.</p>
                            <Button variant="outline">Set up Auto-Withdrawal</Button>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="history" className="mt-6">
                    <TabsList>
                        <TabsTrigger value="history">Balance History</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                    </TabsList>
                </Tabs>

                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                            <div className="flex-1">
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter (0)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Transactions</SelectItem>
                                        <SelectItem value="top-up">Top Up</SelectItem>
                                        <SelectItem value="withdrawal">Withdrawal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex space-x-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, "PPP") : <span>Start date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={setStartDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {endDate ? format(endDate, "PPP") : <span>End date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={setEndDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search by Reference" className="pl-8" />
                                </div>
                            </div>

                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Search className="h-12 w-12 text-muted-foreground mb-4" />
                            <h2 className="text-2xl font-semibold mb-2">No balance history found.</h2>
                            <p className="text-muted-foreground">Try changing your filter or create a new transaction.</p>
                        </div>
                    </CardContent>
                </Card>
            </Layout.Body>

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
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <div className="col-span-3 flex">
                                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                                    XOF
                                </span>
                                <Input
                                    id="amount"
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
                        <Button onClick={handleTopUp}>Next</Button>
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
        </Layout>
    )
}