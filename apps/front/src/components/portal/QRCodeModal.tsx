import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Loader2, SmartphoneIcon, ClipboardCopy, CheckCircle } from 'lucide-react';
import WaveService from '@/utils/wave/service';

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    checkoutSessionId: string | null;
    qrCodeUrl: string | null;
}

export function QRCodeModal({ isOpen, onClose, checkoutSessionId, qrCodeUrl }: QRCodeModalProps) {
    const navigate = useNavigate();
    const [isPolling, setIsPolling] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
    const [copied, setCopied] = useState(false);

    // Function to navigate to success page
    const navigateToSuccess = () => {
        navigate('/checkout/success', {
            state: { sessionId: checkoutSessionId }
        });
    };

    // Function to periodically check payment status
    const checkPaymentStatus = async (sessionId: string) => {
        try {
            const statusData = await WaveService.getCheckoutStatus(sessionId);

            console.log('Checkout status:', statusData);

            if (statusData.dbStatus === 'completed' || statusData.waveStatus?.checkout_status === 'complete') {
                setPaymentStatus('completed');
                // Wait a moment before redirecting to ensure webhook has processed
                setTimeout(() => {
                    navigateToSuccess();
                }, 2000);
                return true; // Status resolved, stop polling
            } else if (
                statusData.dbStatus === 'expired' ||
                statusData.waveStatus?.checkout_status === 'expired' ||
                statusData.waveStatus?.payment_status === 'cancelled'
            ) {
                setPaymentStatus('failed');
                return true; // Status resolved, stop polling
            }

            return false; // Continue polling
        } catch (error) {
            console.error('Error checking payment status:', error);
            return false; // Continue polling on error
        }
    };

    // Start polling when modal is opened
    useEffect(() => {
        if (isOpen && checkoutSessionId && !isPolling) {
            setIsPolling(true);

            const pollInterval = setInterval(async () => {
                if (!checkoutSessionId) {
                    clearInterval(pollInterval);
                    return;
                }

                const isDone = await checkPaymentStatus(checkoutSessionId);
                if (isDone) {
                    clearInterval(pollInterval);
                    setIsPolling(false);
                }
            }, 3000); // Check every 3 seconds

            // Clean up interval on unmount
            return () => {
                clearInterval(pollInterval);
                setIsPolling(false);
            };
        }
        // Add missing dependencies
        return undefined; // Add explicit return for all code paths
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, checkoutSessionId, navigate]); // Omitting checkPaymentStatus and isPolling to avoid re-rendering loop

    // Function to open Wave app directly
    const handleOpenWaveApp = () => {
        if (qrCodeUrl) {
            window.location.href = qrCodeUrl;
        }
    };

    // Function to copy link to clipboard
    const handleCopyLink = () => {
        if (qrCodeUrl) {
            navigator.clipboard.writeText(qrCodeUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md mx-auto">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">
                        Scan with Wave App
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                    {paymentStatus === 'pending' ? (
                        <>
                            {qrCodeUrl ? (
                                <div className="bg-white p-3 rounded-lg">
                                    <QRCodeSVG
                                        value={qrCodeUrl}
                                        size={200}
                                        bgColor={"#ffffff"}
                                        fgColor={"#000000"}
                                        level={"L"}
                                        includeMargin={false}
                                    />
                                </div>
                            ) : (
                                <div className="bg-gray-100 w-[200px] h-[200px] rounded-lg flex items-center justify-center">
                                    <Loader2 size={48} className="animate-spin text-gray-400" />
                                </div>
                            )}

                            <p className="text-center text-sm text-gray-600 mt-4">
                                Scan this QR code with your Wave app to complete the payment
                            </p>

                            <div className="flex flex-col w-full space-y-2 mt-4">
                                <Button
                                    variant="default"
                                    className="w-full"
                                    onClick={handleOpenWaveApp}
                                >
                                    <SmartphoneIcon className="mr-2 h-4 w-4" />
                                    Open Wave App
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleCopyLink}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <ClipboardCopy className="mr-2 h-4 w-4" />
                                            Copy Payment Link
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    ) : paymentStatus === 'completed' ? (
                        <div className="flex flex-col items-center">
                            <CheckCircle size={64} className="text-green-500 mb-4" />
                            <h3 className="text-xl font-medium">Payment Successful!</h3>
                            <p className="text-center text-sm text-gray-600 mt-2">
                                Redirecting to confirmation page...
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="text-red-500 mb-4">⚠️</div>
                            <h3 className="text-xl font-medium">Payment Failed</h3>
                            <p className="text-center text-sm text-gray-600 mt-2">
                                Please try again or contact support.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {paymentStatus === 'pending' && (
                        <div className="w-full flex justify-center items-center text-sm text-gray-500">
                            {isPolling ? (
                                <div className="flex items-center">
                                    <Loader2 size={16} className="animate-spin mr-2" />
                                    Waiting for payment...
                                </div>
                            ) : (
                                <span>The QR code will expire in 30 minutes</span>
                            )}
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 