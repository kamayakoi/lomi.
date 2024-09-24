import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from "@/components/ui/use-toast"
import ContentSection from '../components/content-section'
import ProfilePictureUploader from '../components/profile-picture-uploader'
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
            console.log('User:', user)
            if (!user) throw new Error('No user found')

            const { data, error } = await supabase
                .rpc('fetch_merchant_details', { p_merchant_id: user.id })

            console.log('Merchant data:', data)
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (merchant) {
            setMerchant(prev => ({ ...prev, [name]: value } as MerchantDetails))
        }
    }

    const handleSave = async () => {
        if (!merchant) return

        try {
            const { error } = await supabase.rpc('update_merchant_details', {
                p_merchant_id: merchant.merchant_id,
                p_name: merchant.name,
                p_email: merchant.email,
                p_phone_number: merchant.phone_number,
                p_pin_code: merchant.pin_code,
                p_referral_code: merchant.referral_code
            })

            if (error) throw error

            toast({ title: "Success", description: "Profile updated successfully" })
        } catch (error) {
            console.error('Error saving profile:', error)
            toast({
                title: "Error",
                description: "Failed to save profile",
                variant: "destructive",
            })
        }
    }

    const handlePasswordChange = () => {
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
        return <div>Loading...</div>
    }

    if (!merchant) {
        return <div>No merchant found. Please ensure you&apos;re logged in and have merchant data associated with your account.</div>
    }

    return (
        <ContentSection
            title="Profile"
            desc="Update your profile details, adjust your security settings, and find your referral code here."
        >
            <div className="space-y-8">
                <ProfilePictureUploader currentAvatar={avatarUrl} onAvatarUpdate={handleAvatarUpdate} />

                <div>
                    <h3 className="text-lg font-medium mb-4">Your personal information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={merchant.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                value={merchant.email || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-4">Referral Code</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                        This is your referral code that you may share with your friends.
                    </p>
                    <div className="flex">
                        <Input id="referral-code" value={merchant.referral_code || ''} readOnly className="rounded-r-none bg-muted" />
                        <Button variant="outline" className="rounded-l-none" onClick={generateReferralCode}>
                            Generate
                        </Button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-4">Mobile settings</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                        Register your phone number to add greater security to your account.
                    </p>
                    <div className="flex items-center space-x-4">
                        <Input
                            id="phone_number"
                            name="phone_number"
                            value={merchant.phone_number || ''}
                            onChange={handleInputChange}
                            placeholder="Enter phone number"
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-4">Change password</h3>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="current">Current password</Label>
                            <Input
                                id="current"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new">New password</Label>
                            <Input
                                id="new"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <Button onClick={handlePasswordChange}>Change Password</Button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-4">Additional security</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium">PIN</h4>
                                <p className="text-sm text-muted-foreground">
                                    Required to allow fund transfers like withdrawal, batch disbursements, or cards refund.
                                </p>
                            </div>
                            <Input
                                id="pin_code"
                                name="pin_code"
                                type="password"
                                value={merchant.pin_code || ''}
                                onChange={handleInputChange}
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
                </div>

                <Button onClick={handleSave} className="w-full">Save Changes</Button>
            </div>
        </ContentSection>
    )
}