import { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    ClipboardCopy,
    CheckCircle,
    RefreshCw,
    Check,
    X,
} from 'lucide-react';
import { ShieldIcon } from '@/components/icons/ShieldIcon'
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
} from "@/components/ui/select-crypto";
import { supabase } from '@/utils/supabase/client';
import type { NOWPaymentsCurrency } from '@/utils/nowpayments/types';
import Spinner from '@/components/ui/spinner';
import { motion } from 'framer-motion';
import { CryptoIcon } from './CryptoIcon';

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
    const [error, setError] = useState<string | null>(null);

    // Function to sort cryptocurrencies in a logical order
    const sortCryptocurrencies = (currencies: NOWPaymentsCurrency[]): NOWPaymentsCurrency[] => {
        // Define priority order (most popular first)
        const priorityOrder = [
            'btc', 'eth', 'usdt', 'usdc', 'dai', 'sol', 'bnb', 'matic',
            'doge', 'ada', 'xrp', 'trx', 'fil', 'ton', 'xtz', 'ftm', 'link', 'zec'
        ];

        // Create a map for quick lookup of priority
        const priorityMap = new Map(priorityOrder.map((code, index) => [code.toLowerCase(), index]));

        // Sort the currencies based on priority
        return [...currencies].sort((a, b) => {
            const priorityA = priorityMap.has(a.code.toLowerCase()) ? priorityMap.get(a.code.toLowerCase()) : 999;
            const priorityB = priorityMap.has(b.code.toLowerCase()) ? priorityMap.get(b.code.toLowerCase()) : 999;

            return (priorityA || 999) - (priorityB || 999);
        });
    };

    // Update the loadCurrencies function
    useEffect(() => {
        async function loadCurrencies() {
            try {
                const currencies = await nowPaymentsService.getAvailableCurrencies();

                // Make sure all currencies are marked as enabled
                const enabledCurrencies = currencies.map(c => ({
                    ...c,
                    enabled: true
                }));

                // Sort currencies in the desired order
                const sortedCurrencies = sortCryptocurrencies(enabledCurrencies);

                setAvailableCurrencies(sortedCurrencies);
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
        setError(null);

        try {
            console.log(`Changing currency from ${selectedCurrency} to ${newCurrency}`);

            // Skip TUSD as it's known to have issues
            if (newCurrency.toLowerCase() === 'tusd') {
                throw new Error('TUSD is currently not supported');
            }

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
            <DialogContent className="max-w-md mx-auto bg-white text-black p-4 rounded-lg shadow-lg">
                <DialogHeader className="mb-1">
                    <DialogTitle className="text-center text-xl font-bold text-black">
                        {/* Title removed as requested */}
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <Spinner className="w-5 h-5" />
                        <p className="text-sm text-gray-600">Processing payment...</p>
                    </div>
                ) : paymentStatus === 'completed' ? (
                    <div className="flex flex-col items-center py-6">
                        <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
                        <h3 className="text-lg font-medium text-center text-gray-900">Payment Successful!</h3>
                        <p className="text-center text-sm text-gray-600 mt-1">
                            Your cryptocurrency payment has been confirmed.
                        </p>
                    </div>
                ) : paymentStatus === 'failed' ? (
                    <div className="flex flex-col items-center justify-center p-6">
                        <div className="bg-red-50 text-red-600 rounded-full p-3 mb-4">
                            <X className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium mb-2 text-gray-900">Payment Error</h3>
                        <p className="text-sm text-gray-500 text-center mb-4">
                            {error || "Unable to create payment. Please try again."}
                        </p>
                        <Button
                            onClick={onClose}
                            className="mb-2 bg-gray-100 hover:bg-gray-200 text-gray-800"
                        >
                            Close
                        </Button>
                    </div>
                ) : paymentData ? (
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md border border-gray-100 mt-1 mb-4">
                            <span className="text-gray-600 text-sm">Send exactly</span>
                            <div className="flex items-center gap-1.5">
                                <span className="font-medium text-gray-900">{formatCryptoAmount(paymentData.payAmount, paymentData.payCurrency)}</span>
                                <button
                                    onClick={handleRefresh}
                                    className="text-blue-500 cursor-pointer ml-1 hover:text-blue-600 transition-colors"
                                    disabled={refreshing}
                                >
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Currency Selection */}
                        <div className="w-full mb-3">
                            <Label htmlFor="crypto-currency" className="text-sm text-gray-600 mb-1 block">
                                Select cryptocurrency
                            </Label>
                            <Select
                                value={selectedCurrency}
                                onValueChange={handleCurrencyChange}
                                disabled={availableCurrencies.length === 0}
                            >
                                <SelectTrigger id="crypto-currency" className="w-full bg-white border border-gray-200 h-9 rounded-md">
                                    <SelectValue placeholder="Select cryptocurrency">
                                        {selectedCurrency && (
                                            <div className="flex items-center gap-2">
                                                <CryptoIcon currency={selectedCurrency} className="flex-shrink-0" />
                                                <span className="text-sm text-gray-700">
                                                    {availableCurrencies.find(c => c.code.toLowerCase() === selectedCurrency.toLowerCase())?.name || selectedCurrency.toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent
                                    align="center"
                                    className="max-h-[280px] bg-white text-black border border-gray-200 rounded-md"
                                    sideOffset={4}
                                >
                                    {availableCurrencies.map(currency => (
                                        <SelectItem
                                            key={currency.code}
                                            value={currency.code.toLowerCase()}
                                            className="text-sm py-3 text-gray-700"
                                        >
                                            <div className="flex items-center gap-2">
                                                <CryptoIcon currency={currency.code} className="flex-shrink-0" />
                                                <span>{currency.name} ({currency.code.toUpperCase()})</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* QR Code and Payment Info Side by Side */}
                        <div className="w-full flex flex-row gap-3 mb-3">
                            {/* QR Code */}
                            <div className="bg-white p-3 rounded-lg border border-gray-200 flex justify-center">
                                <QRCodeSVG
                                    value={paymentData.payAddress}
                                    size={130}
                                    bgColor="#FFFFFF"
                                    fgColor="#000000"
                                    level="M"
                                    includeMargin={false}
                                />
                            </div>

                            {/* Payment Info */}
                            <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between items-baseline mb-2">
                                    <span className="text-sm text-gray-600">Amount:</span>
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-semibold">
                                            {formatCurrency(paymentData.originalAmount, paymentData.originalCurrency)}
                                        </span>
                                        {paymentData.originalCurrency !== 'USD' && (
                                            <span className="text-xs text-gray-500">
                                                ≈ ${(paymentData.originalAmount / 605).toFixed(2)} USD
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col mb-1">
                                    <span className="text-xs text-gray-500 mb-1">Wallet address:</span>
                                    <div className="relative flex items-center">
                                        <div className="relative w-full group">
                                            <input
                                                type="text"
                                                value={paymentData.payAddress}
                                                readOnly
                                                className="w-full text-xs font-mono text-gray-800 overflow-hidden overflow-ellipsis whitespace-nowrap bg-white border border-gray-200 rounded-md py-2 px-3 pr-16 focus:outline-none"
                                            />
                                            <div className="absolute right-0 inset-y-0 flex items-center pr-2">
                                                <button
                                                    type="button"
                                                    onClick={handleCopyAddress}
                                                    className="relative h-6 w-6 flex items-center justify-center hover:text-blue-600 transition-colors"
                                                >
                                                    <motion.div
                                                        className="absolute inset-0 flex items-center justify-center"
                                                        initial={{ opacity: 1, scale: 1 }}
                                                        animate={{ opacity: copied ? 0 : 1, scale: copied ? 0 : 1 }}
                                                    >
                                                        <ClipboardCopy className="h-4 w-4" />
                                                    </motion.div>
                                                    <motion.div
                                                        className="absolute inset-0 flex items-center justify-center text-emerald-500"
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: copied ? 1 : 0, scale: copied ? 1 : 0 }}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </motion.div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-center text-blue-500 mt-2">Payment will be confirmed once received.</p>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="w-full border border-gray-200 rounded-lg p-2 mb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Status:</span>
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-sm font-medium">
                                    Waiting for payment
                                </span>
                            </div>
                        </div>

                        {/* Cancel Button */}
                        <Button
                            onClick={onClose}
                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200 h-10 mb-4"
                            variant="outline"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel Payment
                        </Button>

                        <p className="text-xs text-center text-gray-500">
                            lomi. is designed to give merchants access to payment processing technology.
                            Please direct any inquiries regarding goods or services to the respective store.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-6">
                        <p className="text-red-500">Error loading payment details</p>
                        <Button
                            onClick={onClose}
                            className="mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800"
                        >
                            Close
                        </Button>
                    </div>
                )}

                {!loading && (
                    <div className="mt-2 select-none">
                        <div className="border-t border-gray-200 pt-2"></div>
                        <div className="flex items-center justify-center gap-3 text-xs text-gray-400 mt-2">
                            <span className="inline-flex items-center">
                                <ShieldIcon className="w-4 h-4 mr-1" />
                                Powered by{' '}
                                <a href="https://lomi.africa" target="_blank" rel="noopener noreferrer" className="text-gray-400 font-bold flex items-baseline ml-1">
                                    <span className="text-sm">lomi</span>
                                    <div className="w-[2px] h-[2px] bg-current ml-[1px] mb-[1px]"></div>
                                </a>
                            </span>
                            <div className="text-gray-300 h-4 w-[1px] bg-gray-300"></div>
                            <a href="/terms?from=checkout" target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-400">Terms</a>
                            <span className="text-gray-300">|</span>
                            <a href="/privacy?from=checkout" target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-400">Privacy</a>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
} 