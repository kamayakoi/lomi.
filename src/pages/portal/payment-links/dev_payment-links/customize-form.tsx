import React, { useState } from 'react'
import { Plus, X, CheckCircle, Search, Calendar, Circle, Smartphone, Monitor } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

const BrowserMockup: React.FC<{ url: string; children: React.ReactNode; displayMode: DisplayMode }> = ({ url, children, displayMode }) => (
    <div className={`border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden ${displayMode === 'desktop' ? 'w-full' : 'max-w-sm mx-auto'}`}>
        <div className="bg-gray-100 px-4 py-2 flex items-center space-x-2">
            <div className="flex space-x-1">
                <Circle size={12} className="text-red-500" />
                <Circle size={12} className="text-yellow-500" />
                <Circle size={12} className="text-green-500" />
            </div>
            <div className="flex-1 bg-white rounded px-2 py-1 text-sm text-gray-800">
                {url}
            </div>
        </div>
        <div className={`bg-white ${displayMode === 'desktop' ? 'p-6' : 'p-4'}`}>
            {children}
        </div>
    </div>
)

export default function PaymentCustomizerWithCheckout() {
    const [paymentType, setPaymentType] = useState('instant')
    const [instantLinkDetails, setInstantLinkDetails] = useState({
        name: '',
        description: '',
        privateDescription: ''
    })
    const [prices, setPrices] = useState<PriceEntry[]>([{ amount: '', currency: 'XOF' }]);
    const [selectedMethod, setSelectedMethod] = useState('')
    const [expirationDate, setExpirationDate] = useState('')
    const [allowedPaymentMethods, setAllowedPaymentMethods] = useState(['MTN', 'Orange', 'Wave', 'Cards', 'Apple Pay'])
    const [allowCouponCode, setAllowCouponCode] = useState(false)
    const [redirectToCustomPage, setRedirectToCustomPage] = useState(false)
    const [customSuccessUrl, setCustomSuccessUrl] = useState('')
    const [activeTab, setActiveTab] = useState('checkout')
    const [advancedOpen, setAdvancedOpen] = useState(false)
    const [displayMode, setDisplayMode] = useState<DisplayMode>('phone')


    const paymentMethods: PaymentMethod[] = [
        { id: 'MTN', name: 'MTN', icon: '/mtn.png' },
        { id: 'ORANGE', name: 'Orange', icon: '/orange.png' },
        { id: 'WAVE', name: 'Wave', icon: '/wave.png' },
        { id: 'CARDS', name: 'Cards', icon: '/cards.png' },
        { id: 'APPLE_PAY', name: 'Apple Pay', icon: '/apple-pay.png' },
    ]

    const handleMethodSelect = (methodId: string) => {
        setSelectedMethod(methodId)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('instant')) {
            setInstantLinkDetails(prev => ({ ...prev, [name.replace('instant', '').toLowerCase()]: value }));
        } else if (name.startsWith('price')) {
            if (name) {
                const index = parseInt(name?.split('-')[1] ?? '0');
                const field = name?.split('-')[2] as 'amount' | 'currency';
                handlePriceChange(index, field, value);
            }
        } else if (name === 'customSuccessUrl') {
            setCustomSuccessUrl(value);
        }
    };

    const handlePriceChange = (index: number, field: 'amount' | 'currency', value: string) => {
        const newPrices = [...prices]
        newPrices[index] = { ...newPrices[index], [field]: value }
        setPrices(newPrices)
    }

    const addPrice = () => {
        const newCurrency = prices.length === 1 ? 'USD' : 'EUR'
        setPrices([...prices, { amount: '', currency: newCurrency }])
    }

    const removePrice = (index: number) => {
        const newPrices = prices.filter((_, i) => i !== index)
        setPrices(newPrices)
    }

    const togglePaymentMethod = (method: string) => {
        setAllowedPaymentMethods(prev =>
            prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]
        )
    }

    const CheckoutPage = () => (
        <div className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${displayMode === 'desktop' ? 'max-w-4xl' : 'max-w-sm'}`}>
            <div className={`${displayMode === 'desktop' ? 'p-8' : 'p-4'}`}>
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className={`font-bold text-gray-900 ${displayMode === 'desktop' ? 'text-3xl' : 'text-2xl'}`}>
                            {prices[0]?.amount ? `${prices[0]?.amount} ${prices[0]?.currency}` : '$0.00'}
                        </h2>
                        <p className="text-gray-600">Amount to be paid</p>
                    </div>
                    <div className="text-right">
                        <h3 className={`font-semibold text-gray-800 ${displayMode === 'desktop' ? 'text-xl' : 'text-lg'}`}>{instantLinkDetails.name || 'Payment'}</h3>
                        <p className="text-gray-600">{instantLinkDetails.description || 'Description'}</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className={`font-semibold text-gray-800 ${displayMode === 'desktop' ? 'text-xl' : 'text-lg'}`}>Select a payment method</h3>
                    <div className="grid gap-4">
                        {allowedPaymentMethods.map((method) => {
                            const paymentMethod = paymentMethods.find(m => m.id === method.toUpperCase())
                            return paymentMethod ? (
                                <button
                                    key={paymentMethod.id}
                                    onClick={() => handleMethodSelect(paymentMethod.id)}
                                    className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${selectedMethod === paymentMethod.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <img src={paymentMethod.icon} alt={paymentMethod.name} className="w-8 h-8 mr-3" />
                                        <span className="text-lg font-medium">{paymentMethod.name}</span>
                                    </div>
                                    {paymentMethod.id === 'CARDS' && (
                                        <div className="flex space-x-2">
                                            <img src="/checkout-visa.png" alt="Visa" className="h-6" />
                                            <img src="/checkout-mastercard.png" alt="Mastercard" className="h-6" />
                                        </div>
                                    )}
                                    {paymentMethod.id === 'APPLE_PAY' && (
                                        <div className="flex space-x-2">
                                            <img src="/apple-pay-logo.png" alt="Apple Pay" className="h-6" />
                                        </div>
                                    )}
                                </button>
                            ) : null
                        })}
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <span className="text-sm text-gray-500 font-semibold inline-block">
                        Powered by <span className="text-gray-800">lomi.</span>
                    </span>
                </div>
            </div>
        </div>
    )

    const SuccessPage = () => (
        <div className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${displayMode === 'desktop' ? 'max-w-2xl' : 'max-w-md'}`}>
            <div className={`${displayMode === 'desktop' ? 'p-12' : 'p-8'} text-center`}>
                {redirectToCustomPage ? (
                    <>
                        <h2 className={`font-bold mb-4 text-gray-900 ${displayMode === 'desktop' ? 'text-3xl' : 'text-2xl'}`}>Redirecting...</h2>
                        <p className="text-gray-600 mb-8">You will be redirected to: {customSuccessUrl}</p>
                    </>
                ) : (
                    <>
                        <CheckCircle className={`mx-auto mb-4 text-green-500 ${displayMode === 'desktop' ? 'h-20 w-20' : 'h-16 w-16'}`} />
                        <h2 className={`font-bold mb-4 text-gray-900 ${displayMode === 'desktop' ? 'text-3xl' : 'text-2xl'}`}>Payment Successful!</h2>
                        <p className="text-gray-600 mb-8">Thank you for your purchase. Your order has been confirmed.</p>
                        <Button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 shadow-md">
                            View Order Details
                        </Button>
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
                    <SelectTrigger id="payment-type" className="w-full mt-2">
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
                    <Label htmlFor="product-search">Select a product</Label>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="product-search"
                            placeholder="Search product"
                            className="pl-8"
                        />
                    </div>
                    <Button className="w-full flex items-center justify-center">
                        <Plus className="mr-2 h-4 w-4" /> Create a product
                    </Button>
                </div>
            )}

            {paymentType === 'plan' && (
                <div className="space-y-4">
                    <Label htmlFor="plan-search">Select a plan</Label>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="plan-search"
                            placeholder="Search plan"
                            className="pl-8"
                        />
                    </div>
                    <Button className="w-full flex items-center justify-center">
                        <Plus className="mr-2 h-4 w-4" /> Create a plan
                    </Button>
                </div>
            )}

            {paymentType === 'instant' && (
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="instantName">Name</Label>
                        <Input
                            id="instantName"
                            name="instantName"
                            value={instantLinkDetails.name}
                            onChange={handleInputChange}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="instantDescription">Description (Optional)</Label>
                        <Input
                            id="instantDescription"
                            name="instantDescription"
                            value={instantLinkDetails.description}
                            onChange={handleInputChange}
                            className="mt-1"
                        />
                    </div>
                    {prices.map((price, index) => (
                        <div key={index} className="flex space-x-2">
                            <div className="flex-1">
                                <Label htmlFor={`price-${index}-amount`}>Price</Label>
                                <Input
                                    id={`price-${index}-amount`}
                                    name={`price-${index}-amount`}
                                    type="number"
                                    value={price.amount}
                                    onChange={handleInputChange}
                                    className="mt-1"
                                />
                            </div>
                            <div className="w-24">
                                <Label htmlFor={`price-${index}-currency`}>Currency</Label>
                                <Select
                                    value={price.currency}
                                    onValueChange={(value) => handlePriceChange(index, 'currency', value)}
                                >
                                    <SelectTrigger id={`price-${index}-currency`} className="w-full mt-1">
                                        <SelectValue placeholder="Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="XOF">XOF</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {index > 0 && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="mt-8"
                                    onClick={() => removePrice(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    {prices.length < 3 && (
                        <Button onClick={addPrice} variant="outline" className="w-full">
                            <Plus className="mr-2 h-4 w-4" /> Add a Price
                        </Button>
                    )}
                    <div>
                        <Label htmlFor="instantPrivateDescription">Private description (Optional)</Label>
                        <Input
                            id="instantPrivateDescription"
                            name="instantPrivateDescription"
                            value={instantLinkDetails.privateDescription}
                            onChange={handleInputChange}
                            className="mt-1"
                        />
                        <p className="text-sm text-muted-foreground mt-1">This information will not be shown to the customer</p>
                    </div>
                    <Accordion type="single" collapsible value={advancedOpen ? "advanced" : ""} onValueChange={(value) => setAdvancedOpen(value === "advanced")}>
                        <AccordionItem value="advanced">
                            <AccordionTrigger>Advanced</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="expirationDate">Expiration date (Optional)</Label>
                                        <div className="relative">
                                            <Input
                                                id="expirationDate"
                                                type="text"
                                                placeholder="dd/mm/yyyy"
                                                value={expirationDate}
                                                onChange={(e) => setExpirationDate(e.target.value)}
                                                className="pl-10"
                                            />
                                            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Payment methods</Label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {paymentMethods.map((method) => (
                                                <Badge
                                                    key={method.id}
                                                    variant={allowedPaymentMethods.includes(method.name) ? "default" : "outline"}
                                                    className="cursor-pointer"
                                                    onClick={() => togglePaymentMethod(method.name)}
                                                >
                                                    {method.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="allowCouponCode"
                                            checked={allowCouponCode}
                                            onCheckedChange={setAllowCouponCode}
                                        />
                                        <Label htmlFor="allowCouponCode">Allow coupon code</Label>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            )}
        </div>
    )

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
                <div>
                    <Label htmlFor="customSuccessUrl">Custom success page URL</Label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                            https://
                        </span>
                        <Input
                            type="text"
                            name="customSuccessUrl"
                            id="customSuccessUrl"
                            className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="example.com/success"
                            value={customSuccessUrl}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div className="flex flex-col h-screen">
            <header className="flex items-center p-4 border-b">
                <h1 className="text-xl font-semibold">New payment link</h1>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <div className="w-1/2 p-6 overflow-auto border-r">
                    {activeTab === 'checkout' ? <CheckoutCustomizer /> : <SuccessCustomizer />}
                </div>
                <div className="w-1/2 p-6 bg-gray-100 overflow-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Checkout preview</h2>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant={displayMode === 'desktop' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setDisplayMode('desktop')}
                            >
                                <Monitor className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={displayMode === 'phone' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setDisplayMode('phone')}
                            >
                                <Smartphone className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <Tabs defaultValue="checkout" className="w-full" onValueChange={setActiveTab}>
                        <TabsList>
                            <TabsTrigger value="checkout">Checkout page</TabsTrigger>
                            <TabsTrigger value="success">Success page</TabsTrigger>
                        </TabsList>
                        <TabsContent value="checkout">
                            <div className="relative">
                                <BrowserMockup url="pay.lomi.africa" displayMode={displayMode}>
                                    <CheckoutPage />
                                </BrowserMockup>
                            </div>
                        </TabsContent>
                        <TabsContent value="success">
                            <div className="relative">
                                <BrowserMockup url="pay.lomi.africa" displayMode={displayMode}>
                                    <SuccessPage />
                                </BrowserMockup>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
