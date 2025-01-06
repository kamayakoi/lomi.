import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { CircleDot } from 'lucide-react'
import { useSidebar } from '@/lib/hooks/useSidebar'

interface PortalPreviewProps {
    orgName: string
    themeColor: string
}

export function PortalPreview({
    orgName,
    themeColor
}: PortalPreviewProps) {
    const { sidebarData } = useSidebar()

    const getSlug = (name: string | null) => {
        if (!name) return '';
        const lowercaseName = name.toLowerCase();
        const withoutPronouns = lowercaseName.replace(/^(the|le|la)\s+/, '');
        return withoutPronouns.replace(/[^a-z0-9]/g, '');
    }

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
                        <div className="h-24 w-24 rounded-lg border-6 border-transparent">
                            {sidebarData.organizationLogo ? (
                                <img
                                    src={sidebarData.organizationLogo}
                                    alt={orgName}
                                    className="object-contain h-full w-full rounded-lg"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full bg-muted rounded-lg text-3xl font-medium">
                                    {orgName && orgName[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold mt-6">
                            {orgName}
                        </h1>
                        <p className="text-muted-foreground mt-1">@{getSlug(sidebarData.organizationName)}</p>
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
                                { label: 'Start Date', value: 'November 24, 2025' },
                                { label: 'Renewal Date', value: 'December 24, 2025' },
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
                                        <td className="p-4">November 24, 2025</td>
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

