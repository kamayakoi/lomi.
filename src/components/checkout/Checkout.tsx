import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Smartphone, Apple, Building, CheckCircle, XCircle, Waves, Phone, ChevronLeft, ChevronRight } from 'lucide-react'

interface PaymentMethod {
    id: string
    name: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    color: string
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'failure'

export default function StripeCheckoutPage() {
    const [selectedMethod, setSelectedMethod] = useState('')
    const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvc: '' })
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle')
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(true)
    const paymentMethods: PaymentMethod[] = [
        { id: 'CREDIT_CARD', name: 'Credit Card', icon: CreditCard, color: 'bg-gray-100' },
        { id: 'MOBILE_MONEY', name: 'Mobile Money', icon: Smartphone, color: 'bg-gray-100' },
        { id: 'BANK_TRANSFER', name: 'Bank Transfer', icon: Building, color: 'bg-gray-100' },
        { id: 'APPLE_PAY', name: 'Apple Pay', icon: Apple, color: 'bg-gray-100' },
        { id: 'WAVE_PAYMENT', name: 'Wave Payment', icon: Waves, color: 'bg-gray-100' },
        { id: 'ORANGE_PAYMENT', name: 'Orange Payment', icon: Phone, color: 'bg-gray-100' },
    ]

    const handleMethodSelect = (methodId: string) => {
        setSelectedMethod(methodId)
        setPaymentStatus('idle')
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCardDetails(prev => ({ ...prev, [name]: value }))
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

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
        }
    }

    useEffect(() => {
        const container = scrollContainerRef.current
        if (container) {
            const handleScroll = () => {
                setShowLeftArrow(container.scrollLeft > 0)
                setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth)
            }

            container.addEventListener('scroll', handleScroll)
            handleScroll() // Initial check

            return () => container.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <div className="max-w-6xl mx-auto my-4 md:my-8 border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-white flex flex-col md:flex-row">
                {/* Left side - Product details */}
                <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-4 text-gray-900">Your Order</h1>
                        <div className="flex items-center mb-4">
                            <img
                                src="/al.png"
                                alt="Product"
                                width={80}
                                height={80}
                                className="rounded-md mr-4"
                            />
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Premium Subscription</h2>
                                <p className="text-gray-600">1-year access to all features</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">Subtotal</span>
                                <span className="text-gray-900">$99.00</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span className="text-gray-900">Total</span>
                                <span className="text-gray-900">$99.00</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">
                            By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>

                {/* Middle separation (visible only on larger screens) */}
                <div className="hidden md:block w-px bg-gray-200"></div>

                {/* Right side - Checkout component */}
                <div className="w-full md:w-1/2 p-4 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Secure Payment</h2>
                    <div className="space-y-6">
                        <div className="relative">
                            {showLeftArrow && (
                                <button onClick={scrollLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10">
                                    <ChevronLeft className="h-6 w-6 text-gray-600" />
                                </button>
                            )}
                            {showRightArrow && (
                                <button onClick={scrollRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10">
                                    <ChevronRight className="h-6 w-6 text-gray-600" />
                                </button>
                            )}
                            <div
                                ref={scrollContainerRef}
                                className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {paymentMethods.map((method) => (
                                    <motion.div
                                        key={method.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleMethodSelect(method.id)}
                                        className={`flex-shrink-0 flex items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedMethod === method.id ? 'bg-gray-200 shadow-md' : method.color
                                            }`}
                                        style={{ width: '100px', height: '100px' }}
                                    >
                                        {method.id === 'WAVE_PAYMENT' ? (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <img
                                                    src="/wave.png"
                                                    alt="Wave Payment"
                                                    className="max-w-full max-h-full object-contain rounded-lg"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <method.icon className={`h-10 w-10 mb-2 ${selectedMethod === method.id ? 'text-gray-800' : 'text-gray-500'}`} />
                                                <span className="text-xs font-medium text-center text-gray-800">{method.name}</span>
                                            </>
                                        )}
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
                                    <div>
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name on Card</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={cardDetails.name}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="number" className="text-sm font-medium text-gray-700">Card Number</Label>
                                        <Input
                                            id="number"
                                            name="number"
                                            value={cardDetails.number}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                            required
                                        />
                                    </div>
                                    <div className="flex space-x-4">
                                        <div className="flex-1">
                                            <Label htmlFor="expiry" className="text-sm font-medium text-gray-700">Expiry Date</Label>
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
                                            <Label htmlFor="cvc" className="text-sm font-medium text-gray-700">CVC</Label>
                                            <Input
                                                id="cvc"
                                                name="cvc"
                                                value={cardDetails.cvc}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 shadow-md">
                                        Complete Payment
                                    </Button>
                                </motion.form>
                            )}
                            {selectedMethod && selectedMethod !== 'CREDIT_CARD' && paymentStatus === 'idle' && (
                                <motion.div
                                    key="other-method"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-center"
                                >
                                    <p className="mb-4 text-gray-700">You&apos;ve selected {paymentMethods.find(m => m.id === selectedMethod)?.name}.</p>
                                    <Button
                                        onClick={() => console.log(`Proceeding with ${selectedMethod} payment`)}
                                        className="w-full bg-gray-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300 shadow-md"
                                    >
                                        Continue with {paymentMethods.find(m => m.id === selectedMethod)?.name}
                                    </Button>
                                </motion.div>
                            )}
                            {renderPaymentStatus()}
                        </AnimatePresence>
                    </div>
                    <div className="mt-8 text-center">
                        <span className="text-sm text-gray-500 font-semibold border-t border-gray-200 pt-4 inline-block">
                            Powered by <span className="text-gray-800">lomi</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}