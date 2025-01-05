import { useState } from 'react'
import ContentSection from '@/components/dashboard/content-section'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InfoIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

type CurrencyCode = 'USD' | 'XOF';

type Fee = {
    name: string;
    amount: string;
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
            { name: 'Visa', amount: '2.9%' },
            { name: 'Mastercard', amount: '2.9%' },
            { name: 'Bank Transfer (International)', amount: '1% + $5.00' },
            { name: 'Bank Transfer (Local)', amount: 'Free' }
        ],
        otherFees: [
            { name: 'Refund Processing', amount: '1.5%' },
            { name: 'Currency Conversion', amount: '1.5%' },
            { name: 'Express Payout', amount: '$2.00' },
        ],
    },
    XOF: {
        paymentFees: [
            { name: 'Visa', amount: '2.9%' },
            { name: 'Mastercard', amount: '2.9%' },
            { name: 'Orange', amount: '2.9% + 66 XOF' },
            { name: 'MTN', amount: '2.9% + 66 XOF' },
            { name: 'Wave', amount: '2.9%' },
            { name: 'Bank Transfer (International)', amount: '1% + 3,500 XOF' },
            { name: 'Bank Transfer (Local)', amount: 'Free' }
        ],
        otherFees: [
            { name: 'Refund Processing', amount: '1.5%' },
            { name: 'Currency Conversion', amount: '1.5%' },
            { name: 'Express Payout', amount: '655 XOF' },
        ],
    },
}

export default function FeeStructure() {
    const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('XOF')

    return (
        <div style={{
            overflowY: 'auto',
            maxHeight: '100vh',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
        }}>
            <style>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <ContentSection
                title="Fee Structure"
                desc="View fee structure across different products and services"
            >
                <div className="space-y-6">
                    <Alert variant="info">
                        <AlertDescription>
                            Review the fees associated with different payment methods and services. Fees may vary based on currency and payment provider.
                        </AlertDescription>
                    </Alert>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Fee Structure</CardTitle>
                            <CardDescription>View all applicable fees for your transactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={activeCurrency} onValueChange={(value) => setActiveCurrency(value as CurrencyCode)}>
                                <TabsList className="grid w-full grid-cols-2 mb-6 rounded-none">
                                    <TabsTrigger value="XOF" className="rounded-none">XOF</TabsTrigger>
                                    <TabsTrigger value="USD" className="rounded-none">USD</TabsTrigger>
                                </TabsList>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium mb-3">Payment Processing Fees</h3>
                                        <div className="rounded-none border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="rounded-none">
                                                        <TableHead className="w-1/2 rounded-none text-center">PAYMENT METHOD</TableHead>
                                                        <TableHead className="w-1/2 rounded-none text-center">FEE</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {feeData[activeCurrency].paymentFees.map((fee, index) => (
                                                        <TableRow key={index} className="rounded-none">
                                                            <TableCell className="text-center">{fee.name}</TableCell>
                                                            <TableCell className="text-center font-medium">{fee.amount}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>

                                    <Separator className="my-6" />

                                    <div>
                                        <h3 className="text-sm font-medium mb-3">Other Fees</h3>
                                        <div className="rounded-none border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="rounded-none">
                                                        <TableHead className="w-1/2 rounded-none text-center">SERVICE</TableHead>
                                                        <TableHead className="w-1/2 rounded-none text-center">FEE</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {feeData[activeCurrency].otherFees.map((fee, index) => (
                                                        <TableRow key={index} className="rounded-none">
                                                            <TableCell className="text-center flex items-center justify-center gap-2">
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
                                                            <TableCell className="text-center font-medium">{fee.amount}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </ContentSection>
        </div>
    )
}