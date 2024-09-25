import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CalendarIcon, AlertTriangle, Search, User } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

// Mocking the Layout component
const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-background">{children}</div>
)

Layout.Header = React.memo(function LayoutHeader({ children }: { children: React.ReactNode }) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">{children}</div>
        </header>
    )
})

Layout.Body = React.memo(function LayoutBody({ children }: { children: React.ReactNode }) {
    return <main className="container py-6">{children}</main>
})

// Mocking the TopNav component
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

// Mocking the UserNav component
const UserNav = () => (
    <Button variant="ghost" size="icon">
        <User className="h-5 w-5" />
    </Button>
)

export default function WebhooksPage() {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date())
    const [endDate, setEndDate] = useState<Date | undefined>(new Date())

    const topNav = [
        { title: 'Home', href: '', isActive: false },
        { title: 'Integrations', href: 'integrations', isActive: false },
        { title: 'Webhooks', href: 'webhooks', isActive: true },
        { title: 'Settings', href: 'settings', isActive: false },
    ]

    return (
        <Layout>
            <Layout.Header>
                <TopNav links={topNav} />
                <div className='ml-auto flex items-center space-x-4'>
                    <Button variant="ghost" size="icon">
                        <Search className="h-5 w-5" />
                    </Button>
                    <UserNav />
                </div>
            </Layout.Header>

            <Layout.Body>
                <div className='space-y-4'>
                    <h1 className='text-2xl font-bold tracking-tight'>Webhooks</h1>

                    <Alert variant="warning">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Failed events will be redelivered automatically.</AlertTitle>
                        <AlertDescription>
                            Learn more about retry policy <a href="#" className="font-medium underline underline-offset-4">here</a>.
                        </AlertDescription>
                    </Alert>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 space-y-4">
                            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                                <div className="flex-1">
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filter (0)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Events</SelectItem>
                                            <SelectItem value="failed">Failed Events</SelectItem>
                                            <SelectItem value="successful">Successful Events</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-1 items-center space-x-2">
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
                                    <span>-</span>
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

                                <div className="flex flex-1 space-x-2">
                                    <Input type="search" placeholder="Search..." className="md:w-[300px]" />
                                    <Button variant="secondary">Custom Resend</Button>
                                    <Button variant="outline">Resend</Button>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col items-center justify-center space-y-4 py-12">
                                <h2 className="text-2xl font-semibold">No webhook event found</h2>
                                <p className="text-muted-foreground">Please adjust filter or create new webhooks</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    )
}