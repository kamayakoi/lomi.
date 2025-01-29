import { useState, useMemo } from 'react';
import { Button } from '@/components/custom/button';
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
type OnboardingStep1Data = z.infer<OnboardingStep1Schema>;

interface OnboardingStep1Props {
    onNext: (data: OnboardingStep1Data) => void;
    data: Partial<OnboardingStep1Data>;
}

const noop = () => undefined;

const OnboardingStep1: React.FC<OnboardingStep1Props> = ({ onNext, data }) => {
    const { t } = useTranslation();
    const schema = createOnboardingStep1Schema(t);

    const onboardingForm = useForm<OnboardingStep1Data>({
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

    const [countryCodeSearch, setCountryCodeSearch] = useState('');
    const [isCountryCodeDropdownOpen, setIsCountryCodeDropdownOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(data.avatarUrl || '');

    const filteredCountryCodes = useMemo(() => {
        const lowercaseSearch = countryCodeSearch.toLowerCase();
        return Array.from(new Set(countryCodes.filter(code =>
            code.toLowerCase().includes(lowercaseSearch)
        ))).slice(0, 5); // Limit to 5 results
    }, [countryCodeSearch]);

    const handleAvatarUpdate = async (newAvatarUrl: string) => {
        // Extract the relative path from the full URL
        const relativeAvatarPath = newAvatarUrl.replace(/^.*\/avatars\//, '');
        setAvatarUrl(relativeAvatarPath);
    };

    const onSubmit = (data: OnboardingStep1Data) => {
        onNext(data);
    };

    return (
        <form onSubmit={onboardingForm.handleSubmit(onSubmit)} className="space-y-6">
            <div className="absolute top-4 right-4">
                <OnboardingLanguageSwitcher onLanguageChange={noop} />
            </div>
            <div className="mb-6">
                <div className="flex space-x-2">
                    <div className="w-1/2">
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
                    <div className="w-1/2">
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
                <div className="flex space-x-2">
                    <div className="w-1/3">
                        <Label htmlFor="countryCode" className="block mb-2">{t('onboarding.step1.country_code.label')}</Label>
                        <div className="relative w-full">
                            <Input
                                id="countryCode"
                                type="text"
                                placeholder={t('onboarding.step1.country_code.placeholder')}
                                value={countryCodeSearch}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCountryCodeSearch(value);
                                    onboardingForm.setValue("countryCode", value, { shouldValidate: true });
                                    setIsCountryCodeDropdownOpen(true);
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
                    <div className="flex-1">
                        <Label htmlFor="phoneNumber" className="block mb-2">{t('onboarding.step1.phone.label')}</Label>
                        <Input
                            id="phoneNumber"
                            placeholder={t('onboarding.step1.phone.placeholder')}
                            {...onboardingForm.register("phoneNumber", {
                                setValueAs: (value) => value.replace(/\s/g, ''),
                            })}
                            className={cn(
                                "w-full mb-2 h-[48px]",
                                "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.phoneNumber && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.phoneNumber.message}</p>}
                    </div>
                </div>
            </div>
            <div className="mb-6 flex space-x-8">
                <div className="w-1/2 space-y-4">
                    <Label htmlFor="profilePicture" className="block mb-2">{t('onboarding.step1.profile_picture.label')}</Label>
                    <div className="ml-8">
                        <ProfilePictureUploader
                            currentAvatar={avatarUrl}
                            onAvatarUpdate={handleAvatarUpdate}
                            name={onboardingForm.watch('firstName') + ' ' + onboardingForm.watch('lastName')}
                        />
                    </div>
                </div>
                <div className="w-1/2 space-y-4">
                    <div>
                        <Label htmlFor="country" className="block mb-2">{t('onboarding.step1.country.label')}</Label>
                        <select
                            id="country"
                            {...onboardingForm.register("country")}
                            className={cn(
                                "w-full mb-2 px-3 py-2 border h-[48px]",
                                "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                "appearance-none"
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
                                "appearance-none"
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
            <Button type="submit" className="w-full mt-6 h-[48px] bg-black hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 text-white font-semibold text-base transition-all duration-300 ease-in-out hover:shadow-lg">
                {t('common.next')}
            </Button>
        </form>
    );
};

export default OnboardingStep1;
export type { OnboardingStep1Data };