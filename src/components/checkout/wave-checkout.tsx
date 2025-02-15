import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { WaveService } from '@/utils/wave/service';
import { useToast } from "@/lib/hooks/use-toast";
import { supabase } from '@/utils/supabase/client';

interface WaveCheckoutProps {
    merchantId: string;
    organizationId: string;
    customerId: string;
    amount: number;
    currency: string;
    successUrl?: string;
    errorUrl?: string;
    productId?: string;
    subscriptionId?: string;
    description?: string;
    metadata?: {
        linkId?: string;
        customerEmail?: string;
        customerPhone?: string;
        customerName?: string;
        whatsappNumber?: string;
        [key: string]: unknown;
    };
    onSuccess?: (transactionId: string) => void;
    onError?: (error: Error) => void;
}

export function WaveCheckout({
    merchantId,
    organizationId,
    customerId,
    amount,
    currency,
    successUrl = window.location.origin + '/success',
    errorUrl = window.location.origin + '/error',
    productId,
    subscriptionId,
    description,
    metadata,
    onSuccess,
    onError
}: WaveCheckoutProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const handleCheckout = async () => {
        try {
            setIsProcessing(true);

            // 1. Verify customer exists
            const { data: customer, error: customerError } = await supabase
                .from('customers')
                .select('customer_id')
                .eq('customer_id', customerId)
                .single();

            if (customerError || !customer) {
                throw new Error('Customer not found');
            }

            // 2. Create Wave checkout session
            const { transactionId, checkoutUrl } = await WaveService.createCheckoutSession({
                merchantId,
                organizationId,
                customerId,
                amount,
                currency,
                successUrl,
                errorUrl,
                productId,
                subscriptionId,
                description,
                metadata: {
                    ...metadata,
                    wave_session: undefined
                },
            });

            // 3. Call success callback if provided
            onSuccess?.(transactionId);

            // 4. Redirect to Wave payment page
            window.location.href = checkoutUrl;

        } catch (error) {
            console.error('Error initiating Wave payment:', error);

            // Show error toast
            toast({
                variant: "destructive",
                title: "Payment Error",
                description: "Failed to initiate Wave payment. Please try again."
            });

            // Call error callback if provided
            onError?.(error as Error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full bg-[#1B3F9D] hover:bg-[#1B3F9D]/90 text-white"
        >
            {isProcessing ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </>
            ) : (
                'Pay with Wave'
            )}
        </Button>
    );
} 