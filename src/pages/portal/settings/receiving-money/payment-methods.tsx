import { useState } from 'react'
import ContentSection from '../components/content-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data based on the SQL seed
const paymentMethods = [
    { channel: 'Credit Card', type: 'Card', provider: 'Stripe' },
    { channel: 'Debit Card', type: 'Card', provider: 'Stripe' },
    { channel: 'SEPA', type: 'Bank Transfer', provider: 'Stripe' },
    { channel: 'PayPal', type: 'E-Wallet', provider: 'Stripe' },
    { channel: 'Orange Money', type: 'Mobile Money', provider: 'Orange' },
    { channel: 'MTN Mobile Money', type: 'Mobile Money', provider: 'MTN' },
    { channel: 'Wave', type: 'Mobile Money', provider: 'Wave' },
    { channel: 'Ecobank Transfer', type: 'Bank Transfer', provider: 'Ecobank' },
    { channel: 'Lomi Cash', type: 'Cash', provider: 'Lomi' },
    { channel: 'Lomi Wallet', type: 'E-Wallet', provider: 'Lomi' },
    { channel: 'Partner Wallet', type: 'E-Wallet', provider: 'Partner' },
    { channel: 'Apple Pay', type: 'Digital Wallet', provider: 'Stripe' },
    { channel: 'Google Pay', type: 'Digital Wallet', provider: 'Stripe' },
]

export default function PaymentMethods() {
    const [filter, setFilter] = useState('all')

    const filteredMethods = filter === 'all'
        ? paymentMethods
        : paymentMethods.filter(method => method.type.toLowerCase() === filter)

    return (
        <ContentSection
            title="Payment Methods"
            desc="Activate and configure bank transfers, cards, e-wallets and other payment methods"
        >
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>
                            Allow your customers to pay with more payment methods. Please reach out to help@lomi.africa if you would like to enable additional channels.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="card">Card</SelectItem>
                                    <SelectItem value="bank transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="e-wallet">E-Wallet</SelectItem>
                                    <SelectItem value="mobile money">Mobile Money</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="digital wallet">Digital Wallet</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>CHANNEL</TableHead>
                                    <TableHead>TYPE</TableHead>
                                    <TableHead>PROVIDER</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMethods.map((method, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{method.channel}</TableCell>
                                        <TableCell>{method.type}</TableCell>
                                        <TableCell>{method.provider}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </ContentSection>
    )
}