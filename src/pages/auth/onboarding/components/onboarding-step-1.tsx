import { useState, useMemo } from 'react';
import { ButtonExpand } from '@/components/design/button-expand';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/actions/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { countryCodes, countries, organizationPositions } from '@/lib/data/onboarding';
import ProfilePictureUploader from '@/components/auth/avatar-uploader';
import { useTranslation } from 'react-i18next';
import { OnboardingLanguageSwitcher } from '@/components/design/OnboardingLanguageSwitcher';
import { supabase } from '@/utils/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const phoneRegex = /^(\+\d{1,3}[- ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?\(?([0-9]{2})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{2})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$|^(\+\d{1,3}[- ]?)?([0-9]{4})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$|^(\+\d{1,3}[- ]?)?([0-9]{3})[-. ]?([0-9]{6})$|^(\+\d{1,3}[- ]?)?([0-9]{2})[-. ]?([0-9]{8})$|^(\+\d{1,3}[- ]?)?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{5})[-. ]?([0-9]{5})$|^(\+\d{1,3}[- ]?)?([0-9]{5})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$|^(\+\d{1,3}[- ]?)?([0-9]{4})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{2})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{1})[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$|^(\+\d{1,3}[- ]?)?([0-9]{1})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{2})[-. ]?([0-9]{3})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$|^(\+\d{1,3}[- ]?)?([0-9]{3})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;

const createOnboardingStep1Schema = (t: (key: string) => string) => {
    return z.object({
        firstName: z.string().min(1, t('onboarding.step1.first_name.error')),
        lastName: z.string().min(1, t('onboarding.step1.last_name.error')),
        countryCode: z.string().regex(/^\+\d+$/, t('onboarding.step1.country_code.error')),
        phoneNumber: z.string().regex(phoneRegex, t('onboarding.step1.phone.error')),
        country: z.string().min(1, t('onboarding.step1.country.error')),
        position: z.string().min(1, t('onboarding.step1.position.error')),
        avatarUrl: z.string().optional()
    });
};

type OnboardingStep1Schema = ReturnType<typeof createOnboardingStep1Schema>;
export type OnboardingStep1Data = z.infer<OnboardingStep1Schema> & { avatarUrl?: string };

interface OnboardingStep1Props {
    onNext: (data: OnboardingStep1Data) => void;
    data: Partial<OnboardingStep1Data>;
    onAvatarUpdate?: (avatarUrl: string) => void;
}

const noop = () => undefined;

// Add this function before the OnboardingStep1 component
const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, '');

    // Format based on length and potential patterns
    if (numbers.length <= 2) {
        return numbers;
    } else if (numbers.length <= 4) {
        return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    } else if (numbers.length <= 7) {
        return `${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4)}`;
    } else {
        return `${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7)}`;
    }
};

const OnboardingStep1: React.FC<OnboardingStep1Props> = ({ onNext, data, onAvatarUpdate }) => {
    const { t } = useTranslation();
    const schema = createOnboardingStep1Schema(t);

    const [countryCodeSearch, setCountryCodeSearch] = useState(data.countryCode || '+225');
    const [isCountryCodeDropdownOpen, setIsCountryCodeDropdownOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(data.avatarUrl || '');

    const onboardingForm = useForm<z.infer<OnboardingStep1Schema>>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            countryCode: data.countryCode || '+225',
            phoneNumber: data.phoneNumber || '',
            country: data.country || '',
            position: data.position || '',
            avatarUrl: data.avatarUrl || ''
        },
    });

    const handleAvatarUpdate = async (newAvatarUrl: string) => {
        try {
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            // Keep the full URL path for the avatar
            const fullAvatarUrl = newAvatarUrl;

            // Update merchant avatar
            const { error: updateError } = await supabase.rpc('update_merchant_avatar', {
                p_merchant_id: user.id,
                p_avatar_url: fullAvatarUrl
            });

            if (updateError) throw updateError;

            // Update local state with full URL
            setAvatarUrl(fullAvatarUrl);

            // Update parent state with full URL
            if (onAvatarUpdate) {
                onAvatarUpdate(fullAvatarUrl);
            }

            // Pass the full URL to form
            onboardingForm.setValue("avatarUrl", fullAvatarUrl);

            // Trigger a refresh event for the UserNav component
            window.dispatchEvent(new Event('merchant-profile-updated'));
        } catch (error) {
            console.error('Error updating avatar:', error);
            toast({
                title: "Error",
                description: "Failed to update avatar",
                variant: "destructive",
            });
        }
    };

    const onSubmit = (formData: z.infer<OnboardingStep1Schema>) => {
        // Include the full avatar URL in the submission
        onNext({
            ...formData,
            avatarUrl: avatarUrl || formData.avatarUrl
        });
    };

    const filteredCountryCodes = useMemo(() => {
        const lowercaseSearch = countryCodeSearch.toLowerCase();
        return Array.from(new Set(countryCodes.filter(code =>
            code.toLowerCase().includes(lowercaseSearch)
        ))).slice(0, 5); // Limit to 5 results
    }, [countryCodeSearch]);

    // Add this inside the component before return
    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatPhoneNumber(e.target.value);
        e.target.value = formattedValue;
        onboardingForm.setValue("phoneNumber", formattedValue, { shouldValidate: true });
    };

    return (
        <form onSubmit={onboardingForm.handleSubmit(onSubmit)} className="space-y-6">
            <div className="absolute top-8 sm:top-4 right-4">
                <OnboardingLanguageSwitcher onLanguageChange={noop} />
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Left side - Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-[280px] lg:w-[380px] h-[280px] lg:h-[380px] relative flex-shrink-0 flex items-center justify-center lg:ml-8"
                >
                    <img
                        src="/onboarding/okra_test_your_app.svg"
                        alt="Personal Information"
                        className="w-full h-full object-contain"
                        loading="eager"
                    />
                </motion.div>

                {/* Right side - Form Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 w-full"
                >
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2">
                            <div className="w-full sm:w-1/2">
                                <Label htmlFor="firstName" className="block mb-2">{t('onboarding.step1.first_name.label')}</Label>
                                <Input
                                    id="firstName"
                                    placeholder={t('onboarding.step1.first_name.placeholder')}
                                    {...onboardingForm.register("firstName")}
                                    className={cn(
                                        "w-full mb-2 h-[48px]",
                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    )}
                                />
                                {onboardingForm.formState.errors.firstName && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.firstName.message}</p>}
                            </div>
                            <div className="w-full sm:w-1/2">
                                <Label htmlFor="lastName" className="block mb-2">{t('onboarding.step1.last_name.label')}</Label>
                                <Input
                                    id="lastName"
                                    placeholder={t('onboarding.step1.last_name.placeholder')}
                                    {...onboardingForm.register("lastName")}
                                    className={cn(
                                        "w-full mb-2 h-[48px]",
                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    )}
                                />
                                {onboardingForm.formState.errors.lastName && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.lastName.message}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2">
                            <div className="w-full sm:w-1/3">
                                <Label htmlFor="countryCode" className="block mb-2">{t('onboarding.step1.country_code.label')}</Label>
                                <div className="relative w-full">
                                    <Input
                                        id="countryCode"
                                        type="text"
                                        autoComplete="tel-country-code"
                                        placeholder={t('onboarding.step1.country_code.placeholder')}
                                        value={countryCodeSearch}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Only update if it's a valid country code format
                                            if (value.startsWith('+') || value === '') {
                                                setCountryCodeSearch(value);
                                                onboardingForm.setValue("countryCode", value, { shouldValidate: true });
                                                setIsCountryCodeDropdownOpen(true);
                                            }
                                        }}
                                        onFocus={() => setIsCountryCodeDropdownOpen(true)}
                                        onBlur={() => setTimeout(() => setIsCountryCodeDropdownOpen(false), 200)}
                                        className={cn(
                                            "w-full mb-2 px-3 py-2 border h-[48px]",
                                            "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                            "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        )}
                                    />
                                    {onboardingForm.formState.errors.countryCode && (
                                        <p className="text-red-500 text-sm">{onboardingForm.formState.errors.countryCode.message}</p>
                                    )}
                                    {isCountryCodeDropdownOpen && filteredCountryCodes.length > 0 && (
                                        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 mt-1 max-h-60 overflow-auto">
                                            {filteredCountryCodes.map((code: string) => (
                                                <li
                                                    key={code}
                                                    className="px-3 py-2 h-[48px] flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    onClick={() => {
                                                        setCountryCodeSearch(code);
                                                        onboardingForm.setValue("countryCode", code, { shouldValidate: true });
                                                        setIsCountryCodeDropdownOpen(false);
                                                    }}
                                                >
                                                    {code}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="w-full sm:w-2/3">
                                <Label htmlFor="phoneNumber" className="block mb-2">{t('onboarding.step1.phone.label')}</Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    autoComplete="tel-national"
                                    placeholder={t('onboarding.step1.phone.placeholder')}
                                    {...onboardingForm.register("phoneNumber", {
                                        onChange: (e) => {
                                            handlePhoneNumberChange(e);
                                            // Prevent country code from being modified by autofill
                                            const currentCountryCode = onboardingForm.getValues("countryCode");
                                            if (currentCountryCode && currentCountryCode !== countryCodeSearch) {
                                                setCountryCodeSearch(currentCountryCode);
                                            }
                                        },
                                        setValueAs: (value) => value.replace(/\s/g, ''),
                                    })}
                                    className={cn(
                                        "w-full mb-2 h-[48px]",
                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    )}
                                />
                                {onboardingForm.formState.errors.phoneNumber && (
                                    <p className="text-red-500 text-sm">{onboardingForm.formState.errors.phoneNumber.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mb-6 flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8">
                        <div className="w-full sm:w-1/2 space-y-4">
                            <Label htmlFor="profilePicture" className="block mb-2">{t('onboarding.step1.profile_picture.label')}</Label>
                            <div className="ml-0 sm:ml-8">
                                <ProfilePictureUploader
                                    currentAvatar={avatarUrl}
                                    onAvatarUpdate={handleAvatarUpdate}
                                    name={onboardingForm.watch('firstName') + ' ' + onboardingForm.watch('lastName')}
                                />
                            </div>
                        </div>
                        <div className="w-full sm:w-1/2 space-y-4">
                            <div>
                                <Label htmlFor="country" className="block mb-2">{t('onboarding.step1.country.label')}</Label>
                                <select
                                    id="country"
                                    {...onboardingForm.register("country")}
                                    className={cn(
                                        "w-full mb-2 px-3 py-2 border h-[48px]",
                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                        "appearance-none rounded-none"
                                    )}
                                >
                                    {countries.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                                {onboardingForm.formState.errors.country && <p className="text-red-500 text-sm">{t('onboarding.step1.country.error')}</p>}
                            </div>
                            <div>
                                <Label htmlFor="position" className="block mb-2">{t('onboarding.step1.position.label')}</Label>
                                <select
                                    id="position"
                                    {...onboardingForm.register("position")}
                                    className={cn(
                                        "w-full mb-2 px-3 py-2 border h-[48px]",
                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                        "appearance-none rounded-none"
                                    )}
                                >
                                    {organizationPositions.map((position) => (
                                        <option key={position} value={position}>
                                            {position}
                                        </option>
                                    ))}
                                </select>
                                {onboardingForm.formState.errors.position && <p className="text-red-500 text-sm">{t('onboarding.step1.position.error')}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end">
                        <ButtonExpand
                            text={t('common.next')}
                            icon={ArrowRight}
                            iconPlacement="right"
                            bgColor="bg-black dark:bg-gray-800"
                            hoverBgColor="hover:bg-gray-900 dark:hover:bg-gray-700"
                            textColor="text-white"
                            hoverTextColor="hover:text-white"
                            className="h-[44px] sm:h-[48px] font-semibold text-base transition-all duration-300 ease-in-out hover:shadow-lg ml-auto"
                            onClick={() => onboardingForm.handleSubmit(onSubmit)()}
                        />
                    </div>
                </motion.div>
            </div>
        </form>
    );
};

export default OnboardingStep1;
export type { OnboardingStep1Schema };