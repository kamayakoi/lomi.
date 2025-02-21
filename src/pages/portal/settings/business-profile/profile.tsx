import { useState, useEffect, useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from "@/lib/hooks/use-toast"
import ContentSection from '@/components/portal/content-section'
import { supabase, updateUserEmail } from '@/utils/supabase/client'
import { EyeIcon, EyeOffIcon, KeyRound, AlertCircle, PencilIcon, CheckIcon, X } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import ProfilePictureUploader from '@/components/auth/avatar-uploader'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { withActivationCheck } from '@/components/custom/with-activation-check'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '@/components/custom/button';
import { cn } from '@/lib/actions/utils';
import { MFA } from "@/components/mfa/mfa";
import InfoBox from '@/components/ui/info-box'
interface MerchantDetails {
    merchant_id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    phone_number: string;
    pin_code: string;
    preferred_language: string;
}

function Profile() {
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
    const [isRemovingPin, setIsRemovingPin] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const [currentPinError, setCurrentPinError] = useState('')
    const [isPasswordAuth, setIsPasswordAuth] = useState(false)
    const [editedMerchant, setEditedMerchant] = useState<MerchantDetails | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [authProvider, setAuthProvider] = useState<string>('');

    useEffect(() => {
        if (merchant) {
            setEditedMerchant(merchant);
        }
    }, [merchant]);

    const cancelEdit = useCallback(() => {
        setIsEditing(false);
        setEditedMerchant(merchant);
    }, [merchant]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isEditing) {
                const target = event.target as HTMLElement;
                if (!target.closest('.relative') && !target.closest('button')) {
                    cancelEdit();
                }
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (isEditing && event.key === 'Enter') {
                cancelEdit();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isEditing, cancelEdit]);

    useEffect(() => {
        fetchMerchant()
    }, [])

    useEffect(() => {
        const checkAuthMethod = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const provider = user.app_metadata.provider;
                setIsPasswordAuth(provider === 'email');
                // Set the provider name with proper capitalization
                if (provider && provider !== 'email') {
                    setAuthProvider(provider.charAt(0).toUpperCase() + provider.slice(1));
                }
            }
        };
        checkAuthMethod();
    }, []);

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

            if (data && Array.isArray(data) && data.length > 0) {
                const merchantData = data[0] as MerchantDetails;
                setMerchant(merchantData);
                setHasPIN(merchantData.pin_code !== null && merchantData.pin_code !== '');

                // Check if avatar_url is not null before attempting to download
                if (merchantData.avatar_url) {
                    // Download the merchant avatar
                    const { data: avatarData, error: avatarError } = await supabase
                        .storage
                        .from('avatars')
                        .download(merchantData.avatar_url);

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
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            // Verify the current password
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user.email || '',
                password: currentPassword,
            });

            if (signInError) {
                toast({
                    title: "Error",
                    description: "Current password is incorrect",
                    variant: "destructive",
                });
                return;
            }

            // Update the password
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) throw updateError;

            toast({
                title: "Success",
                description: "Password updated successfully",
            });
            setNewPassword('');
            setCurrentPassword('');
        } catch (error) {
            console.error('Error changing password:', error);
            toast({
                title: "Error",
                description: "Failed to change password",
                variant: "destructive",
            });
        }
    };

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
                    p_preferred_language: updatedMerchant.preferred_language
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

    const handleInputChange = (field: keyof MerchantDetails, value: string) => {
        if (!editedMerchant) return;

        if (field === 'phone_number') {
            // Remove all non-numeric characters
            const numericValue = value.replace(/\D/g, '');

            // Format phone number with country code
            if (numericValue.length > 0) {
                let formattedNumber = numericValue;
                if (numericValue.startsWith('225')) {
                    formattedNumber = `+225 ${numericValue.slice(3)}`;
                } else if (!numericValue.startsWith('225')) {
                    formattedNumber = `+225 ${numericValue}`;
                }
                setEditedMerchant({ ...editedMerchant, [field]: formattedNumber });
            } else {
                setEditedMerchant({ ...editedMerchant, [field]: value });
            }
        } else {
            setEditedMerchant({ ...editedMerchant, [field]: value });
        }
    };

    const handleFieldValidate = async (field: keyof MerchantDetails) => {
        if (!editedMerchant) return;

        try {
            // First update merchant details in custom table
            const { error: merchantError } = await supabase.rpc('update_merchant_details', {
                p_merchant_id: editedMerchant.merchant_id,
                p_name: editedMerchant.name,
                p_email: editedMerchant.email,
                p_phone_number: editedMerchant.phone_number.replace(/\s/g, ''),
                p_pin_code: editedMerchant.pin_code,
                p_preferred_language: editedMerchant.preferred_language
            });

            if (merchantError) throw merchantError;

            // Then update auth metadata if name or email is being changed
            if (field === 'name' || field === 'email') {
                if (field === 'name') {
                    const { error: authError } = await supabase.auth.updateUser({
                        data: { full_name: editedMerchant.name }
                    });
                    if (authError) {
                        console.warn('Failed to update auth metadata, but merchant details were updated:', authError);
                        // Don't throw here, as the merchant table update succeeded
                    }
                }
                if (field === 'email') {
                    const { error, message } = await updateUserEmail(editedMerchant.email);
                    if (error) {
                        console.warn('Failed to update email, but merchant details were updated:', error);
                        // Don't throw here, as the merchant table update succeeded
                    }
                    toast({
                        title: "Verification Required",
                        description: message || "Please check your email to verify the email change.",
                    });
                    setIsEditing(false);
                    return;
                }
            }

            // Update local state
            setMerchant(editedMerchant);
            setIsEditing(false);

            // Show success message
            toast({
                title: "Success",
                description: `${field === 'preferred_language' ? 'Language' : field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`,
            });

            // Trigger a refresh of the sidebar data if name was changed
            if (field === 'name' && window.dispatchEvent) {
                window.dispatchEvent(new Event('merchant-profile-updated'));
            }
        } catch (error) {
            console.error('Error updating field:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update field",
                variant: "destructive",
            });
        }
    };

    const handleLanguageChange = (value: string) => {
        if (!editedMerchant) return;
        setEditedMerchant({ ...editedMerchant, preferred_language: value });
    };

    const handleFieldEdit = (field: string) => {
        // Don't allow editing email if user is using OAuth
        if (field === 'email' && !isPasswordAuth) {
            toast({
                title: "Cannot Edit Email",
                description: `Email is managed by ${authProvider} and cannot be changed.`,
                variant: "destructive",
            });
            return;
        }
        setIsEditing(true);
        // Focus the field that was clicked
        setTimeout(() => {
            const element = document.getElementById(field);
            if (element) element.focus();
        }, 0);
    };

    const handleRemovePin = async () => {
        if (!merchant) return;

        try {
            if (currentPinInput.join('') !== merchant.pin_code) {
                setCurrentPinError('Current PIN is incorrect');
                return;
            }

            const { error } = await supabase.rpc('update_merchant_details', {
                p_merchant_id: merchant.merchant_id,
                p_name: merchant.name,
                p_email: merchant.email,
                p_phone_number: merchant.phone_number,
                p_pin_code: '',
                p_preferred_language: merchant.preferred_language
            });

            if (error) throw error;

            setHasPIN(false);
            setMerchant({ ...merchant, pin_code: '' });
            setShowPinModal(false);
            toast({
                title: "Success",
                description: "PIN removed successfully",
            });
        } catch (error) {
            console.error('Error removing PIN:', error);
            toast({
                title: "Error",
                description: "Failed to remove PIN",
                variant: "destructive",
            });
        }
    };

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
            overflowX: 'hidden',
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
                <div className="max-w-3xl">
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
                                <div className="relative ml-[1px]">
                                    <Input
                                        id="name"
                                        value={editedMerchant?.name || ''}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`${!isEditing ? "bg-muted" : ""} rounded-none pr-8`}
                                        readOnly={!isEditing}
                                    />
                                    {!isEditing ? (
                                        <button
                                            onClick={() => handleFieldEdit('name')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 transition-colors"
                                        >
                                            <PencilIcon className="h-3 w-3" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleFieldValidate('name')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-600 transition-colors"
                                        >
                                            <CheckIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        value={editedMerchant?.email || ''}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={cn(
                                            "rounded-none pr-8",
                                            !isEditing ? "bg-muted" : "",
                                            !isPasswordAuth ? "cursor-not-allowed opacity-60" : ""
                                        )}
                                        readOnly={!isEditing || !isPasswordAuth}
                                    />
                                    {isPasswordAuth ? (
                                        !isEditing ? (
                                            <button
                                                onClick={() => handleFieldEdit('email')}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 transition-colors"
                                            >
                                                <PencilIcon className="h-3 w-3" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleFieldValidate('email')}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-600 transition-colors"
                                            >
                                                <CheckIcon className="h-4 w-4" />
                                            </button>
                                        )
                                    ) : (
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <AlertCircle className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                                {!isPasswordAuth && (
                                    <p className="text-xs text-muted-foreground">
                                        Email is managed by {authProvider}.
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone number</Label>
                                <div className="relative ml-[1px]">
                                    <Input
                                        id="phone"
                                        value={editedMerchant?.phone_number || ''}
                                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                        className={`${!isEditing ? "bg-muted" : ""} rounded-none pr-8`}
                                        readOnly={!isEditing}
                                        placeholder="+225 XXXXXXXXXX"
                                    />
                                    {!isEditing ? (
                                        <button
                                            onClick={() => handleFieldEdit('phone')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 transition-colors"
                                        >
                                            <PencilIcon className="h-3 w-3" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleFieldValidate('phone_number')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-600 transition-colors"
                                        >
                                            <CheckIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <div className="relative">
                                    {isEditing ? (
                                        <div className="relative">
                                            <Select
                                                value={editedMerchant?.preferred_language || ''}
                                                onValueChange={handleLanguageChange}
                                            >
                                                <SelectTrigger className="rounded-none w-full pr-8">
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">English</SelectItem>
                                                    <SelectItem value="fr">Français</SelectItem>
                                                    <SelectItem value="es">Español</SelectItem>
                                                    <SelectItem value="pt">Português</SelectItem>
                                                    <SelectItem value="zh">中文</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <button
                                                onClick={() => handleFieldValidate('preferred_language')}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-600 transition-colors"
                                            >
                                                <CheckIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <Input
                                                id="language"
                                                value={(() => {
                                                    switch (editedMerchant?.preferred_language) {
                                                        case 'en': return 'English';
                                                        case 'fr': return 'Français';
                                                        case 'es': return 'Español';
                                                        case 'pt': return 'Português';
                                                        case 'zh': return '中文';
                                                        default: return 'English';
                                                    }
                                                })()}
                                                className="bg-muted rounded-none pr-8"
                                                readOnly
                                            />
                                            <button
                                                onClick={() => handleFieldEdit('language')}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 transition-colors"
                                            >
                                                <PencilIcon className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isPasswordAuth && (
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
                                                className="pr-24 transition-all duration-200 focus:ring-1 focus:ring-primary"
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
                                                className="absolute right-0 h-full px-4 rounded-none bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Additional security</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium">PIN</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Activated, your pin will be mandatory for all payouts.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowPinModal(true);
                                            setCurrentPinInput(['', '', '', '']);
                                            setIsRemovingPin(false);
                                        }}
                                        className="rounded-none bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                        {hasPIN ? 'Update your PIN' : 'Set your PIN'}
                                    </Button>
                                    {hasPIN && (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowPinModal(true);
                                                setCurrentPinInput(['', '', '', '']);
                                                setNewPin(['', '', '', '']);
                                                setIsRemovingPin(true);
                                            }}
                                            className="rounded-none p-2 hover:bg-red-100 hover:text-red-600 text-red-500 border-red-200"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <MFA />
                        </div>

                        <InfoBox mini
                            variant="green"
                            title="Need help?"
                            type="info"
                        >
                            Contact <a href="mailto:hello@lomi.africa" className="underline">hello@lomi.africa</a> if you need assistance with updating your profile details.
                        </InfoBox>
                    </div>

                    {showPinModal && (
                        <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
                            <DialogContent className="sm:max-w-[350px]">
                                <DialogHeader>
                                    <DialogTitle className="text-center flex items-center justify-center gap-2">
                                        <KeyRound className="w-4 h-4" />
                                        {hasPIN ? (isRemovingPin ? 'Remove your PIN' : 'Change your PIN') : 'Set your PIN'}
                                    </DialogTitle>
                                    {hasPIN && (
                                        <DialogDescription className="text-center mt-2">
                                            Enter your current PIN to {isRemovingPin ? 'remove' : 'change'} it
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
                                                    className="w-12 h-12 text-center text-xl border rounded-none focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 bg-background hover:bg-muted/50"
                                                    aria-label={`Current PIN digit ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                        {currentPinError && (
                                            <p className="text-sm text-red-500">{currentPinError}</p>
                                        )}
                                    </div>
                                )}
                                {(!hasPIN || !isRemovingPin) && (
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
                                                    className="w-12 h-12 text-center text-xl border rounded-none focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 bg-background hover:bg-muted/50"
                                                    aria-label={`New PIN digit ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-center text-xs text-muted-foreground text-center mt-1">
                                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mb-2" />
                                            <p>This code is crucial for transaction security.<br />Kindly store it safely.</p>
                                        </div>
                                    </div>
                                )}
                                <DialogFooter>
                                    <Button
                                        onClick={isRemovingPin ? handleRemovePin : handleSavePIN}
                                        disabled={
                                            (hasPIN && currentPinInput.some((digit: string) => digit === '')) ||
                                            (!isRemovingPin && newPin.some((digit: string) => digit === ''))
                                        }
                                        className="w-full rounded-none bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                        {hasPIN ? (isRemovingPin ? 'Remove' : 'Change') : 'Save'}
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

function ProfileWithActivationCheck() {
    return withActivationCheck(Profile)({});
}

export default ProfileWithActivationCheck;