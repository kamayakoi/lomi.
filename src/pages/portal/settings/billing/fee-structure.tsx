import ContentSection from '../components/content-section'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InfoIcon } from 'lucide-react'

type CurrencyCode = 'USD' | 'XOF';

type Fee = {
    name: string;
    amount: string;
    provider?: string;
};

type FeeData = {
    [key in CurrencyCode]: {
        paymentFees: Fee[];
        otherFees: Fee[];
    };
};

// Mock data based on the SQL seed
const feeData: FeeData = {
    USD: {
        paymentFees: [
            { name: 'Credit Card', amount: '2.9% + $0.00', provider: 'Stripe' },
            { name: 'Debit Card', amount: '2.9% + $0.00', provider: 'Stripe' },
            { name: 'SEPA', amount: '1.4% + $1.00', provider: 'Stripe' },
            { name: 'PayPal', amount: '3.4% + $0.30', provider: 'PayPal' },
        ],
        otherFees: [
            { name: 'Currency Conversion', amount: '1.5%' },
            { name: 'Chargeback', amount: '$5.00' },
            { name: 'Recurring Payment Setup', amount: '3.0%' },
            { name: 'Express Payout', amount: '$2.00' },
            { name: 'Refund Processing', amount: '1.5%' },
            { name: 'Payout Processing', amount: '2.0% + $0.50' },
        ],
    },
    XOF: {
        paymentFees: [
            { name: 'Mobile Money', amount: '2% + 66 XOF', provider: 'Orange' },
            { name: 'Mobile Money', amount: '2% + 66 XOF', provider: 'MTN' },
            { name: 'Mobile Money', amount: '2.9% + 66 XOF', provider: 'Wave' },
            { name: 'Bank Transfer', amount: '2.5% + 256 XOF', provider: 'Ecobank' },
            { name: 'Cash', amount: '3.3% + 56 XOF', provider: 'Lomi' },
            { name: 'E-Wallet', amount: '2.9% + 0 XOF', provider: 'Lomi' },
        ],
        otherFees: [
            { name: 'Currency Conversion', amount: '1.5%' },
            { name: 'Chargeback', amount: '5 XOF' },
            { name: 'Recurring Payment Setup', amount: '3.0%' },
            { name: 'Express Payout', amount: '2 XOF' },
            { name: 'Refund Processing', amount: '2.2%' },
            { name: 'Payout Processing', amount: '2.2%' },
        ],
    },
}

export default function FeeStructure() {
    return (
        <ContentSection
            title="Fee Structure"
            desc="View fee structure across different products and services"
        >
            <div className="space-y-6 max-w-6xl mx-auto">
                <Tabs defaultValue="XOF">
                    <TabsList>
                        <TabsTrigger value="XOF">XOF</TabsTrigger>
                        <TabsTrigger value="USD">USD</TabsTrigger>
                    </TabsList>
                    {(['XOF', 'USD'] as const).map((curr) => (
                        <TabsContent key={curr} value={curr}>
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Payment Processing Fees</CardTitle>
                                        <CardDescription>Fees for different payment methods</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-1/3">Payment Method</TableHead>
                                                    <TableHead className="w-1/3">Fee</TableHead>
                                                    <TableHead className="w-1/3">Provider</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {feeData[curr].paymentFees.map((fee, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{fee.name}</TableCell>
                                                        <TableCell>{fee.amount}</TableCell>
                                                        <TableCell>{fee.provider}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Other Fees</CardTitle>
                                        <CardDescription>Additional fees for various services</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-1/3">Service</TableHead>
                                                    <TableHead className="w-1/3">Fee</TableHead>
                                                    <TableHead className="w-1/3"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {feeData[curr].otherFees.map((fee, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{fee.name}</TableCell>
                                                        <TableCell>{fee.amount}</TableCell>
                                                        <TableCell>
                                                            {fee.name === 'Currency Conversion' && (
                                                                <div className="relative group">
                                                                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-secondary text-secondary-foreground rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-64 text-xs">
                                                                        Applied when converting between currencies
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </ContentSection>
    )
}