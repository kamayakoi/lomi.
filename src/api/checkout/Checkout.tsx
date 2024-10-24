import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle } from 'lucide-react'
import axios from 'axios'
import { useUser } from '@/lib/hooks/useUser'
import { useOrganization } from '@/lib/hooks/useOrganization'
import {
    PaymentMethod,
    PaymentStatus,
    CheckoutFormData,
    WaveCheckoutResponse,
    Product,
    Provider,
    Organization,
    PaymentLink,
} from './checkoutTypes'
import { supabase } from '@/utils/supabase/client'
import { useParams } from 'react-router-dom'

export default function CheckoutPage() {
    const { productId, planId } = useParams<{ productId?: string; planId?: string }>();
    const [selectedMethod, setSelectedMethod] = useState('')
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' })
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle')
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
    const { user } = useUser();
    const userOrganization = useOrganization();
    const paymentMethods: PaymentMethod[] = [
        { id: 'CREDIT_CARD', name: 'Credit Card', icon: '/cards.png', color: 'bg-gray-100' },
        { id: 'APPLE_PAY', name: 'Apple Pay', icon: '/apple-pay.png', color: 'bg-gray-100' },
        { id: 'GOOGLE_PAY', name: 'Google Pay', icon: '/google-pay.png', color: 'bg-gray-100' },
        { id: 'WAVE', name: 'Wave', icon: '/wave.png', color: 'bg-blue-500' },
        { id: 'ORANGE', name: 'Orange', icon: '/orange.png', color: 'bg-gray-100' },
        { id: 'MTN_MOMO', name: 'Momo', icon: '/mtn.png', color: 'bg-gray-100' },
    ]

    useEffect(() => {
        // Fetch organization data
        const fetchOrganization = async () => {
            if (user && userOrganization) {
                try {
                    const response = await axios.get<Organization>(`/api/organizations/${userOrganization.organizationId}`);
                    setOrganization(response.data);
                } catch (error) {
                    console.error('Error fetching organization data:', error);
                }
            }
        };

        // Fetch product or plan data based on the URL parameters
        const fetchData = async () => {
            if (productId) {
                // Fetch product data using productId
                try {
                    const response = await axios.get<Product>(`/api/products/${productId}`);
                    setProduct(response.data);
                } catch (error) {
                    console.error('Error fetching product data:', error);
                }
            } else if (planId) {
                // Fetch plan data using planId
                try {
                    const response = await axios.get<Product>(`/api/plans/${planId}`);
                    setProduct(response.data);
                } catch (error) {
                    console.error('Error fetching plan data:', error);
                }
            }
        };

        // Fetch payment link data
        const fetchPaymentLink = async () => {
            if (user && userOrganization) {
                try {
                    const response = await axios.get<PaymentLink>(`/api/payment-links/${productId || planId}`);
                    setPaymentLink(response.data);
                } catch (error) {
                    console.error('Error fetching payment link data:', error);
                }
            }
        };

        fetchOrganization();
        fetchData();
        fetchPaymentLink();
    }, [user, userOrganization, productId, planId]);

    useEffect(() => {
        // Fetch available providers
        const fetchProviders = async () => {
            if (paymentLink) {
                try {
                    const allowedProviders = paymentLink.allowedProviders;
                    setProviders(allowedProviders.map((code) => ({ code, name: code, description: '' })));
                } catch (error) {
                    console.error('Error fetching providers:', error);
                }
            }
        };

        if (paymentLink) {
            fetchProviders();
        }
    }, [paymentLink]);

    const handleMethodSelect = (methodId: string) => {
        setSelectedMethod(methodId)
        setPaymentStatus('idle')
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'expiry') {
            // Automatically format expiry date
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setPaymentStatus('processing')

        // Simulate API call
        setTimeout(() => {
            if (cardDetails.number === '4444 4444 4444 4444') {
                setPaymentStatus('success')
            } else if (cardDetails.number === '0000 0000 0000 0000') {
                setPaymentStatus('failure')
            } else {
                setPaymentStatus('idle')
            }
        }, 2000)
    }

    const initiateWaveCheckout = async () => {
        setPaymentStatus('processing');
        try {
            if (user && userOrganization && product && paymentLink) {
                // Create a new customer or fetch existing customer
                const { data: customerData, error: customerError } = await supabase.rpc('create_customer', {
                    p_merchant_id: user.id,
                    p_organization_id: userOrganization.organizationId,
                    p_name: 'Customer Name', // Replace with actual customer name
                    p_email: 'customer@example.com', // Replace with actual customer email
                    p_phone_number: '+1234567890', // Replace with actual customer phone number
                    p_country: 'Country', // Replace with actual customer country
                    p_city: 'City', // Replace with actual customer city
                    p_address: 'Address', // Replace with actual customer address
                    p_postal_code: '12345', // Replace with actual customer postal code
                    p_is_business: false, // Replace with actual customer type
                });

                if (customerError) {
                    console.error('Error creating or fetching customer:', customerError);
                    setPaymentStatus('failure');
                    return;
                }

                const customerId = customerData.customer_id;

                const checkoutFormData: CheckoutFormData = {
                    amount: paymentLink.price || product.price,
                    currency: paymentLink.currencyCode || product.currencyCode,
                    aggregatedMerchantId: 'your_aggregated_merchant_id', // Determine based on merchant and organization
                    errorUrl: 'https://pay.lomi.africa/error',
                    successUrl: paymentLink.successUrl || 'https://pay.lomi.africa/success',
                    merchantId: product.merchantId,
                    organizationId: product.organizationId,
                    customerId: customerId,
                    productId: product.id,
                    subscriptionId: null,
                    transactionType: 'payment',
                    description: `Payment for ${product.name}`,
                    referenceId: 'ref_123',
                    metadata: paymentLink.metadata,
                    feeAmount: 0,
                    feeReference: 'standard_fee',
                    providerCode: 'WAVE',
                    paymentMethodCode: 'MOBILE_MONEY',
                    providerTransactionId: 'wave_transaction_id_here', // Replace with actual Wave transaction ID
                    providerPaymentStatus: 'pending', // Set initial payment status
                };

                const response = await axios.post<WaveCheckoutResponse>('/api/checkout/wave', checkoutFormData);
                const { waveLaunchUrl } = response.data;
                window.location.href = waveLaunchUrl;
            }
        } catch (error) {
            console.error('Error initiating Wave checkout:', error);
            setPaymentStatus('failure');
        }
    };

    const renderPaymentStatus = () => {
        switch (paymentStatus) {
            case 'processing':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-4"
                    >
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
                        <p className="text-gray-800 font-semibold">Processing payment...</p>
                    </motion.div>
                )
            case 'success':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center py-4"
                    >
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <p className="text-green-600 font-semibold">Payment successful!</p>
                    </motion.div>
                )
            case 'failure':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center py-4"
                    >
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600 font-semibold">Payment failed. Please try again.</p>
                    </motion.div>
                )
            default:
                return null
        }
    }

    const isPaymentFormValid = () => {
        return cardDetails.number !== '' && cardDetails.expiry !== '' && cardDetails.cvc !== ''
    }

    return (
        <div className="max-w-6xl mx-auto my-4 md:my-8 border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-white flex flex-col md:flex-row">
                {/* Left side - Product details */}
                <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-4 text-gray-900">{paymentLink?.title || 'Your Order'}</h1>
                        <div className="flex items-center mb-4">
                            {organization && (
                                <img
                                    src={organization.logoUrl}
                                    alt="Organization Logo"
                                    width={80}
                                    height={80}
                                    className="rounded-md mr-4"
                                />
                            )}
                            <div>
                                {product && (
                                    <>
                                        <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
                                        <p className="text-gray-600">{paymentLink?.publicDescription || product.description}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">Subtotal</span>
                                <span className="text-gray-900">{paymentLink?.price || product?.price} {paymentLink?.currencyCode || product?.currencyCode}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span className="text-gray-900">Total</span>
                                <span className="text-gray-900">{paymentLink?.price || product?.price} {paymentLink?.currencyCode || product?.currencyCode}</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            By completing this purchase, you agree to our <a href="/terms" className="text-blue-600 hover:underline">Terms</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                        </p>
                    </div>
                </div>

                {/* Middle separation (visible only on larger screens) */}
                <div className="hidden md:block w-px bg-gray-200"></div>

                {/* Right side - Checkout component */}
                <div className="w-full md:w-1/2 p-4 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Checkout</h2>
                    <div className="space-y-6">
                        <div className="relative">
                            <div
                                className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {providers.map((provider) => (
                                    <motion.div
                                        key={provider.code}
                                        onClick={() => handleMethodSelect(provider.code)}
                                        className={`flex-shrink-0 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 border ${selectedMethod === provider.code ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-100'
                                            }`}
                                        style={{ width: '100px', height: '100px', padding: '0rem' }}
                                    >
                                        <span>{provider.name}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <AnimatePresence mode="wait">
                            {selectedMethod === 'CREDIT_CARD' && paymentStatus === 'idle' && (
                                <motion.form
                                    key="card-form"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-4 bg-white rounded-md p-4"
                                >
                                    <div className="relative">
                                        <Input
                                            id="number"
                                            name="number"
                                            value={cardDetails.number}
                                            onChange={handleInputChange}
                                            placeholder="1234 1234 1234 1234"
                                            className="mt-1 block w-full pr-20 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
                                            <img src="/checkout-visa.png" alt="Visa" className="h-4 w-auto" />
                                            <img src="/checkout-mastercard.png" alt="Mastercard" className="h-4 w-auto" />
                                            <img src="/checkout-amer.png" alt="American Express" className="h-4 w-auto" />
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <div className="flex-1">
                                            <Input
                                                id="expiry"
                                                name="expiry"
                                                value={cardDetails.expiry}
                                                onChange={handleInputChange}
                                                placeholder="MM/YY"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                id="cvc"
                                                name="cvc"
                                                value={cardDetails.cvc}
                                                onChange={handleInputChange}
                                                placeholder="CVC"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
                                        disabled={!isPaymentFormValid()}
                                    >
                                        Pay
                                    </Button>
                                </motion.form>
                            )}
                            {selectedMethod === 'WAVE' && paymentStatus === 'idle' && (
                                <motion.div
                                    key="wave-method"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-center"
                                >
                                    <Button
                                        onClick={initiateWaveCheckout}
                                        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
                                    >
                                        Continue with Wave
                                    </Button>
                                </motion.div>
                            )}
                            {selectedMethod && selectedMethod !== 'CREDIT_CARD' && selectedMethod !== 'WAVE' && paymentStatus === 'idle' && (
                                <motion.div
                                    key="other-method"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-center"
                                >
                                    <Button
                                        onClick={() => console.log(`Proceeding with ${selectedMethod} payment`)}
                                        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
                                    >
                                        Continue with {paymentMethods.find(m => m.id === selectedMethod)?.name}
                                    </Button>
                                </motion.div>
                            )}
                            {renderPaymentStatus()}
                        </AnimatePresence>
                    </div>
                    <div className="mt-8 text-center">
                        <div className="border-t border-gray-200 pt-4 mb-4"></div>
                        <span className="text-sm text-gray-500 font-semibold inline-block">
                            Powered by <span className="text-gray-800">lomi.</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
