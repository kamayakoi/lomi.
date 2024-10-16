import React, { useState, useCallback, useEffect } from 'react'
import { ExternalLink, CheckCircle, Circle, Smartphone, Monitor, Lock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import DateFieldInput from "@/components/ui/date-field-input"
import { DateValue } from "react-aria-components"
import { SegmentedControl } from "@/components/ui/segmented-control"

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
            {optional && <p className="text-[0.625rem] text-muted-foreground mt-1">Optional</p>}
        </div>
    );
};

const BrowserMockup: React.FC<{ url: string; children: React.ReactNode; displayMode: DisplayMode }> = ({ url, children, displayMode }) => (
    <div className={`border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden ${displayMode === 'desktop' ? 'w-full' : 'max-w-sm mx-auto'}`}>
        <div className="bg-gray-100 px-4 py-2 flex items-center space-x-2">
            <div className="flex space-x-1">
                <Circle size={12} className="text-red-500" />
                <Circle size={12} className="text-yellow-500" />
                <Circle size={12} className="text-green-500" />
            </div>
            <div className="flex-1 bg-white rounded-none px-2 py-1 text-sm text-gray-800 flex items-center justify-center relative">
                <Lock className="h-3 w-3 absolute left-2 text-green-600" />
                <span className="text-xs font-semibold text-gray-400">{url}</span>
            </div>
        </div>
        <div className={`bg-white ${displayMode === 'desktop' ? 'h-[600px]' : 'h-[565px]'} overflow-y-auto`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="p-6">
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
    value: DateValue | null;
    onChange: (value: DateValue | null) => void;
}

const ExpirationDateInput: React.FC<ExpirationDateInputProps> = ({ value, onChange }) => {
    const handleChange = (value: DateValue | null) => {
        onChange(value);
    };

    return (
        <div>
            <Label htmlFor="expirationDate" className="mb-2 block">Expiration date</Label>
            <DateFieldInput
                value={value}
                onChange={handleChange}
                className="w-full rounded-none bg-background text-foreground"
            />
        </div>
    );
};

export default function PaymentCustomizerWithCheckout() {
    const [paymentType, setPaymentType] = useState('instant')
    const [instantLinkDetails, setInstantLinkDetails] = useState({
        name: '',
        description: '',
        privateDescription: ''
    })
    const [prices, setPrices] = useState<PriceEntry[]>([{ amount: '', currency: 'XOF' }]);
    const [expirationDate, setExpirationDate] = useState<DateValue | null>(null);
    const [allowedPaymentMethods, setAllowedPaymentMethods] = useState(['MTN', 'ORANGE', 'WAVE', 'CARDS', 'APPLE_PAY'])
    const [redirectToCustomPage, setRedirectToCustomPage] = useState(false)
    const [customSuccessUrl, setCustomSuccessUrl] = useState('')
    const [activeTab, setActiveTab] = useState('checkout')
    const [displayMode, setDisplayMode] = useState<DisplayMode>('desktop')

    const paymentMethods: PaymentMethod[] = [
        { id: 'CARDS', name: 'Cards', icon: '/cards.png' },
        { id: 'APPLE_PAY', name: 'Apple Pay', icon: '/apple-pay.png' },
        { id: 'WAVE', name: 'Wave', icon: '/wave.png' },
        { id: 'MTN', name: 'MTN', icon: '/mtn.png' },
        { id: 'ORANGE', name: 'Orange', icon: '/orange.png' },
    ]

    const handlePriceChange = (index: number, field: 'amount' | 'currency', value: string) => {
        const newPrices = [...prices]
        newPrices[index] = { ...newPrices[index], [field]: value }
        setPrices(newPrices)
    }

    const togglePaymentMethod = useCallback((methodId: string) => {
        if (methodId !== 'CARDS') {
            setAllowedPaymentMethods(prev =>
                prev.includes(methodId) ? prev.filter(m => m !== methodId) : [...prev, methodId]
            )
        }
    }, []);

    const handleInstantLinkChange = useCallback((name: string, value: string) => {
        setInstantLinkDetails(prev => ({ ...prev, [name]: value }));
    }, []);

    const CheckoutPage = () => (
        <div className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${displayMode === 'desktop' ? 'max-w-4xl' : 'max-w-sm'}`}>
            <div className={`${displayMode === 'desktop' ? 'flex' : 'block'}`}>
                <div className={`${displayMode === 'desktop' ? 'w-1/2 p-6 border-r flex flex-col justify-between' : 'p-4'}`}>
                    <div>
                        <div className="mb-8">
                            <h2 className={`font-bold text-gray-900 ${displayMode === 'desktop' ? 'text-2xl' : 'text-xl'}`}>
                                {prices[0]?.amount ? `${prices[0]?.amount} ${prices[0]?.currency}` : '0.00 XOF'}
                            </h2>
                            <p className="text-gray-600 text-sm">Amount to be paid</p>
                        </div>
                        <div>
                            <h3 className={`font-semibold text-gray-800 ${displayMode === 'desktop' ? 'text-lg' : 'text-base'} truncate max-w-[200px]`} title={instantLinkDetails.name || 'Payment'}>{instantLinkDetails.name || 'Payment'}</h3>
                            <p className={`text-gray-600 text-sm truncate max-w-[200px]`} title={instantLinkDetails.description || 'Description'}>{instantLinkDetails.description || 'Description'}</p>
                        </div>
                    </div>
                    {displayMode === 'desktop' && (
                        <div className="mt-8 text-left">
                            <span className="text-sm text-gray-500 font-semibold inline-flex items-center">
                                Powered by <img src="/transparent2.png" alt="Lomi" className="h-8 w-8 ml-1" />
                            </span>
                            <div className="mt-2 text-xs text-blue-500 space-x-2">
                                <a href="#" className="underline">Terms</a>
                                <a href="#" className="underline">Conditions</a>
                            </div>
                        </div>
                    )}
                </div>
                <div className={`${displayMode === 'desktop' ? 'w-1/2 p-6' : 'p-4'}`}>
                    <h3 className={`font-semibold text-gray-800 ${displayMode === 'desktop' ? 'text-lg' : 'text-lg'} mb-4`}>Select a payment method</h3>
                    <div className="grid gap-4">
                        {/* Always render the "Cards" element first */}
                        {allowedPaymentMethods.includes('CARDS') && (
                            <button
                                className={`flex items-center justify-between p-4 border rounded-none transition-colors border-gray-200 dark:text-black`}
                            >
                                <div className="flex items-center">
                                    <img src="/cards.png" alt="Cards" className="w-8 h-8 mr-3" />
                                    <span className="text-lg font-medium">Cards</span>
                                </div>
                                <div className="flex space-x-2">
                                    <img src="/checkout-visa.png" alt="Visa" className="h-6" />
                                    <img src="/checkout-mastercard.png" alt="Mastercard" className="h-6" />
                                </div>
                            </button>
                        )}
                        {/* Render the remaining payment methods */}
                        {allowedPaymentMethods.filter(method => method !== 'CARDS').map((method) => {
                            const paymentMethod = paymentMethods.find(m => m.id === method)
                            return paymentMethod ? (
                                <button
                                    key={paymentMethod.id}
                                    className={`flex items-center justify-between p-4 border rounded-none transition-colors border-gray-200 dark:text-black`}
                                >
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
            {displayMode === 'phone' && (
                <div className="mt-8 text-center">
                    <span className="text-sm text-gray-500 font-semibold inline-flex items-center justify-center">
                        Powered by <img src="/transparent2.png" alt="Lomi" className="h-8 w-8 ml-1" />
                    </span>
                    <div className="mt-4 mb-6 text-xs text-blue-500 space-x-2">
                        <a href="#" className="underline">Terms</a>
                        <a href="#" className="underline">Conditions</a>
                    </div>
                </div>
            )}
        </div>
    )

    const SuccessPage = () => (
        <div className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${displayMode === 'desktop' ? 'max-w-2xl' : 'max-w-md'}`}>
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
                    <Select>
                        <SelectTrigger id="product-select" className="w-full">
                            <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="create-product">
                                Create a product
                            </SelectItem>
                            {/* Add more SelectItem components for existing products */}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {paymentType === 'plan' && (
                <div className="space-y-4">
                    <Label htmlFor="plan-select">Select a plan</Label>
                    <Select>
                        <SelectTrigger id="plan-select" className="w-full">
                            <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="create-plan">
                                Create a plan
                            </SelectItem>
                            {/* Add more SelectItem components for existing plans */}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {paymentType === 'instant' && (
                <div className="space-y-4">
                    <InstantLinkCustomizer />
                    <ExpirationDateInput
                        value={expirationDate}
                        onChange={setExpirationDate}
                    />
                    <div className="space-y-4"> {/* Increased space between label and badges */}
                        <Label className="block">Payment methods</Label>
                        <div className="flex flex-wrap gap-2">
                            {paymentMethods.map((method) => (
                                <Badge
                                    key={method.id}
                                    variant={allowedPaymentMethods.includes(method.id) ? "default" : "outline"}
                                    className={`cursor-pointer rounded-none px-4 py-2 ${allowedPaymentMethods.includes(method.id)
                                        ? getBadgeColor(method.id)
                                        : 'bg-transparent hover:bg-transparent'
                                        }`}
                                    onClick={() => togglePaymentMethod(method.id)}
                                >
                                    {method.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
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
                <Label htmlFor="customSuccessUrl" className="mb-2 block">Custom success page URL</Label>
                <div className="mt-1 flex rounded-none shadow-sm">
                    <span className="inline-flex items-center rounded-none border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                        https://
                    </span>
                    <Input
                        type="text"
                        name="customSuccessUrl"
                        id="customSuccessUrl"
                        className="block w-full flex-1 rounded-none border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            <h2 className="text-2xl font-bold">Set up the success page</h2>
            <div className="flex items-center justify-between">
                <Label htmlFor="redirectToggle" className="text-base font-medium">
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

    const handleSubmit = () => {
        // TODO: Implement the logic to submit the payment link creation
        console.log("Submitting payment link creation...");
        // You can add your submission logic here, such as API calls, state updates, etc.
    };

    return (
        <div className="flex flex-col">
            <div className="flex overflow-hidden">
                <div className="w-[35%] p-6 overflow-auto border-r bg-white dark:bg-[#121317]">
                    {/* Add the new title and description here */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold">Create a payment link</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Fill in the details to get started.
                        </p>
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
                                className="w-full bg-primary hover:bg-primary/90 text-white dark:text-black rounded-none h-10"
                            >
                                Create Payment Link
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-[65%] p-6 bg-transparent dark:bg-[#121317] overflow-auto">
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
                        This preview approximates the actual checkout experience.
                    </p>
                    <div className="mb-6">
                        <SegmentedControl
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <SegmentedControl.Item value="checkout" className="w-full">
                                Checkout page
                            </SegmentedControl.Item>
                            <SegmentedControl.Item value="success" className="w-full">
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
