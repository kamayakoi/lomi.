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
import { CalendarIcon, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import ThemeSwitch from '@/components/dashboard/theme-switch'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'

export default function WebhooksPage() {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date())
    const [endDate, setEndDate] = useState<Date | undefined>(new Date())

    const topNav = [
        { title: 'Webhooks', href: '/portal/webhooks', isActive: true },
        { title: 'Settings', href: '/portal/settings', isActive: false },
    ]

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
                <div className='space-y-4'>
                    <h1 className='text-2xl font-bold tracking-tight'>Webhooks</h1>

                    <Alert variant="warning">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Failed events will be redelivered automatically.</AlertTitle>
                        <AlertDescription>
                            Learn more about our retry policy <a href="https://devs.lomi.africa/docs/webhooks/retry-policy" className="font-medium underline underline-offset-4">here</a>.
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