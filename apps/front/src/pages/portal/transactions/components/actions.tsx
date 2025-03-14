import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Transaction, transaction_status, transaction_type, provider_code } from './types'
import { ArrowDownToLine, RefreshCcw, LifeBuoy, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { jsPDF } from 'jspdf';
import { useSidebar } from '@/lib/hooks/use-sidebar';
import { toast } from "@/lib/hooks/use-toast"
import { useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import RefundDialog from './refund-dialog'
import { Badge } from "@/components/ui/badge"
import { ButtonExpand } from "@/components/design/button-expand"

type TransactionActionsProps = {
    transaction: Transaction | null
    isOpen: boolean
    onClose: () => void
    isGenerating: boolean
}

export default function TransactionActions({ transaction, isOpen, onClose, isGenerating }: TransactionActionsProps) {
    const { sidebarData } = useSidebar();
    const [refundDialogOpen, setRefundDialogOpen] = useState(false);

    if (!transaction) return null

    const handleContactSupport = () => {
        const subject = encodeURIComponent(`[Support] — Transaction Issue: ${transaction.transaction_id}`)
        const mailtoLink = `mailto:hello@lomi.africa?subject=${subject}`
        window.location.href = mailtoLink
    }

    // A transaction can be refunded if it's completed and not already refunded
    // Also for Wave, we need to make sure provider_transaction_id exists
    const canRefund = transaction.status === 'completed' &&
        transaction.status !== 'refunded' as transaction_status &&
        !(transaction.provider_code === 'WAVE' && !transaction.provider_transaction_id);

    // Initialize refund
    const initializeRefund = () => {
        setRefundDialogOpen(true);
    };

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
            `Amount: XOF ${formatAmount(transaction.gross_amount)}`,
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
                `Price: XOF ${formatAmount(transaction.product_price || 0)}`,
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
        doc.text('Powered by lomi. | © 2025 lomi.africa, Inc — All rights reserved', 15, footerY);

        // Save the PDF
        doc.save(`transaction_receipt_${transaction.transaction_id}.pdf`);

        toast({
            description: "Receipt downloaded successfully",
        });
    };

    return (
        <>
            <RefundDialog
                transaction={transaction}
                isOpen={refundDialogOpen}
                onClose={() => setRefundDialogOpen(false)}
            />

            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="sm:max-w-2xl w-full p-0 overflow-y-auto rounded-none">
                    <Card className="border-0 shadow-none rounded-none h-full">
                        <CardHeader className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-medium">Transaction Details</CardTitle>
                            <button onClick={onClose} className="text-muted-foreground hover:text-foreground md:hidden">
                                <X className="h-4 w-4" />
                            </button>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4 overflow-auto">
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Internal ID</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(transaction.transaction_id);
                                            toast({
                                                description: "Copied to clipboard",
                                            });
                                        }}
                                        className="font-mono text-xs text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                                    >
                                        {transaction.transaction_id}
                                    </button>
                                </div>

                                {transaction.provider_transaction_id && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Transaction ID</span>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(transaction.provider_transaction_id || '');
                                                toast({
                                                    description: "Copied to clipboard",
                                                });
                                            }}
                                            className="font-mono text-xs text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                                        >
                                            {transaction.provider_transaction_id}
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className={`
                                        inline-block px-2 py-1 rounded-none text-xs font-normal
                                        ${transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                            transaction.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                                transaction.status === 'refunded' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' :
                                                    transaction.status === ('expired' as transaction_status) ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                                                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}
                                    `}>
                                        {formatTransactionStatus(transaction.status)}
                                    </span>
                                </div>

                                <Separator />

                                <div>
                                    <span className="text-sm text-muted-foreground block">Amount</span>
                                    <div className="flex flex-col">
                                        {transaction.status === 'refunded' && (
                                            <Badge className="w-fit text-xs rounded-none bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 mb-1">
                                                Refunded
                                            </Badge>
                                        )}
                                        <p className="text-sm font-medium">{transaction.currency_code} {formatAmount(transaction.gross_amount)}</p>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-sm text-muted-foreground block">Date</span>
                                    <p className="text-sm mt-1">{formatDate(transaction.date)}</p>
                                </div>

                                <div>
                                    <span className="text-sm text-muted-foreground block">Provider</span>
                                    {transaction.provider_code === 'ECOBANK' ? (
                                        <div className="mt-1 flex items-center gap-2">
                                            <div className="inline-flex items-center justify-center rounded-sm">
                                                <img
                                                    src="/payment_channels/visa.webp"
                                                    alt="Visa"
                                                    width={55}
                                                    height={55}
                                                    className="rounded-sm"
                                                />
                                            </div>
                                            <div className="inline-flex items-center justify-center rounded-sm">
                                                <img
                                                    src="/payment_channels/mastercard.webp"
                                                    alt="Mastercard"
                                                    width={55}
                                                    height={55}
                                                    className="rounded-sm"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-1 flex items-center gap-2">
                                            <div className={`
                                                inline-flex items-center justify-center rounded-sm
                                                ${transaction.provider_code === 'ORANGE' ? 'bg-[#FC6307]' : ''}
                                                ${transaction.provider_code === 'WAVE' ? 'bg-[#71CDF4]' : ''}  
                                                ${transaction.provider_code === 'MTN' ? 'bg-[#F7CE46]' : ''}
                                                ${transaction.provider_code === 'NOWPAYMENTS' ? 'bg-[#037BFE]' : ''}
                                                ${transaction.provider_code === 'MOOV' ? 'bg-[#0093DD]' : ''}
                                                ${transaction.provider_code === 'AIRTEL' ? 'bg-[#FF0000]' : ''}
                                                ${transaction.provider_code === 'MPESA' ? 'bg-[#4CAF50]' : ''}
                                                ${transaction.provider_code === 'OPAY' ? 'bg-[#14B55A]' : ''}
                                                ${transaction.provider_code === 'PAYPAL' ? 'bg-[#003087]' : ''}
                                                ${transaction.provider_code === 'OTHER' ? 'bg-gray-200' : ''}
                                            `}>
                                                {transaction.provider_code === 'WAVE' && (
                                                    <img
                                                        src="/payment_channels/wave.webp"
                                                        alt="Wave"
                                                        width={55}
                                                        height={55}
                                                        className="rounded-sm"
                                                    />
                                                )}
                                                {transaction.provider_code === 'ORANGE' && (
                                                    <img
                                                        src="/payment_channels/orange.webp"
                                                        alt="Orange"
                                                        width={55}
                                                        height={55}
                                                        className="rounded-sm"
                                                    />
                                                )}
                                                {transaction.provider_code === 'MTN' && (
                                                    <img
                                                        src="/payment_channels/mtn.webp"
                                                        alt="MTN"
                                                        width={55}
                                                        height={55}
                                                        className="rounded-sm"
                                                    />
                                                )}
                                                {transaction.provider_code === 'NOWPAYMENTS' && (
                                                    <img
                                                        src="/company/lomi_icon.webp"
                                                        alt="lomi."
                                                        width={55}
                                                        height={55}
                                                        className="rounded-sm"
                                                    />
                                                )}
                                                {transaction.provider_code === 'MOOV' && (
                                                    <img
                                                        src="/payment_channels/moov.webp"
                                                        alt="Moov"
                                                        width={55}
                                                        height={55}
                                                        className="rounded-sm"
                                                    />
                                                )}
                                                {transaction.provider_code === 'AIRTEL' && (
                                                    <img
                                                        src="/payment_channels/airtel.webp"
                                                        alt="Airtel"
                                                        width={55}
                                                        height={55}
                                                        className="rounded-sm"
                                                    />
                                                )}
                                                {transaction.provider_code === 'MPESA' && (
                                                    <img
                                                        src="/payment_channels/mpesa.webp"
                                                        alt="M-Pesa"
                                                        width={55}
                                                        height={55}
                                                        className="rounded-sm"
                                                    />
                                                )}
                                                {transaction.provider_code === 'OPAY' && (
                                                    <img
                                                        src="/payment_channels/opay.webp"
                                                        alt="OPay"
                                                        width={55}
                                                        height={55}
                                                        className="rounded-sm"
                                                    />
                                                )}
                                                {transaction.provider_code === 'PAYPAL' && (
                                                    <img
                                                        src="/payment_channels/paypal.webp"
                                                        alt="PayPal"
                                                        width={55}
                                                        height={55}
                                                        className="rounded-sm"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <section>
                                    <h3 className="text-sm font-medium mb-2">Customer Information</h3>
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
                                            <h3 className="text-sm font-medium mb-2">Product Details</h3>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="font-medium">Name:</div>
                                                <div>{transaction.product_name}</div>
                                                <div className="font-medium">Description:</div>
                                                <div>{transaction.product_description}</div>
                                                <div className="font-medium">Price:</div>
                                                <div>XOF {formatAmount(transaction.product_price || 0)}</div>
                                            </div>
                                        </section>
                                    </>
                                )}

                                {transaction.subscription_id && (
                                    <>
                                        <Separator />
                                        <section>
                                            <h3 className="text-sm font-medium mb-2">Subscription Details</h3>
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
                        <CardFooter className="border-t p-4 flex flex-col sm:flex-row justify-between gap-2">
                            <div className="flex w-full sm:w-auto">
                                <ButtonExpand
                                    text={isGenerating ? "Generating..." : "Download Receipt"}
                                    icon={ArrowDownToLine}
                                    onClick={handleDownloadReceipt}
                                    bgColor="bg-blue-50 dark:bg-blue-900/30"
                                    textColor="text-blue-700 dark:text-blue-300"
                                    hoverBgColor="hover:bg-blue-100 dark:hover:bg-blue-900/40"
                                    hoverTextColor="hover:text-blue-800 dark:hover:text-blue-200"
                                    className={`rounded-md w-full ${isGenerating ? "opacity-50 cursor-not-allowed" : ""}`}
                                />
                            </div>
                            {transaction.provider_code === 'NOWPAYMENTS' && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="w-full sm:w-auto">
                                                <ButtonExpand
                                                    text="Refund Transaction"
                                                    icon={RefreshCcw}
                                                    bgColor="bg-gray-50 dark:bg-gray-900/30"
                                                    textColor="text-gray-400 dark:text-gray-400"
                                                    hoverBgColor="hover:bg-gray-50 dark:hover:bg-gray-900/30"
                                                    hoverTextColor="hover:text-gray-400 dark:hover:text-gray-400"
                                                    className="rounded-md w-full opacity-50 cursor-not-allowed"
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Payments made by crypto can&apos;t be refunded for the moment
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                            {transaction.provider_code === 'WAVE' && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="w-full sm:w-auto">
                                                <ButtonExpand
                                                    text="Refund Transaction"
                                                    icon={RefreshCcw}
                                                    onClick={canRefund ? initializeRefund : undefined}
                                                    bgColor={!canRefund ? "bg-gray-50 dark:bg-gray-900/30" : "bg-red-50 dark:bg-red-900/30"}
                                                    textColor={!canRefund ? "text-gray-400 dark:text-gray-400" : "text-red-700 dark:text-red-300"}
                                                    hoverBgColor={!canRefund ? "hover:bg-gray-50 dark:hover:bg-gray-900/30" : "hover:bg-red-100 dark:hover:bg-red-900/40"}
                                                    hoverTextColor={!canRefund ? "hover:text-gray-400 dark:hover:text-gray-400" : "hover:text-red-800 dark:hover:text-red-200"}
                                                    className={`rounded-md w-full ${!canRefund ? "opacity-50 cursor-not-allowed" : ""}`}
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {!canRefund ? (
                                                transaction.status === 'refunded'
                                                    ? "This transaction has already been refunded"
                                                    : transaction.status !== 'completed'
                                                        ? "Only completed transactions can be refunded"
                                                        : "Missing Wave transaction details"
                                            ) : "Process a refund for this transaction"}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                            {transaction.provider_code !== 'WAVE' && transaction.provider_code !== 'NOWPAYMENTS' && (
                                <div className="w-full sm:w-auto">
                                    <ButtonExpand
                                        text="Refund Transaction"
                                        icon={RefreshCcw}
                                        bgColor="bg-gray-50 dark:bg-gray-900/30"
                                        textColor="text-gray-400 dark:text-gray-400"
                                        hoverBgColor="hover:bg-gray-50 dark:hover:bg-gray-900/30"
                                        hoverTextColor="hover:text-gray-400 dark:hover:text-gray-400"
                                        className="rounded-md w-full opacity-50 cursor-not-allowed"
                                    />
                                </div>
                            )}
                            <div className="w-full sm:w-auto">
                                <ButtonExpand
                                    text="Contact Support"
                                    icon={LifeBuoy}
                                    onClick={handleContactSupport}
                                    bgColor="bg-purple-50 dark:bg-purple-900/30"
                                    textColor="text-purple-700 dark:text-purple-300"
                                    hoverBgColor="hover:bg-purple-100 dark:hover:bg-purple-900/40"
                                    hoverTextColor="hover:text-purple-800 dark:hover:text-purple-200"
                                    className="rounded-md w-full"
                                />
                            </div>
                        </CardFooter>
                    </Card>
                </SheetContent>
            </Sheet>
        </>
    )
}

function formatAmount(amount: number): string {
    // Return simple "0" for zero values
    if (amount === 0) return "0"

    // Format with thousands separators as spaces and decimal as comma
    const integerPart = Math.floor(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")

    // Get decimal part if it exists and format with comma
    const decimalPart = (amount % 1).toFixed(2).substring(2)

    // Only show decimal part if it's not .00
    if (decimalPart === "00") {
        return integerPart
    }

    return `${integerPart},${decimalPart}`
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
        case ('expired' as transaction_status):
            return 'Expired'
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
            return 'Visa / Mastercard'
        case 'MTN':
            return 'MTN'
        case 'NOWPAYMENTS':
            return 'lomi.'
        case 'PAYPAL':
            return 'Paypal'
        case 'APPLE':
            return 'Apple'
        case 'GOOGLE':
            return 'Google'
        case 'MOOV':
            return 'Moov'
        case 'AIRTEL':
            return 'Airtel'
        case 'MPESA':
            return 'M-Pesa'
        case 'OPAY':
            return 'OPay'
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

