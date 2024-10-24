import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { PaymentLink, provider_code } from './types'
import { LifeBuoy } from 'lucide-react'

const providerColors: Record<provider_code, string> = {
    'ORANGE': 'bg-[#FC6307] text-white dark:bg-[#FC6307] dark:text-white',
    'WAVE': 'bg-[#71CDF4] text-blue-700 dark:bg-[#71CDF4] dark:text-white',
    'ECOBANK': 'bg-[#074367] text-white dark:bg-[#074367] dark:text-white',
    'MTN': 'bg-[#F7CE46] text-black dark:bg-[#F7CE46] dark:text-black',
    'STRIPE': 'bg-[#625BF6] text-white dark:bg-[#625BF6] dark:text-white',
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
            <SheetContent className="sm:max-w-2xl overflow-y-auto">
                <Card className="border-0 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Payment Link Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Payment Link Information</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="font-medium">ID:</div>
                                    <div>{paymentLink.link_id}</div>
                                    <div className="font-medium">Title:</div>
                                    <div>{paymentLink.title}</div>
                                    <div className="font-medium">Public Description:</div>
                                    <div>{paymentLink.public_description}</div>
                                    <div className="font-medium">Private Description:</div>
                                    <div>{paymentLink.private_description}</div>
                                    <div className="font-medium">Price:</div>
                                    <div>
                                        {paymentLink.link_type === 'instant' && paymentLink.price ? (
                                            `${paymentLink.price} ${paymentLink.currency_code}`
                                        ) : paymentLink.link_type === 'product' && paymentLink.product_price ? (
                                            `${paymentLink.product_price} ${paymentLink.currency_code}`
                                        ) : paymentLink.link_type === 'plan' && paymentLink.plan_amount ? (
                                            `${paymentLink.plan_amount} ${paymentLink.currency_code}`
                                        ) : (
                                            '-'
                                        )}
                                    </div>
                                    <div className="font-medium">Status:</div>
                                    <div>{paymentLink.is_active ? 'Active' : 'Inactive'}</div>
                                    <div className="font-medium">Expiration Date:</div>
                                    <div>{paymentLink.expires_at ? formatDate(paymentLink.expires_at) : '-'}</div>
                                    <div className="font-medium">Success URL:</div>
                                    <div>{paymentLink.success_url || '-'}</div>
                                    <div className="font-medium">Allowed Providers:</div>
                                    <div>
                                        {paymentLink.allowed_providers.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {paymentLink.allowed_providers.map((provider) => (
                                                    <span
                                                        key={provider}
                                                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${providerColors[provider]}`}
                                                    >
                                                        {formatProviderCode(provider)}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </div>
                                    {paymentLink.link_type === 'product' && (
                                        <>
                                            <div className="font-medium">Associated Product:</div>
                                            <div>{paymentLink.product_name || '-'}</div>
                                        </>
                                    )}
                                    {paymentLink.link_type === 'plan' && (
                                        <>
                                            <div className="font-medium">Associated Plan:</div>
                                            <div>{paymentLink.plan_name || '-'}</div>
                                        </>
                                    )}
                                </div>
                            </section>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button variant="outline" onClick={handleContactSupport}>
                            <LifeBuoy className="mr-2 h-4 w-4" />
                            Contact Support
                        </Button>
                    </CardFooter>
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
        case 'STRIPE':
            return 'Stripe'
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
