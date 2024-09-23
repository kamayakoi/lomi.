import { useState, useEffect } from 'react'
import ContentSection from '../components/content-section'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CopyIcon } from '@radix-ui/react-icons'
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/components/ui/use-toast'
import LogoUploader from '../components/LogoUploader'

interface OrganizationDetails {
    organization_id: string;
    name: string;
    email: string;
    logo_url: string | null;
    website_url: string | null;
    country: string;
    address: string;
    city: string;
    postal_code: string;
}

export default function Business() {
    const [organization, setOrganization] = useState<OrganizationDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [logoUrl, setLogoUrl] = useState<string | null>(null)

    useEffect(() => {
        fetchOrganization()
    }, [])

    const fetchOrganization = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user found')

            const { data, error } = await supabase
                .rpc('fetch_organization_details', { p_merchant_id: user.id })

            if (error) throw error
            if (data && data.length > 0) {
                setOrganization(data[0] as OrganizationDetails)
                setLogoUrl(data[0].logo_url)
            }
        } catch (error) {
            console.error('Error fetching organization:', error)
            toast({
                title: "Error",
                description: "Failed to fetch organization details",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleLogoUpdate = async (newLogoUrl: string) => {
        setLogoUrl(newLogoUrl)
        if (!organization) return

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user found')

            const { error: updateError } = await supabase.rpc('update_organization_logo', {
                p_organization_id: organization.organization_id,
                p_logo_url: newLogoUrl
            })

            if (updateError) throw updateError

            setOrganization({ ...organization, logo_url: newLogoUrl })
            toast({
                title: "Success",
                description: "Logo updated successfully",
            })

            // Refresh the organization data to ensure we have the latest information
            await fetchOrganization()
        } catch (error) {
            console.error('Error uploading logo:', error)
            toast({
                title: "Error",
                description: "Failed to upload logo",
                variant: "destructive",
            })
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!organization) {
        return <div>No organization found</div>
    }

    return (
        <ContentSection
            title="Your Business"
            desc="Upload your business logo and view your public contact information"
        >
            <>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-medium">Business information</h2>
                        <p className="text-sm text-muted-foreground">
                            This information helps customers recognize your business, and may appear in your payment statements, invoices, and receipts.
                        </p>
                    </div>

                    <LogoUploader currentLogo={logoUrl} onLogoUpdate={handleLogoUpdate} />

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Business name</Label>
                            <Input id="name" value={organization.name} readOnly className="bg-muted" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Business email</Label>
                            <Input id="email" type="email" value={organization.email || ''} readOnly className="bg-muted" />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="business-id">Business ID</Label>
                            <div className="flex">
                                <Input id="business-id" value={organization.organization_id} readOnly className="rounded-r-none bg-muted" />
                                <Button variant="outline" className="rounded-l-none" onClick={() => navigator.clipboard.writeText(organization.organization_id)}>
                                    <CopyIcon className="h-4 w-4" />
                                    Copy
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="website">Business website URL</Label>
                            <Input id="website" value={organization.website_url || ''} readOnly className="bg-muted" />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="country">Country of operation</Label>
                            <Input id="country" value={organization.country || ''} readOnly className="bg-muted" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Business address</Label>
                            <Input id="address" value={`${organization.address || ''}, ${organization.city || ''}, ${organization.postal_code || ''}`} readOnly className="bg-muted" />
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Contact help@lomi.africa if you want to update your business details.
                    </p>
                </div>
            </>
        </ContentSection>
    )
}