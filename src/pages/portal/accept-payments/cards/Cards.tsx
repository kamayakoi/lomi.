import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { CreditCard, Search as SearchIcon } from 'lucide-react'
import { DateRangePicker } from '@/components/ui/date-range-picker.tsx'
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import ThemeSwitch from '@/components/dashboard/theme-switch'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { DateRange } from 'react-day-picker'

export default function CardsPage() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(2024, 7, 27),
        to: new Date(2024, 8, 27),
    })

    const topNav = [
        { title: 'Cards', href: '/portal/cards', isActive: true },
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
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold tracking-tight">Card Payments</h1>
                    </div>

                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="w-full md:w-auto">
                                    <Select>
                                        <SelectTrigger className="w-full md:w-[180px]">
                                            <SelectValue placeholder="Filter (0)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full md:w-auto">
                                    <DateRangePicker date={dateRange} setDate={setDateRange} />
                                </div>
                                <div className="w-full md:w-auto">
                                    <Select>
                                        <SelectTrigger className="w-full md:w-[180px]">
                                            <SelectValue placeholder="Reference ID" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="transaction">Transaction ID</SelectItem>
                                            <SelectItem value="order">Order ID</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full md:flex-1">
                                    <div className="relative">
                                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <Input className="pl-10 w-full" placeholder="Search..." />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                            <CreditCard className="w-12 h-12 text-gray-400 mb-4" />
                            <CardTitle className="text-xl mb-2">There are no card payments found</CardTitle>
                            <CardDescription className="text-center">
                                Please adjust the filter or create new card transactions
                            </CardDescription>
                            <Button className="mt-4">Create Card Transaction</Button>
                        </CardContent>
                    </Card>
                </div>
            </Layout.Body>
        </Layout>
    )
}