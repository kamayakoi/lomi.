import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentLink, provider_code, link_type } from './types'
import { LifeBuoy, X } from 'lucide-react'
import { toast } from "@/lib/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

const linkTypeColors: Record<link_type, string> = {
    'instant': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'product': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'plan': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

function formatPrice(price: number | undefined): string {
    if (price === undefined) {
        return '-';
    }
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
}

const providerColors: Record<provider_code, string> = {
    'ORANGE': 'bg-[#FC6307] text-white dark:bg-[#FC6307] dark:text-white',
    'WAVE': 'bg-[#71CDF4] text-blue-700 dark:bg-[#71CDF4] dark:text-white',
    'ECOBANK': 'bg-[#074367] text-white dark:bg-[#074367] dark:text-white',
    'MTN': 'bg-[#F7CE46] text-black dark:bg-[#F7CE46] dark:text-black',
    'NOWPAYMENTS': 'bg-[#037BFE] text-white dark:bg-[#037BFE] dark:text-white',
    'APPLE': 'bg-[#000000] text-white dark:bg-[#000000] dark:text-white',
    'GOOGLE': 'bg-[#4285F4] text-white dark:bg-[#4285F4] dark:text-white',
    'MOOV': 'bg-[#0093DD] text-white dark:bg-[#0093DD] dark:text-white',
    'AIRTEL': 'bg-[#FF0000] text-white dark:bg-[#FF0000] dark:text-white',
    'MPESA': 'bg-[#4CAF50] text-white dark:bg-[#4CAF50] dark:text-white',
    'OPAY': 'bg-[#14B55A] text-white dark:bg-[#14B55A] dark:text-white',
    'PAYPAL': 'bg-[#003087] text-white dark:bg-[#003087] dark:text-white',
    'OTHER': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
}

type PaymentLinkActionsProps = {
    paymentLink: PaymentLink | null
    isOpen: boolean
    onClose: () => void
}

export default function PaymentLinkActions({ paymentLink, isOpen, onClose }: PaymentLinkActionsProps) {
    if (!paymentLink) return null

    const handleContactSupport = () => {
        const subject = encodeURIComponent(`[Support] — Payment link Issue: ${paymentLink.link_id} (id)`)
        const mailtoLink = `mailto:hello@lomi.africa?subject=${subject}`
        window.location.href = mailtoLink
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                className="sm:max-w-2xl w-full p-0 overflow-y-auto rounded-none"
            >
                <Card className="border-0 shadow-none rounded-none h-full">
                    <CardHeader className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-medium">Link details</CardTitle>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground md:hidden">
                            <X className="h-4 w-4" />
                        </button>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4 overflow-auto">
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Link ID</span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(paymentLink.link_id);
                                        toast({
                                            description: "Copied to clipboard",
                                        });
                                    }}
                                    className="font-mono text-xs text-blue-500 hover:text-blue-500"
                                >
                                    {paymentLink.link_id}
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <span className={`
                                    inline-block px-2 py-1 rounded-none text-xs font-normal
                                    ${paymentLink.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}
                                `}>
                                    {paymentLink.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <Separator />

                            {paymentLink.link_type === 'product' ? (
                                <div>
                                    <span className="text-sm text-muted-foreground block">Associated Product</span>
                                    <p className="text-sm mt-1">{paymentLink.product_name || '-'}</p>
                                </div>
                            ) : paymentLink.link_type === 'plan' ? (
                                <div>
                                    <span className="text-sm text-muted-foreground block">Associated Plan</span>
                                    <p className="text-sm mt-1">{paymentLink.plan_name || '-'}</p>
                                </div>
                            ) : null}

                            <div>
                                <span className="text-sm text-muted-foreground block">Private Description</span>
                                <p className="text-sm mt-1">{paymentLink.private_description || '-'}</p>
                            </div>

                            <div>
                                <span className="text-sm text-muted-foreground block">Price</span>
                                <p className="text-sm mt-1">
                                    {paymentLink.link_type === 'instant' && paymentLink.price ? (
                                        `${formatPrice(paymentLink.price)} ${paymentLink.currency_code}`
                                    ) : paymentLink.link_type === 'product' && paymentLink.product_price ? (
                                        `${formatPrice(paymentLink.product_price)} ${paymentLink.currency_code}`
                                    ) : paymentLink.link_type === 'plan' && paymentLink.plan_amount ? (
                                        `${formatPrice(paymentLink.plan_amount)} ${paymentLink.currency_code}`
                                    ) : (
                                        '-'
                                    )}
                                </p>
                            </div>

                            <div>
                                <span className="text-sm text-muted-foreground block">Link Type</span>
                                <span className={`
                                    inline-block px-2 py-1 rounded-none text-xs font-normal mt-1
                                    ${linkTypeColors[paymentLink.link_type]}
                                `}>
                                    {paymentLink.link_type.charAt(0).toUpperCase() + paymentLink.link_type.slice(1)}
                                </span>
                            </div>

                            <div>
                                <span className="text-sm text-muted-foreground block">URL</span>
                                <a
                                    href={paymentLink.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-500 hover:underline mt-1 block"
                                >
                                    {paymentLink.url}
                                </a>
                            </div>

                            <div>
                                <span className="text-sm text-muted-foreground block">Success URL</span>
                                <p className="text-sm mt-1">{paymentLink.success_url || '-'}</p>
                            </div>

                            <div>
                                <span className="text-sm text-muted-foreground block">Expiration Date</span>
                                <p className="text-sm mt-1">{paymentLink.expires_at ? formatDate(paymentLink.expires_at) : '-'}</p>
                            </div>

                            <div>
                                <span className="text-sm text-muted-foreground block">Allowed Providers</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {paymentLink.allowed_providers.length > 0 ? (
                                        paymentLink.allowed_providers.map((provider) => (
                                            <span
                                                key={provider}
                                                className={`inline-block px-2 py-1 rounded-none text-xs font-semibold ${providerColors[provider]}`}
                                            >
                                                {formatProviderCode(provider)}
                                            </span>
                                        ))
                                    ) : (
                                        <span>-</span>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <Button variant="outline" className="w-full sm:w-auto rounded-none" onClick={handleContactSupport}>
                                    <LifeBuoy className="mr-2 h-4 w-4" />
                                    Contact Support
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </SheetContent>
        </Sheet>
    )
}

function formatProviderCode(providerCode: provider_code): string {
    switch (providerCode) {
        case 'ORANGE':
            return 'Orange'
        case 'WAVE':
            return 'Wave'
        case 'ECOBANK':
            return 'Ecobank'
        case 'MTN':
            return 'MTN'
        case 'NOWPAYMENTS':
            return 'NowPayments'
        case 'PAYPAL':
            return 'Paypal'
        case 'APPLE':
            return 'Apple'
        case 'GOOGLE':
            return 'Google'
        case 'MOOV':
            return 'Moov'
        case 'AIRTEL':
            return 'Airtel'
        case 'MPESA':
            return 'Mpesa'
        case 'OPAY':
            return 'Opay'
        case 'OTHER':
            return 'Other'
        default:
            return providerCode
    }
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
