import { useState } from 'react'
import ContentSection from '@/components/dashboard/content-section'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InfoIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
    const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('XOF')

    return (
        <ContentSection
            title="Fee Structure"
            desc="View fee structure across different products and services"
        >
            <div className="space-y-6 max-w-6xl mx-auto">
                <Tabs value={activeCurrency} onValueChange={(value) => setActiveCurrency(value as CurrencyCode)}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="XOF">XOF</TabsTrigger>
                        <TabsTrigger value="USD">USD</TabsTrigger>
                    </TabsList>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Processing Fees</CardTitle>
                                <CardDescription>Fees for different payment methods in {activeCurrency}</CardDescription>
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
                                        {feeData[activeCurrency].paymentFees.map((fee, index) => (
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
                                <CardDescription>Additional fees for various services in {activeCurrency}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-1/2">Service</TableHead>
                                            <TableHead className="w-1/2">Fee</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {feeData[activeCurrency].otherFees.map((fee, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="flex items-center space-x-2">
                                                    <span>{fee.name}</span>
                                                    {fee.name === 'Currency Conversion' && (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Applied when converting between currencies</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                </TableCell>
                                                <TableCell>{fee.amount}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </Tabs>
            </div>
        </ContentSection>
    )
}