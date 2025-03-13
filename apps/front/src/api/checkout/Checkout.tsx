import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useParams } from 'react-router-dom'
import { fetchDataForCheckout, createOrUpdateCustomer } from './SupportCheckout'
import { CheckoutData } from './types'
import { supabase } from '@/utils/supabase/client'
import PhoneNumberInput from '@/components/ui/phone-number-input'
import WhatsAppNumberInput from '@/components/portal/whatsapp-number-input'
import { ArrowLeft, ImageIcon, Loader2, ChevronDown, ArrowRightLeft, ArrowRight } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ShieldIcon } from '@/components/icons/ShieldIcon'
import { countries } from '@/lib/data/onboarding'
import { toast } from "@/lib/hooks/use-toast"
import { initiateWaveCheckout } from '@/api/checkout/wave/WaveCheckout'
import { checkoutStyles } from './CheckoutStyles'
import { initiateOrangeCheckout } from './orange/orangeCheckoutUtils'
import nowPaymentsService from '@/utils/nowpayments/service'
import NOWPaymentsCheckout from '@/api/checkout/nowpayments/NOWPaymentsCheckout'
import { ButtonExpand } from '@/components/design/button-expand'

// Helper function to format numbers with separators
const formatNumber = (num: number | string) => {
    if (typeof num === 'string') num = parseFloat(num);
    return num.toLocaleString('fr-FR').replace(/\s/g, '.');
};

// Create a more comprehensive type-safe mixpanel check
declare global {
    interface Window {
        mixpanel?: {
            track: (event: string, properties?: Record<string, unknown>) => void;
        };
    }
}

// Add this check for mixpanel availability
const mixpanelAvailable = typeof window !== 'undefined' && window.mixpanel !== undefined;

export default function CheckoutPage() {
    const { sessionId, linkId } = useParams<{ sessionId?: string; linkId?: string }>();

    const [organization, setOrganization] = useState<{ organizationId: string | null; logoUrl: string | undefined }>({ organizationId: null, logoUrl: undefined })
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
    const [selectedProvider, setSelectedProvider] = useState<string | undefined>()
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' })
    const [customerDetails, setCustomerDetails] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        whatsappNumber: '',
        country: '',
        city: '',
        postalCode: '',
        address: '',
    });
    const [isHovered, setIsHovered] = useState(false)
    const [isPromoCodeOpen, setIsPromoCodeOpen] = useState(false)
    const [promoCode, setPromoCode] = useState('')
    const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null)
    const promoInputRef = useRef<HTMLInputElement>(null)
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isDifferentWhatsApp, setIsDifferentWhatsApp] = useState(false)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [sessionError, setSessionError] = useState<string | null>(null);
    const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [rawNameInput, setRawNameInput] = useState('');
    const [isNowPaymentsModalOpen, setIsNowPaymentsModalOpen] = useState(false);
    const [nowPaymentsTransactionId, setNowPaymentsTransactionId] = useState<string | null>(null);

    useEffect(() => {
        // First check if we have a cached country code in localStorage
        const cachedCountryName = localStorage.getItem('user_country_name');
        if (cachedCountryName) {
            setCustomerDetails(prev => ({
                ...prev,
                country: cachedCountryName
            }));
            return;
        }

        // Add a timeout for the fetch to avoid long waits
        const timeoutPromise = new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), 2000)
        );

        // Try to get user's country using ipapi.co
        Promise.race([
            fetch('https://ipapi.co/json/', {
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                }),
            timeoutPromise
        ])
            .then(data => {
                // Find the country name from our countries list
                const countryName = countries.find(country =>
                    country.toLowerCase() === data.country_name.toLowerCase()
                ) || 'Côte d\'Ivoire';

                // Cache the result in localStorage for future use
                localStorage.setItem('user_country_name', countryName);

                setCustomerDetails(prev => ({
                    ...prev,
                    country: countryName
                }));
            })
            .catch(() => {
                // Fallback to Côte d'Ivoire if geolocation fails
                const defaultCountry = 'Côte d\'Ivoire';
                localStorage.setItem('user_country_name', defaultCountry);
                setCustomerDetails(prev => ({
                    ...prev,
                    country: defaultCountry
                }));
            });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (linkId) {
                try {
                    // Get the original payment link data
                    const data = await fetchDataForCheckout(linkId);
                    setCheckoutData(data);

                    // Create a checkout session from this payment link
                    const { data: sessionData, error } = await supabase.rpc(
                        'create_checkout_session_from_payment_link',
                        {
                            p_payment_link_id: linkId,
                            p_expiration_minutes: 60 // 1 hour expiration
                        }
                    );

                    if (error) {
                        console.error('Error creating checkout session:', error);
                        setSessionError("We couldn't create your checkout session at this time");
                        return;
                    }

                    console.log('Checkout session created:', sessionData);
                    // Store the checkout session ID
                    setCheckoutSessionId(sessionData.checkout_session_id);

                    // Handle organization logo and favicon
                    if (data?.paymentLink?.organizationLogoUrl) {
                        const logoPath = data.paymentLink.organizationLogoUrl;
                        const { data: logoData, error: logoError } = await supabase
                            .storage
                            .from('logos')
                            .download(logoPath);

                        if (logoError) {
                            console.error('Error downloading logo:', logoError);
                        } else {
                            const logoUrl = URL.createObjectURL(logoData);
                            setOrganization(prevOrg => ({ ...prevOrg, logoUrl }));

                            // Update favicons
                            let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
                            let appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;

                            // Create favicon link if it doesn't exist
                            if (!favicon) {
                                favicon = document.createElement('link');
                                favicon.rel = 'icon';
                                document.head.appendChild(favicon);
                            }

                            // Create apple touch icon link if it doesn't exist
                            if (!appleTouchIcon) {
                                appleTouchIcon = document.createElement('link');
                                appleTouchIcon.rel = 'apple-touch-icon';
                                document.head.appendChild(appleTouchIcon);
                            }

                            // Remove any existing lomi favicon
                            const existingFavicons = document.querySelectorAll("link[rel*='icon']");
                            existingFavicons.forEach(icon => icon.remove());

                            // Set new favicon
                            favicon = document.createElement('link');
                            favicon.rel = 'icon';
                            favicon.href = logoUrl;
                            document.head.appendChild(favicon);

                            // Set new apple touch icon
                            appleTouchIcon = document.createElement('link');
                            appleTouchIcon.rel = 'apple-touch-icon';
                            appleTouchIcon.href = logoUrl;
                            document.head.appendChild(appleTouchIcon);
                        }
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
                    console.error('Error fetching checkout data:', errorMessage);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to load payment information"
                    });
                }
            } else if (sessionId) {
                // Handle direct checkout session access
                try {
                    const { data, error } = await supabase.rpc(
                        'get_checkout_session',
                        { p_checkout_session_id: sessionId }
                    );

                    if (error) throw error;

                    if (!data) {
                        toast({
                            variant: "destructive",
                            title: "Not Found",
                            description: "Checkout session not found"
                        });
                        return;
                    }

                    if (data.status === 'expired' || data.is_expired) {
                        setSessionError("This checkout session has expired");
                        return;
                    }

                    // Store the checkout session ID
                    setCheckoutSessionId(sessionId);

                    console.log('Retrieved checkout session:', data);
                    // Would need to convert session data to CheckoutData format
                    // to maintain compatibility with existing UI

                    // For now, just show the organization logo if available
                    if (data.organization_logo) {
                        setOrganization({
                            organizationId: data.organization_id,
                            logoUrl: data.organization_logo
                        });
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
                    console.error('Error loading checkout session:', errorMessage);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to load checkout session"
                    });
                }
            }
        };

        fetchData();
    }, [linkId, sessionId]);

    // Add a new effect to periodically check the checkout session status
    useEffect(() => {
        let intervalId: number | undefined;

        const checkSessionStatus = async () => {
            if (!checkoutSessionId) return;

            try {
                const { data, error } = await supabase.rpc(
                    'get_checkout_session',
                    { p_checkout_session_id: checkoutSessionId }
                );

                if (error) {
                    console.error('Error checking session status:', error);
                    return;
                }

                if (!data) {
                    setSessionError("Checkout session not found");
                    return;
                }

                if (data.status === 'expired' || data.is_expired) {
                    setSessionError("This checkout session has expired");
                    clearInterval(intervalId);
                    return;
                }
            } catch (error) {
                console.error('Error checking session status:', error);
            }
        };

        if (checkoutSessionId) {
            // Check status every 30 seconds
            intervalId = window.setInterval(checkSessionStatus, 30000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [checkoutSessionId]);

    // Add a new effect to update the page title and meta description when checkout data is loaded
    useEffect(() => {
        if (checkoutData) {
            // Find the organization name from any available source or use fallbacks
            let titleText = checkoutData.paymentLink?.organizationName;

            // If payment link doesn't have organization name but we have product or subscription info
            if (!titleText) {
                if (checkoutData.merchantProduct) {
                    titleText = checkoutData.merchantProduct.name
                        ? `${checkoutData.merchantProduct.name}`
                        : 'Product Checkout';
                } else if (checkoutData.subscriptionPlan) {
                    titleText = checkoutData.subscriptionPlan.name
                        ? `${checkoutData.subscriptionPlan.name}`
                        : 'Subscription Checkout';
                } else if (checkoutData.paymentLink?.title) {
                    // Use payment link title as fallback
                    titleText = checkoutData.paymentLink.title;
                } else {
                    titleText = 'Secure Checkout';
                }
            }

            // Update page title
            document.title = `${titleText} | Checkout`;

            // Update meta description
            const metaDescription = document.querySelector("meta[name='description']") as HTMLMetaElement;
            if (metaDescription) {
                metaDescription.content = `Secure checkout page for ${titleText}`;
            }
        }
    }, [checkoutData]);

    const handleProviderClick = async (provider: string) => {
        try {
            setSelectedProvider(provider);

            // Check if required fields are filled, if not, focus the name field
            if (!areRequiredFieldsFilled()) {
                toast({
                    variant: "destructive",
                    title: "Required Information",
                    description: "Please fill in your full name, email, and phone number first."
                });

                // Focus on the name input
                if (nameInputRef.current) {
                    nameInputRef.current.focus();
                }
                return;
            }

            if (provider === 'WAVE') {
                try {
                    setIsProcessing(true);

                    if (!checkoutData) {
                        console.error('Checkout data missing');
                        throw new Error('Missing required data for checkout');
                    }

                    // Check for required merchant and organization IDs
                    if (!checkoutData.paymentLink?.merchantId || !checkoutData.paymentLink?.organizationId) {
                        console.error('Missing merchant ID or organization ID:', {
                            merchantId: checkoutData.paymentLink?.merchantId,
                            organizationId: checkoutData.paymentLink?.organizationId,
                            paymentLink: checkoutData.paymentLink
                        });
                        toast({
                            variant: "destructive",
                            title: "Configuration Error",
                            description: "Payment configuration is incomplete. Please contact support."
                        });
                        throw new Error('Missing merchant or organization ID');
                    }

                    console.log('Checkout data structure check:', {
                        merchantId: checkoutData.paymentLink.merchantId,
                        organizationId: checkoutData.paymentLink.organizationId,
                        merchant_id: checkoutData.paymentLink.merchantId,
                        organization_id: checkoutData.paymentLink.organizationId,
                        paymentLinkType: typeof checkoutData.paymentLink,
                        checkoutDataType: typeof checkoutData,
                        fullPaymentLink: checkoutData.paymentLink
                    });

                    // First, ensure we have a customer ID by creating/updating the customer
                    const newCustomerId = await createOrUpdateCustomer(
                        checkoutData.paymentLink.merchantId,
                        checkoutData.paymentLink.organizationId,
                        {
                            firstName: customerDetails.firstName,
                            lastName: customerDetails.lastName,
                            email: customerDetails.email,
                            phoneNumber: customerDetails.phoneNumber,
                            whatsappNumber: isDifferentWhatsApp ? customerDetails.whatsappNumber : customerDetails.phoneNumber,
                            country: customerDetails.country,
                            city: customerDetails.city,
                            address: customerDetails.address,
                            postalCode: customerDetails.postalCode
                        }
                    );

                    if (!newCustomerId) {
                        console.error('Failed to create/update customer');
                        toast({
                            variant: "destructive",
                            title: "Customer Creation Failed",
                            description: "Could not create customer record. Please check your information and try again."
                        });
                        throw new Error('Could not create customer record');
                    }

                    // Store the customer ID in the customerDetails object instead of a separate state
                    setCustomerDetails(prev => ({
                        ...prev,
                        customerId: newCustomerId
                    }));

                    // Calculate total amount including fees
                    const basePrice = checkoutData?.merchantProduct?.price || checkoutData?.subscriptionPlan?.amount || checkoutData?.paymentLink?.price || 0;
                    const fees = checkoutData?.merchantProduct?.fees || [];
                    const feeAmount = fees.reduce((total, fee) => {
                        return total + (basePrice * (fee.percentage / 100));
                    }, 0);
                    const totalAmount = basePrice + feeAmount;

                    // Success and error URLs - use merchant-specified URLs or default to our pages
                    const successUrl = checkoutData.paymentLink.success_url || `${window.location.origin}/checkout/success`;
                    const errorUrl = checkoutData.paymentLink.cancel_url || `${window.location.origin}/checkout/error`;

                    console.log('Creating Wave checkout with customer ID:', newCustomerId);

                    // Use the initiateWaveCheckout helper function
                    const { checkoutUrl } = await initiateWaveCheckout({
                        merchantId: checkoutData.paymentLink.merchantId,
                        organizationId: checkoutData.paymentLink.organizationId,
                        customerId: newCustomerId,
                        amount: totalAmount,
                        currency: checkoutData.paymentLink.currency_code,
                        successUrl,
                        errorUrl,
                        productId: checkoutData.merchantProduct?.product_id,
                        subscriptionId: checkoutData.subscriptionPlan?.planId,
                        description: checkoutData.paymentLink.title,
                        metadata: {
                            linkId: checkoutData.paymentLink.linkId,
                            customerEmail: customerDetails.email,
                            customerPhone: customerDetails.phoneNumber,
                            customerName: `${customerDetails.firstName} ${customerDetails.lastName}`.trim(),
                            whatsappNumber: isDifferentWhatsApp ? customerDetails.whatsappNumber : customerDetails.phoneNumber,
                            ...(checkoutData.subscriptionPlan && {
                                planId: checkoutData.subscriptionPlan.planId,
                                subscriptionName: checkoutData.subscriptionPlan.name,
                                billingFrequency: checkoutData.subscriptionPlan.billingFrequency
                            })
                        },
                        onSuccess: (result) => {
                            console.log('Wave checkout session created successfully:', result);
                        },
                        onError: (error) => {
                            console.error('Error creating Wave checkout session:', error);
                            toast({
                                variant: "destructive",
                                title: "Payment Error",
                                description: "Failed to initiate Wave payment. Please ensure your phone number is correct and try again."
                            });
                        }
                    });

                    // Redirect to Wave payment page
                    window.location.href = checkoutUrl;
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
                    console.error('Error creating Wave checkout session:', errorMessage);
                    toast({
                        variant: "destructive",
                        title: "Payment Error",
                        description: "Failed to initiate Wave payment. Please ensure your phone number is correct and try again."
                    });
                } finally {
                    setIsProcessing(false);
                }
            } else if (provider === 'ORANGE') {
                try {
                    setIsProcessing(true);

                    if (!checkoutData) {
                        console.error('Checkout data missing');
                        throw new Error('Missing required data for checkout');
                    }

                    // Check for required merchant and organization IDs
                    if (!checkoutData.paymentLink?.merchantId || !checkoutData.paymentLink?.organizationId) {
                        console.error('Missing merchant ID or organization ID:', {
                            merchantId: checkoutData.paymentLink?.merchantId,
                            organizationId: checkoutData.paymentLink?.organizationId,
                            paymentLink: checkoutData.paymentLink
                        });
                        toast({
                            variant: "destructive",
                            title: "Configuration Error",
                            description: "Payment configuration is incomplete. Please contact support."
                        });
                        throw new Error('Missing merchant or organization ID');
                    }

                    console.log('Checkout data structure check for Orange:', {
                        merchantId: checkoutData.paymentLink.merchantId,
                        organizationId: checkoutData.paymentLink.organizationId,
                        paymentLinkType: typeof checkoutData.paymentLink,
                        checkoutDataType: typeof checkoutData,
                        fullPaymentLink: checkoutData.paymentLink
                    });

                    // First, ensure we have a customer ID by creating/updating the customer
                    const newCustomerId = await createOrUpdateCustomer(
                        checkoutData.paymentLink.merchantId,
                        checkoutData.paymentLink.organizationId,
                        {
                            firstName: customerDetails.firstName,
                            lastName: customerDetails.lastName,
                            email: customerDetails.email,
                            phoneNumber: customerDetails.phoneNumber,
                            whatsappNumber: isDifferentWhatsApp ? customerDetails.whatsappNumber : customerDetails.phoneNumber,
                            country: customerDetails.country,
                            city: customerDetails.city,
                            address: customerDetails.address,
                            postalCode: customerDetails.postalCode
                        }
                    );

                    if (!newCustomerId) {
                        console.error('Failed to create/update customer');
                        toast({
                            variant: "destructive",
                            title: "Customer Creation Failed",
                            description: "Could not create customer record. Please check your information and try again."
                        });
                        throw new Error('Could not create customer record');
                    }

                    // Store the customer ID in the customerDetails object instead of a separate state
                    setCustomerDetails(prev => ({
                        ...prev,
                        customerId: newCustomerId
                    }));

                    // Calculate total amount including fees
                    const basePrice = checkoutData?.merchantProduct?.price || checkoutData?.subscriptionPlan?.amount || checkoutData?.paymentLink?.price || 0;
                    const fees = checkoutData?.merchantProduct?.fees || [];
                    const feeAmount = fees.reduce((total, fee) => {
                        return total + (basePrice * (fee.percentage / 100));
                    }, 0);
                    const totalAmount = basePrice + feeAmount;

                    // Success and error URLs - use merchant-specified URLs or default to our pages
                    const successUrl = checkoutData.paymentLink.success_url || `${window.location.origin}/checkout/success`;
                    const errorUrl = checkoutData.paymentLink.cancel_url || `${window.location.origin}/checkout/error`;

                    console.log('Creating Orange checkout with customer ID:', newCustomerId);

                    // Use the initiateOrangeCheckout helper function
                    const { checkoutUrl } = await initiateOrangeCheckout({
                        merchantId: checkoutData.paymentLink.merchantId,
                        organizationId: checkoutData.paymentLink.organizationId,
                        customerId: newCustomerId,
                        amount: totalAmount,
                        currency: checkoutData.paymentLink.currency_code,
                        successUrl,
                        cancelUrl: errorUrl,
                        notificationUrl: `${window.location.origin}/api/orange/webhook`,
                        productId: checkoutData.merchantProduct?.product_id,
                        subscriptionId: checkoutData.subscriptionPlan?.planId,
                        description: checkoutData.paymentLink.title,
                        metadata: {
                            linkId: checkoutData.paymentLink.linkId,
                            customerEmail: customerDetails.email,
                            customerPhone: customerDetails.phoneNumber,
                            customerName: `${customerDetails.firstName} ${customerDetails.lastName}`.trim(),
                            whatsappNumber: isDifferentWhatsApp ? customerDetails.whatsappNumber : customerDetails.phoneNumber,
                            ...(checkoutData.subscriptionPlan && {
                                planId: checkoutData.subscriptionPlan.planId,
                                subscriptionName: checkoutData.subscriptionPlan.name,
                                billingFrequency: checkoutData.subscriptionPlan.billingFrequency
                            })
                        }
                    });

                    // Redirect to Orange payment page
                    window.location.href = checkoutUrl;
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
                    console.error('Error creating Orange checkout session:', errorMessage);
                    toast({
                        variant: "destructive",
                        title: "Payment Error",
                        description: "Failed to initiate Orange Money payment. Please try again or use a different payment method."
                    });
                } finally {
                    setIsProcessing(false);
                }
            } else if (provider === 'NOWPAYMENTS') {
                try {
                    setIsProcessing(true);

                    if (!checkoutData) {
                        console.error('Checkout data missing');
                        throw new Error('Missing required data for checkout');
                    }

                    // Check for required merchant and organization IDs
                    if (!checkoutData.paymentLink?.merchantId || !checkoutData.paymentLink?.organizationId) {
                        console.error('Missing merchant ID or organization ID:', {
                            merchantId: checkoutData.paymentLink?.merchantId,
                            organizationId: checkoutData.paymentLink?.organizationId,
                            paymentLink: checkoutData.paymentLink
                        });
                        toast({
                            variant: "destructive",
                            title: "Configuration Error",
                            description: "Payment configuration is incomplete. Please contact support."
                        });
                        throw new Error('Missing merchant or organization ID');
                    }

                    console.log('Checkout data structure check for NOWPayments:', {
                        merchantId: checkoutData.paymentLink.merchantId,
                        organizationId: checkoutData.paymentLink.organizationId,
                        paymentLinkType: typeof checkoutData.paymentLink,
                        checkoutDataType: typeof checkoutData,
                        fullPaymentLink: checkoutData.paymentLink
                    });

                    // First, ensure we have a customer ID by creating/updating the customer
                    const newCustomerId = await createOrUpdateCustomer(
                        checkoutData.paymentLink.merchantId,
                        checkoutData.paymentLink.organizationId,
                        {
                            firstName: customerDetails.firstName,
                            lastName: customerDetails.lastName,
                            email: customerDetails.email,
                            phoneNumber: customerDetails.phoneNumber,
                            whatsappNumber: isDifferentWhatsApp ? customerDetails.whatsappNumber : customerDetails.phoneNumber,
                            country: customerDetails.country,
                            city: customerDetails.city,
                            address: customerDetails.address,
                            postalCode: customerDetails.postalCode
                        }
                    );

                    if (!newCustomerId) {
                        console.error('Failed to create/update customer');
                        toast({
                            variant: "destructive",
                            title: "Customer Creation Failed",
                            description: "Could not create customer record. Please check your information and try again."
                        });
                        throw new Error('Could not create customer record');
                    }

                    // Store the customer ID in the customerDetails object instead of a separate state
                    setCustomerDetails(prev => ({
                        ...prev,
                        customerId: newCustomerId
                    }));

                    // Calculate total amount including fees
                    const basePrice = checkoutData?.merchantProduct?.price || checkoutData?.subscriptionPlan?.amount || checkoutData?.paymentLink?.price || 0;
                    const fees = checkoutData?.merchantProduct?.fees || [];
                    const feeAmount = fees.reduce((total, fee) => {
                        return total + (basePrice * (fee.percentage / 100));
                    }, 0);
                    const totalAmount = basePrice + feeAmount;

                    // Success and error URLs - use merchant-specified URLs or default to our pages
                    const successUrl = checkoutData.paymentLink.success_url || `${window.location.origin}/checkout/success`;
                    const cancelUrl = checkoutData.paymentLink.cancel_url || `${window.location.origin}/checkout/error`;

                    console.log('Creating NOWPayments checkout with customer ID:', newCustomerId);

                    // Use the initiateNOWPaymentsCheckout helper function
                    const result = await nowPaymentsService.initiateCheckout({
                        merchantId: checkoutData.paymentLink.merchantId,
                        organizationId: checkoutData.paymentLink.organizationId,
                        customerId: newCustomerId,
                        amount: totalAmount,
                        currency: checkoutData.paymentLink.currency_code,
                        payCurrency: 'btc', // Default to BTC, this could be made selectable
                        successUrl,
                        cancelUrl,
                        productId: checkoutData.merchantProduct?.product_id,
                        subscriptionId: checkoutData.subscriptionPlan?.planId,
                        description: checkoutData.paymentLink.title,
                        metadata: {
                            linkId: checkoutData.paymentLink.linkId,
                            customerEmail: customerDetails.email,
                            customerPhone: customerDetails.phoneNumber,
                            customerName: `${customerDetails.firstName} ${customerDetails.lastName}`.trim(),
                            whatsappNumber: isDifferentWhatsApp ? customerDetails.whatsappNumber : customerDetails.phoneNumber,
                            ...(checkoutData.subscriptionPlan && {
                                planId: checkoutData.subscriptionPlan.planId,
                                subscriptionName: checkoutData.subscriptionPlan.name,
                                billingFrequency: checkoutData.subscriptionPlan.billingFrequency
                            })
                        }
                    });

                    // For modal approach, store the transaction ID and open modal instead of redirecting
                    setNowPaymentsTransactionId(result.transactionId);
                    setIsNowPaymentsModalOpen(true);

                    // Optional: Track with mixpanel if available
                    if (mixpanelAvailable && window.mixpanel) {
                        window.mixpanel.track('Payment Method Selected', {
                            method: 'Crypto (NOWPayments)',
                            amount: totalAmount,
                            currency: checkoutData?.paymentLink?.currency_code || 'Unknown'
                        });
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
                    console.error('Error creating NOWPayments checkout session:', errorMessage);
                    toast({
                        variant: "destructive",
                        title: "Payment Error",
                        description: "Failed to initiate crypto payment. Please try again or use a different payment method."
                    });
                } finally {
                    setIsProcessing(false);
                }
            } else {
                setIsCheckoutModalOpen(true);
            }
        } catch (error) {
            console.error(`Error handling provider ${provider}:`, error);
            setSessionError(
                error instanceof Error ? error.message : 'Failed to process payment'
            );
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'number') {
            // Automatically add spacing after every 4 numbers and limit to 12 numbers
            const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
            setCardDetails((prev) => ({ ...prev, [name]: formattedValue }));
        } else if (name === 'expiry') {
            // Limit to 4 numbers (considering the automatic "/")
            const formatted = value.replace(/\D/g, '').slice(0, 4);
            if (formatted.length > 2) {
                setCardDetails((prev) => ({ ...prev, [name]: `${formatted.slice(0, 2)}/${formatted.slice(2)}` }));
            } else {
                setCardDetails((prev) => ({ ...prev, [name]: formatted }));
            }
        } else if (name === 'cvc') {
            // Limit to 4 numbers
            const formatted = value.replace(/\D/g, '').slice(0, 4);
            setCardDetails((prev) => ({ ...prev, [name]: formatted }));
        } else {
            setCardDetails((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomerDetails((prev) => ({ ...prev, [name]: value }));
    };

    const isPaymentFormValid = () => {
        const basicInfoValid = customerDetails.firstName !== '' &&
            customerDetails.lastName !== '' &&
            customerDetails.email !== '' &&
            customerDetails.phoneNumber !== '' &&
            customerDetails.country !== '' &&
            customerDetails.city !== '' &&
            customerDetails.address !== '';

        // Only validate card details if ECOBANK is an allowed provider
        if (checkoutData?.paymentLink?.allowed_providers?.includes('ECOBANK')) {
            return basicInfoValid && cardDetails.number !== '' && cardDetails.expiry !== '' && cardDetails.cvc !== '';
        }

        // For other payment methods, just validate basic info
        return basicInfoValid;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (checkoutData) {
            try {
                const newCustomerId = await createOrUpdateCustomer(
                    checkoutData.paymentLink.merchantId,
                    checkoutData.paymentLink.organizationId,
                    {
                        firstName: customerDetails.firstName,
                        lastName: customerDetails.lastName,
                        email: customerDetails.email,
                        phoneNumber: customerDetails.phoneNumber,
                        whatsappNumber: isDifferentWhatsApp ? customerDetails.whatsappNumber : customerDetails.phoneNumber,
                        country: customerDetails.country,
                        city: customerDetails.city,
                        address: customerDetails.address,
                        postalCode: customerDetails.postalCode
                    }
                );

                if (!newCustomerId) {
                    console.error('Failed to create/update customer');
                    return;
                }

                // Store the customer ID in the customerDetails object instead of a separate state
                setCustomerDetails(prev => ({
                    ...prev,
                    customerId: newCustomerId
                }));

                // If ECOBANK is not in allowed providers or a mobile money provider is explicitly selected,
                // show the mobile payment selection dialog
                if (!checkoutData.paymentLink.allowed_providers.includes('ECOBANK') || selectedProvider) {
                    if (selectedProvider) {
                        handleProviderClick(selectedProvider);
                    } else {
                        // Show toast message to select a payment method
                        toast({
                            title: "Select Payment Method",
                            description: "Please select a payment method to continue.",
                        });
                    }
                    return;
                }

                // Continue with card payment (ECOBANK)
                // Rest of the card payment processing code here...

            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'An error occurred';
                console.error('Error creating/updating customer:', errorMessage);
            }
        }
    };

    const handleGoBack = () => {
        if (checkoutData?.paymentLink?.cancel_url) {
            window.location.href = checkoutData.paymentLink.cancel_url;
        } else {
            window.location.href = 'https://lomi.africa';
        }
    }

    const handlePromoCodeSubmit = () => {
        if (promoCode.trim()) {
            setAppliedPromoCode(promoCode)
            setPromoCode('')
            setIsPromoCodeOpen(false)
        }
    }

    const handlePromoCodeBlur = () => {
        if (!promoCode.trim()) {
            setIsPromoCodeOpen(false)
        }
    }

    const handleCheckoutSubmit = async () => {
        setIsProcessing(true)
        // TODO: Integrate with provider's API
        // For now, just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsProcessing(false)
        // Handle success/error
    }

    // 1. First, let's add a function to check if required fields are filled
    const areRequiredFieldsFilled = () => {
        return rawNameInput.trim().includes(' ') &&
            customerDetails.email &&
            customerDetails.email.includes('@') &&
            customerDetails.phoneNumber;
    };

    // Add handlers for modal success and error
    const handleNowPaymentsSuccess = useCallback(() => {
        // Redirect to success page
        const successUrl = checkoutData?.paymentLink?.success_url ||
            `${window.location.origin}/checkout/success`;
        window.location.href = successUrl;
    }, [checkoutData]);

    const handleNowPaymentsError = useCallback((error?: string) => {
        console.error('NOWPayments payment error:', error);
        setSessionError(error || 'Payment failed or was cancelled');
        setIsNowPaymentsModalOpen(false);
    }, []);

    // Render the error state when session creation fails
    if (sessionError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-[#121317] p-4">
                <div className="max-w-xs w-full rounded-[5px] border border-border dark:border-zinc-800 bg-card text-card-foreground dark:bg-[#1A1D23] shadow-sm p-5 flex flex-col items-center">
                    {organization.logoUrl ? (
                        <img
                            src={organization.logoUrl}
                            alt="Organization Logo"
                            className="w-14 h-14 object-contain mb-3"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-amber-500/10 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-500">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                    )}

                    <h1 className="text-lg font-semibold mb-2 text-foreground dark:text-white">Payment unavailable</h1>
                    <p className="text-muted-foreground dark:text-gray-400 text-center text-sm mb-5">
                        We&apos;re unable to process your payment at this time. The payment link may have expired or is temporarily unavailable.
                    </p>

                    <div className="w-full">
                        <Button
                            onClick={() => {
                                if (checkoutData?.paymentLink?.cancel_url) {
                                    window.location.href = checkoutData.paymentLink.cancel_url;
                                } else {
                                    window.location.href = 'https://lomi.africa';
                                }
                            }}
                            className="w-full h-10 rounded-[5px] flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100"
                        >
                            Back to website
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{checkoutStyles}</style>
            <div className="min-h-screen flex flex-col lg:flex-row bg-white checkout-container">
                {/* Left side - Product details */}
                <div className={`w-full lg:w-1/2 bg-[#121317] text-white p-4 lg:p-8 flex flex-col relative`}>
                    {/* Mobile Header - Fixed */}
                    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#121317]">
                        <div className="flex items-center justify-between w-full h-14 px-4">
                            <div className="flex items-center gap-1.5">
                                <AnimatePresence mode="wait">
                                    {!isDetailsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, width: 0, marginRight: 0 }}
                                            animate={{ opacity: 1, width: "auto", marginRight: 4 }}
                                            exit={{ opacity: 0, width: 0, marginRight: 0 }}
                                            transition={{ duration: 0.15, ease: "easeInOut" }}
                                            onClick={handleGoBack}
                                            className="cursor-pointer"
                                        >
                                            <ArrowLeft className="h-4 w-4 text-gray-500 hover:text-gray-300 transition-colors" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <motion.div
                                    animate={{ x: isDetailsOpen ? "-4px" : 0 }}
                                    transition={{ duration: 0.15, ease: "easeInOut" }}
                                >
                                    {organization.logoUrl && (
                                        <img
                                            src={organization.logoUrl}
                                            alt="Organization Logo"
                                            className="w-7 h-7 rounded-md"
                                        />
                                    )}
                                </motion.div>
                            </div>
                            <button
                                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                                className="flex items-center gap-0.5 text-gray-500 hover:text-gray-300 transition-colors text-[13px] font-medium tracking-wide"
                            >
                                Details
                                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isDetailsOpen ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden lg:block max-w-[488px] ml-auto pr-8 w-full">
                        <div className="flex mb-8">
                            <div
                                className="group flex items-center gap-2 cursor-pointer"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={handleGoBack}
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                <div className="relative w-[40px] h-[40px]">
                                    <AnimatePresence mode="wait">
                                        {!isHovered && organization.logoUrl && (
                                            <motion.img
                                                key="logo"
                                                src={organization.logoUrl}
                                                alt="Organization Logo"
                                                className="rounded-md absolute inset-0 w-full h-full object-cover"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.1 }}
                                            />
                                        )}
                                        {isHovered && (
                                            <motion.div
                                                key="text"
                                                className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.1 }}
                                            >
                                                Back
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                        <div className="pl-[28px]">
                            <div className="mb-12">
                                {!checkoutData?.merchantProduct && !checkoutData?.subscriptionPlan && (
                                    <>
                                        <h2 className="text-xl text-gray-300 mb-4">Complete your payment</h2>
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-4xl font-bold">{formatNumber(checkoutData?.paymentLink?.price || 0)}</span>
                                            <span className="text-4xl">{checkoutData?.paymentLink?.currency_code}</span>
                                        </div>
                                        {organization.logoUrl && (
                                            <div className="flex items-start gap-3 border-t border-gray-800 pt-4">
                                                <img
                                                    src={organization.logoUrl}
                                                    alt="Organization Logo"
                                                    className="w-12 h-12 rounded-md"
                                                />
                                                <div className="flex-1">
                                                    <div className="text-white font-medium">{checkoutData?.paymentLink?.title}</div>
                                                    <div className="text-sm text-gray-400">{checkoutData?.paymentLink?.public_description}</div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                {checkoutData?.subscriptionPlan && (
                                    <>
                                        <h2 className="text-xl text-gray-300 mb-4">Subscribe to {checkoutData.subscriptionPlan.name}</h2>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex items-center">
                                                <span className="text-4xl font-bold">{formatNumber(checkoutData.subscriptionPlan.amount)}</span>
                                                <span className="text-4xl ml-2">{checkoutData.subscriptionPlan.currency_code}</span>
                                            </div>
                                            <div className="text-gray-400 text-lg ml-2 h-[2.2rem] flex flex-col justify-between leading-none">
                                                <span>per</span>
                                                <span>{checkoutData.subscriptionPlan.billingFrequency.toLowerCase()
                                                    .replace('weekly', 'week')
                                                    .replace('bi-weekly', 'two weeks')
                                                    .replace('monthly', 'month')
                                                    .replace('bi-monthly', 'two months')
                                                    .replace('quarterly', 'quarter')
                                                    .replace('semi-annual', 'six months')
                                                    .replace('yearly', 'year')}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 border-t border-gray-800 pt-4">
                                            <div className="w-12 h-12 rounded-md bg-gray-800 flex-shrink-0 overflow-hidden">
                                                {checkoutData.subscriptionPlan.image_url ? (
                                                    <img
                                                        src={checkoutData.subscriptionPlan.image_url}
                                                        alt={checkoutData.subscriptionPlan.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-white font-medium">{checkoutData.subscriptionPlan.name}</div>
                                                <div className="text-sm text-gray-400">{checkoutData.subscriptionPlan.description}</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {checkoutData?.merchantProduct && (
                                    <>
                                        <h2 className="text-xl text-gray-300 mb-4">Pay for {checkoutData.merchantProduct.name}</h2>
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-4xl font-bold">{formatNumber(checkoutData.merchantProduct.price)}</span>
                                            <span className="text-4xl">{checkoutData.merchantProduct.currency_code}</span>
                                        </div>
                                        <div className="flex items-start gap-3 border-t border-gray-800 pt-4">
                                            <div className="w-12 h-12 rounded-md bg-gray-800 flex-shrink-0 overflow-hidden">
                                                {checkoutData.merchantProduct.image_url ? (
                                                    <img
                                                        src={checkoutData.merchantProduct.image_url}
                                                        alt={checkoutData.merchantProduct.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-white font-medium">{checkoutData.merchantProduct.name}</div>
                                                <div className="text-sm text-gray-400">{checkoutData.merchantProduct.description}</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="pl-[60px] space-y-4">
                                <div className="border-t border-gray-800 pt-4">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-gray-400">Subtotal</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg">{formatNumber(checkoutData?.merchantProduct?.price || checkoutData?.subscriptionPlan?.amount || checkoutData?.paymentLink?.price || 0)}</span>
                                            <span className="text-lg text-gray-400">{checkoutData?.paymentLink?.currency_code}</span>
                                        </div>
                                    </div>

                                    {/* Fees Section */}
                                    {checkoutData?.merchantProduct?.fees?.map((fee) => {
                                        const basePrice = checkoutData.merchantProduct?.price || 0;
                                        const feeAmount = basePrice * (fee.percentage / 100);
                                        return (
                                            <div key={fee.fee_type_id} className="flex justify-between items-baseline pt-2">
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-gray-400">{fee.name}</span>
                                                    <span className="text-xs text-gray-500">({fee.percentage}%)</span>
                                                </div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-gray-400">{formatNumber(feeAmount)}</span>
                                                    <span className="text-gray-500">{checkoutData.paymentLink.currency_code}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="relative flex justify-start">
                                    {!isPromoCodeOpen ? (
                                        <button
                                            onClick={() => {
                                                setIsPromoCodeOpen(true)
                                                setTimeout(() => promoInputRef.current?.focus(), 0)
                                            }}
                                            className="inline-flex px-4 h-[42px] items-center bg-[#1A1D23] text-gray-300 hover:bg-[#22262F] transition-all duration-300 rounded-md"
                                        >
                                            Add promotion code
                                        </button>
                                    ) : (
                                        <motion.div
                                            className="w-full"
                                            initial={{ width: "auto" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="relative h-[42px] promo-input">
                                                <Input
                                                    ref={promoInputRef}
                                                    value={promoCode}
                                                    onChange={(e) => setPromoCode(e.target.value)}
                                                    onBlur={handlePromoCodeBlur}
                                                    placeholder="Enter promotion code"
                                                    className="w-full h-full rounded-md px-4"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handlePromoCodeSubmit()
                                                        }
                                                    }}
                                                />
                                                {promoCode && (
                                                    <button
                                                        onClick={handlePromoCodeSubmit}
                                                        className="absolute right-0 top-0 h-full px-4 text-gray-700 hover:text-gray-900 transition-colors bg-transparent"
                                                    >
                                                        Apply
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {appliedPromoCode && (
                                    <div className="flex items-center justify-end">
                                        <div className="relative flex items-center bg-red-100/10 text-red-400 px-3 py-2 text-sm rounded-md">
                                            <span className="font-medium">{appliedPromoCode}</span>
                                            <button
                                                onClick={() => setAppliedPromoCode(null)}
                                                className="ml-3 text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-gray-800 pt-4">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-white font-medium">Total due today</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-medium">
                                                {(() => {
                                                    if (!checkoutData) return formatNumber(0);
                                                    const basePrice = checkoutData.merchantProduct?.price || checkoutData.subscriptionPlan?.amount || checkoutData.paymentLink?.price || 0;
                                                    const fees = checkoutData.merchantProduct?.fees || [];
                                                    const feeAmount = fees.reduce((total, fee) => {
                                                        return total + (basePrice * (fee.percentage / 100));
                                                    }, 0);
                                                    return formatNumber(basePrice + feeAmount);
                                                })()}
                                            </span>
                                            <span className="text-lg text-gray-400">{checkoutData?.paymentLink?.currency_code}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile View - Add top padding to account for fixed header */}
                    <div className="lg:hidden flex flex-col items-center px-2 mt-14">
                        {/* Product Image */}
                        <div className="w-36 h-36 mb-5 rounded-lg overflow-hidden bg-gray-800">
                            {(() => {
                                if (checkoutData?.merchantProduct?.image_url || checkoutData?.subscriptionPlan?.image_url) {
                                    return (
                                        <img
                                            src={checkoutData.merchantProduct?.image_url || checkoutData.subscriptionPlan?.image_url || ''}
                                            alt="Product"
                                            className="w-full h-full object-cover"
                                        />
                                    );
                                }

                                if (organization.logoUrl) {
                                    return (
                                        <img
                                            src={organization.logoUrl}
                                            alt="Organization Logo"
                                            className="w-full h-full object-cover"
                                        />
                                    );
                                }

                                return (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon className="h-12 w-12 text-gray-600" />
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Product Title & Price */}
                        <div className="text-center mb-5">
                            <h2 className="text-base text-gray-400 mb-1.5">
                                {checkoutData?.subscriptionPlan ? 'Subscribe to ' : 'Pay for '}
                                {checkoutData?.merchantProduct?.name || checkoutData?.subscriptionPlan?.name || checkoutData?.paymentLink?.title}
                            </h2>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-3xl font-bold">
                                    {formatNumber(checkoutData?.merchantProduct?.price || checkoutData?.subscriptionPlan?.amount || checkoutData?.paymentLink?.price || 0)}
                                </span>
                                <span className="text-3xl">{checkoutData?.paymentLink?.currency_code}</span>
                            </div>
                        </div>

                        {/* Add Code Button */}
                        <button
                            onClick={() => {
                                setIsDetailsOpen(true);
                                setIsPromoCodeOpen(true);
                                setTimeout(() => promoInputRef.current?.focus(), 100);
                            }}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1A1D23] text-gray-300 hover:bg-[#22262F] transition-all duration-300 rounded-md text-sm mb-8"
                        >
                            Add code
                            <ChevronDown className="h-4 w-4 opacity-70" />
                        </button>
                    </div>

                    {/* Mobile Details Dropdown */}
                    <AnimatePresence>
                        {isDetailsOpen && (
                            <>
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsDetailsOpen(false)}
                                    className="lg:hidden fixed inset-0 bg-black/20 z-30"
                                />
                                {/* Content */}
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="lg:hidden fixed top-14 left-0 right-0 z-40 bg-[#121317] overflow-hidden"
                                >
                                    <div className="p-4 space-y-4">
                                        {/* Product Info */}
                                        <div className="flex items-start gap-3 border-b border-gray-800 pb-4">
                                            <div className="w-16 h-16 rounded-md bg-gray-800 flex-shrink-0 overflow-hidden">
                                                {((checkoutData?.merchantProduct?.image_url || checkoutData?.subscriptionPlan?.image_url) || '') ? (
                                                    <img
                                                        src={(checkoutData?.merchantProduct?.image_url || checkoutData?.subscriptionPlan?.image_url) || ''}
                                                        alt="Product"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon className="h-6 w-6 text-gray-600" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-white font-medium">
                                                    {checkoutData?.merchantProduct?.name || checkoutData?.subscriptionPlan?.name || checkoutData?.paymentLink?.title}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    {checkoutData?.merchantProduct?.description || checkoutData?.subscriptionPlan?.description || checkoutData?.paymentLink?.public_description}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price Breakdown */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-baseline">
                                                <span className="text-gray-400">Subtotal</span>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg">{formatNumber(checkoutData?.merchantProduct?.price || checkoutData?.subscriptionPlan?.amount || checkoutData?.paymentLink?.price || 0)}</span>
                                                    <span className="text-lg text-gray-400">{checkoutData?.paymentLink?.currency_code}</span>
                                                </div>
                                            </div>

                                            {/* Fees */}
                                            {checkoutData?.merchantProduct?.fees?.map((fee) => {
                                                const basePrice = checkoutData.merchantProduct?.price || 0;
                                                const feeAmount = basePrice * (fee.percentage / 100);
                                                return (
                                                    <div key={fee.fee_type_id} className="flex justify-between items-baseline">
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="text-gray-400">{fee.name}</span>
                                                            <span className="text-xs text-gray-500">({fee.percentage}%)</span>
                                                        </div>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-gray-400">{formatNumber(feeAmount)}</span>
                                                            <span className="text-gray-500">{checkoutData.paymentLink.currency_code}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Promo Code */}
                                            <div className="relative flex justify-start pt-3">
                                                {!isPromoCodeOpen ? (
                                                    <button
                                                        onClick={() => {
                                                            setIsPromoCodeOpen(true)
                                                            setTimeout(() => promoInputRef.current?.focus(), 0)
                                                        }}
                                                        className="inline-flex px-4 h-[42px] items-center bg-[#1A1D23] text-gray-300 hover:bg-[#22262F] transition-all duration-300 rounded-md"
                                                    >
                                                        Add promotion code
                                                    </button>
                                                ) : (
                                                    <motion.div
                                                        className="w-full"
                                                        initial={{ width: "auto" }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <div className="relative h-[42px] promo-input">
                                                            <Input
                                                                ref={promoInputRef}
                                                                value={promoCode}
                                                                onChange={(e) => setPromoCode(e.target.value)}
                                                                onBlur={handlePromoCodeBlur}
                                                                placeholder="Enter promotion code"
                                                                className="w-full h-full rounded-md px-4"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        handlePromoCodeSubmit()
                                                                    }
                                                                }}
                                                            />
                                                            {promoCode && (
                                                                <button
                                                                    onClick={handlePromoCodeSubmit}
                                                                    className="absolute right-0 top-0 h-full px-4 text-gray-700 hover:text-gray-900 transition-colors bg-transparent"
                                                                >
                                                                    Apply
                                                                </button>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Total */}
                                            <div className="flex justify-between items-baseline pt-3 border-t border-gray-800">
                                                <span className="text-white font-medium">Total due today</span>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-medium">
                                                        {(() => {
                                                            if (!checkoutData) return formatNumber(0);
                                                            const basePrice = checkoutData.merchantProduct?.price || checkoutData.subscriptionPlan?.amount || checkoutData.paymentLink?.price || 0;
                                                            const fees = checkoutData.merchantProduct?.fees || [];
                                                            const feeAmount = fees.reduce((total, fee) => {
                                                                return total + (basePrice * (fee.percentage / 100));
                                                            }, 0);
                                                            return formatNumber(basePrice + feeAmount);
                                                        })()}
                                                    </span>
                                                    <span className="text-gray-400">{checkoutData?.paymentLink?.currency_code}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right side - Checkout form */}
                <div className="w-full lg:w-1/2 bg-white p-4 lg:p-8">
                    <div className="max-w-[448px] lg:pl-8 w-full mx-auto px-4">
                        {/* Mobile Money Options */}
                        <div className="flex overflow-x-auto pb-4 space-x-4">
                            {checkoutData?.paymentLink?.allowed_providers?.map((provider) => (
                                provider !== 'ECOBANK' && provider !== 'NOWPAYMENTS' && (
                                    <div
                                        key={provider}
                                        onClick={() => {
                                            if (!areRequiredFieldsFilled()) {
                                                toast({
                                                    variant: "destructive",
                                                    title: "Required Information",
                                                    description: "Please fill in your full name, email, and phone number first."
                                                });

                                                // Focus on the name input
                                                if (nameInputRef.current) {
                                                    nameInputRef.current.focus();
                                                }
                                            } else {
                                                handleProviderClick(provider);
                                            }
                                        }}
                                        className={`flex-shrink-0 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 ${!areRequiredFieldsFilled()
                                            ? 'opacity-50'
                                            : selectedProvider === provider
                                                ? 'bg-gray-50/80'
                                                : 'hover:bg-gray-50/50'
                                            }`}
                                        style={{ width: '100px', height: '100px', padding: '0' }}
                                    >
                                        <img
                                            src={`/payment_channels/${provider.toLowerCase()}.webp`}
                                            alt={provider}
                                            className={`w-full h-full object-contain rounded-lg ${!areRequiredFieldsFilled() ? 'grayscale' : ''}`}
                                        />
                                    </div>
                                )
                            ))}
                        </div>

                        {/* Crypto payment option (NOWPAYMENTS) */}
                        {checkoutData?.paymentLink?.allowed_providers?.includes('NOWPAYMENTS') && (
                            <div className="mb-4 mt-1">
                                <ButtonExpand
                                    text="Pay with crypto using lomi."
                                    icon={ArrowRight}
                                    bgColor="bg-blue-900 dark:bg-blue-800"
                                    textColor="text-white dark:text-white"
                                    hoverBgColor="hover:bg-blue-800 dark:hover:bg-blue-700"
                                    hoverTextColor="hover:text-white dark:hover:text-white"
                                    className="w-full justify-end rounded-md h-10 font-normal text-sm tracking-wide border border-blue-700 dark:border-blue-700 shadow-sm"
                                    onClick={() => {
                                        if (!areRequiredFieldsFilled()) {
                                            toast({
                                                variant: "destructive",
                                                title: "Required Information",
                                                description: "Please fill in your full name, email, and phone number first."
                                            });

                                            // Focus on the name input
                                            if (nameInputRef.current) {
                                                nameInputRef.current.focus();
                                            }
                                        } else {
                                            handleProviderClick('NOWPAYMENTS');
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <Dialog open={isCheckoutModalOpen} onOpenChange={setIsCheckoutModalOpen}>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Secure Checkout</DialogTitle>
                                    <DialogDescription>
                                        Complete your payment securely with {selectedProvider || 'selected provider'}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between py-4">
                                        <div className="flex items-center space-x-4">
                                            {selectedProvider && (
                                                <img
                                                    src={`${selectedProvider === 'NOWPAYMENTS' ? '/company/lomi_icon.png' : `/payment_channels/${selectedProvider.toLowerCase()}.webp`}`}
                                                    alt={selectedProvider}
                                                    className="w-12 h-12 object-contain"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium">Amount</p>
                                                <p className="text-2xl font-bold">
                                                    {formatNumber(checkoutData?.merchantProduct?.price || checkoutData?.subscriptionPlan?.amount || checkoutData?.paymentLink?.price || 0)} {checkoutData?.paymentLink?.currency_code}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 h-10"
                                        disabled={isProcessing}
                                        onClick={handleCheckoutSubmit}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            `Pay with ${selectedProvider === 'MTN' ? 'Momo' : selectedProvider === 'ORANGE' ? 'Orange Money' : selectedProvider === 'WAVE' ? 'Wave' : selectedProvider === 'NOWPAYMENTS' ? 'Crypto' : selectedProvider}`
                                        )}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Plain divider line - Always visible without text */}
                        <div className="relative flex items-center mb-4">
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        {/* Customer Information Form - Always visible */}
                        <form onSubmit={handleSubmit} className="space-y-3 [&_*]:!rounded-none">
                            {/* Cardholder Information */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {checkoutData?.paymentLink?.allowed_providers?.includes('ECOBANK')
                                        ? "Cardholder information"
                                        : "Personal information"
                                    }
                                </label>
                                <div className="rounded-lg shadow-sm shadow-black/[.04]">
                                    <Input
                                        ref={nameInputRef}
                                        name="fullName"
                                        value={rawNameInput}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            setRawNameInput(inputValue);

                                            // Now handle the firstName/lastName split
                                            const trimmedValue = inputValue.trim();
                                            const lastSpaceIndex = trimmedValue.lastIndexOf(' ');

                                            if (lastSpaceIndex === -1) {
                                                // No space found, all is first name
                                                setCustomerDetails(prev => ({
                                                    ...prev,
                                                    firstName: trimmedValue,
                                                    lastName: ''
                                                }));
                                            } else {
                                                // Split at the last space
                                                const firstName = trimmedValue.substring(0, lastSpaceIndex);
                                                const lastName = trimmedValue.substring(lastSpaceIndex + 1);
                                                setCustomerDetails(prev => ({
                                                    ...prev,
                                                    firstName,
                                                    lastName
                                                }));
                                            }
                                        }}
                                        placeholder={checkoutData?.paymentLink?.allowed_providers?.includes('ECOBANK')
                                            ? "Full name on card"
                                            : "Full name"
                                        }
                                        className="rounded-b-none w-full bg-white text-gray-900 border-gray-300 focus:bg-white dark:bg-white dark:text-gray-900 dark:border-gray-300 dark:focus:bg-white dark:placeholder:text-gray-500 input-checkout"
                                        required
                                    />
                                    <div className="flex -mt-px">
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={customerDetails.email}
                                            onChange={handleCustomerInputChange}
                                            placeholder="Email address"
                                            className="rounded-none w-full bg-white text-gray-900 border-gray-300"
                                            required
                                        />
                                    </div>
                                    <div className="flex -mt-px">
                                        <div className="w-full rounded-none box-border">
                                            <PhoneNumberInput
                                                value={customerDetails.phoneNumber}
                                                onChange={(value) => {
                                                    setCustomerDetails(prev => ({
                                                        ...prev,
                                                        phoneNumber: value || '',
                                                        whatsappNumber: isDifferentWhatsApp ? prev.whatsappNumber : value || ''
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {!isDifferentWhatsApp ? (
                                        <div className="flex -mt-px">
                                            <div className="w-full rounded-none box-border bg-white border border-gray-300">
                                                <div
                                                    onClick={() => setIsDifferentWhatsApp(true)}
                                                    className="group py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all duration-200 px-3"
                                                >
                                                    <span className="text-xs text-gray-500">My WhatsApp number is different</span>
                                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex -mt-px bg-transparent">
                                                <div className="w-full rounded-none bg-transparent relative">
                                                    <WhatsAppNumberInput
                                                        value={customerDetails.whatsappNumber}
                                                        onChange={(value) => setCustomerDetails(prev => ({ ...prev, whatsappNumber: value || '' }))}
                                                    />
                                                    <div
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-blue-100 hover:bg-blue-200 transition-colors p-1.5"
                                                        onClick={() => setIsDifferentWhatsApp(false)}
                                                        title="Switch to using phone number"
                                                    >
                                                        <ArrowRightLeft className="h-3.5 w-3.5 text-blue-600" />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* "Or pay with card" divider - Only when ECOBANK is active */}
                            {checkoutData?.paymentLink?.allowed_providers?.includes('ECOBANK') && (
                                <div className="relative flex items-center mb-4">
                                    <div className="flex-grow border-t border-gray-300"></div>
                                    <span className="flex-shrink mx-4 text-gray-400">Or pay with card</span>
                                    <div className="flex-grow border-t border-gray-300"></div>
                                </div>
                            )}

                            {/* Card Information - Only show if ECOBANK is in allowed providers */}
                            {checkoutData?.paymentLink?.allowed_providers?.includes('ECOBANK') && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Card information</label>
                                    <div className="rounded-lg shadow-sm shadow-black/[.04]">
                                        <Input
                                            id="number"
                                            name="number"
                                            value={cardDetails.number}
                                            onChange={handleInputChange}
                                            placeholder="1234 1234 1234 1234"
                                            className="rounded-b-none bg-white text-gray-900 border-gray-300"
                                            required
                                        />
                                        <div className="flex -mt-px">
                                            <Input
                                                id="expiry"
                                                name="expiry"
                                                value={cardDetails.expiry}
                                                onChange={handleInputChange}
                                                placeholder="MM / YY"
                                                className="rounded-none w-1/2 bg-white text-gray-900 border-gray-300 border-r-0"
                                                required
                                            />
                                            <Input
                                                id="cvc"
                                                name="cvc"
                                                value={cardDetails.cvc}
                                                onChange={handleInputChange}
                                                placeholder="CVC"
                                                className="rounded-none w-1/2 bg-white text-gray-900 border-gray-300"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Billing Address */}
                            <div className="space-y-2 billing-address-section">
                                <label className="block text-sm font-medium text-gray-700">Billing address</label>
                                <div className="rounded-lg shadow-sm shadow-black/[.04]">
                                    <div className="relative">
                                        <select
                                            name="country"
                                            value={customerDetails.country}
                                            onChange={handleCustomerInputChange}
                                            className="flex h-10 w-full border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 rounded-b-none appearance-none bg-white text-gray-900"
                                            required
                                        >
                                            <option value="" className="text-gray-400">Select country</option>
                                            {countries.map((country) => (
                                                <option key={country} value={country}>
                                                    {country}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                                    </div>
                                    <div className="flex -mt-px">
                                        <Input
                                            name="city"
                                            value={customerDetails.city}
                                            onChange={handleCustomerInputChange}
                                            placeholder="City"
                                            className="rounded-none w-full border-x bg-white text-gray-900 border-gray-300"
                                            required
                                        />
                                    </div>
                                    <div className="flex -mt-px">
                                        <Input
                                            name="address"
                                            value={customerDetails.address}
                                            onChange={handleCustomerInputChange}
                                            placeholder="Address"
                                            className="rounded-none rounded-bl w-[70%] bg-white text-gray-900 border-gray-300 border-r-0"
                                            required
                                        />
                                        <Input
                                            name="postalCode"
                                            value={customerDetails.postalCode}
                                            onChange={handleCustomerInputChange}
                                            placeholder="Postal code"
                                            className="rounded-none rounded-br w-[30%] bg-white text-gray-900 border-gray-300"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button - Only show for card payments */}
                            {checkoutData?.paymentLink?.allowed_providers?.includes('ECOBANK') && (
                                <div className="flex justify-center pt-2">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-[#074367] text-white font-semibold allow-rounded hover:bg-[#063352] transition duration-300 shadow-md text-lg"
                                        disabled={!isPaymentFormValid()}
                                    >
                                        {checkoutData?.subscriptionPlan ? 'Subscribe' : 'Pay'}
                                    </Button>
                                </div>
                            )}

                            {/* Subscription Confirmation Text */}
                            {checkoutData?.subscriptionPlan && (
                                <div className="w-full text-sm text-center text-gray-600 mt-4 mb-2">
                                    <p>
                                        By confirming your subscription, you authorize {checkoutData.paymentLink?.organizationName || 'the merchant'} to charge you for future payments in accordance with their terms. You can always cancel your subscription.
                                    </p>
                                </div>
                            )}
                        </form>

                        <div className="mt-6 select-none">
                            <div className="border-t border-gray-200 pt-4"></div>
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
                    </div>
                </div>
            </div>
            {isNowPaymentsModalOpen && nowPaymentsTransactionId && (
                <NOWPaymentsCheckout
                    isOpen={isNowPaymentsModalOpen}
                    onClose={() => setIsNowPaymentsModalOpen(false)}
                    transactionId={nowPaymentsTransactionId}
                    onPaymentSuccess={handleNowPaymentsSuccess}
                    onPaymentError={handleNowPaymentsError}
                    isModal={true}
                />
            )}
        </>
    )
}