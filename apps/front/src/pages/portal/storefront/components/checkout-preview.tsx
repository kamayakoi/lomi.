import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { motion } from 'framer-motion'
import { useSidebar } from '@/lib/hooks/use-sidebar'

interface CheckoutPreviewProps {
    orgName: string
    themeColor: string
}

export function CheckoutPreview({
    orgName,
    themeColor = '#3B82F6'
}: CheckoutPreviewProps) {
    const { sidebarData } = useSidebar()

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-6xl mx-auto p-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Product Details */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg border-6 border-transparent">
                                {sidebarData.organizationLogo ? (
                                    <img
                                        src={sidebarData.organizationLogo}
                                        alt={orgName}
                                        className="object-contain h-full w-full rounded-lg"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full w-full bg-muted rounded-lg text-xl font-medium">
                                        {orgName && orgName[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <h1 className="text-2xl font-semibold">Pro Tier</h1>
                        </div>

                        <div className="aspect-[2/1] rounded-lg overflow-hidden bg-muted border shadow-sm">
                            <motion.div
                                className="w-full h-full"
                                animate={{
                                    background: [
                                        `radial-gradient(circle at 70% 30%, ${themeColor}50 0%, transparent 50%)`,
                                        `radial-gradient(circle at 30% 70%, ${themeColor}50 0%, transparent 50%)`,
                                        `radial-gradient(circle at 70% 30%, ${themeColor}50 0%, transparent 50%)`
                                    ]
                                }}
                                transition={{
                                    duration: 10,
                                    ease: "linear",
                                    repeat: Infinity
                                }}
                            />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Et Tritonia pectora partus praebentem</h2>
                            <h3 className="text-lg">Clipeo mentiris arquato obliqua lacerta</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Lorem markdownum bifidosque tenus quod gutture parte genialiter Manto, et potuit: medio mea rogando Hector: bene? Bracchia pectus Acrisioneas adsumus? O Aeaeae flammae, est ait fleverunt llli lamdudum; captatur e. Caede et lues praecipites corrige gessit montis, aspera miserum si facit. Cum milia docta amens nec solito manifesta fitque incognita haec enim, sed resupinus enim.
                            </p>
                            <h3 className="text-lg pt-4">Nox flebilis torva</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Repetito cum furtum altera Mare prius gelidumque perde Gravem colentes impetus reminiscitur invitusque blanditur ipse Iam maiora In quoque extulerat tale semper quidque. Fovebat.
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Checkout Form */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-2">Email</label>
                                <Input
                                    type="email"
                                    value="janedoe@gmail.com"
                                    className="bg-muted border-primary"
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-2">Cardholder name</label>
                                <Input
                                    type="text"
                                    value="Jane Doe"
                                    className="bg-muted border-border"
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-2">Billing address</label>
                                <Select defaultValue="country">
                                    <SelectTrigger className="bg-muted border-border">
                                        <SelectValue placeholder="Country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="country">Country</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex justify-end mt-2">
                                    <Button variant="link" className="text-primary text-sm p-0">
                                        Add Tax ID
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-2">
                                    Discount Code
                                    <span className="float-right text-muted-foreground text-xs">Optional</span>
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        className="bg-muted border-border"
                                        placeholder="Enter code"
                                    />
                                    <Button variant="outline" className="text-muted-foreground">
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>$100</span>
                            </div>
                            <div className="flex justify-between font-medium">
                                <span>Total</span>
                                <span>$100</span>
                            </div>
                        </div>

                        <Button className="w-full bg-primary hover:bg-primary/90">
                            Pay
                        </Button>

                        <p className="text-center text-xs text-muted-foreground">
                            This order is processed by our online reseller & Merchant of Record, Polar, who also handles order-related inquiries and returns.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}