import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/utils/supabase/client';
import { Loader2, AlertTriangle } from 'lucide-react';
import { createCheckoutSessionFromLink } from '@/pages/portal/payment-links/components/support';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

/**
 * A middleware component that handles payment links and creates checkout sessions
 */
export function PaymentLinkHandler() {
    const { linkId } = useParams<{ linkId: string }>();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function handlePaymentLink() {
            if (!linkId) {
                setError('Invalid payment link ID');
                return;
            }

            try {
                // Get payment link details
                const { data: paymentLink, error: linkError } = await supabase
                    .from('payment_links')
                    .select('*')
                    .eq('link_id', linkId)
                    .single();

                if (linkError) {
                    throw new Error('Payment link not found');
                }

                if (!paymentLink.is_active) {
                    throw new Error('This payment link is no longer active');
                }

                if (paymentLink.expires_at && new Date(paymentLink.expires_at) < new Date()) {
                    throw new Error('This payment link has expired');
                }

                // Create a checkout session from the payment link
                const result = await createCheckoutSessionFromLink(
                    paymentLink.link_id,
                    {}, // No customer info yet
                    supabase
                );

                if (!result.success || !result.data) {
                    throw new Error(result.message || 'Unable to create your checkout session. Please try again later.');
                }

                // Redirect to the checkout page with the session ID
                navigate(`/checkout/${result.data.checkout_session_id}`);
            } catch (error: unknown) {
                console.error('Error handling payment link:', error);
                setError('We couldn\'t process your payment request. Please try again or contact the merchant for assistance.');
            }
        }

        handlePaymentLink();
    }, [linkId, navigate]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-[#121317] p-4">
                <div className="max-w-xs w-full">
                    <Alert className="mb-3 rounded-[5px] border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        <AlertTitle className="text-sm">Payment Link Error</AlertTitle>
                        <AlertDescription className="text-xs text-amber-700 dark:text-amber-400">{error}</AlertDescription>
                    </Alert>
                    <div className="w-full">
                        <Button
                            onClick={() => window.location.href = 'https://lomi.africa'}
                            className="w-full h-10 rounded-[5px] bg-zinc-800 hover:bg-zinc-700 text-white"
                        >
                            Back to website
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg">Preparing your checkout...</p>
        </div>
    );
}

/**
 * Handles product-specific payment links
 */
export function ProductLinkHandler() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function handleProductLink() {
            if (!productId) {
                setError('Invalid product ID');
                return;
            }

            try {
                // Find an active payment link for this product
                const { data: links, error: linkError } = await supabase
                    .from('payment_links')
                    .select('link_id')
                    .eq('product_id', productId)
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (linkError || !links || links.length === 0) {
                    throw new Error('No active payment link found for this product');
                }

                const linkId = links[0]?.link_id;
                if (!linkId) {
                    throw new Error('Invalid payment link');
                }

                // Create a checkout session from the payment link
                const result = await createCheckoutSessionFromLink(
                    linkId,
                    {}, // No customer info yet
                    supabase
                );

                if (!result.success || !result.data) {
                    throw new Error(result.message || 'Unable to create your checkout session. Please try again later.');
                }

                // Redirect to the checkout page with the session ID
                navigate(`/checkout/${result.data.checkout_session_id}`);
            } catch (error: unknown) {
                console.error('Error handling product link:', error);
                setError('We couldn\'t process your product purchase. Please try again or contact the merchant for assistance.');
            }
        }

        handleProductLink();
    }, [productId, navigate]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-[#121317] p-4">
                <div className="max-w-xs w-full">
                    <Alert className="mb-3 rounded-[5px] border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        <AlertTitle className="text-sm">Product Link Error</AlertTitle>
                        <AlertDescription className="text-xs text-amber-700 dark:text-amber-400">{error}</AlertDescription>
                    </Alert>
                    <div className="w-full">
                        <Button
                            onClick={() => window.location.href = 'https://lomi.africa'}
                            className="w-full h-10 rounded-[5px] bg-zinc-800 hover:bg-zinc-700 text-white"
                        >
                            Back to website
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg">Preparing your checkout...</p>
        </div>
    );
}

/**
 * Handles plan-specific payment links
 */
export function PlanLinkHandler() {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function handlePlanLink() {
            if (!planId) {
                setError('Invalid plan ID');
                return;
            }

            try {
                // Find an active payment link for this plan
                const { data: links, error: linkError } = await supabase
                    .from('payment_links')
                    .select('link_id')
                    .eq('plan_id', planId)
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (linkError || !links || links.length === 0) {
                    throw new Error('No active payment link found for this subscription plan');
                }

                const linkId = links[0]?.link_id;
                if (!linkId) {
                    throw new Error('Invalid payment link');
                }

                // Create a checkout session from the payment link
                const result = await createCheckoutSessionFromLink(
                    linkId,
                    {}, // No customer info yet
                    supabase
                );

                if (!result.success || !result.data) {
                    throw new Error(result.message || 'Unable to create your checkout session. Please try again later.');
                }

                // Redirect to the checkout page with the session ID
                navigate(`/checkout/${result.data.checkout_session_id}`);
            } catch (error: unknown) {
                console.error('Error handling subscription plan:', error);
                setError('We couldn\'t process your subscription request. Please try again or contact the merchant for assistance.');
            }
        }

        handlePlanLink();
    }, [planId, navigate]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-[#121317] p-4">
                <div className="max-w-xs w-full">
                    <Alert className="mb-3 rounded-[5px] border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                        <AlertTitle className="text-sm">Subscription Plan Error</AlertTitle>
                        <AlertDescription className="text-xs text-amber-700 dark:text-amber-400">{error}</AlertDescription>
                    </Alert>
                    <div className="w-full">
                        <Button
                            onClick={() => window.location.href = 'https://lomi.africa'}
                            className="w-full h-10 rounded-[5px] bg-zinc-800 hover:bg-zinc-700 text-white"
                        >
                            Back to website
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg">Preparing your checkout...</p>
        </div>
    );
} 