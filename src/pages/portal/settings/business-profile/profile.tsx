import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from "@/components/ui/use-toast"
import ContentSection from '@/components/dashboard/content-section'
import { supabase } from '@/utils/supabase/client'
import { EyeIcon, EyeOffIcon, KeyRound, AlertCircle } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import ProfilePictureUploader from '@/components/auth/avatar-uploader'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"

interface MerchantDetails {
    merchant_id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    phone_number: string;
    pin_code: string;
    preferred_language: string;
}

export default function Profile() {
    const [merchant, setMerchant] = useState<MerchantDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [newPassword, setNewPassword] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showPinModal, setShowPinModal] = useState(false)
    const [newPin, setNewPin] = useState(['', '', '', ''])
    const [hasPIN, setHasPIN] = useState(false)
    const [currentPinInput, setCurrentPinInput] = useState(['', '', '', ''])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const [currentPinError, setCurrentPinError] = useState('')

    useEffect(() => {
        fetchMerchant()
    }, [])

    useEffect(() => {
        if (showPinModal) {
            inputRefs.current[0]?.focus()
        }
    }, [showPinModal])

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
                setHasPIN(data[0].pin_code !== null && data[0].pin_code !== ''); // Set hasPIN based on pin_code value

                // Check if avatar_url is not null before attempting to download
                if (data[0].avatar_url) {
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

    const handlePinChange = (index: number, value: string) => {
        const newPinArray = [...newPin]
        const filteredValue = value.replace(/\D/g, '') || ''

        for (let i = 0; i < filteredValue.length; i++) {
            if (index + i < 4) {
                newPinArray[index + i] = filteredValue[i] as string
            }
        }

        setNewPin(newPinArray)

        const nextIndex = newPinArray.findIndex((digit: string) => digit === '')
        const focusIndex = nextIndex === -1 ? 3 : nextIndex
        inputRefs.current[focusIndex + (hasPIN ? 4 : 0)]?.focus() // Adjust focus based on hasPIN
    }

    const handleCurrentPinChange = (index: number, value: string) => {
        const newPinArray = [...currentPinInput]
        const filteredValue = value.replace(/\D/g, '') || ''

        for (let i = 0; i < filteredValue.length; i++) {
            if (index + i < 4) {
                newPinArray[index + i] = filteredValue[i] as string
            }
        }

        setCurrentPinInput(newPinArray)
        setCurrentPinError('') // Clear the error message when the current PIN is changed

        const nextIndex = newPinArray.findIndex((digit: string) => digit === '')
        const focusIndex = nextIndex === -1 ? 3 : nextIndex
        inputRefs.current[focusIndex]?.focus()

        // Automatically transition to the new PIN input after entering the 4-digit current PIN
        if (newPinArray.every((digit: string) => digit !== '')) {
            inputRefs.current[4]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            const newPinArray = [...newPin];
            let currentIndex = index;

            while (currentIndex >= 0) {
                newPinArray[currentIndex] = '';
                currentIndex--;
            }

            setNewPin(newPinArray);

            if (newPinArray.every((digit: string) => digit === '')) {
                inputRefs.current[0 + (hasPIN ? 4 : 0)]?.focus();
            } else {
                const prevIndex = newPinArray.slice(0, index).lastIndexOf('');
                if (prevIndex !== -1) {
                    inputRefs.current[prevIndex + (hasPIN ? 4 : 0)]?.focus();
                }
            }
        } else if (e.key === 'Enter' && newPin.every((digit: string) => digit !== '')) {
            handleSavePIN();
        }
    };

    const handleCurrentPinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            const newPinArray = [...currentPinInput];
            let currentIndex = index;

            while (currentIndex >= 0) {
                newPinArray[currentIndex] = '';
                currentIndex--;
            }

            setCurrentPinInput(newPinArray);

            if (newPinArray.every((digit: string) => digit === '')) {
                inputRefs.current[0]?.focus();
            } else {
                const prevIndex = newPinArray.slice(0, index).lastIndexOf('');
                if (prevIndex !== -1) {
                    inputRefs.current[prevIndex]?.focus();
                }
            }
        } else if (e.key === 'Enter' && currentPinInput.every((digit: string) => digit !== '')) {
            handleSavePIN();
        }
    };

    const handleSavePIN = async () => {
        if (newPin.every((digit: string) => digit !== '')) {
            try {
                if (!merchant) {
                    throw new Error('Merchant details not found');
                }

                if (hasPIN && currentPinInput.join('') !== merchant.pin_code) {
                    setCurrentPinError('Current PIN is incorrect')
                    return
                }

                const updatedMerchant: MerchantDetails = {
                    ...merchant,
                    pin_code: newPin.join('')
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
                setHasPIN(true)
                toast({
                    title: "Success",
                    description: "PIN updated successfully",
                })
                setShowPinModal(false)
                setNewPin(['', '', '', ''])
                setCurrentPinInput(['', '', '', ''])
            } catch (error) {
                console.error('Error updating PIN:', error)
                toast({
                    title: "Error",
                    description: error instanceof Error ? error.message : "Failed to update PIN",
                    variant: "destructive",
                })
            }
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
        <div style={{
            overflowY: 'auto',
            maxHeight: '100vh',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
        }}>
            <style>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <ContentSection
                title="Profile"
                desc="Update your profile details and adjust your security settings."
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
                                <Label htmlFor="language">Language</Label>
                                <Input id="language" value={merchant.preferred_language} readOnly className="bg-muted" />
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
                                        Required for payouts.
                                    </p>
                                </div>
                                <Button variant="outline" onClick={() => setShowPinModal(true)}>
                                    {hasPIN ? 'Update your PIN' : 'Set your PIN'}
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium">2-factor Authentication</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Require a security key in addition to your password.
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
                        <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
                            <DialogContent className="sm:max-w-[350px]">
                                <DialogHeader>
                                    <DialogTitle className="text-center flex items-center justify-center gap-2">
                                        <KeyRound className="w-4 h-4" />
                                        {hasPIN ? 'Change your PIN' : 'Set your PIN'}
                                    </DialogTitle>
                                    {hasPIN && (
                                        <DialogDescription className="text-center mt-2">
                                            Enter your current PIN to change it
                                        </DialogDescription>
                                    )}
                                </DialogHeader>
                                {hasPIN && (
                                    <div className="flex flex-col items-center gap-3 my-4">
                                        <div className="flex justify-center gap-2">
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <input
                                                    key={index}
                                                    ref={el => inputRefs.current[index] = el}
                                                    type={currentPinInput.join('').length === 4 ? 'password' : 'text'}
                                                    inputMode="numeric"
                                                    pattern="\d*"
                                                    maxLength={1}
                                                    value={currentPinInput[index] || ''}
                                                    onChange={(e) => handleCurrentPinChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleCurrentPinKeyDown(index, e)}
                                                    className="w-12 h-12 text-center text-xl bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    aria-label={`Current PIN digit ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                        {currentPinError && (
                                            <p className="text-sm text-red-500">{currentPinError}</p>
                                        )}
                                    </div>
                                )}
                                <div className="flex flex-col items-center gap-3 my-4">
                                    <div className="flex justify-center gap-2">
                                        {Array.from({ length: 4 }).map((_, index) => (
                                            <input
                                                key={index}
                                                ref={el => inputRefs.current[index + (hasPIN ? 4 : 0)] = el}
                                                type={newPin.join('').length === 4 ? 'password' : 'text'}
                                                inputMode="numeric"
                                                pattern="\d*"
                                                maxLength={1}
                                                value={newPin[index] || ''}
                                                onChange={(e) => handlePinChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                className="w-12 h-12 text-center text-xl bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                aria-label={`New PIN digit ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-center text-xs text-muted-foreground text-center mt-1">
                                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mb-2" />
                                        <p>This code is crucial for transaction security.<br />Kindly store it safely.</p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        onClick={handleSavePIN}
                                        disabled={newPin.some((digit: string) => digit === '') || (hasPIN && currentPinInput.some((digit: string) => digit === ''))}
                                        className="w-full"
                                    >
                                        {hasPIN ? 'Change' : 'Save'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </ContentSection>
        </div>
    )
}