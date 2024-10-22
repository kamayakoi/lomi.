import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { PaymentLink } from './types'
import { ArrowDownToLine, LifeBuoy } from 'lucide-react'

type PaymentLinkActionsProps = {
    paymentLink: PaymentLink | null
    isOpen: boolean
    onClose: () => void
}

export default function PaymentLinkActions({ paymentLink, isOpen, onClose }: PaymentLinkActionsProps) {
    if (!paymentLink) return null

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
                                        ) : paymentLink.link_type === 'plan' && paymentLink.plan_price ? (
                                            `${paymentLink.plan_price} ${paymentLink.currency_code}`
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
                                    <div>{paymentLink.allowed_providers.join(', ') || '-'}</div>
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
                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                        <Button variant="outline" className="w-full sm:w-auto">
                            <ArrowDownToLine className="mr-2 h-4 w-4" />
                            Download Details
                        </Button>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <LifeBuoy className="mr-2 h-4 w-4" />
                            Contact Support
                        </Button>
                    </CardFooter>
                </Card>
            </SheetContent>
        </Sheet>
    )
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
