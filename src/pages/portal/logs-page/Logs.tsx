import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Search, Calendar as CalendarIcon, Filter } from 'lucide-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Layout } from '@/components/custom/layout'
import Notifications from '@/components/dashboard/notifications'
import { UserNav } from '@/components/dashboard/user-nav'
import { TopNav } from '@/components/dashboard/top-nav'
import { Separator } from '@/components/ui/separator'

interface LogEntry {
    date: string
    userEmail: string
    activity: string
    ipAddress: string
    operatingSystem: string
    browser: string
}

const mockData: LogEntry[] = [
    {
        date: '25 Sep 2024, 11:39 AM',
        userEmail: 'babacar.diop.bba@edhec.com',
        activity: 'Login with email',
        ipAddress: '102.216.217.235',
        operatingSystem: 'MacOS',
        browser: 'Chrome'
    },
    // ... add more mock data entries here
]

export default function LogsPage() {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date('2024-08-25'))
    const [endDate, setEndDate] = useState<Date | undefined>(new Date('2024-09-25'))

    const topNav = [
        { title: 'Logs', href: '/portal/logs', isActive: true },
        { title: 'Settings', href: '/portal/settings', isActive: false },
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
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 space-y-2">
                                <label htmlFor="filter" className="text-sm font-medium">Filter</label>
                                <Select>
                                    <SelectTrigger id="filter">
                                        <SelectValue placeholder="Select filter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Activities</SelectItem>
                                        <SelectItem value="login">Login</SelectItem>
                                        <SelectItem value="password">Password Change</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Date Range</label>
                                <div className="flex gap-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={setStartDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <span className="self-center">-</span>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
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
                        </div>

                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search logs..." className="pl-8" />
                            </div>
                            <Button variant="outline">
                                <Filter className="mr-2 h-4 w-4" />
                                Filters
                            </Button>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date (GMT +0)</TableHead>
                                        <TableHead>User Email</TableHead>
                                        <TableHead>Activity</TableHead>
                                        <TableHead>IP Address</TableHead>
                                        <TableHead>Operating System</TableHead>
                                        <TableHead>Browser</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockData.map((entry, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{entry.date}</TableCell>
                                            <TableCell>{entry.userEmail}</TableCell>
                                            <TableCell>{entry.activity}</TableCell>
                                            <TableCell>{entry.ipAddress}</TableCell>
                                            <TableCell>{entry.operatingSystem}</TableCell>
                                            <TableCell>{entry.browser}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Showing 1 - 20 from 20 activities
                            </p>
                            <nav>
                                <ul className="flex items-center space-x-2">
                                    <li>
                                        <Button variant="outline" size="sm" disabled>
                                            Previous
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="outline" size="sm">
                                            1
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="outline" size="sm">
                                            2
                                        </Button>
                                    </li>
                                    <li>
                                        <Button variant="outline" size="sm">
                                            3
                                        </Button>
                                    </li>
                                    <li>
                                        <span>...</span>
                                    </li>
                                    <li>
                                        <Button variant="outline" size="sm">
                                            Next
                                        </Button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    )
}