import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Transaction, transaction_status, transaction_type, provider_code } from './types'
import { ArrowDownToLine, RefreshCcw, LifeBuoy } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { jsPDF } from 'jspdf';
import { useSidebar } from '@/lib/hooks/useSidebar';

type TransactionActionsProps = {
    transaction: Transaction | null
    isOpen: boolean
    onClose: () => void
    isGenerating: boolean
}

export default function TransactionActions({ transaction, isOpen, onClose, isGenerating }: TransactionActionsProps) {
    const { sidebarData } = useSidebar();

    if (!transaction) return null

    const canRefund = transaction.status !== 'failed' && transaction.status !== 'refunded' && transaction.status !== 'pending'

    const handleContactSupport = () => {
        const subject = encodeURIComponent(`[Support] — Transaction Issue: ${transaction.transaction_id}`)
        const mailtoLink = `mailto:hello@lomi.africa?subject=${subject}`
        window.location.href = mailtoLink
    }

    const handleDownloadReceipt = async () => {
        if (!transaction) return;

        const doc = new jsPDF();

        // Set background color
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

        // Add company name and receipt title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(31, 41, 55);
        doc.text(sidebarData.organizationName || '', 15, 25);

        // Add company logo
        const logoUrl = sidebarData.organizationLogo;
        if (logoUrl) {
            const logoImage = await getImageFromUrl(logoUrl);
            const logoWidth = 20;
            const logoHeight = 20;
            const logoX = doc.internal.pageSize.width - 15 - logoWidth;
            const logoY = 15;
            doc.addImage(logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.text('Receipt', 15, 35);

        // Add horizontal line separator
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(15, 45, 195, 45);

        // Add transaction details
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(31, 41, 55);
        doc.text('Summary', 15, 55);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(75, 85, 99);
        const details = [
            `Transaction ID: ${transaction.transaction_id}`,
            `Amount: ${formatCurrency(transaction.gross_amount, transaction.currency)}`,
            `Status: ${formatTransactionStatus(transaction.status)}`,
            `Type: ${formatTransactionType(transaction.type)}`,
            `Date: ${formatDate(transaction.date)}`,
            `Provider: ${formatProviderCode(transaction.provider_code)}`,
        ];
        details.forEach((detail, index) => {
            doc.text(detail, 15, 65 + index * 7);
        });

        // Add horizontal line separator
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(15, 110, 195, 110);

        // Add customer information
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(31, 41, 55);
        doc.text('Customer Information', 15, 120);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(75, 85, 99);
        const customerInfo = [
            `Name: ${transaction.customer_name}`,
            `Email: ${transaction.customer_email || 'N/A'}`,
            `Phone: ${transaction.customer_phone || 'N/A'}`,
            `Country: ${transaction.customer_country || 'N/A'}`,
        ];
        customerInfo.forEach((info, index) => {
            doc.text(info, 15, 130 + index * 7);
        });

        let lastY = 160;

        // Add product details
        if (transaction.product_id) {
            // Add horizontal line separator
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.5);
            doc.line(15, lastY, 195, lastY);
            lastY += 10;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(31, 41, 55);
            doc.text('Product Details', 15, lastY);
            lastY += 10;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(75, 85, 99);
            const productDetails = [
                `Name: ${transaction.product_name}`,
                `Description: ${transaction.product_description}`,
                `Price: ${formatCurrency(transaction.product_price || 0, transaction.currency)}`,
            ];
            productDetails.forEach((detail, index) => {
                doc.text(detail, 15, lastY + index * 7);
            });
            lastY += productDetails.length * 7 + 10;
        }

        // Add subscription details
        if (transaction.subscription_id) {
            // Add horizontal line separator
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.5);
            doc.line(15, lastY, 195, lastY);
            lastY += 10;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(31, 41, 55);
            doc.text('Subscription Details', 15, lastY);
            lastY += 10;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(75, 85, 99);
            const subscriptionDetails = [
                `Plan Name: ${transaction.plan_name}`,
                `Description: ${transaction.plan_description}`,
                `Billing Frequency: ${formatBillingFrequency(transaction.plan_billing_frequency)}`,
                `End Date: ${formatDate(transaction.subscription_end_date)}`,
                `Next Billing Date: ${formatDate(transaction.subscription_next_billing_date)}`,
                `Status: ${formatSubscriptionStatus(transaction.subscription_status)}`,
            ];
            subscriptionDetails.forEach((detail, index) => {
                doc.text(detail, 15, lastY + index * 7);
            });
            lastY += subscriptionDetails.length * 7 + 10;
        }

        // Add footer
        const footerY = doc.internal.pageSize.height - 10;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('Powered by lomi. | © 2024 lomi.africa, Inc — All rights reserved', 15, footerY);

        // Save the PDF
        doc.save(`transaction_receipt_${transaction.transaction_id}.pdf`);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-2xl overflow-y-auto">
                <Card className="border-0 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Transaction Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="font-medium">Transaction ID:</div>
                                    <div>{transaction.transaction_id}</div>
                                    <div className="font-medium">Amount:</div>
                                    <div>{formatCurrency(transaction.gross_amount, transaction.currency)}</div>
                                    <div className="font-medium">Status:</div>
                                    <div>{formatTransactionStatus(transaction.status)}</div>
                                    <div className="font-medium">Type:</div>
                                    <div>{formatTransactionType(transaction.type)}</div>
                                    <div className="font-medium">Date:</div>
                                    <div>{formatDate(transaction.date)}</div>
                                    <div className="font-medium">Provider:</div>
                                    <div>{formatProviderCode(transaction.provider_code)}</div>
                                </div>
                            </section>
                            <Separator />
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="font-medium">Name:</div>
                                    <div>{transaction.customer_name}</div>
                                    {transaction.customer_email && (
                                        <>
                                            <div className="font-medium">Email:</div>
                                            <div>{transaction.customer_email}</div>
                                        </>
                                    )}
                                    {transaction.customer_phone && (
                                        <>
                                            <div className="font-medium">Phone:</div>
                                            <div>{transaction.customer_phone}</div>
                                        </>
                                    )}
                                    {transaction.customer_country && (
                                        <>
                                            <div className="font-medium">Country:</div>
                                            <div>{transaction.customer_country}</div>
                                        </>
                                    )}
                                </div>
                            </section>
                            {transaction.product_id && (
                                <>
                                    <Separator />
                                    <section>
                                        <h3 className="text-lg font-semibold mb-2">Product Details</h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="font-medium">Name:</div>
                                            <div>{transaction.product_name}</div>
                                            <div className="font-medium">Description:</div>
                                            <div>{transaction.product_description}</div>
                                            <div className="font-medium">Price:</div>
                                            <div>{formatCurrency(transaction.product_price || 0, transaction.currency)}</div>
                                        </div>
                                    </section>
                                </>
                            )}
                            {transaction.subscription_id && (
                                <>
                                    <Separator />
                                    <section>
                                        <h3 className="text-lg font-semibold mb-2">Subscription Details</h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="font-medium">Plan Name:</div>
                                            <div>{transaction.plan_name}</div>
                                            <div className="font-medium">Description:</div>
                                            <div>{transaction.plan_description}</div>
                                            <div className="font-medium">Billing Frequency:</div>
                                            <div>{formatBillingFrequency(transaction.plan_billing_frequency)}</div>
                                            <div className="font-medium">End Date:</div>
                                            <div>{formatDate(transaction.subscription_end_date)}</div>
                                            <div className="font-medium">Next Billing Date:</div>
                                            <div>{formatDate(transaction.subscription_next_billing_date)}</div>
                                            <div className="font-medium">Status:</div>
                                            <div>{formatSubscriptionStatus(transaction.subscription_status)}</div>
                                        </div>
                                    </section>
                                </>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto flex items-center space-x-2"
                            onClick={handleDownloadReceipt}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                                    <span>Download Receipt</span>
                                </>
                            )}
                        </Button>
                        {canRefund && (
                            <Button variant="outline" className="w-full sm:w-auto" disabled>
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Refund Transaction
                            </Button>
                        )}
                        <Button variant="outline" className="w-full sm:w-auto" onClick={handleContactSupport}>
                            <LifeBuoy className="mr-2 h-4 w-4" />
                            Contact Support
                        </Button>
                    </CardFooter>
                </Card>
            </SheetContent>
        </Sheet>
    )
}

function formatCurrency(amount: number, currency: string): string {
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })} ${currency}`;
}

function formatTransactionStatus(status: transaction_status): string {
    switch (status) {
        case 'pending':
            return 'Pending'
        case 'completed':
            return 'Completed'
        case 'failed':
            return 'Failed'
        case 'refunded':
            return 'Refunded'
        default:
            return status
    }
}

function formatTransactionType(type: transaction_type): string {
    return type.charAt(0).toUpperCase() + type.slice(1)
}

function formatProviderCode(providerCode: provider_code): string {
    switch (providerCode) {
        case 'ORANGE':
            return 'Orange'
        case 'WAVE':
            return 'Wave'
        case 'ECOBANK':
            return 'Ecobank'
        case 'MTN':
            return 'MTN'
        case 'STRIPE':
            return 'Stripe'
        case 'OTHER':
            return 'Other'
        default:
            return providerCode
    }
}

function formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatBillingFrequency(frequency: string | undefined): string {
    if (!frequency) return '';
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
}

function formatSubscriptionStatus(status: string | undefined): string {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1);
}

async function getImageFromUrl(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
