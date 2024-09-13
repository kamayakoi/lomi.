import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase/client'
import ContentSection from '../components/content-section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'

export default function Profile() {
    const [merchant, setMerchant] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchMerchant() {
            const { data: { session } } = await supabase.auth.getSession()

            if (session) {
                const { data: merchant } = await supabase
                    .from('merchants')
                    .select('*')
                    .eq('merchant_id', session.user.id)
                    .single()

                setMerchant(merchant)
                setLoading(false)
            }
        }

        fetchMerchant()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <ContentSection
            title="Your Profile"
            desc="Update your profile details, adjust your security settings, and find your referral code"
        >
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Personal information</h3>
                    <p className="text-sm text-muted-foreground">
                        This information helps with identification so that others on your team are able to recognize you easily.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full name</Label>
                        <Input id="name" value={merchant.name} readOnly />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={merchant.email} readOnly />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium">Referral Code</h3>
                    <p className="text-sm text-muted-foreground">
                        This is your referral code that you may share with your friends.
                    </p>
                    <Input value={merchant.referral_code} readOnly className="max-w-sm" />
                </div>

                <div>
                    <h3 className="text-lg font-medium">Mobile settings</h3>
                    <p className="text-sm text-muted-foreground">
                        Register your phone number to add greater security to your account.
                    </p>
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src="/flag.png" alt="Country flag" />
                        </Avatar>
                        <Input value={merchant.phone_number} readOnly className="max-w-sm" />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium">Change password</h3>
                    <div className="grid gap-2">
                        <Label htmlFor="current">Current password</Label>
                        <Input id="current" type="password" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new">New password</Label>
                        <Input id="new" type="password" />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium">Additional security</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium">PIN</h4>
                            <p className="text-sm text-muted-foreground">
                                Required to allow fund transfers like withdrawal, batch disbursements, or cards refund.
                            </p>
                        </div>
                        <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium">2-factor Authentication</h4>
                            <p className="text-sm text-muted-foreground">
                                Require a security key in addition to your password
                            </p>
                        </div>
                        <Switch />
                    </div>
                </div>
            </div>
        </ContentSection>
    )
}