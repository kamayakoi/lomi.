import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from "@/components/ui/use-toast"
import ContentSection from '../components/content-section'
import ProfilePictureUploader from '../../../auth/components/avatar-uploader'
import { supabase } from '@/utils/supabase/client'
import { countryCodes } from '@/data/onboarding'

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
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showPinModal, setShowPinModal] = useState(false)
    const [newPin, setNewPin] = useState('')

    useEffect(() => {
        fetchMerchant()
    }, [])

    const fetchMerchant = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const { data, error } = await supabase
                .rpc('fetch_merchant_details', { p_user_id: user.id });

            if (error) throw error;
            if (data && data.length > 0) {
                setMerchant(data[0] as MerchantDetails);

                // Download the merchant avatar
                if (data[0].avatar_url) {
                    const { data: avatarData, error: avatarError } = await supabase
                        .storage
                        .from('avatars')
                        .download(data[0].avatar_url);

                    if (avatarError) {
                        console.error('Error downloading avatar:', avatarError);
                    } else {
                        const avatarUrl = URL.createObjectURL(avatarData);
                        setAvatarUrl(avatarUrl);
                    }
                } else {
                    setAvatarUrl(null);
                }
            } else {
                throw new Error('No merchant found');
            }
        } catch (error) {
            console.error('Error fetching merchant:', error);
            toast({
                title: "Error",
                description: "Failed to fetch merchant details",
                variant: "destructive",
            });
            setAvatarUrl(null); // Set fallback avatar URL or placeholder
        } finally {
            setLoading(false);
        }
    };

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

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword) {
            toast({
                title: "Error",
                description: "Please fill in both current and new password fields",
                variant: "destructive",
            })
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
                // currentPassword is not a valid property, so we need to handle this differently
            })

            if (error) throw error

            toast({
                title: "Success",
                description: "Password updated successfully",
            })
            setNewPassword('')
            setCurrentPassword('')
        } catch (error) {
            console.error('Error changing password:', error)
            toast({
                title: "Error",
                description: "Failed to change password",
                variant: "destructive",
            })
        }
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

    const handlePinChange = async () => {
        if (!merchant || !newPin || newPin.length !== 6) {
            toast({
                title: "Error",
                description: "Please enter a valid 6-digit PIN",
                variant: "destructive",
            })
            return
        }

        try {
            const updatedMerchant: MerchantDetails = {
                ...merchant,
                pin_code: newPin
            }

            const { error } = await supabase.rpc('update_merchant_details', {
                p_merchant_id: updatedMerchant.merchant_id,
                p_name: updatedMerchant.name,
                p_email: updatedMerchant.email,
                p_phone_number: updatedMerchant.phone_number,
                p_pin_code: updatedMerchant.pin_code,
                p_referral_code: updatedMerchant.referral_code
            })

            if (error) throw error

            setMerchant(updatedMerchant)
            toast({
                title: "Success",
                description: "PIN updated successfully",
            })
            setShowPinModal(false)
            setNewPin('')
        } catch (error) {
            console.error('Error updating PIN:', error)
            toast({
                title: "Error",
                description: "Failed to update PIN",
                variant: "destructive",
            })
        }
    }

    const handleFieldChange = (field: keyof MerchantDetails, value: string) => {
        if (merchant) {
            setMerchant({ ...merchant, [field]: value })
        }
    }

    const handleSaveChanges = async () => {
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

            toast({
                title: "Success",
                description: "Changes saved successfully",
            })
        } catch (error) {
            console.error('Error saving changes:', error)
            toast({
                title: "Error",
                description: "Failed to save changes",
                variant: "destructive",
            })
        }
    }

    if (loading) {
        return (
            <ContentSection title="Profile" desc="Loading...">
                <div>Loading...</div>
            </ContentSection>
        )
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
            <div>
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <ProfilePictureUploader
                            currentAvatar={avatarUrl}
                            onAvatarUpdate={handleAvatarUpdate}
                            name={merchant?.name || ''}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full name</Label>
                            <div className="flex">
                                <Input id="name" value={merchant.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
                                <Button variant="outline" onClick={handleSaveChanges}>Save</Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="flex">
                                <Input id="email" value={merchant.email} onChange={(e) => handleFieldChange('email', e.target.value)} />
                                <Button variant="outline" onClick={handleSaveChanges}>Save</Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone number</Label>
                            <div className="flex">
                                <select className="bg-muted" onChange={(e) => handleFieldChange('phone_number', e.target.value)}>
                                    {countryCodes.map((code, index) => (
                                        <option key={index} value={code}>{code}</option>
                                    ))}
                                </select>
                                <Input id="phone" value={merchant.phone_number} onChange={(e) => handleFieldChange('phone_number', e.target.value)} />
                                <Button variant="outline" onClick={handleSaveChanges}>Save</Button>
                            </div>
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
                                <div className="flex">
                                    <Input
                                        id="new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <Button variant="outline" onClick={() => setShowNewPassword(!showNewPassword)}>
                                        {showNewPassword ? "Hide" : "Show"}
                                    </Button>
                                </div>
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
                            <Button variant="outline" onClick={() => setShowPinModal(true)}>Set your PIN</Button>
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

                    <Button onClick={handleSaveChanges} className="w-full">
                        Save Changes
                    </Button>

                    <p className="text-sm text-muted-foreground mt-4">
                        Contact hello@lomi.africa if you want to update your business details.
                    </p>
                </div>

                {showPinModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-lg font-medium mb-4">Set your PIN</h3>
                            <div className="flex space-x-2">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <Input
                                        key={index}
                                        type="password"
                                        maxLength={1}
                                        value={newPin[index] || ''}
                                        onChange={(e) => {
                                            const newPinArray = newPin.split('')
                                            newPinArray[index] = e.target.value
                                            setNewPin(newPinArray.join(''))
                                        }}
                                        className="w-12 text-center"
                                    />
                                ))}
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setShowPinModal(false)}>Cancel</Button>
                                <Button onClick={handlePinChange}>Save</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ContentSection>
    )
}