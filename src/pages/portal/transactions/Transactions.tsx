import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Search, ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { format } from 'date-fns'

const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-background">{children}</div>
)

Layout.Header = React.memo(function LayoutHeader({ children }: { children: React.ReactNode }) {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">{children}</div>
        </header>
    )
})

Layout.Body = React.memo(function LayoutBody({ children }: { children: React.ReactNode }) {
    return <main className="container py-6">{children}</main>
})

const TopNav = ({ links }: { links: Array<{ title: string; href: string; isActive: boolean }> }) => (
    <nav className="flex items-center space-x-4 lg:space-x-6">
        {links.map((link, index) => (
            <a
                key={index}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${link.isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
            >
                {link.title}
            </a>
        ))}
    </nav>
)

export default function TransactionsPage() {
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()

    const topNav = [
        { title: 'Home', href: '', isActive: false },
        { title: 'Transactions', href: 'transactions', isActive: true },
        { title: 'Settings', href: 'settings', isActive: false },
    ]

    return (
        <Layout>
            <Layout.Header>
                <TopNav links={topNav} />
            </Layout.Header>

            <Layout.Body>
                <h1 className="text-2xl font-bold tracking-tight mb-4">Transactions</h1>

                <div className="grid gap-4 md:grid-cols-2 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Incoming Amount</CardTitle>
                            <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">XOF 0</div>
                            <p className="text-xs text-muted-foreground">0 transactions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Outgoing Amount</CardTitle>
                            <ArrowUpIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">XOF 0</div>
                            <p className="text-xs text-muted-foreground">0 transactions</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                            <div className="flex-1 space-y-2">
                                <Label>Date Range</Label>
                                <div className="flex space-x-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                            </div>

                            <div className="flex-1 space-y-2">
                                <Label>Reference</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select reference" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All References</SelectItem>
                                        <SelectItem value="transaction-id">Transaction ID</SelectItem>
                                        <SelectItem value="order-id">Order ID</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex-1 space-y-2">
                                <Label>Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search transactions" className="pl-8" />
                                </div>
                            </div>

                            <Button className="md:self-end">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardContent className="p-6">
                        <p className="text-sm text-muted-foreground mb-4">
                            For incoming payments, you can only see Successful status here. To see all statuses, switch to Detailed Transactions now!
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <h3 className="font-semibold mb-2">Status</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <Checkbox id="status-success" />
                                        <label htmlFor="status-success" className="ml-2 text-sm">Success</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="status-reversed" />
                                        <label htmlFor="status-reversed" className="ml-2 text-sm">Reversed</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="status-voided" />
                                        <label htmlFor="status-voided" className="ml-2 text-sm">Voided</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="status-failed" />
                                        <label htmlFor="status-failed" className="ml-2 text-sm">Failed</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="status-pending" />
                                        <label htmlFor="status-pending" className="ml-2 text-sm">Pending</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Settlement Status</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <Checkbox id="settlement-pending" />
                                        <label htmlFor="settlement-pending" className="ml-2 text-sm">Pending</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="settlement-settled" />
                                        <label htmlFor="settlement-settled" className="ml-2 text-sm">Settled</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="settlement-early-settled" />
                                        <label htmlFor="settlement-early-settled" className="ml-2 text-sm">Early Settled</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Type</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <Checkbox id="type-payment" />
                                        <label htmlFor="type-payment" className="ml-2 text-sm">Payment</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="type-disbursement" />
                                        <label htmlFor="type-disbursement" className="ml-2 text-sm">Disbursement</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="type-batch-disbursement" />
                                        <label htmlFor="type-batch-disbursement" className="ml-2 text-sm">Batch Disbursement</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="type-withdrawal" />
                                        <label htmlFor="type-withdrawal" className="ml-2 text-sm">Withdrawal</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="type-top-up" />
                                        <label htmlFor="type-top-up" className="ml-2 text-sm">Top Up</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="type-refund" />
                                        <label htmlFor="type-refund" className="ml-2 text-sm">Refund</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="type-other" />
                                        <label htmlFor="type-other" className="ml-2 text-sm">Other</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Channel</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <Checkbox id="channel-bank" />
                                        <label htmlFor="channel-bank" className="ml-2 text-sm">Bank</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="channel-virtual-account" />
                                        <label htmlFor="channel-virtual-account" className="ml-2 text-sm">Virtual Account</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="channel-cards" />
                                        <label htmlFor="channel-cards" className="ml-2 text-sm">Cards</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="channel-ewallet" />
                                        <label htmlFor="channel-ewallet" className="ml-2 text-sm">eWallet</label>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox id="channel-other" />
                                        <label htmlFor="channel-other" className="ml-2 text-sm">Other</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Search className="h-12 w-12 text-muted-foreground mb-4" />
                            <h2 className="text-2xl font-semibold mb-2">No transaction history found.</h2>
                            <p className="text-muted-foreground">Try changing your filter or create a new transaction.</p>
                        </div>
                    </CardContent>
                </Card>
            </Layout.Body>
        </Layout>
    )
}