import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useParams } from 'react-router-dom'
import { fetchDataForCheckout, fetchOrganizationDetails } from './support-checkout.tsx'
import { CheckoutData } from './checkoutTypes.ts'
import { supabase } from '@/utils/supabase/client'
import PhoneNumberInput from '@/components/ui/phone-number-input'
import WhatsAppNumberInput from '@/components/ui/whatsapp-number-input'
import { ArrowLeft, ImageIcon, Loader2, ChevronDown } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ShieldIcon } from '@/components/icons/ShieldIcon'
import { countries } from '@/utils/data/onboarding'

// Helper function to format numbers with separators
const formatNumber = (num: number | string) => {
    if (typeof num === 'string') num = parseFloat(num);
    return num.toLocaleString('fr-FR').replace(/\s/g, '.');
};

export default function CheckoutPage() {
    const { linkId } = useParams<{ linkId?: string }>()
    const [organization, setOrganization] = useState<{ organizationId: string | null; logoUrl: string | null }>({ organizationId: null, logoUrl: null })
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

    useEffect(() => {
        // Get user's country using their IP
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                // Find the country name from our countries list
                const countryName = countries.find(country =>
                    country.toLowerCase() === data.country_name.toLowerCase()
                );
                setCustomerDetails(prev => ({
                    ...prev,
                    country: countryName || 'Côte d\'Ivoire'
                }));
            })
            .catch(() => {
                // Fallback to Côte d'Ivoire if geolocation fails
                setCustomerDetails(prev => ({
                    ...prev,
                    country: 'Côte d\'Ivoire'
                }));
            });
    }, []);

    useEffect(() => {
        const fetchOrganization = async () => {
            if (checkoutData?.paymentLink?.organizationId) {
                const orgDetails = await fetchOrganizationDetails(checkoutData.paymentLink.organizationId);
                setOrganization({ ...orgDetails, logoUrl: orgDetails.logoUrl || null });
            }
        };

        const fetchData = async () => {
            if (linkId) {
                const data = await fetchDataForCheckout(linkId);
                setCheckoutData(data);

                if (data?.paymentLink?.organizationLogoUrl) {
                    const logoPath = data.paymentLink.organizationLogoUrl
                    const { data: logoData, error: logoError } = await supabase
                        .storage
                        .from('logos')
                        .download(logoPath)

                    if (logoError) {
                        console.error('Error downloading logo:', logoError)
                    } else {
                        const logoUrl = URL.createObjectURL(logoData)
                        setOrganization(prevOrg => ({ ...prevOrg, logoUrl }))

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
            }
        }

        fetchData();
        fetchOrganization();
    }, [linkId, checkoutData?.paymentLink?.organizationId]);

    useEffect(() => {
        if (checkoutData?.paymentLink?.organizationName) {
            // Update page title
            document.title = `${checkoutData.paymentLink.organizationName} | Checkout`;

            // Update meta description
            const metaDescription = document.querySelector("meta[name='description']") as HTMLMetaElement;
            if (metaDescription) {
                metaDescription.content = `Secure checkout page for ${checkoutData.paymentLink.organizationName}`;
            }
        }
    }, [checkoutData?.paymentLink?.organizationName]);

    const handleProviderClick = async (provider: string) => {
        setSelectedProvider(provider)
        setIsCheckoutModalOpen(true)
    }

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
        return cardDetails.number !== '' && cardDetails.expiry !== '' && cardDetails.cvc !== ''
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (checkoutData) {
            try {
                const { data, error } = await supabase.rpc('create_or_update_customer', {
                    p_merchant_id: checkoutData.paymentLink.merchantId,
                    p_organization_id: checkoutData.paymentLink.organizationId,
                    p_name: `${customerDetails.firstName} ${customerDetails.lastName}`.trim(),
                    p_email: customerDetails.email,
                    p_phone_number: customerDetails.phoneNumber,
                    p_whatsapp_number: isDifferentWhatsApp ? customerDetails.whatsappNumber : customerDetails.phoneNumber,
                    p_country: customerDetails.country,
                    p_city: customerDetails.city,
                    p_address: customerDetails.address,
                    p_postal_code: customerDetails.postalCode
                });

                if (error) {
                    console.error('Error creating/updating customer:', error);
                    return;
                }

                const customerId = data;
                if (customerId) {
                    // Process the payment with the customerId
                    // ...
                }
            } catch (error) {
                console.error('Error creating/updating customer:', error);
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

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Left side - Product details */}
            <div className={`w-full lg:w-1/2 bg-[#121317] text-white p-4 lg:p-8 flex flex-col`}>
                <div className="max-w-[488px] ml-auto pr-8 w-full">
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
                                            <span className="text-4xl ml-2">{checkoutData.subscriptionPlan.currencyCode}</span>
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
                                                .replace('yearly', 'year')
                                                .replace('one-time', 'payment')}</span>
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
                                        <span className="text-4xl">{checkoutData.merchantProduct.currencyCode}</span>
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
                                        <div className="relative h-[42px]">
                                            <Input
                                                ref={promoInputRef}
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                onBlur={handlePromoCodeBlur}
                                                placeholder="Enter promotion code"
                                                className="w-full h-full bg-[#1A1D23] border-gray-800 text-white placeholder:text-gray-500 rounded-md px-4"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handlePromoCodeSubmit()
                                                    }
                                                }}
                                            />
                                            {promoCode && (
                                                <button
                                                    onClick={handlePromoCodeSubmit}
                                                    className="absolute right-0 top-0 h-full px-4 text-red-500 hover:text-red-400 transition-colors bg-transparent"
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
                                        <span className="text-lg font-medium">{formatNumber(checkoutData?.merchantProduct?.price || checkoutData?.subscriptionPlan?.amount || checkoutData?.paymentLink?.price || 0)}</span>
                                        <span className="text-lg text-gray-400">{checkoutData?.paymentLink?.currency_code}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Checkout form */}
            <div className="w-full lg:w-1/2 bg-white p-4 lg:p-8">
                <div className="max-w-[448px] pl-8 w-full">
                    {/* Mobile Money Options */}
                    <div className="flex overflow-x-auto pb-4 space-x-4">
                        {checkoutData?.paymentLink?.allowed_providers?.map((provider) => (
                            provider !== 'ECOBANK' && (
                                <div
                                    key={provider}
                                    onClick={() => handleProviderClick(provider)}
                                    className={`flex-shrink-0 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 border ${selectedProvider === provider ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-100'}`}
                                    style={{ width: '100px', height: '100px', padding: '0' }}
                                >
                                    <img
                                        src={`/${provider.toLowerCase()}.webp`}
                                        alt={provider}
                                        className="w-full h-full object-contain rounded-lg"
                                    />
                                </div>
                            )
                        ))}
                    </div>

                    <Dialog open={isCheckoutModalOpen} onOpenChange={setIsCheckoutModalOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Secure Checkout</DialogTitle>
                                <DialogDescription>
                                    Complete your payment securely with {selectedProvider}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-4">
                                    <div className="flex items-center space-x-4">
                                        {selectedProvider && (
                                            <img
                                                src={`/${selectedProvider.toLowerCase()}.webp`}
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
                                    onClick={handleCheckoutSubmit}
                                    className="w-full"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        `Pay with ${selectedProvider === 'MTN' ? 'Momo' : selectedProvider === 'ORANGE' ? 'Orange Money' : selectedProvider === 'WAVE' ? 'Wave' : selectedProvider}`
                                    )}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <div className="relative flex items-center mb-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-400">Or pay with card</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Cardholder Information */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Cardholder information</label>
                            <div className="rounded-lg shadow-sm shadow-black/[.04]">
                                <Input
                                    name="fullName"
                                    value={`${customerDetails.firstName} ${customerDetails.lastName}`.trim()}
                                    onChange={(e) => {
                                        const fullName = e.target.value;
                                        const [firstName = '', lastName = ''] = fullName.split(' ');
                                        setCustomerDetails(prev => ({
                                            ...prev,
                                            firstName,
                                            lastName
                                        }));
                                    }}
                                    placeholder="Full name on card"
                                    className="rounded-b-none w-full bg-white text-gray-900 border-gray-300"
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
                                        className="rounded-none rounded-b-lg w-full bg-white text-gray-900 border-gray-300"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Card Information */}
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
                                        className="rounded-none rounded-bl-lg w-1/2 bg-white text-gray-900 border-gray-300"
                                        required
                                    />
                                    <Input
                                        id="cvc"
                                        name="cvc"
                                        value={cardDetails.cvc}
                                        onChange={handleInputChange}
                                        placeholder="CVC"
                                        className="rounded-none rounded-br-lg w-1/2 bg-white text-gray-900 border-gray-300"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Billing Address */}
                        <div className="space-y-2">
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
                                        className="rounded-none rounded-bl-lg w-[70%] bg-white text-gray-900 border-gray-300"
                                        required
                                    />
                                    <Input
                                        name="postalCode"
                                        value={customerDetails.postalCode}
                                        onChange={handleCustomerInputChange}
                                        placeholder="Postal code"
                                        className="rounded-none rounded-br-lg w-[30%] bg-white text-gray-900 border-gray-300"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phone Numbers - Show both for subscription plans */}
                        {checkoutData?.subscriptionPlan ? (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Contact information</label>
                                <div className="rounded-lg shadow-sm shadow-black/[.04]">
                                    <div className="rounded-t-lg">
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
                                    <AnimatePresence mode="wait">
                                        {!isDifferentWhatsApp ? (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="border-t border-gray-200 mt-2"
                                            >
                                                <div
                                                    onClick={() => setIsDifferentWhatsApp(true)}
                                                    className="group py-2.5 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all duration-200"
                                                >
                                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                                                        My WhatsApp number is different
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="border-t border-gray-200 mt-2"
                                            >
                                                <WhatsAppNumberInput
                                                    value={customerDetails.whatsappNumber}
                                                    onChange={(value) => setCustomerDetails(prev => ({ ...prev, whatsappNumber: value || '' }))}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : null}

                        {/* Submit Button */}
                        <div className="flex justify-center pt-2">
                            <Button
                                type="submit"
                                className="w-full h-12 bg-[#074367] text-white font-semibold rounded-none hover:bg-[#063352] transition duration-300 shadow-md text-lg"
                                disabled={!isPaymentFormValid()}
                            >
                                {checkoutData?.subscriptionPlan ? 'Subscribe' : 'Pay'}
                            </Button>
                        </div>

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
                            <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-400">Terms</a>
                            <span className="text-gray-300">|</span>
                            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-400">Privacy</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
