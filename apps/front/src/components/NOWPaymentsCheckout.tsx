import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, CopyIcon, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/utils/supabase/client';
import nowPaymentsService from '@/utils/nowpayments/service';
import { formatCryptoAmount } from '@/utils/currency-utils';
import { formatCurrency } from '@/lib/formatter';
import { useToast } from '@/lib/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface NOWPaymentsCheckoutProps {
    isModal?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    transactionId?: string;
    onPaymentSuccess?: () => void;
    onPaymentError?: (error?: string) => void;
}

export default function NOWPaymentsCheckout({
    isModal = false,
    isOpen = true,
    onClose,
    transactionId: propTransactionId,
    onPaymentSuccess,
    onPaymentError
}: NOWPaymentsCheckoutProps) {
    // For page mode, get params from URL
    const { transactionId: paramTransactionId } = useParams<{ transactionId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const payCurrency = searchParams.get('payCurrency');
    const { t } = useTranslation();
    const { toast } = useToast();

    // Use prop transactionId in modal mode, or URL param in page mode
    const transactionId = isModal ? propTransactionId : paramTransactionId;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentData, setPaymentData] = useState<{
        paymentId: string;
        payAddress: string;
        payAmount: number;
        paymentStatus: string;
        originalAmount: number;
        originalCurrency: string;
        payCurrency: string;
        paymentUrl?: string;
    } | null>(null);

    const [copySuccess, setCopySuccess] = useState(false);

    // Load payment data
    useEffect(() => {
        if (!isOpen || !transactionId) return;

        async function loadPaymentData() {
            try {
                setLoading(true);

                // Get transaction details from database
                const { data: transaction, error: txError } = await supabase
                    .from('providers_transactions')
                    .select('*')
                    .eq('id', transactionId)
                    .single();

                if (txError || !transaction) {
                    throw new Error('Transaction not found');
                }

                // Get payment details from NOWPayments
                const paymentDetails = await nowPaymentsService.checkPaymentStatus(transaction.provider_transaction_id);

                if (!paymentDetails) {
                    throw new Error('Payment not found');
                }

                // Extract payment URL from metadata if it exists
                const metadata = transaction.metadata || {};
                const nowpaymentsSession = metadata.nowpayments_session || {};
                const paymentUrl = typeof nowpaymentsSession === 'object' ?
                    nowpaymentsSession.payment_url : undefined;

                setPaymentData({
                    paymentId: transaction.provider_transaction_id,
                    payAddress: paymentDetails.pay_address,
                    payAmount: transaction.pay_amount || paymentDetails.pay_amount,
                    paymentStatus: transaction.status,
                    originalAmount: transaction.amount,
                    originalCurrency: transaction.currency_code,
                    payCurrency: transaction.pay_currency || payCurrency || 'btc',
                    paymentUrl: paymentUrl
                });
            } catch (err) {
                console.error('Error loading payment data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load payment data');
                if (onPaymentError) {
                    onPaymentError(err instanceof Error ? err.message : 'Failed to load payment data');
                }
            } finally {
                setLoading(false);
            }
        }

        loadPaymentData();

        // Set up polling to check payment status
        const intervalId = setInterval(async () => {
            if (!transactionId) return;

            try {
                const { data } = await supabase
                    .from('providers_transactions')
                    .select('status')
                    .eq('id', transactionId)
                    .single();

                if (data && ['COMPLETED', 'CONFIRMED', 'FAILED', 'EXPIRED', 'REFUNDED'].includes(data.status)) {
                    if (['COMPLETED', 'CONFIRMED'].includes(data.status)) {
                        // Payment completed successfully
                        if (isModal && onPaymentSuccess) {
                            onPaymentSuccess();
                        } else if (!isModal) {
                            navigate('/checkout/success');
                        }
                    } else {
                        // Payment failed
                        if (isModal && onPaymentError) {
                            onPaymentError('Payment failed or expired');
                        } else if (!isModal) {
                            navigate('/checkout/error');
                        }
                    }
                }
            } catch (err) {
                console.error('Error checking payment status:', err);
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(intervalId);
    }, [transactionId, isOpen, navigate, payCurrency, isModal, onPaymentSuccess, onPaymentError]);

    // Handle copy address to clipboard
    const copyToClipboard = useCallback(async () => {
        if (!paymentData?.payAddress) return;

        try {
            await navigator.clipboard.writeText(paymentData.payAddress);
            setCopySuccess(true);
            toast({ title: t('portal.crypto_checkout.address_copied'), variant: 'success' });

            // Reset copy success after 3 seconds
            setTimeout(() => setCopySuccess(false), 3000);
        } catch (err) {
            console.error('Failed to copy address:', err);
            toast({ title: t('portal.crypto_checkout.copy_failed'), variant: 'destructive' });
        }
    }, [paymentData?.payAddress, t, toast]);

    // Handle cancel payment
    const handleCancel = useCallback(() => {
        if (isModal && onClose) {
            onClose();
            if (onPaymentError) {
                onPaymentError('Payment cancelled by user');
            }
        } else {
            navigate('/checkout/error?reason=user_cancelled');
        }
    }, [isModal, onClose, onPaymentError, navigate]);

    // Content to display
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p>{t('portal.crypto_checkout.loading_payment')}</p>
                </div>
            );
        }

        if (error || !paymentData) {
            return (
                <div className="flex flex-col items-center justify-center py-4">
                    <h1 className="text-2xl font-bold mb-4">{t('portal.crypto_checkout.payment_error')}</h1>
                    <p className="text-red-500 mb-6">{error || t('portal.crypto_checkout.payment_not_found')}</p>
                    <Button onClick={isModal ? onClose : () => navigate('/checkout/error')}>
                        {t('portal.crypto_checkout.return_to_merchant')}
                    </Button>
                </div>
            );
        }

        return (
            <>
                <div className="flex flex-col items-center space-y-4">
                    {/* QR Code */}
                    <div className="bg-white p-3 rounded-lg">
                        <QRCodeSVG
                            value={paymentData.payAddress}
                            size={isModal ? 180 : 200}
                            includeMargin
                            level="M"
                        />
                    </div>

                    {/* Payment Details */}
                    <div className="w-full bg-gray-100 p-3 rounded-lg text-sm break-words">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{t('portal.crypto_checkout.amount')}:</span>
                            <span className="font-bold">
                                {formatCryptoAmount(paymentData.payAmount, paymentData.payCurrency)} {paymentData.payCurrency.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-medium">{t('portal.crypto_checkout.original_amount')}:</span>
                            <span className="font-bold">
                                {formatCurrency(paymentData.originalAmount, paymentData.originalCurrency)}
                            </span>
                        </div>

                        <p className="text-xs mb-1">{t('portal.crypto_checkout.address')}:</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-mono break-all mr-2">
                                {paymentData.payAddress}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={copyToClipboard}
                                className="shrink-0"
                            >
                                {copySuccess ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                    <CopyIcon className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="w-full border border-gray-200 rounded-lg p-3">
                        <p className="text-sm flex items-center justify-between">
                            <span>{t('portal.crypto_checkout.status')}:</span>
                            <span className="font-medium capitalize">
                                {paymentData.paymentStatus === 'CREATED' ? t('portal.crypto_checkout.waiting_for_payment') :
                                    paymentData.paymentStatus === 'CONFIRMED' ? t('portal.crypto_checkout.confirmed') :
                                        paymentData.paymentStatus === 'COMPLETED' ? t('portal.crypto_checkout.completed') :
                                            paymentData.paymentStatus.toLowerCase()}
                            </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {t('portal.crypto_checkout.payment_auto_check')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                    {paymentData.paymentUrl && (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => window.open(paymentData.paymentUrl, '_blank')}
                        >
                            {t('portal.crypto_checkout.pay_with_app')}
                            <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={handleCancel}
                    >
                        {t('portal.crypto_checkout.cancel_payment')}
                    </Button>
                </div>

                <div className="flex justify-center items-center mt-2">
                    <p className="text-center text-xs text-gray-500">
                        {t('portal.crypto_checkout.powered_by_nowpayments')}
                    </p>
                </div>
            </>
        );
    };

    // For modal mode, use Dialog component
    if (isModal) {
        return (
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
                <DialogContent className="sm:max-w-md">
                    <CardHeader>
                        <CardTitle>{t('portal.crypto_checkout.crypto_payment')}</CardTitle>
                        <CardDescription>
                            {paymentData?.payAmount && paymentData?.payCurrency
                                ? `${t('portal.crypto_checkout.send_exactly')} ${formatCryptoAmount(paymentData.payAmount, paymentData.payCurrency)} ${paymentData.payCurrency.toUpperCase()}`
                                : '...'}
                        </CardDescription>
                    </CardHeader>
                    {renderContent()}
                </DialogContent>
            </Dialog>
        );
    }

    // For page mode, use a full page layout
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md">
                <Button
                    variant="ghost"
                    className="mb-4"
                    onClick={handleCancel}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('portal.crypto_checkout.back')}
                </Button>

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>{t('portal.crypto_checkout.crypto_payment')}</CardTitle>
                        <CardDescription>
                            {paymentData?.payAmount && paymentData?.payCurrency
                                ? `${t('portal.crypto_checkout.send_exactly')} ${formatCryptoAmount(paymentData.payAmount, paymentData.payCurrency)} ${paymentData.payCurrency.toUpperCase()}`
                                : '...'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderContent()}
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-gray-500 mt-4">
                    {t('portal.crypto_checkout.powered_by_nowpayments')}
                </p>
            </div>
        </div>
    );
} 