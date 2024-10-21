import { useState } from 'react'
import { Search, CreditCard, Wallet, Phone } from 'lucide-react'
import ContentSection from '@/components/dashboard/content-section'
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const paymentMethods = [
    { channel: 'Credit Card', type: 'Card', provider: 'Stripe' },
    { channel: 'Debit Card', type: 'Card', provider: 'Stripe' },
    { channel: 'Apple Pay', type: 'E-Wallet', provider: 'Stripe' },
    { channel: 'PayPal', type: 'E-Wallet', provider: 'Stripe' },
    { channel: 'Orange', type: 'Mobile Money', provider: 'Orange' },
    { channel: 'MTN', type: 'Mobile Money', provider: 'MTN' },
    { channel: 'Wave', type: 'Mobile Money', provider: 'Wave' },
]

const typeIcons: Record<string, JSX.Element> = {
    'Card': <CreditCard className="h-4 w-4" />,
    'E-Wallet': <Wallet className="h-4 w-4" />,
    'Mobile Money': <Phone className="h-4 w-4" />,
}

export default function PaymentMethods() {
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    const filteredMethods = paymentMethods
        .filter(method => filter === 'all' || method.type.toLowerCase() === filter)
        .filter(method =>
            method.channel.toLowerCase().includes(search.toLowerCase()) ||
            method.type.toLowerCase().includes(search.toLowerCase()) ||
            method.provider.toLowerCase().includes(search.toLowerCase())
        )

    return (
        <ContentSection
            title="Payment Methods"
            desc="Activate and configure bank transfers, cards, e-wallets and other payment methods"
        >
            <Card className="mt-4">
                <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 my-6">
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="e-wallet">E-Wallet</SelectItem>
                                <SelectItem value="mobile money">Mobile Money</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                placeholder="Search payment methods..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-[300px] pl-8"
                            />
                        </div>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">CHANNEL</TableHead>
                                    <TableHead className="w-[30%]">TYPE</TableHead>
                                    <TableHead className="w-[30%]">PROVIDER</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMethods.map((method, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{method.channel}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {typeIcons[method.type]}
                                                <span>{method.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{method.provider}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {filteredMethods.length === 0 && (
                        <p className="text-center text-muted-foreground my-4">No payment methods found.</p>
                    )}
                </CardContent>
            </Card>
        </ContentSection>
    )
}