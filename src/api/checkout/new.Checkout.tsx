import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useParams } from 'react-router-dom'
import { fetchDataForCheckout, fetchOrganizationDetails } from './support_checkout'
import { CheckoutData } from './checkoutTypes.ts'
import { useUser } from '@/lib/hooks/useUser'
import { supabase } from '@/utils/supabase/client'

export default function CheckoutPage() {
    const { linkId } = useParams<{ linkId?: string }>()
    const [organization, setOrganization] = useState<{ organizationId: string | null; logoUrl: string | null }>({ organizationId: null, logoUrl: null })
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' })
    const { user } = useUser()

    useEffect(() => {
        const fetchOrganization = async () => {
            if (user?.id) {
                const orgDetails = await fetchOrganizationDetails(user.id)
                setOrganization({ ...orgDetails, logoUrl: null })
            }
        }

        const fetchData = async () => {
            if (linkId && organization.organizationId) {
                const data = await fetchDataForCheckout(linkId, organization.organizationId)
                setCheckoutData(data)

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

        fetchOrganization()
        fetchData()
    }, [linkId, organization.organizationId, user?.id])

    const handleProviderClick = (provider: string) => {
        setSelectedProvider(provider)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'expiry') {
            const formatted = value.replace(/\D/g, '').slice(0, 4)
            if (formatted.length > 2) {
                setCardDetails(prev => ({ ...prev, [name]: `${formatted.slice(0, 2)}/${formatted.slice(2)}` }))
            } else {
                setCardDetails(prev => ({ ...prev, [name]: formatted }))
            }
        } else {
            setCardDetails(prev => ({ ...prev, [name]: value }))
        }
    }

    const renderProviderImages = () => {
        if (checkoutData?.paymentLink?.allowed_providers) {
            // Always place the "STRIPE" provider first if it exists
            const stripeIndex = checkoutData.paymentLink.allowed_providers.indexOf('STRIPE');
            if (stripeIndex !== -1) {
                checkoutData.paymentLink.allowed_providers.splice(stripeIndex, 1);
                checkoutData.paymentLink.allowed_providers.unshift('STRIPE');
            }

            return checkoutData.paymentLink.allowed_providers.map((provider) => (
                <motion.div
                    key={provider}
                    onClick={() => handleProviderClick(provider)}
                    className={`flex-shrink-0 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 border ${selectedProvider === provider ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-100'}`}
                    style={{ width: '100px', height: '100px', padding: '0' }}
                >
                    {provider === 'STRIPE' ? (
                        <img src="/cards.png" alt="Credit Cards" className="w-full h-full object-contain rounded-lg" />
                    ) : provider === 'ORANGE' ? (
                        <img src="/orange.png" alt="Orange" className="w-full h-full object-contain rounded-lg" />
                    ) : provider === 'WAVE' ? (
                        <img src="/wave.png" alt="Wave" className="w-full h-full object-contain rounded-lg" />
                    ) : provider === 'MTN' ? (
                        <img src="/mtn.png" alt="MTN" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                        <span>{provider}</span>
                    )}
                </motion.div>
            ));
        }
        return null;
    };

    const isPaymentFormValid = () => {
        return cardDetails.number !== '' && cardDetails.expiry !== '' && cardDetails.cvc !== ''
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-6xl bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    {/* Left side - Product details */}
                    <div className="w-full lg:w-1/2 p-4 lg:p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center mb-4">
                                {organization.logoUrl && (
                                    <img
                                        src={organization.logoUrl}
                                        alt="Organization Logo"
                                        width={80}
                                        height={80}
                                        className="rounded-md mr-4"
                                    />
                                )}
                                <div className="flex-1">
                                    {checkoutData?.merchantProduct && (
                                        <>
                                            <h2 className="text-lg font-semibold text-gray-900">{checkoutData.merchantProduct.name}</h2>
                                            <p className="text-gray-600">{checkoutData.merchantProduct.description}</p>
                                            <p className="text-gray-800 font-semibold mt-2">{checkoutData.merchantProduct.price} {checkoutData.merchantProduct.currencyCode}</p>
                                        </>
                                    )}
                                    {checkoutData?.subscriptionPlan && (
                                        <>
                                            <h2 className="text-lg font-semibold text-gray-900">{checkoutData.subscriptionPlan.name}</h2>
                                            <p className="text-gray-600">{checkoutData.subscriptionPlan.description}</p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <p className="text-gray-800 font-semibold">{checkoutData.subscriptionPlan.amount} {checkoutData.subscriptionPlan.currencyCode}</p>
                                                <span className="text-gray-400">|</span>
                                                <p className="text-gray-600">Billed {checkoutData.subscriptionPlan.billingFrequency}</p>
                                            </div>
                                        </>
                                    )}
                                    {!checkoutData?.merchantProduct && !checkoutData?.subscriptionPlan && (
                                        <div className="mt-[-30px]">
                                            <h2 className="text-lg font-semibold text-gray-900">{checkoutData?.paymentLink?.title}</h2>
                                            <p className="text-gray-600">{checkoutData?.paymentLink?.public_description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="border-t border-gray-200 pt-4 mb-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700">Subtotal</span>
                                    <span className="text-gray-900">
                                        {checkoutData?.merchantProduct?.price || checkoutData?.subscriptionPlan?.amount || checkoutData?.paymentLink?.price} {checkoutData?.paymentLink?.currency_code}
                                    </span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-gray-900">
                                        {checkoutData?.merchantProduct?.price || checkoutData?.subscriptionPlan?.amount || checkoutData?.paymentLink?.price} {checkoutData?.paymentLink?.currency_code}
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 text-center">
                                By completing this purchase, you agree to our <a href="/terms" className="text-blue-600 hover:underline">Terms</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>

                    {/* Right side - Checkout component */}
                    <div className="w-full lg:w-1/2 p-4 lg:p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Checkout</h2>
                        <div className="space-y-6">
                            {/* Render the "Pay" button with Apple icon */}
                            <Button
                                onClick={() => handleProviderClick('APPLE_PAY')}
                                className="w-full bg-black text-white font-semibold py-7 px-6 rounded-md hover:bg-gray-900 transition duration-300 shadow-md flex items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    x="0px"
                                    y="0px"
                                    width="28"
                                    height="28"
                                    viewBox="0 0 50 50"
                                    style={{ fill: '#FFFFFF' }}
                                    className="mr-1"
                                >
                                    <path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z"></path>
                                </svg>
                                <span className="text-2xl">Pay</span>
                            </Button>

                            <div className="relative flex items-center">
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="flex-shrink mx-4 text-gray-400">Or pay another way</span>
                                <div className="flex-grow border-t border-gray-300"></div>
                            </div>

                            <div className="relative">
                                <div
                                    className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    {renderProviderImages()}
                                </div>
                            </div>
                            <AnimatePresence mode="wait">
                                {selectedProvider === 'STRIPE' && (
                                    <motion.form
                                        key="card-form"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4 bg-white rounded-md"
                                    >
                                        <div className="rounded-lg shadow-sm shadow-black/[.04]">
                                            <div className="relative focus-within:z-10">
                                                <Input
                                                    id="number"
                                                    name="number"
                                                    value={cardDetails.number}
                                                    onChange={handleInputChange}
                                                    placeholder="1234 1234 1234 1234"
                                                    className="peer rounded-b-none pe-12 shadow-none [direction:inherit] text-lg py-3 mt-1 block w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                                    required
                                                />
                                                <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-4 text-muted-foreground/80 peer-disabled:opacity-50">
                                                    <div className="flex space-x-1">
                                                        <img src="/checkout-visa.png" alt="Visa" className="h-4 w-auto" />
                                                        <img src="/checkout-mastercard.png" alt="Mastercard" className="h-4 w-auto" />
                                                        <img src="/checkout-amer.png" alt="American Express" className="h-4 w-auto" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="-mt-px flex">
                                                <div className="w-1/2 min-w-0 flex-1 focus-within:z-10">
                                                    <Input
                                                        id="expiry"
                                                        name="expiry"
                                                        value={cardDetails.expiry}
                                                        onChange={handleInputChange}
                                                        placeholder="MM/YY"
                                                        className="rounded-e-none rounded-t-none shadow-none [direction:inherit] text-lg py-3 block w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                                        required
                                                    />
                                                </div>
                                                <div className="-ms-px w-1/2 min-w-0 flex-1 focus-within:z-10">
                                                    <Input
                                                        id="cvc"
                                                        name="cvc"
                                                        value={cardDetails.cvc}
                                                        onChange={handleInputChange}
                                                        placeholder="CVC"
                                                        className="rounded-s-none rounded-t-none shadow-none [direction:inherit] text-lg py-3 block w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full bg-blue-600 text-white font-semibold py-7 px-4 rounded-md hover:bg-gray-700 transition duration-300 shadow-md text-xl"
                                            disabled={!isPaymentFormValid()}
                                        >
                                            Pay
                                        </Button>
                                    </motion.form>
                                )}
                                {selectedProvider && selectedProvider !== 'STRIPE' && selectedProvider !== 'APPLE_PAY' && (
                                    <motion.div
                                        key="other-method"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-center"
                                    >
                                        <Button className="w-full bg-blue-600 text-white font-semibold py-7 px-4 rounded-md hover:bg-gray-700 transition duration-300 shadow-md text-xl">
                                            Continue with {selectedProvider}
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="mt-8 text-center">
                            <div className="border-t border-gray-200 pt-4 mb-4"></div>
                            <span className="text-sm text-gray-500 font-semibold inline-flex items-center">
                                Powered by{' '}
                                <a href="https://lomi.africa" target="_blank" rel="noopener noreferrer">
                                    <img src="/transparent2.png" alt="Lomi" className="h-8 w-8 ml-1" />
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
