import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { CircleDot } from 'lucide-react'

interface PortalPreviewProps {
    logoUrl?: string
    orgName: string
    themeColor: string
}

export function PortalPreview({
    logoUrl,
    orgName,
    themeColor
}: PortalPreviewProps) {
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

                {/* Portal Content */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-semibold">Customer Portal</h2>

                    {/* Subscription Details */}
                    <div className="rounded-2xl bg-muted border shadow-sm p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold">Pro Tier</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Avatar className="h-5 w-5">
                                        <AvatarFallback>M</AvatarFallback>
                                    </Avatar>
                                    My Organization
                                </div>
                            </div>
                            <Button className="bg-primary hover:bg-primary/90">
                                Manage Subscription
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Amount', value: '$100/mo' },
                                {
                                    label: 'Status',
                                    value: (
                                        <div className="flex items-center gap-2">
                                            <CircleDot className="w-3 h-3 text-green-500 fill-green-500" />
                                            Active
                                        </div>
                                    )
                                },
                                { label: 'Start Date', value: 'November 24, 2024' },
                                { label: 'Renewal Date', value: 'December 24, 2024' },
                                {
                                    label: 'Benefits',
                                    value: (
                                        <Button variant="outline" size="sm" className="h-8">
                                            View Benefits
                                        </Button>
                                    )
                                }
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between items-center py-4 border-b border-border last:border-0">
                                    <span className="text-muted-foreground">{label}</span>
                                    <span className="font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Order History</h3>
                        <div className="rounded-2xl bg-muted border shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left p-4 text-muted-foreground font-medium">Purchase Date</th>
                                        <th className="text-left p-4 text-muted-foreground font-medium">Product</th>
                                        <th className="text-left p-4 text-muted-foreground font-medium">Amount</th>
                                        <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-4">November 24, 2024</td>
                                        <td className="p-4">Pro Tier</td>
                                        <td className="p-4">$100</td>
                                        <td className="p-4 text-right">
                                            <Button variant="link" className="text-primary h-auto p-0">
                                                View Order
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

