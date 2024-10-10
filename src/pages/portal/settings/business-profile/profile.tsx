import React, { useState, useEffect, Suspense } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from "@/components/ui/use-toast"
import ContentSection from '../../../../components/dashboard/content-section'
import { supabase } from '@/utils/supabase/client'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

const ProfilePictureUploader = React.lazy(() => import('../../../../components/auth/avatar-uploader'))

interface MerchantDetails {
    merchant_id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    phone_number: string;
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
        if (typeof window === 'undefined') return

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const { data, error } = await supabase
                .rpc('fetch_merchant_details', { p_user_id: user.id });

            if (error) {
                console.error('Supabase function error:', error);
                throw error;
            }

            if (data && data.length > 0) {
                setMerchant(data[0] as MerchantDetails);

                // Download the merchant avatar
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
                console.error('No merchant data found');
                throw new Error('No merchant found.');
            }
        } catch (error) {
            console.error('Error fetching merchant:', error);
            toast({
                title: "Error",
                description: "Failed to fetch merchant details",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    async function handleAvatarUpdate(newAvatarUrl: string) {
        setAvatarUrl(newAvatarUrl);
        if (!merchant) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            // Extract the relative path from the full URL
            const relativeAvatarPath = newAvatarUrl.replace(/^.*\/avatars\//, '');

            const { error: updateError } = await supabase.rpc('update_merchant_avatar', {
                p_merchant_id: user.id,
                p_avatar_url: relativeAvatarPath
            });

            if (updateError) throw updateError;

            // Update the local state with the new avatar URL
            setMerchant({ ...merchant, avatar_url: relativeAvatarPath });
            toast({
                title: "Success",
                description: "Profile picture updated successfully",
            });

            // Refresh the merchant data to ensure we have the latest information
            await fetchMerchant();
        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast({
                title: "Error",
                description: "Failed to upload profile picture",
                variant: "destructive",
            });
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

    const handlePinChange = async () => {
        if (!merchant || !newPin || newPin.length !== 4) {
            toast({
                title: "Error",
                description: "Please enter a valid 4-digit PIN",
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

    if (typeof window === 'undefined' || loading) {
        return (
            <ContentSection
                title="Profile"
                desc="Update your profile details and adjust your security settings."
            >
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-[100px] w-[100px] rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[150px]" />
                            <Skeleton className="h-4 w-[100px]" />
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-[200px]" />
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[150px]" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[150px]" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-[200px]" />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-4 w-[150px]" />
                                </div>
                                <Skeleton className="h-10 w-[100px]" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                                <Skeleton className="h-6 w-[40px] rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
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
            desc="Update your profile details and adjust your security settings."
        >
            <div>
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Suspense fallback={<div>Loading avatar uploader...</div>}>
                            <ProfilePictureUploader
                                currentAvatar={avatarUrl}
                                onAvatarUpdate={handleAvatarUpdate}
                                name={merchant?.name || ''}
                            />
                        </Suspense>
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
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Change password</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current password</Label>
                                <div className="relative">
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="pr-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New password</Label>
                                <div className="relative flex items-center">
                                    <Input
                                        id="new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="pr-24 transition-all duration-200 focus:ring-2 focus:ring-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 mr-16"
                                    >
                                        {showNewPassword ? (
                                            <EyeOffIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                    <Button
                                        size="sm"
                                        onClick={handlePasswordChange}
                                        className="absolute right-0 h-full px-4 rounded-l-none bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
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

                    <p className="text-sm text-muted-foreground mt-4">
                        Contact <a href="mailto:hello@lomi.africa?subject=[Support] — Updating Profile information" className="underline">hello@lomi.africa</a> if you want to update your profile details.
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