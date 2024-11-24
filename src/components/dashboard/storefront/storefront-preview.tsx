import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CubeIcon } from '@heroicons/react/24/outline'

interface StorefrontPreviewProps {
    logoUrl?: string
    orgName: string
    description: string
    themeColor: string
}

export function StorefrontPreview({
    logoUrl,
    orgName,
    description,
    themeColor
}: StorefrontPreviewProps) {
    return (
        <div className="min-h-screen bg-background overflow-y-auto">
            {/* Preview Content */}
            <div className="max-w-4xl mx-auto p-8">
                <div className="rounded-2xl bg-muted overflow-hidden mb-8">
                    {/* Banner with gradient */}
                    <div
                        className="w-full h-48 relative"
                        style={{
                            background: `radial-gradient(circle at center, ${themeColor}30, ${themeColor}15, transparent 70%)`,
                        }}
                    >
                    </div>

                    {/* Centered logo overlapping the banner */}
                    <div className="relative -mt-12 flex flex-col items-center">
                        <Avatar className="w-24 h-24 border-4 border-background rounded-full bg-background">
                            {logoUrl ? (
                                <AvatarImage src={logoUrl} alt={orgName} />
                            ) : (
                                <AvatarFallback className="text-2xl font-medium">
                                    {orgName && orgName[0]?.toUpperCase()}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <h1 className="text-2xl font-bold text-foreground mt-4">
                            {orgName}
                        </h1>
                        {description && (
                            <p className="text-muted-foreground mb-4">{description}</p>
                        )}
                        <p className="text-muted-foreground mb-4">@{orgName.toLowerCase().replace(/\./g, '')}</p>
                    </div>
                </div>

                <div className="rounded-2xl bg-muted p-8">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center mb-6">
                            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                                <CubeIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                            No products and subscriptions found
                        </h3>
                        <p className="text-muted-foreground">
                            {orgName} is not offering any products or subscriptions yet
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

