import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NOWPaymentsQRModal } from './NOWPaymentsQRModal';

// No-op function that satisfies the linter
const noop = () => undefined;

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
    const { t } = useTranslation();

    // Use prop transactionId in modal mode, or URL param in page mode
    const transactionId = isModal ? propTransactionId : paramTransactionId;

    // Handle cancel payment
    const handleCancel = () => {
        if (isModal) {
            onClose?.();
            if (onPaymentError) {
                onPaymentError('Payment cancelled by user');
            }
        } else {
            navigate('/checkout/error?reason=user_cancelled');
        }
    };

    // Handle payment success
    const handlePaymentSuccess = () => {
        if (isModal && onPaymentSuccess) {
            onPaymentSuccess();
        } else {
            navigate('/checkout/success');
        }
    };

    // Handle payment error
    const handlePaymentError = (error?: string) => {
        if (isModal && onPaymentError) {
            onPaymentError(error);
        } else {
            navigate('/checkout/error');
        }
    };

    // For modal mode, use NOWPaymentsQRModal directly
    if (isModal) {
        return (
            <NOWPaymentsQRModal
                isOpen={isOpen}
                onClose={onClose || noop}
                transactionId={transactionId || ''}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
            />
        );
    }

    // For page mode, use a full page layout
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
            <div className="w-full max-w-md">
                <Button
                    variant="ghost"
                    className="mb-4 text-gray-600 hover:text-gray-900"
                    onClick={handleCancel}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('portal.crypto_checkout.back')}
                </Button>

                <Card className="w-full border border-gray-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-semibold text-gray-900">
                            {t('portal.crypto_checkout.crypto_payment')}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            {t('portal.crypto_checkout.scan_qr_or_copy')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <NOWPaymentsQRModal
                            isOpen={true}
                            onClose={handleCancel}
                            transactionId={transactionId || ''}
                            onPaymentSuccess={handlePaymentSuccess}
                            onPaymentError={handlePaymentError}
                        />
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-gray-500 mt-4">
                    {t('portal.crypto_checkout.powered_by_nowpayments')}
                </p>
            </div>
        </div>
    );
} 