import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from "@/components/ui/use-toast"
import ContentSection from '../components/content-section'
import ProfilePictureUploader from '../components/avatar-uploader'
import { supabase } from '@/utils/supabase/client'

interface MerchantDetails {
    merchant_id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    phone_number: string;
    referral_code: string;
    pin_code: string;
}

export default function Profile() {
    const [merchant, setMerchant] = useState<MerchantDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [newPassword, setNewPassword] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')

    useEffect(() => {
        fetchMerchant()
    }, [])

    const fetchMerchant = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user found')

            const { data, error } = await supabase
                .rpc('fetch_merchant_details', { p_user_id: user.id })

            if (error) throw error
            if (data && data.length > 0) {
                setMerchant(data[0] as MerchantDetails)
                setAvatarUrl(data[0].avatar_url)
            } else {
                throw new Error('No merchant found')
            }
        } catch (error) {
            console.error('Error fetching merchant:', error)
            toast({
                title: "Error",
                description: "Failed to fetch merchant details",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleAvatarUpdate = async (newAvatarUrl: string) => {
        setAvatarUrl(newAvatarUrl)
        if (!merchant) return

        try {
            const { error: updateError } = await supabase.rpc('update_merchant_avatar', {
                p_merchant_id: merchant.merchant_id,
                p_avatar_url: newAvatarUrl
            })

            if (updateError) throw updateError

            setMerchant({ ...merchant, avatar_url: newAvatarUrl })
            toast({
                title: "Success",
                description: "Profile picture updated successfully",
            })

            // Refresh the merchant data to ensure we have the latest information
            await fetchMerchant()
        } catch (error) {
            console.error('Error uploading avatar:', error)
            toast({
                title: "Error",
                description: "Failed to upload profile picture",
                variant: "destructive",
            })
        }
    }

    const handlePasswordChange = () => {
        // Implement password change logic here
        console.log('Changing password')
        toast({ title: "Success", description: "Password updated successfully" })
        setNewPassword('')
        setCurrentPassword('')
    }

    const generateReferralCode = async () => {
        if (!merchant) return

        try {
            const { data, error } = await supabase.rpc('generate_referral_code')
            if (error) throw error

            const newReferralCode = data as string

            const { error: updateError } = await supabase.rpc('update_merchant_details', {
                p_merchant_id: merchant.merchant_id,
                p_name: merchant.name,
                p_email: merchant.email,
                p_phone_number: merchant.phone_number,
                p_pin_code: merchant.pin_code,
                p_referral_code: newReferralCode
            })

            if (updateError) throw updateError

            setMerchant({ ...merchant, referral_code: newReferralCode })
            toast({
                title: "Success",
                description: "Referral code generated successfully",
            })
        } catch (error) {
            console.error('Error generating referral code:', error)
            toast({
                title: "Error",
                description: "Failed to generate referral code",
                variant: "destructive",
            })
        }
    }

    if (loading) {
        return <ContentSection title="Profile" desc="Loading..."><div>Loading...</div></ContentSection>
    }

    if (!merchant) {
        return (
            <ContentSection
                title="Profile Not Found"
                desc="We couldn't find your merchant profile."
            >
                <div>
                    No merchant found. Please ensure you&apos;re logged in and have merchant data associated with your account.
                </div>
            </ContentSection>
        )
    }

    return (
        <ContentSection
            title="Profile"
            desc="Update your profile details, adjust your security settings, and find your referral code here."
        >
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <ProfilePictureUploader currentAvatar={avatarUrl} onAvatarUpdate={handleAvatarUpdate} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full name</Label>
                        <Input id="name" value={merchant.name} readOnly className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={merchant.email} readOnly className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <Input id="phone" value={merchant.phone_number} readOnly className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="referral-code">Referral Code</Label>
                        <div className="flex">
                            <Input id="referral-code" value={merchant.referral_code || ''} readOnly className="rounded-r-none bg-muted" />
                            <Button variant="outline" className="rounded-l-none" onClick={generateReferralCode}>
                                Generate
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change password</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current password</Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button onClick={handlePasswordChange}>Change Password</Button>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Additional security</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium">PIN</h4>
                            <p className="text-sm text-muted-foreground">
                                Required for fund transfers
                            </p>
                        </div>
                        <Input
                            id="pin_code"
                            name="pin_code"
                            type="password"
                            value={merchant.pin_code || ''}
                            onChange={(e) => setMerchant({ ...merchant, pin_code: e.target.value })}
                            placeholder="Enter PIN"
                            className="w-24"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium">2-factor Authentication</h4>
                            <p className="text-sm text-muted-foreground">
                                Require a security key in addition to your password
                            </p>
                        </div>
                        <Switch disabled />
                    </div>
                </div>

                <Button onClick={() => {
                    // Implement save changes logic here
                    toast({ title: "Success", description: "Changes saved successfully" })
                }} className="w-full">
                    Save Changes
                </Button>

                <p className="text-sm text-muted-foreground mt-4">
                    Contact help@lomi.africa if you want to update your business details.
                </p>
            </div>
        </ContentSection>
    )
}