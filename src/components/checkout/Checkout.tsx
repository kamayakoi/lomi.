import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Smartphone, Apple, Building, CheckCircle, XCircle } from 'lucide-react'

interface PaymentMethod {
    id: string
    name: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    color: string
    darkColor: string
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'failure'

export default function Checkout() {
    const [selectedMethod, setSelectedMethod] = useState('')
    const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvc: '' })
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle')
    const paymentMethods: PaymentMethod[] = [
        {
            id: 'CREDIT_CARD',
            name: 'Credit Card',
            icon: CreditCard,
            color: 'bg-indigo-100 text-indigo-600',
            darkColor: 'bg-indigo-800 text-indigo-100',
        },
        {
            id: 'MOBILE_MONEY',
            name: 'Mobile Money',
            icon: Smartphone,
            color: 'bg-yellow-100 text-yellow-600',
            darkColor: 'bg-yellow-800 text-yellow-100',
        },
        {
            id: 'BANK_TRANSFER',
            name: 'Bank Transfer',
            icon: Building,
            color: 'bg-green-100 text-green-600',
            darkColor: 'bg-green-800 text-green-100',
        },
        {
            id: 'APPLE_PAY',
            name: 'Apple Pay',
            icon: Apple,
            color: 'bg-gray-100 text-gray-600',
            darkColor: 'bg-gray-800 text-gray-100',
        },
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
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-indigo-600 dark:text-indigo-400 font-semibold">Processing payment...</p>
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
                        <p className="text-green-600 dark:text-green-400 font-semibold">Payment successful!</p>
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
                        <p className="text-red-600 dark:text-red-400 font-semibold">Payment failed. Please try again.</p>
                    </motion.div>
                )
            default:
                return null
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
                <form onSubmit={handleSubmit} className="flex">
                    <div className="w-1/2 p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your order</h2>
                        <div className="bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg p-6">
                            <div className="mb-4">
                                <p className="text-gray-600 dark:text-gray-400">Pure set</p>
                                <p className="text-lg font-semibold text-gray-800 dark:text-white">$65.00</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-gray-600 dark:text-gray-400">Pure glow cream</p>
                                <p className="text-lg font-semibold text-gray-800 dark:text-white">$64.00</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-gray-600 dark:text-gray-400">Subtotal</p>
                                <p className="text-lg font-semibold text-gray-800 dark:text-white">$129.00</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-gray-600 dark:text-gray-400">Shipping</p>
                                <p className="text-lg font-semibold text-gray-800 dark:text-white">$5.00</p>
                            </div>
                            <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                                <p className="text-gray-600 dark:text-gray-400">Total due</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">$134.00</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Checkout</h2>
                        <CardContent className="p-6">
                            <motion.div
                                className="grid grid-cols-3 gap-4 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {paymentMethods.map((method) => (
                                    <motion.div
                                        key={method.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleMethodSelect(method.id)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedMethod === method.id ? `${method.darkColor} shadow-md` : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        <method.icon className={`h-8 w-8 mb-2 ${selectedMethod === method.id ? '' : 'text-gray-500 dark:text-gray-400'}`} />
                                        <span className="text-xs font-medium text-center dark:text-gray-200">{method.name}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                            <AnimatePresence mode="wait">
                                {selectedMethod === 'CREDIT_CARD' && paymentStatus === 'idle' && (
                                    <motion.div
                                        key="card-form"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-200">Name on Card</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={cardDetails.name}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="number" className="text-sm font-medium text-gray-700 dark:text-gray-200">Card Number</Label>
                                            <Input
                                                id="number"
                                                name="number"
                                                value={cardDetails.number}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                                                required
                                            />
                                        </div>
                                        <div className="flex space-x-4">
                                            <div className="flex-1">
                                                <Label htmlFor="expiry" className="text-sm font-medium text-gray-700 dark:text-gray-200">Expiry Date</Label>
                                                <Input
                                                    id="expiry"
                                                    name="expiry"
                                                    value={cardDetails.expiry}
                                                    onChange={handleInputChange}
                                                    placeholder="MM/YY"
                                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                                                    required
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Label htmlFor="cvc" className="text-sm font-medium text-gray-700 dark:text-gray-200">CVC</Label>
                                                <Input
                                                    id="cvc"
                                                    name="cvc"
                                                    value={cardDetails.cvc}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
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
                                        <p className="mb-4 text-gray-700 dark:text-gray-200">You&apos;ve selected {paymentMethods.find(m => m.id === selectedMethod)?.name}.</p>
                                        <Button
                                            type="submit"
                                            className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 shadow-md"
                                        >
                                            Continue with {paymentMethods.find(m => m.id === selectedMethod)?.name}
                                        </Button>
                                    </motion.div>
                                )}
                                {renderPaymentStatus()}
                            </AnimatePresence>
                        </CardContent>
                    </div>
                </form>
                <CardFooter className="bg-gray-50 dark:bg-gray-700 py-3 flex justify-center items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Powered by lomi.</span>
                </CardFooter>
            </Card>
        </div>
    )
}