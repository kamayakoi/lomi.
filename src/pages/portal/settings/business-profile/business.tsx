import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase/client'
import ContentSection from '../components/content-section'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Business() {
    const [organization, setOrganization] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrganization() {
            const { data: { session } } = await supabase.auth.getSession()

            if (session) {
                const { data: merchant } = await supabase
                    .from('merchants')
                    .select('*')
                    .eq('merchant_id', session.user.id)
                    .single()

                const { data: organization } = await supabase
                    .from('organizations')
                    .select(`
                        *,
                        merchant_organization_links (
                            role
                        )
                    `)
                    .eq('merchant_organization_links.merchant_id', merchant.merchant_id)
                    .single()

                setOrganization(organization)
                setLoading(false)
            }
        }

        fetchOrganization()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <ContentSection
            title="Your Business"
            desc="Upload your logo and other public contact information"
        >
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium">Add New Business Account</h3>
                    <p className="text-sm text-muted-foreground">
                        Need Xendit in other businesses and countries? Add them all to easily manage your business accounts.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-medium">Business information</h3>
                    <p className="text-sm text-muted-foreground">
                        This information helps customers recognize your business, and may appear in your payment statements, invoices, and receipts.
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src={organization.logo_url} alt="Business logo" />
                        <AvatarFallback>WT</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-muted-foreground">
                        Must be at least 200px by 200px and smaller than 1MB
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Business name</Label>
                        <Input id="name" value={organization.name} readOnly />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Business email</Label>
                        <Input id="email" type="email" value={organization.email} readOnly />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="id">Business ID</Label>
                        <Input id="id" value={organization.organization_id} readOnly />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="country">Country of operation</Label>
                        <Input id="country" value={organization.country} readOnly />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="address">Business address</Label>
                    <Input id="address" value={organization.address} readOnly />
                    <p className="text-sm text-muted-foreground">
                        Contact help@xendit.vn if you want to update your business details.
                    </p>
                </div>
            </div>
        </ContentSection>
    )
}