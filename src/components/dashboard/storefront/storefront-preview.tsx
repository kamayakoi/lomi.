import { CuboidIcon as CubeIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSidebar } from '@/lib/hooks/useSidebar'

interface StorefrontPreviewProps {
    orgName: string
    description: string
    themeColor: string
}

export function StorefrontPreview({
    orgName,
    description,
    themeColor
}: StorefrontPreviewProps) {
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
                <div className="rounded-2xl bg-muted overflow-hidden mb-8 relative border shadow-sm">
                    {/* Animated gradient background */}
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

                    {/* Centered logo overlapping the banner */}
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
                        {description && (
                            <p className="text-muted-foreground mt-4 max-w-md text-center">{description}</p>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl bg-muted p-12 border shadow-sm">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center mb-6">
                            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                                <CubeIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-muted-foreground">
                            No products and subscriptions found
                        </h3>
                        <p className="text-muted-foreground/70">
                            {orgName} is not offering any products or subscriptions yet
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

