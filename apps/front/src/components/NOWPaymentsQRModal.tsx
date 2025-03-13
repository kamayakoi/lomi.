import { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    ClipboardCopy,
    CheckCircle,
    RefreshCw
} from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import nowPaymentsService from '@/utils/nowpayments/service';
import { formatCryptoAmount } from '@/utils/currency-utils';
import { formatCurrency } from '@/lib/formatter';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/utils/supabase/client';
import type { NOWPaymentsCurrency } from '@/utils/nowpayments/types';

interface NOWPaymentsQRModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionId: string;
    onPaymentSuccess?: () => void;
    onPaymentError?: (error?: string) => void;
}

export function NOWPaymentsQRModal({
    isOpen,
    onClose,
    transactionId,
    onPaymentSuccess,
    onPaymentError
}: NOWPaymentsQRModalProps) {
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
    const [copied, setCopied] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [availableCurrencies, setAvailableCurrencies] = useState<NOWPaymentsCurrency[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState('btc');
    const [paymentData, setPaymentData] = useState<{
        paymentId: string;
        payAddress: string;
        payAmount: number;
        paymentStatus: string;
        originalAmount: number;
        originalCurrency: string;
        payCurrency: string;
    } | null>(null);

    // Load available cryptocurrencies
    useEffect(() => {
        async function loadCurrencies() {
            try {
                const currencies = await nowPaymentsService.getAvailableCurrencies();
                setAvailableCurrencies(currencies.filter(c => c.enabled));
            } catch (error) {
                console.error("Error loading cryptocurrencies:", error);
                // Continue with default (BTC)
            }
        }

        loadCurrencies();
    }, []);

    // Load payment data
    useEffect(() => {
        if (!isOpen || !transactionId) return;

        async function loadPaymentData() {
            try {
                setLoading(true);

                // Get transaction details from database
                const { data: paymentData, error: paymentError } = await supabase
                    .rpc('get_nowpayments_payment_status_by_transaction_id', {
                        p_transaction_id: transactionId
                    });

                if (paymentError || !paymentData) {
                    console.error('Error fetching payment data:', paymentError || 'No data returned');
                    throw new Error('Transaction not found');
                }

                // Get payment details from NOWPayments
                let paymentDetails;
                try {
                    paymentDetails = await nowPaymentsService.checkPaymentStatus(paymentData.provider_checkout_id);
                } catch (apiError) {
                    console.error('Error fetching payment details from API:', apiError);
                    // Continue with data from database only
                }

                // Extract payment data
                const metadata = paymentData.metadata || {};
                const nowpaymentsSession = metadata.nowpayments_session || {};
                const payAddress = paymentDetails?.pay_address || nowpaymentsSession.pay_address;

                if (!payAddress) {
                    throw new Error('Payment address not found');
                }

                // Set payment status based on transaction status
                if (paymentData.status === 'completed') {
                    setPaymentStatus('completed');
                } else if (paymentData.status === 'failed' || paymentData.status === 'refunded') {
                    setPaymentStatus('failed');
                } else {
                    setPaymentStatus('pending');
                }

                // Set initial currency from database
                const payCurrency = paymentData.pay_currency?.toLowerCase() || 'btc';
                setSelectedCurrency(payCurrency);

                setPaymentData({
                    paymentId: paymentData.provider_checkout_id,
                    payAddress: payAddress,
                    payAmount: paymentData.pay_amount || paymentDetails?.pay_amount || nowpaymentsSession.pay_amount,
                    paymentStatus: paymentData.status,
                    originalAmount: paymentData.amount,
                    originalCurrency: paymentData.currency,
                    payCurrency: payCurrency
                });
            } catch (err) {
                console.error('Error loading payment data:', err);
                if (onPaymentError) {
                    onPaymentError(err instanceof Error ? err.message : 'Failed to load payment data');
                }
            } finally {
                setLoading(false);
            }
        }

        loadPaymentData();

        // Set up polling to check payment status
        const pollInterval = setInterval(async () => {
            if (!transactionId) {
                clearInterval(pollInterval);
                return;
            }

            try {
                const { data: statusData } = await supabase
                    .rpc('get_nowpayments_payment_status_by_transaction_id', {
                        p_transaction_id: transactionId
                    });

                if (!statusData) return;

                if (statusData.status === 'completed') {
                    setPaymentStatus('completed');
                    if (onPaymentSuccess) {
                        setTimeout(() => {
                            onPaymentSuccess();
                        }, 2000);
                    }
                    clearInterval(pollInterval);
                } else if (statusData.status === 'failed' || statusData.status === 'refunded') {
                    setPaymentStatus('failed');
                    if (onPaymentError) {
                        onPaymentError('Payment failed or was cancelled');
                    }
                    clearInterval(pollInterval);
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
            }
        }, 5000); // Check every 5 seconds

        return () => {
            clearInterval(pollInterval);
        };
    }, [isOpen, transactionId, onPaymentSuccess, onPaymentError]);

    // Function to copy address to clipboard
    const handleCopyAddress = useCallback(() => {
        if (!paymentData?.payAddress) return;

        try {
            navigator.clipboard.writeText(paymentData.payAddress);
            setCopied(true);
            toast({
                title: "Address copied to clipboard",
                variant: "default"
            });
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            console.error('Failed to copy:', err);
            toast({
                title: "Failed to copy address",
                variant: "destructive"
            });
        }
    }, [paymentData?.payAddress, toast]);

    // Function to handle refresh
    const handleRefresh = useCallback(async () => {
        if (!paymentData?.paymentId || refreshing) return;

        setRefreshing(true);
        try {
            const refreshedData = await nowPaymentsService.checkPaymentStatus(paymentData.paymentId);
            console.log('Refreshed payment status:', refreshedData);

            // Update status if needed
            if (refreshedData.payment_status === 'finished') {
                setPaymentStatus('completed');
                if (onPaymentSuccess) {
                    setTimeout(() => onPaymentSuccess(), 2000);
                }
            } else if (refreshedData.payment_status === 'failed' || refreshedData.payment_status === 'refunded') {
                setPaymentStatus('failed');
            }

            toast({
                title: "Payment status refreshed",
                variant: "default"
            });
        } catch (error) {
            console.error('Error refreshing payment status:', error);
            toast({
                title: "Failed to refresh status",
                variant: "destructive"
            });
        } finally {
            setRefreshing(false);
        }
    }, [paymentData?.paymentId, refreshing, onPaymentSuccess, toast]);

    // Function to handle currency change
    const handleCurrencyChange = useCallback(async (newCurrency: string) => {
        if (!paymentData || newCurrency === selectedCurrency) return;

        setLoading(true);
        try {
            console.log(`Changing currency from ${selectedCurrency} to ${newCurrency}`);

            // Create a new payment with the new currency
            const result = await nowPaymentsService.updatePaymentCurrency({
                transactionId: transactionId,
                newCurrency: newCurrency
            });

            if (result.success) {
                setSelectedCurrency(newCurrency);
                setPaymentData({
                    ...paymentData,
                    payAddress: result.payAddress,
                    payAmount: result.payAmount,
                    payCurrency: newCurrency
                });

                toast({
                    title: `Currency changed to ${newCurrency.toUpperCase()}`,
                    variant: "default"
                });
            } else {
                throw new Error('Failed to update currency');
            }
        } catch (error) {
            console.error('Error changing currency:', error);

            // If it fails, try one more time with USD as intermediary currency
            try {
                console.log('Retrying with explicit USD conversion...');
                const retryResult = await nowPaymentsService.updatePaymentCurrency({
                    transactionId: transactionId,
                    newCurrency: newCurrency,
                    forceUsdConversion: true
                });

                if (retryResult.success) {
                    setSelectedCurrency(newCurrency);
                    setPaymentData({
                        ...paymentData,
                        payAddress: retryResult.payAddress,
                        payAmount: retryResult.payAmount,
                        payCurrency: newCurrency
                    });

                    toast({
                        title: `Currency changed to ${newCurrency.toUpperCase()}`,
                        variant: "default"
                    });
                    return;
                }
            } catch (retryError) {
                console.error('Retry attempt also failed:', retryError);
            }

            // If both attempts fail, show error toast
            toast({
                title: "Failed to change currency",
                description: "Please try again or use a different currency",
                variant: "destructive"
            });

            // Revert the selection in UI
            setSelectedCurrency(paymentData.payCurrency);
        } finally {
            setLoading(false);
        }
    }, [paymentData, selectedCurrency, transactionId, toast]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm mx-auto bg-white text-black p-4 rounded-lg shadow-lg">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-center text-xl font-bold text-black">
                        Cryptocurrency Payment
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-8">
                        <Loader2 className="h-10 w-10 animate-spin text-gray-400 mb-4" />
                        <p className="text-gray-600">Loading payment details...</p>
                    </div>
                ) : paymentStatus === 'completed' ? (
                    <div className="flex flex-col items-center py-8">
                        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                        <h3 className="text-xl font-medium text-center">Payment Successful!</h3>
                        <p className="text-center text-sm text-gray-600 mt-2">
                            Your cryptocurrency payment has been confirmed.
                        </p>
                    </div>
                ) : paymentStatus === 'failed' ? (
                    <div className="flex flex-col items-center py-8">
                        <div className="text-red-500 text-4xl mb-4">⚠️</div>
                        <h3 className="text-xl font-medium text-center">Payment Failed</h3>
                        <p className="text-center text-sm text-gray-600 mt-2">
                            Your payment could not be processed. Please try again or use a different payment method.
                        </p>
                    </div>
                ) : paymentData ? (
                    <div className="flex flex-col items-center">
                        <div className="flex justify-between w-full mb-2">
                            <p className="text-sm text-gray-600">
                                Send exactly
                            </p>
                            <button
                                onClick={handleRefresh}
                                className="p-1 rounded-full hover:bg-gray-100"
                                disabled={refreshing}
                            >
                                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-blue-500' : 'text-gray-500'}`} />
                            </button>
                        </div>

                        <div className="text-lg font-bold mb-4 flex items-center gap-2">
                            {formatCryptoAmount(paymentData.payAmount, paymentData.payCurrency)} {paymentData.payCurrency.toUpperCase()}
                        </div>

                        {/* Currency Selection */}
                        <div className="w-full mb-4">
                            <Label htmlFor="crypto-currency" className="text-xs text-gray-500 mb-1 block">
                                Select cryptocurrency
                            </Label>
                            <Select
                                value={selectedCurrency}
                                onValueChange={handleCurrencyChange}
                                disabled={availableCurrencies.length === 0}
                            >
                                <SelectTrigger id="crypto-currency" className="w-full bg-white">
                                    <SelectValue placeholder="Select cryptocurrency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCurrencies.map(currency => (
                                        <SelectItem key={currency.code} value={currency.code.toLowerCase()}>
                                            {currency.name} ({currency.code.toUpperCase()})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* QR Code */}
                        <div className="w-full bg-white p-4 rounded-lg border border-gray-200 flex justify-center mb-4">
                            <QRCodeSVG
                                value={paymentData.payAddress}
                                size={180}
                                bgColor="#FFFFFF"
                                fgColor="#000000"
                                level="M"
                                includeMargin={true}
                            />
                        </div>

                        {/* Payment Info */}
                        <div className="w-full bg-gray-50 p-3 rounded-lg mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Amount:</span>
                                <span className="text-sm font-semibold">
                                    {formatCurrency(paymentData.originalAmount, paymentData.originalCurrency)}
                                </span>
                            </div>

                            <div className="flex flex-col mb-2">
                                <span className="text-xs text-gray-500 mb-1">Wallet address:</span>
                                <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                    <span className="text-xs font-mono overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[80%]">
                                        {paymentData.payAddress}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleCopyAddress}
                                        className="h-6 w-6"
                                    >
                                        {copied ? (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <ClipboardCopy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="w-full border border-gray-200 rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Status:</span>
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                    Waiting for payment
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-center text-gray-500 mb-2">
                            Payment will be automatically confirmed once received.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-8">
                        <p className="text-red-500">Error loading payment details</p>
                        <Button
                            onClick={onClose}
                            className="mt-4"
                        >
                            Close
                        </Button>
                    </div>
                )}

                <DialogFooter className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">
                        Powered by lomi.
                    </div>
                    {paymentStatus === 'pending' && (
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="text-sm"
                        >
                            Cancel payment
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 