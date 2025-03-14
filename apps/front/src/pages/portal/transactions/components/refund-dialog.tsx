import { useState, useRef, useEffect } from 'react'
import { AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ButtonExpand } from "@/components/design/button-expand"
import { Transaction } from './types'
import { supabase } from "@/utils/supabase/client"
import waveClient from '@/utils/wave/client'
import { toast } from "@/lib/hooks/use-toast"

interface RefundDialogProps {
    transaction: Transaction
    isOpen: boolean
    onClose: () => void
}

export default function RefundDialog({ transaction, isOpen, onClose }: RefundDialogProps) {
    const [isRefunding, setIsRefunding] = useState(false);
    const [refundReason, setRefundReason] = useState('Customer requested refund.');
    const [refundAmount, setRefundAmount] = useState<string>("");
    const [isPartialRefund, setIsPartialRefund] = useState(false);
    const [processingFee, setProcessingFee] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Calculate processing fee (2% of refund amount)
    const calculateProcessingFee = (amount: number) => {
        return Math.round(amount * 0.02 * 100) / 100; // 2% fee rounded to 2 decimal places
    };

    // Calculate net refund amount (after fee deduction)
    const calculateNetRefundAmount = (amount: number) => {
        return Math.round((amount - calculateProcessingFee(amount)) * 100) / 100;
    };

    // Update refund amount and enforce max amount
    const updateRefundAmount = (value: string) => {
        // Clear any previous error
        setErrorMessage(null);

        // Remove any non-numeric characters except decimal point
        const sanitizedValue = value.replace(/[^\d.]/g, '');

        // Only allow one decimal point
        const parts = sanitizedValue.split('.');
        const newValue = parts.length > 1
            ? parts[0] + '.' + parts.slice(1).join('')
            : sanitizedValue;

        // Parse to check if valid number and not greater than transaction amount
        const amount = parseFloat(newValue);

        if (!isNaN(amount)) {
            if (amount > transaction.gross_amount) {
                // Set error but still update the displayed amount
                setErrorMessage(`Amount cannot exceed ${transaction.currency_code} ${formatAmount(transaction.gross_amount)}`);
            }

            // Update processing fee based on valid amount
            setProcessingFee(calculateProcessingFee(amount));
        } else {
            setProcessingFee(0);
        }

        // Always update the input field for better UX
        setRefundAmount(newValue);
    };

    // Reset state when dialog opens
    useEffect(() => {
        if (isOpen && transaction) {
            const amount = transaction.gross_amount.toString();
            setRefundAmount(amount);
            setProcessingFee(calculateProcessingFee(transaction.gross_amount));
            setIsPartialRefund(false);
            setRefundReason('Customer requested refund');
            setErrorMessage(null);
        }
    }, [isOpen, transaction]);

    const handleRefund = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        try {
            // Validate refund amount
            const amount = parseFloat(refundAmount);
            if (isNaN(amount) || amount <= 0) {
                setErrorMessage('Please enter a valid refund amount');
                return;
            }

            if (amount > transaction.gross_amount) {
                setErrorMessage(`Refund amount cannot exceed ${transaction.currency_code} ${formatAmount(transaction.gross_amount)}`);
                return;
            }

            setIsRefunding(true);

            if (transaction.provider_code === 'WAVE') {
                // Get the Wave transaction ID from the database
                const { data: providerTx, error: providerTxError } = await supabase
                    .from('providers_transactions')
                    .select('provider_transaction_id, provider_checkout_id')
                    .eq('transaction_id', transaction.transaction_id)
                    .single();

                if (providerTxError || !providerTx?.provider_transaction_id) {
                    throw new Error('Could not find Wave transaction details');
                }

                // Get the provider merchant ID using the RPC function
                const { data: providerMerchantId, error: providerMerchantIdError } = await supabase
                    .rpc('get_provider_merchant_id', {
                        p_organization_id: transaction.merchant_id,
                        p_provider_code: 'WAVE'
                    });

                if (providerMerchantIdError) {
                    console.error('Error fetching Wave merchant ID:', providerMerchantIdError);
                }

                // Use the Wave client to process the refund using the Wave transaction ID
                await waveClient.request(`/v1/transactions/${providerTx.provider_transaction_id}/refund`, {
                    method: 'POST',
                    body: JSON.stringify({
                        amount: amount.toString(),
                        currency: transaction.currency_code,
                        reason: refundReason
                    })
                });

                // Calculate processing fee (2%)
                const fee = calculateProcessingFee(amount);

                // Create a refund record using the create_refund function
                const { error: refundError } = await supabase
                    .rpc('create_refund', {
                        p_merchant_id: transaction.merchant_id,
                        p_transaction_id: transaction.transaction_id,
                        p_amount: amount,
                        p_reason: refundReason,
                        p_provider_transaction_id: providerTx.provider_transaction_id,
                        p_provider_merchant_id: providerMerchantId,
                        p_provider_code: transaction.provider_code,
                        p_metadata: {
                            processing_fee: fee,
                            net_refund_amount: amount - fee
                        }
                    });

                if (refundError) {
                    console.error('Error creating refund record:', refundError);
                    throw new Error('Failed to record the refund in our system');
                }

                toast({
                    title: "Refund Processed",
                    description: `Transaction ${transaction.transaction_id} has been refunded successfully (${formatAmount(amount)} ${transaction.currency_code}).`,
                });

                // Close the refund dialog
                onClose();
            } else {
                // Handle other providers here in future
                toast({
                    title: "Refund Not Supported",
                    description: `Refunds for ${formatProviderCode(transaction.provider_code)} are not yet supported through this interface.`,
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Refund failed:', error);
            toast({
                title: "Refund Failed",
                description: error instanceof Error ? error.message : "An unexpected error occurred",
                variant: "destructive"
            });
        } finally {
            setIsRefunding(false);
        }
    };

    // Handle number input without using type="number" to avoid refresh issues
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        updateRefundAmount(e.target.value);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl rounded-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-xl">Confirm Refund</DialogTitle>
                    <DialogDescription className="text-sm">
                        Please review the refund details below before confirming.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="text-sm">Amount to refund:</span>
                        <span className="font-medium">{transaction.currency_code} {formatAmount(transaction.gross_amount)}</span>
                    </div>

                    <div className="flex flex-col space-y-4">
                        {/* Better styled toggle button group */}
                        <div className="w-full bg-muted rounded-md p-1 grid grid-cols-2 gap-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsPartialRefund(false);
                                    updateRefundAmount(transaction.gross_amount.toString());
                                }}
                                className={`py-2 rounded-md text-sm font-medium transition-all ${!isPartialRefund
                                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-sm'
                                    : 'bg-transparent hover:bg-green-50/50 dark:hover:bg-green-900/20 text-muted-foreground'
                                    }`}
                            >
                                Full Refund
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsPartialRefund(true);
                                    if (parseFloat(refundAmount) <= 0 || isNaN(parseFloat(refundAmount))) {
                                        updateRefundAmount((transaction.gross_amount / 2).toString());
                                    }
                                }}
                                className={`py-2 rounded-md text-sm font-medium transition-all ${isPartialRefund
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                                    : 'bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-muted-foreground'
                                    }`}
                            >
                                Partial Refund
                            </button>
                        </div>

                        {isPartialRefund && (
                            <div className="flex flex-col space-y-1">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        {transaction.currency_code}
                                    </span>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        inputMode="decimal"
                                        pattern="[0-9]*\.?[0-9]*"
                                        min="0.01"
                                        max={transaction.gross_amount.toString()}
                                        value={refundAmount}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                return false;
                                            }
                                            return undefined;
                                        }}
                                        className={`w-full pl-14 py-2 rounded-md border ${errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-input'} bg-background text-sm`}
                                    />
                                </div>
                                {errorMessage && (
                                    <div className="text-xs text-red-500 mt-1">
                                        {errorMessage}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Processing Fee:</span>
                            <div className="flex items-center">
                                <span className="font-medium text-orange-600 dark:text-orange-400">
                                    {transaction.currency_code} {formatAmount(processingFee)}
                                </span>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button type="button" className="ml-2 text-muted-foreground hover:text-foreground">
                                                <AlertCircle className="h-3 w-3" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left" className="max-w-xs text-xs p-1">
                                            A 2% fee is charged for all refunds to cover processing costs.
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Net refund to merchant:</span>
                            <span>{transaction.currency_code} {formatAmount(calculateNetRefundAmount(parseFloat(refundAmount) || 0))}</span>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="reason" className="text-sm">Reason</Label>
                        <textarea
                            id="reason"
                            className="w-full p-3 border rounded-md bg-background text-foreground resize-y min-h-[80px]"
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            placeholder="Please provide a reason for the refund..."
                            rows={2}
                        />
                        <div className="space-y-2">
                            <Alert className="bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 py-2 rounded-lg flex items-center">
                                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 ml-1 " />
                                <AlertDescription className="text-amber-700 dark:text-amber-300 text-xs mt-1">
                                    Your refund description will be included in the refund record and visible to the customer. — Refunds are processed immediately and cannot be undone.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row w-full gap-2 pt-4">
                        <ButtonExpand
                            text="Cancel"
                            onClick={onClose}
                            bgColor="bg-gray-50 dark:bg-gray-900/30"
                            textColor="text-gray-700 dark:text-gray-300"
                            hoverBgColor="hover:bg-gray-100 dark:hover:bg-gray-900/40"
                            hoverTextColor="hover:text-gray-800 dark:hover:text-gray-200"
                            className="rounded-md w-full h-10"
                            type="button"
                        />
                        <ButtonExpand
                            text={isRefunding ? "Processing..." : "Confirm Refund"}
                            onClick={() => {
                                // Only allow clicking if not refunding and amount is valid
                                if (!isRefunding &&
                                    parseFloat(refundAmount) <= transaction.gross_amount &&
                                    errorMessage === null) {
                                    handleRefund();
                                }
                            }}
                            bgColor={
                                isRefunding ||
                                    parseFloat(refundAmount) > transaction.gross_amount ||
                                    errorMessage !== null
                                    ? "bg-red-50/50 dark:bg-red-900/20"
                                    : "bg-red-50 dark:bg-red-900/30"
                            }
                            textColor={
                                isRefunding ||
                                    parseFloat(refundAmount) > transaction.gross_amount ||
                                    errorMessage !== null
                                    ? "text-red-400 dark:text-red-400"
                                    : "text-red-700 dark:text-red-300"
                            }
                            hoverBgColor={
                                isRefunding ||
                                    parseFloat(refundAmount) > transaction.gross_amount ||
                                    errorMessage !== null
                                    ? "hover:bg-red-50/50 dark:hover:bg-red-900/20"
                                    : "hover:bg-red-100 dark:hover:bg-red-900/40"
                            }
                            hoverTextColor={
                                isRefunding ||
                                    parseFloat(refundAmount) > transaction.gross_amount ||
                                    errorMessage !== null
                                    ? "hover:text-red-400 dark:hover:text-red-400"
                                    : "hover:text-red-800 dark:hover:text-red-200"
                            }
                            className={`rounded-md w-full h-10 ${isRefunding ||
                                parseFloat(refundAmount) > transaction.gross_amount ||
                                errorMessage !== null
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                                }`}
                            type="button"
                        />
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Helper function for formatting amounts
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

// Format provider code
function formatProviderCode(providerCode: string): string {
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