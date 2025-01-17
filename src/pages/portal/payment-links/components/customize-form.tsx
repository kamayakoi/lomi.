import React, { useState, useCallback, useEffect } from 'react'
import { ExternalLink, CheckCircle, Circle, Smartphone, Monitor, Lock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { supabase } from '@/utils/supabase/client'
import { useUser } from '@/lib/hooks/useUser'
import { useNavigate } from 'react-router-dom'
import { fetchProducts } from '@/pages/portal/product/components/support_product'
import { fetchSubscriptionPlans } from '@/pages/portal/subscription/components/support_subscriptions'
import { Product } from '@/pages/portal/product/components/Products_types'
import { SubscriptionPlan } from '@/pages/portal/subscription/components/types'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { provider_code } from './PaymentLinks_types'

interface PaymentMethod {
    id: string
    name: string
    icon: string
}

type DisplayMode = 'phone' | 'desktop'

interface PriceEntry {
    amount?: string;
    currency?: string;
}

interface InstantLinkInputProps {
    name: string;
    label: string;
    value: string;
    onChange: (name: string, value: string) => void;
    optional?: boolean;
}

const InstantLinkInput: React.FC<InstantLinkInputProps> = ({ name, label, value, onChange, optional }) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
    };

    const handleBlur = () => {
        onChange(name, localValue);
    };

    return (
        <div>
            <Label htmlFor={name} className="mb-2 block">{label}</Label>
            <Input
                id={name}
                name={name}
                value={localValue}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded-none"
            />
            {optional && <p className="text-xs text-muted-foreground mt-1">Optional</p>}
        </div>
    );
};

const BrowserMockup: React.FC<{ url: string; children: React.ReactNode; displayMode: DisplayMode }> = ({ url, children, displayMode }) => (
    <div className={`border-2 border-gray-200 rounded-none shadow-lg overflow-hidden ${displayMode === 'desktop' ? 'w-full' : 'max-w-sm mx-auto'}`}>
        <div className="bg-gray-100 px-4 py-2 flex items-center space-x-2">
            <div className="flex space-x-1">
                <Circle size={10} className="text-red-500" />
                <Circle size={10} className="text-yellow-500" />
                <Circle size={10} className="text-green-500" />
            </div>
            <div className="flex-1 bg-white rounded-none px-2 py-1 text-sm text-gray-800 flex items-center justify-center relative">
                <Lock className="h-3 w-3 absolute left-2 text-green-600" />
                <span className="text-xs font-semibold text-gray-400">{url}</span>
            </div>
        </div>
        <div className={`bg-white ${displayMode === 'desktop' ? 'h-[450px]' : 'h-[455px]'} overflow-y-auto`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="p-4">
                {children}
            </div>
        </div>
    </div>
)

interface PriceInputProps {
    index: number;
    price: PriceEntry;
    onAmountChange: (index: number, amount: string) => void;
    onCurrencyChange: (index: number, currency: string) => void;
    onRemove?: (index: number) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({ index, price, onAmountChange, onCurrencyChange }) => {
    const [localAmount, setLocalAmount] = useState(price.amount || '');
    const [localCurrency, setLocalCurrency] = useState(price.currency || 'XOF');

    useEffect(() => {
        setLocalAmount(price.amount || '');
        setLocalCurrency(price.currency || 'XOF');
    }, [price]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and one decimal point
        if (/^\d*\.?\d*$/.test(value)) {
            setLocalAmount(value);
        }
    };

    const handleAmountBlur = () => {
        const formattedAmount = Number(localAmount).toFixed(2);
        setLocalAmount(formattedAmount);
        onAmountChange(index, formattedAmount);
    };

    const handleCurrencyChange = (value: string) => {
        setLocalCurrency(value);
        onCurrencyChange(index, value);
    };

    return (
        <div className="flex space-x-2">
            <div className="flex-1">
                <Label htmlFor={`price-${index}-amount`} className="mb-2 block">Price</Label>
                <Input
                    id={`price-${index}-amount`}
                    type="text"
                    inputMode="decimal"
                    pattern="^\d*\.?\d*$"
                    value={localAmount}
                    onChange={handleAmountChange}
                    onBlur={handleAmountBlur}
                    className="w-full rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
            </div>
            <div className="w-24">
                <Label htmlFor={`price-${index}-currency`} className="mb-2 block">Currency</Label>
                <Select
                    value={localCurrency}
                    onValueChange={handleCurrencyChange}
                >
                    <SelectTrigger id={`price-${index}-currency`} className="w-full rounded-none">
                        <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="XOF">XOF</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

interface ExpirationDateInputProps {
    value: Date | null;
    onChange: (value: Date | null) => void;
}

const ExpirationDateInput: React.FC<ExpirationDateInputProps> = ({ value, onChange }) => {
    const handleChange = (date: Date | null) => {
        onChange(date);
    };

    return (
        <div>
            <Label htmlFor="expirationDate" className="mb-2 block">Expiration date</Label>
            <DatePicker
                id="expirationDate"
                selected={value}
                onChange={handleChange}
                className="w-full rounded-none bg-background text-foreground p-2 border border-gray-300"
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
            />
        </div>
    );
};

interface PaymentCustomizerWithCheckoutProps {
    setIsCreateLinkOpen: (isOpen: boolean) => void
    refetch: () => void
}

export default function PaymentCustomizerWithCheckout({ setIsCreateLinkOpen, refetch }: PaymentCustomizerWithCheckoutProps) {
    const [paymentType, setPaymentType] = useState('instant')
    const [instantLinkDetails, setInstantLinkDetails] = useState({
        name: '',
        description: '',
        privateDescription: ''
    })
    const [prices, setPrices] = useState<PriceEntry[]>([{ amount: '', currency: 'XOF' }]);
    const [expirationDate, setExpirationDate] = useState<Date | null>(null);
    const [allowedPaymentMethods, setAllowedPaymentMethods] = useState(['CARDS'])
    const [redirectToCustomPage, setRedirectToCustomPage] = useState(false)
    const [customSuccessUrl, setCustomSuccessUrl] = useState('')
    const [activeTab, setActiveTab] = useState('checkout')
    const [displayMode, setDisplayMode] = useState<DisplayMode>('desktop')
    const [allowCouponCode, setAllowCouponCode] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [plans, setPlans] = useState<SubscriptionPlan[]>([])
    const { user } = useUser()
    const navigate = useNavigate()
    const [connectedProviders, setConnectedProviders] = useState<string[]>([])

    const paymentMethods: PaymentMethod[] = [
        { id: 'CARDS', name: 'Cards', icon: '/cards.webp' },
        { id: 'APPLE_PAY', name: 'Apple Pay', icon: '/apple-pay.webp' },
        { id: 'WAVE', name: 'Wave', icon: '/wave.webp' },
        { id: 'MTN', name: 'MTN', icon: '/mtn.webp' },
        { id: 'ORANGE', name: 'Orange', icon: '/orange.webp' },
    ]

    useEffect(() => {
        const fetchData = async () => {
            if (user?.id) {
                const fetchedProducts = await fetchProducts(user.id, null)
                setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : [])

                const fetchedPlans = await fetchSubscriptionPlans(user.id, 1, 50)
                setPlans(Array.isArray(fetchedPlans) ? fetchedPlans : [])

                const { data: connectedProvidersData, error: connectedProvidersError } = await supabase
                    .rpc('get_payment_link_available_providers', { p_merchant_id: user.id })

                if (connectedProvidersError) {
                    console.error('Error fetching connected providers:', connectedProvidersError)
                } else {
                    const mappedProviders = connectedProvidersData.reduce((acc: string[], provider: { code: string }) => {
                        if (provider.code === 'STRIPE') {
                            acc.push('CARDS', 'APPLE_PAY')
                        } else {
                            acc.push(provider.code)
                        }
                        return acc
                    }, [])
                    setConnectedProviders(mappedProviders)
                }
            }
        }

        fetchData()
    }, [user?.id])

    useEffect(() => {
        if (paymentType === 'product' && selectedProduct) {
            setInstantLinkDetails({
                name: selectedProduct.name,
                description: selectedProduct.description || '',
                privateDescription: '',
            })
        } else if (paymentType === 'plan' && selectedPlan) {
            setInstantLinkDetails({
                name: selectedPlan.name,
                description: selectedPlan.description || '',
                privateDescription: '',
            })
        }
    }, [paymentType, selectedProduct, selectedPlan])

    const handlePriceChange = (index: number, field: 'amount' | 'currency', value: string) => {
        const newPrices = [...prices]
        newPrices[index] = { ...newPrices[index], [field]: value }
        setPrices(newPrices)
    }

    const togglePaymentMethod = useCallback((methodId: string) => {
        setAllowedPaymentMethods(prev =>
            prev.includes(methodId) ? prev.filter(m => m !== methodId) : [...prev, methodId]
        )
    }, []);

    const handleInstantLinkChange = useCallback((name: string, value: string) => {
        setInstantLinkDetails(prev => ({ ...prev, [name]: value }));
    }, []);

    const CheckoutPage = () => (
        <div className={`mx-auto bg-white rounded-none shadow-lg overflow-hidden ${displayMode === 'desktop' ? 'max-w-4xl' : 'max-w-sm'}`}>
            <div className={`${displayMode === 'desktop' ? 'flex' : 'block'}`}>
                <div className={`${displayMode === 'desktop' ? 'w-1/2 p-6 border-r flex flex-col justify-between' : 'p-4'}`}>
                    <div>
                        <div className="mb-8">
                            <h2 className={`font-bold text-gray-900 ${displayMode === 'desktop' ? 'text-2xl' : 'text-xl'}`}>
                                {paymentType === 'instant' && prices[0]?.amount ? (
                                    `${prices[0]?.amount} ${prices[0]?.currency}`
                                ) : paymentType === 'plan' && selectedPlan?.amount ? (
                                    `${selectedPlan.amount} ${selectedPlan.currency_code}`
                                ) : paymentType === 'product' && selectedProduct?.price ? (
                                    `${selectedProduct.price} ${selectedProduct.currency_code}`
                                ) : (
                                    '0.00 XOF'
                                )}
                            </h2>
                            <p className="text-gray-600 text-sm">Amount to be paid</p>
                        </div>
                        <div>
                            <h3 className={`font-semibold text-gray-800 ${displayMode === 'desktop' ? 'text-lg' : 'text-base'} truncate max-w-[200px]`} title={instantLinkDetails.name || selectedPlan?.name || selectedProduct?.name || 'Payment'}>
                                {instantLinkDetails.name || selectedPlan?.name || selectedProduct?.name || 'Payment'}
                            </h3>
                            <p className={`text-gray-600 text-sm truncate max-w-[200px]`} title={instantLinkDetails.description || selectedPlan?.description || selectedProduct?.description || 'Description'}>
                                {instantLinkDetails.description || selectedPlan?.description || selectedProduct?.description || 'Description'}
                            </p>
                        </div>
                        {allowCouponCode && displayMode === 'desktop' && (
                            <div className="mt-4">
                                <Label htmlFor="discount-code">Discount code</Label>
                                <Input id="discount-code" type="text" placeholder="Enter code" className="mt-1 rounded-none" readOnly />
                            </div>
                        )}
                    </div>
                    {displayMode === 'desktop' && (
                        <div className="mt-8 text-left">
                            <span className="text-sm text-gray-500 font-semibold inline-flex items-center">
                                Powered by <img src="/transparent2.webp" alt="Lomi" className="h-8 w-8 ml-1" />
                            </span>
                            <div className="mt-2 text-xs flex items-center justify-between">
                                <div className="space-x-2">
                                    <a href="#" className="underline text-blue-500">Terms</a>
                                    <a href="#" className="underline text-blue-500">Conditions</a>
                                </div>
                                <a href="#" className="text-gray-500">Language</a>
                            </div>
                        </div>
                    )}
                </div>
                <div className={`${displayMode === 'desktop' ? 'w-1/2 p-10' : 'p-4'}`}>
                    {allowCouponCode && displayMode === 'phone' && (
                        <div className="mt-[-6] mb-8">
                            <Label htmlFor="discount-code">Discount code</Label>
                            <Input id="discount-code" type="text" placeholder="Enter code" className="mt-1 rounded-none" readOnly />
                        </div>
                    )}
                    <h3 className={`font-semibold text-gray-800 ${displayMode === 'desktop' ? 'text-lg' : 'text-lg'} mb-4`}>Select a payment method</h3>
                    <div className="grid gap-4">
                        {allowedPaymentMethods.includes('CARDS') && (
                            <button className="flex items-center justify-between p-4 border rounded-none transition-colors border-gray-200 dark:text-black">
                                <div className="flex items-center">
                                    <img src="/cards.webp" alt="Cards" className="w-8 h-8 mr-3" />
                                    <span className="text-lg font-medium">Cards</span>
                                </div>
                                <div className="flex space-x-2">
                                    <img src="/checkout-visa.webp" alt="Visa" className="h-6" />
                                    <img src="/checkout-mastercard.webp" alt="Mastercard" className="h-6" />
                                </div>
                            </button>
                        )}
                        {allowedPaymentMethods.filter(method => method !== 'CARDS').map((method) => {
                            const paymentMethod = paymentMethods.find(m => m.id === method)
                            return paymentMethod ? (
                                <button key={paymentMethod.id} className="flex items-center justify-between p-4 border rounded-none transition-colors border-gray-200 dark:text-black">
                                    <div className="flex items-center">
                                        <img src={paymentMethod.icon} alt={paymentMethod.name} className="w-8 h-8 mr-3" />
                                        <span className="text-lg font-medium">{paymentMethod.name}</span>
                                    </div>
                                </button>
                            ) : null
                        })}
                    </div>
                </div>
            </div>
        </div>
    )

    const SuccessPage = () => (
        <div className={`mx-auto bg-white rounded-none shadow-lg overflow-hidden ${displayMode === 'desktop' ? 'max-w-2xl' : 'max-w-md'}`}>
            <div className={`${displayMode === 'desktop' ? 'p-12' : 'p-8'} text-center h-full flex flex-col justify-center`}>
                {redirectToCustomPage ? (
                    <>
                        <ExternalLink className={`mx-auto mb-4 text-blue-600 ${displayMode === 'desktop' ? 'h-20 w-20' : 'h-16 w-16'}`} />
                        <h2 className={`font-bold mb-4 text-gray-900 ${displayMode === 'desktop' ? 'text-3xl' : 'text-2xl'}`}>Your transaction has been processed.</h2>
                        <p className="text-blue-600 text-xs mb-8">Redirection to your custom URL.</p>
                    </>
                ) : (
                    <>
                        <CheckCircle className={`mx-auto mb-4 text-green-500 ${displayMode === 'desktop' ? 'h-20 w-20' : 'h-16 w-16'}`} />
                        <h2 className={`font-bold mb-4 text-gray-900 ${displayMode === 'desktop' ? 'text-3xl' : 'text-2xl'}`}>Payment Successful!</h2>
                        <p className="text-gray-600 mb-8">Thank you for your purchase. Your order has been confirmed.</p>
                    </>
                )}
            </div>
        </div>
    )

    const CheckoutCustomizer = () => (
        <div className="space-y-6">
            <div>
                <Label htmlFor="payment-type">Select the type of payment link</Label>
                <Select value={paymentType} onValueChange={setPaymentType}>
                    <SelectTrigger id="payment-type" className="w-full mt-2 rounded-none">
                        <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="product">Associated with a product</SelectItem>
                        <SelectItem value="plan">Associated with a plan</SelectItem>
                        <SelectItem value="instant">Instant link</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {paymentType === 'product' && (
                <div className="space-y-4">
                    <Label htmlFor="product-select">Select a product</Label>
                    <Select value={selectedProduct?.product_id || ''} onValueChange={(value) => {
                        if (value === 'create-product') {
                            navigate('/portal/product')
                        } else {
                            setSelectedProduct(products.find(p => p.product_id === value) || null)
                        }
                    }}>
                        <SelectTrigger id="product-select" className="w-full rounded-none">
                            <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map(product => (
                                <SelectItem key={product.product_id} value={product.product_id}>
                                    {product.name}
                                </SelectItem>
                            ))}
                            <SelectItem value="create-product">
                                Create a product
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {paymentType === 'plan' && (
                <div className="space-y-4">
                    <Label htmlFor="plan-select">Select a plan</Label>
                    <Select value={selectedPlan?.plan_id || ''} onValueChange={(value) => {
                        if (value === 'create-plan') {
                            navigate('/portal/subscription')
                        } else {
                            setSelectedPlan(plans.find(p => p.plan_id === value) || null)
                        }
                    }}>
                        <SelectTrigger id="plan-select" className="w-full rounded-none">
                            <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                            {plans.map(plan => (
                                <SelectItem key={plan.plan_id} value={plan.plan_id}>
                                    {plan.name}
                                </SelectItem>
                            ))}
                            <SelectItem value="create-plan">
                                Create a plan
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {(paymentType === 'product' || paymentType === 'plan') && (
                <>
                    <InstantLinkInput
                        name="privateDescription"
                        label="Private description"
                        value={instantLinkDetails.privateDescription}
                        onChange={handleInstantLinkChange}
                        optional
                    />
                    <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-4">
                        <div className="flex-1">
                            <ExpirationDateInput
                                value={expirationDate}
                                onChange={setExpirationDate}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="block">Payment methods</Label>
                            <button
                                onClick={() => setAllowCouponCode(!allowCouponCode)}
                                className={`
                                    px-3 py-1.5 text-xs font-medium transition-colors duration-200 cursor-pointer inline-block rounded-none
                                    ${allowCouponCode
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                                    }
                                `}
                            >
                                {allowCouponCode ? 'Coupon Code' : 'Coupon Code'}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                            {paymentMethods
                                .filter((method) => connectedProviders.includes(method.id))
                                .map((method) => (
                                    <Badge
                                        key={method.id}
                                        variant={allowedPaymentMethods.includes(method.id) ? "default" : "outline"}
                                        className={`cursor-pointer rounded-none px-3 py-1.5 text-xs ${allowedPaymentMethods.includes(method.id)
                                            ? getBadgeColor(method.id)
                                            : 'bg-transparent hover:bg-transparent'
                                            }`}
                                        onClick={() => togglePaymentMethod(method.id)}
                                    >
                                        {method.name}
                                    </Badge>
                                ))
                            }
                        </div>
                    </div>
                </>
            )}

            {paymentType === 'instant' && (
                <>
                    <InstantLinkCustomizer />
                    <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-4">
                        <div className="flex-1">
                            <ExpirationDateInput
                                value={expirationDate}
                                onChange={setExpirationDate}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="block">Payment methods</Label>
                            <button
                                onClick={() => setAllowCouponCode(!allowCouponCode)}
                                className={`
                                    px-3 py-1.5 text-xs font-medium transition-colors duration-200 cursor-pointer inline-block rounded-none
                                    ${allowCouponCode
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                                    }
                                `}
                            >
                                {allowCouponCode ? 'Coupon Code' : 'Coupon Code'}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                            {paymentMethods
                                .filter((method) => connectedProviders.includes(method.id))
                                .map((method) => (
                                    <Badge
                                        key={method.id}
                                        variant={allowedPaymentMethods.includes(method.id) ? "default" : "outline"}
                                        className={`cursor-pointer rounded-none px-3 py-1.5 text-xs ${allowedPaymentMethods.includes(method.id)
                                            ? getBadgeColor(method.id)
                                            : 'bg-transparent hover:bg-transparent'
                                            }`}
                                        onClick={() => togglePaymentMethod(method.id)}
                                    >
                                        {method.name}
                                    </Badge>
                                ))
                            }
                        </div>
                    </div>
                </>
            )}
        </div>
    )

    // Add this function to determine the badge color
    const getBadgeColor = (methodId: string) => {
        switch (methodId) {
            case 'WAVE':
                return 'bg-[#71CDF4] hover:bg-[#71CDF4] text-black';
            case 'ORANGE':
                return 'bg-[#FC6307] hover:bg-[#FC6307] text-white';
            case 'MTN':
                return 'bg-[#F7CE46] hover:bg-[#F7CE46] text-black';
            case 'APPLE_PAY':
                return 'bg-[#000000] hover:bg-[#1a1a1a] text-white dark:bg-[#ffffff] dark:hover:bg-[#f0f0f0] dark:text-black';
            case 'CARDS':
                return 'bg-[#625BF6] hover:bg-[#625BF6] text-white';
            default:
                return '';
        }
    };

    interface CustomUrlInputProps {
        value: string;
        onChange: (value: string) => void;
    }

    const CustomUrlInput: React.FC<CustomUrlInputProps> = ({ value, onChange }) => {
        const [localValue, setLocalValue] = useState(value);

        useEffect(() => {
            setLocalValue(value);
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setLocalValue(e.target.value);
        };

        const handleBlur = () => {
            onChange(localValue);
        };

        return (
            <div>
                <Label htmlFor="customSuccessUrl" className="mb-2 block text-sm sm:text-base">Custom success page URL</Label>
                <div className="mt-1 flex flex-row rounded-none shadow-sm">
                    <span className="inline-flex items-center px-3 py-2 text-xs sm:text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 w-[72px] sm:w-[85px] justify-center">
                        https://
                    </span>
                    <Input
                        type="text"
                        name="customSuccessUrl"
                        id="customSuccessUrl"
                        className="block w-full flex-1 rounded-none text-sm sm:text-base border-l-0"
                        placeholder="example.com/success"
                        value={localValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </div>
            </div>
        );
    };

    const SuccessCustomizer = () => (
        <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold">Set up the success page</h2>
            <div className="flex items-center justify-between space-x-4">
                <Label htmlFor="redirectToggle" className="text-sm sm:text-base font-medium flex-1">
                    Redirect to a custom success page
                </Label>
                <Switch
                    id="redirectToggle"
                    checked={redirectToCustomPage}
                    onCheckedChange={setRedirectToCustomPage}
                />
            </div>
            {redirectToCustomPage && (
                <CustomUrlInput
                    value={customSuccessUrl}
                    onChange={(value) => setCustomSuccessUrl(value)}
                />
            )}
        </div>
    )

    const InstantLinkCustomizer = () => (
        <div className="space-y-4">
            <InstantLinkInput
                name="name"
                label="Name"
                value={instantLinkDetails.name}
                onChange={handleInstantLinkChange}
            />
            <InstantLinkInput
                name="description"
                label="Description"
                value={instantLinkDetails.description}
                onChange={handleInstantLinkChange}
                optional
            />
            <PriceInput
                index={0}
                price={prices[0] || { amount: '', currency: 'XOF' }}
                onAmountChange={(_, amount) => handlePriceChange(0, 'amount', amount)}
                onCurrencyChange={(_, currency) => handlePriceChange(0, 'currency', currency)}
            />
            <InstantLinkInput
                name="privateDescription"
                label="Private description"
                value={instantLinkDetails.privateDescription}
                onChange={handleInstantLinkChange}
                optional
            />
        </div>
    );

    const handleSubmit = async () => {
        if (!user || !user.id) {
            console.error('User data not available.')
            return
        }

        try {
            const { data: organizationData, error: organizationError } = await supabase
                .rpc('fetch_organization_details', { p_merchant_id: user.id })

            if (organizationError) {
                console.error('Error fetching organization details:', organizationError)
                return
            }

            // Map the selected payment methods to their corresponding provider codes
            const mappedProviders = allowedPaymentMethods.reduce((acc, method) => {
                if (method === 'CARDS' || method === 'APPLE_PAY') {
                    if (!acc.includes('STRIPE')) {
                        acc.push('STRIPE')
                    }
                } else {
                    acc.push(method as provider_code)
                }
                return acc
            }, [] as provider_code[])

            const { data, error } = await supabase.rpc('create_payment_link', {
                p_merchant_id: user.id,
                p_organization_id: organizationData[0].organization_id,
                p_link_type: paymentType,
                p_title: paymentType === 'instant' ? instantLinkDetails.name : selectedPlan?.name || selectedProduct?.name || '',
                p_public_description: paymentType === 'instant' ? instantLinkDetails.description : selectedPlan?.description || selectedProduct?.description || '',
                p_private_description: instantLinkDetails.privateDescription,
                p_price: paymentType === 'instant' && prices[0]?.amount ? parseFloat(prices[0].amount) : null,
                p_currency_code: paymentType === 'instant' ? prices[0]?.currency || 'XOF' : selectedPlan?.currency_code || selectedProduct?.currency_code || 'XOF',
                p_allowed_providers: mappedProviders,
                p_allow_coupon_code: paymentType === 'instant' ? allowCouponCode : false,
                p_expires_at: expirationDate ? expirationDate.toISOString() : null,
                p_success_url: redirectToCustomPage ? customSuccessUrl : null,
                p_plan_id: paymentType === 'plan' && selectedPlan?.plan_id ? selectedPlan.plan_id : null,
                p_product_id: paymentType === 'product' && selectedProduct?.product_id ? selectedProduct.product_id : null,
            })

            if (error) {
                console.error('Error creating payment link:', error)
                // Display an error message to the user
                alert('An error occurred while creating the payment link. Please contact support for assistance.')
            } else {
                console.log('Payment link created:', data)
                // Close the form dialog
                setIsCreateLinkOpen(false)
                // Refresh the payment links data
                refetch()
            }
        } catch (error) {
            console.error('Error creating payment link:', error)
            // Display a generic error message to the user
            alert('An unexpected error occurred. Please contact support for assistance.')
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col lg:flex-row overflow-hidden">
                <div className="w-full lg:w-[35%] p-6 overflow-auto border-r bg-white dark:bg-[#121317]">
                    {/* Title and description */}
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold">Create a payment link</h2>
                    </div>

                    {/* Show SegmentedControl only on mobile */}
                    <div className="mb-6 lg:hidden">
                        <SegmentedControl
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full rounded-none"
                        >
                            <SegmentedControl.Item value="checkout" className="w-full rounded-none">
                                Checkout page
                            </SegmentedControl.Item>
                            <SegmentedControl.Item value="success" className="w-full rounded-none">
                                Success page
                            </SegmentedControl.Item>
                        </SegmentedControl>
                    </div>

                    {/* Render the appropriate customizer based on the active tab */}
                    {activeTab === 'checkout' ? (
                        <CheckoutCustomizer />
                    ) : (
                        <SuccessCustomizer />
                    )}

                    {/* Submit button - only show on the checkout tab */}
                    {activeTab === 'checkout' && (
                        <div className="mt-8">
                            <Button
                                onClick={handleSubmit}
                                className="w-full bg-green-500 text-white hover:bg-green-600 dark:text-black rounded-none h-10"
                            >
                                Create
                            </Button>
                        </div>
                    )}
                </div>
                <div className="hidden lg:block w-full lg:w-[65%] p-6 bg-transparent dark:bg-[#121317] overflow-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Preview</h2>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant={displayMode === 'desktop' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setDisplayMode('desktop')}
                                className="rounded-none"
                            >
                                <Monitor className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={displayMode === 'phone' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setDisplayMode('phone')}
                                className="rounded-none"
                            >
                                <Smartphone className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6 -mt-6">
                        This preview simplifies the actual checkout experience.
                    </p>
                    {/* Show SegmentedControl only on desktop */}
                    <div className="mb-6">
                        <SegmentedControl
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full rounded-none"
                        >
                            <SegmentedControl.Item value="checkout" className="w-full rounded-none">
                                Checkout page
                            </SegmentedControl.Item>
                            <SegmentedControl.Item value="success" className="w-full rounded-none">
                                Success page
                            </SegmentedControl.Item>
                        </SegmentedControl>
                    </div>
                    {activeTab === 'checkout' ? (
                        <div className="relative">
                            <BrowserMockup url="pay.lomi.africa" displayMode={displayMode}>
                                <CheckoutPage />
                            </BrowserMockup>
                        </div>
                    ) : (
                        <div className="relative">
                            <BrowserMockup url="pay.lomi.africa" displayMode={displayMode}>
                                <SuccessPage />
                            </BrowserMockup>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
