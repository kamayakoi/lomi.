import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface ConfirmationPreviewProps {
    logoUrl?: string
    orgName: string
    themeColor: string
}

export function ConfirmationPreview({
    logoUrl,
    orgName,
    themeColor
}: ConfirmationPreviewProps) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-4xl mx-auto p-8">
                {/* Banner Section */}
                <div className="rounded-2xl bg-muted overflow-hidden mb-8 relative border shadow-sm">
                    <motion.div
                        className="w-full h-96 relative"
                        animate={{
                            background: [
                                `radial-gradient(circle at 30% 30%, ${themeColor}50 0%, transparent 70%)`,
                                `radial-gradient(circle at 70% 70%, ${themeColor}50 0%, transparent 70%)`,
                                `radial-gradient(circle at 30% 30%, ${themeColor}50 0%, transparent 70%)`
                            ]
                        }}
                        transition={{
                            duration: 10,
                            ease: "linear",
                            repeat: Infinity
                        }}
                        style={{
                            backgroundBlendMode: 'soft-light'
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/50 to-muted" />
                    </motion.div>

                    <div className="relative -mt-48 flex flex-col items-center pb-12">
                        <Avatar className="h-24 w-24 border-4 border-muted rounded-full bg-muted ring-4 ring-background/10">
                            {logoUrl ? (
                                <AvatarImage src={logoUrl} alt={orgName} />
                            ) : (
                                <AvatarFallback className="text-3xl font-medium">
                                    {orgName && orgName[0]?.toUpperCase()}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <h1 className="text-3xl font-bold mt-6">
                            {orgName}
                        </h1>
                        <p className="text-muted-foreground mt-1">@{orgName.toLowerCase().replace(/\./g, '')}</p>
                    </div>
                </div>

                {/* Confirmation Section */}
                <div className="rounded-2xl bg-muted p-12 border shadow-sm">
                    <div className="max-w-md mx-auto text-center space-y-6">
                        <h2 className="text-2xl font-bold">Your order was successful!</h2>
                        <p className="text-muted-foreground">You&apos;re now eligible for the benefits of Pro Tier.</p>

                        <div className="bg-background rounded-lg p-6 text-left space-y-4">
                            <div className="text-3xl font-bold">$100</div>
                            <div className="text-sm text-muted-foreground">Before VAT and taxes</div>

                            <div>
                                <h3 className="font-medium mb-2">Included</h3>
                                <div className="flex items-center gap-2 text-sm">
                                    <Check className="w-4 h-4" />
                                    Weekly Newsletter
                                </div>
                            </div>
                        </div>

                        <Button className="w-full bg-primary hover:bg-primary/90">
                            Access your benefits
                        </Button>

                        <p className="text-xs text-muted-foreground">
                            This order is processed by our online reseller & Merchant of Record, Polar, who also handles order-related inquiries and returns.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

