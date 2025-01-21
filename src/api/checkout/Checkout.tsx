import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useParams, useNavigate } from 'react-router-dom'
import { fetchDataForCheckout, fetchOrganizationDetails } from './support-checkout.tsx'
import { CheckoutData } from './checkoutTypes.ts'
import { supabase } from '@/utils/supabase/client'
import PhoneNumberInput from '@/components/ui/phone-number-input'
import { ArrowLeft, ImageIcon } from 'lucide-react'

// Helper function to format numbers with separators
const formatNumber = (num: number | string) => {
    if (typeof num === 'string') num = parseFloat(num);
    return num.toLocaleString('fr-FR');
};

export default function CheckoutPage() {
    const navigate = useNavigate()
    const { linkId } = useParams<{ linkId?: string }>()
    const [organization, setOrganization] = useState<{ organizationId: string | null; logoUrl: string | null }>({ organizationId: null, logoUrl: null })
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
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
                    }
                }
            }
        }

        fetchData();
        fetchOrganization();
    }, [linkId, checkoutData?.paymentLink?.organizationId]);

    const handleProviderClick = (provider: string) => {
        setSelectedProvider(prev => prev === provider ? null : provider)
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

    const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        navigate(-1)
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

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left side - Product details */}
            <div className="w-full lg:w-1/2 bg-[#121317] text-white p-4 lg:p-8 flex flex-col">
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
                <div className="max-w-[488px] pl-8 w-full">
                    {/* Mobile Money Options */}
                    <div className="flex overflow-x-auto pb-4 space-x-4">
                        {checkoutData?.paymentLink?.allowed_providers?.map((provider) => (
                            provider !== 'ECOBANK' && (
                                <div
                                    key={provider}
                                    onClick={() => handleProviderClick(provider)}
                                    className={`flex-shrink-0 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 border ${selectedProvider === provider ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-100'
                                        }`}
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

                    {/* Continue with provider button */}
                    {selectedProvider && selectedProvider !== 'ECOBANK' && (
                        <div className="mt-2 mb-6 flex justify-center">
                            <Button
                                onClick={() => {/* handle provider payment */ }}
                                className={`
                                    w-full h-12 text-white font-semibold rounded-none transition duration-300 shadow-md text-lg
                                    ${selectedProvider === 'ORANGE' ? 'bg-[#FC6307] hover:bg-[#E35A06]' : ''}
                                    ${selectedProvider === 'WAVE' ? 'bg-[#25BBF9] text-black hover:bg-[#60B8D8]' : ''}
                                    ${selectedProvider === 'MTN' ? 'bg-[#F7CE46] text-black hover:bg-[#E0B83D]' : ''}
                                `}
                            >
                                Continue with {selectedProvider === 'MTN' ? 'Momo' : selectedProvider === 'ORANGE' ? 'Orange' : selectedProvider === 'WAVE' ? 'Wave' : selectedProvider}
                            </Button>
                        </div>
                    )}

                    <div className="relative flex items-center mb-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-400">Or pay with card</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Email */}
                        <div>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={customerDetails.email}
                                onChange={handleCustomerInputChange}
                                placeholder="Email address**"
                                className="w-full"
                                required
                            />
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
                                    className="rounded-b-none"
                                    required
                                />
                                <div className="flex -mt-px">
                                    <Input
                                        id="expiry"
                                        name="expiry"
                                        value={cardDetails.expiry}
                                        onChange={handleInputChange}
                                        placeholder="MM / YY"
                                        className="rounded-none rounded-bl-lg w-1/2"
                                        required
                                    />
                                    <Input
                                        id="cvc"
                                        name="cvc"
                                        value={cardDetails.cvc}
                                        onChange={handleInputChange}
                                        placeholder="CVC"
                                        className="rounded-none rounded-br-lg w-1/2"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cardholder Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Cardholder name</label>
                            <div className="flex space-x-3">
                                <Input
                                    name="firstName"
                                    value={customerDetails.firstName}
                                    onChange={handleCustomerInputChange}
                                    placeholder="First name"
                                    className="w-1/2"
                                    required
                                />
                                <Input
                                    name="lastName"
                                    value={customerDetails.lastName}
                                    onChange={handleCustomerInputChange}
                                    placeholder="Last name"
                                    className="w-1/2"
                                    required
                                />
                            </div>
                        </div>

                        {/* Billing Address */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Billing address</label>
                            <div className="space-y-3">
                                <div className="flex space-x-3">
                                    <Input
                                        name="country"
                                        value={customerDetails.country}
                                        onChange={handleCustomerInputChange}
                                        placeholder="Country**"
                                        className="w-1/2"
                                        required
                                    />
                                    <Input
                                        name="city"
                                        value={customerDetails.city}
                                        onChange={handleCustomerInputChange}
                                        placeholder="City**"
                                        className="w-1/2"
                                        required
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <Input
                                        name="address"
                                        value={customerDetails.address}
                                        onChange={handleCustomerInputChange}
                                        placeholder="Address line**"
                                        className="w-[70%]"
                                        required
                                    />
                                    <Input
                                        name="postalCode"
                                        value={customerDetails.postalCode}
                                        onChange={handleCustomerInputChange}
                                        placeholder="Postal code**"
                                        className="w-[30%]"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phone Numbers - Show both for subscription plans */}
                        {checkoutData?.subscriptionPlan ? (
                            <div className="space-y-3">
                                <PhoneNumberInput
                                    value={customerDetails.phoneNumber}
                                    onChange={(value) => setCustomerDetails(prev => ({ ...prev, phoneNumber: value || '' }))}
                                />
                                <PhoneNumberInput
                                    value={customerDetails.whatsappNumber}
                                    onChange={(value) => setCustomerDetails(prev => ({ ...prev, whatsappNumber: value || '' }))}
                                />
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
                    </form>

                    <div className="mt-8 select-none">
                        <div className="border-t border-gray-200 pt-4"></div>
                        <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                            <span className="inline-flex items-center">
                                Powered by{' '}
                                <a href="https://lomi.africa" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-xs font-bold flex items-baseline ml-1">
                                    lomi
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
