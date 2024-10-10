import Notifications from '@/components/dashboard/notifications'
import { UserNav } from '@/components/dashboard/user-nav'
import { TopNav } from '@/components/dashboard/top-nav'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'

const revenueData = [
    { month: 'Jan', revenue: 2400 },
    { month: 'Feb', revenue: 1398 },
    { month: 'Mar', revenue: 9800 },
    { month: 'Apr', revenue: 3908 },
    { month: 'May', revenue: 4800 },
    { month: 'Jun', revenue: 3800 },
]

const transactionData = [
    { name: 'Mon', transactions: 4000 },
    { name: 'Tue', transactions: 3000 },
    { name: 'Wed', transactions: 2000 },
    { name: 'Thu', transactions: 2780 },
    { name: 'Fri', transactions: 1890 },
    { name: 'Sat', transactions: 2390 },
    { name: 'Sun', transactions: 3490 },
]

const channelData = [
    { name: 'Credit Cards', value: 400 },
    { name: 'Bank Transfers', value: 300 },
    { name: 'E-Wallets', value: 300 },
    { name: 'Other', value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function ReportingPage() {
    const topNav = [
        { title: 'Reporting', href: '/portal/reporting', isActive: true },
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
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                            <Select defaultValue="thisMonth">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="thisWeek">This Week</SelectItem>
                                    <SelectItem value="thisMonth">This Month</SelectItem>
                                    <SelectItem value="lastMonth">Last Month</SelectItem>
                                    <SelectItem value="thisYear">This Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Revenue
                                    </CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">$45,231.89</div>
                                    <p className="text-xs text-muted-foreground">
                                        +20.1% from last month
                                    </p>
                                    <div className="text-green-600 flex items-center mt-1">
                                        <ArrowUpRight className="h-4 w-4 mr-1" />
                                        <span className="text-sm font-medium">18.2%</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Transactions
                                    </CardTitle>
                                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+2350</div>
                                    <p className="text-xs text-muted-foreground">
                                        +180.1% from last month
                                    </p>
                                    <div className="text-green-600 flex items-center mt-1">
                                        <ArrowUpRight className="h-4 w-4 mr-1" />
                                        <span className="text-sm font-medium">259</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        New Customers
                                    </CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+573</div>
                                    <p className="text-xs text-muted-foreground">
                                        +201 since last hour
                                    </p>
                                    <div className="text-green-600 flex items-center mt-1">
                                        <ArrowUpRight className="h-4 w-4 mr-1" />
                                        <span className="text-sm font-medium">7%</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Conversion Rate
                                    </CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">3.24%</div>
                                    <p className="text-xs text-muted-foreground">
                                        -0.1% from yesterday
                                    </p>
                                    <div className="text-red-600 flex items-center mt-1">
                                        <ArrowDownRight className="h-4 w-4 mr-1" />
                                        <span className="text-sm font-medium">0.1%</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Revenue Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={revenueData}>
                                            <XAxis dataKey="month" stroke="#888888" />
                                            <YAxis stroke="#888888" />
                                            <Tooltip />
                                            <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Transaction Volume</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <LineChart data={transactionData}>
                                            <XAxis dataKey="name" stroke="#888888" />
                                            <YAxis stroke="#888888" />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="transactions" stroke="#8884d8" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Top Performing Products</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        {['Product A', 'Product B', 'Product C', 'Product D'].map((product) => (
                                            <div className="flex items-center" key={product}>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none">{product}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {Math.floor(Math.random() * 1000) + 500} sales
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium">
                                                    ${(Math.random() * 10000).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Payment Channels</CardTitle>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <ResponsiveContainer width="100%" height={350}>
                                        <PieChart>
                                            <Pie
                                                data={channelData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {channelData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Most Recent Transactions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {['Transaction 1', 'Transaction 2', 'Transaction 3', 'Transaction 4'].map((transaction) => (
                                        <div className="flex items-center" key={transaction}>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{transaction}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date().toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="ml-auto font-medium">
                                                ${(Math.random() * 1000).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    )
}