import { useState, useMemo } from 'react';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/actions/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { countryCodes, countries, organizationPositions } from '@/utils/data/onboarding';
import ProfilePictureUploader from '@/components/auth/avatar-uploader';

const phoneRegex = /^(\+\d{1,3}[- ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?\(?([0-9]{2})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{2})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$|^(\+\d{1,3}[- ]?)?([0-9]{4})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$|^(\+\d{1,3}[- ]?)?([0-9]{3})[-. ]?([0-9]{6})$|^(\+\d{1,3}[- ]?)?([0-9]{2})[-. ]?([0-9]{8})$|^(\+\d{1,3}[- ]?)?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{5})[-. ]?([0-9]{5})$|^(\+\d{1,3}[- ]?)?([0-9]{5})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$|^(\+\d{1,3}[- ]?)?([0-9]{4})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{2})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{1})[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$|^(\+\d{1,3}[- ]?)?([0-9]{1})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{2})[-. ]?([0-9]{3})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$|^(\+\d{1,3}[- ]?)?([0-9]{3})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;

const onboardingStep1Schema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    countryCode: z.string().regex(/^\+\d+$/, 'Country code must start with + followed by numbers'),
    phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number format'),
    country: z.string().min(1, 'Country is required'),
    position: z.string().min(1, 'Position is required'),
});

type OnboardingStep1Data = z.infer<typeof onboardingStep1Schema> & {
    avatarUrl: string;
};

interface OnboardingStep1Props {
    onNext: (data: OnboardingStep1Data & { avatarUrl: string }) => void;
    data: OnboardingStep1Data & { avatarUrl: string };
}

const OnboardingStep1: React.FC<OnboardingStep1Props> = ({ onNext, data }) => {
    const onboardingForm = useForm<OnboardingStep1Data>({
        resolver: zodResolver(onboardingStep1Schema),
        mode: 'onChange',
        defaultValues: {
            firstName: data.firstName,
            lastName: data.lastName,
            countryCode: data.countryCode || '+225',
            phoneNumber: data.phoneNumber,
            country: data.country,
            position: data.position,
        },
    });

    const [countryCodeSearch, setCountryCodeSearch] = useState('');
    const [isCountryCodeDropdownOpen, setIsCountryCodeDropdownOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');

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
        onNext({ ...data, avatarUrl });
    };

    return (
        <form onSubmit={onboardingForm.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-6">
                <div className="flex space-x-2">
                    <div className="w-1/2">
                        <Label htmlFor="firstName" className="block mb-2">First name</Label>
                        <Input
                            id="firstName"
                            placeholder="Enter your first name"
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
                        <Label htmlFor="lastName" className="block mb-2">Last name</Label>
                        <Input
                            id="lastName"
                            placeholder="Enter your last name"
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
                        <Label htmlFor="countryCode" className="block mb-2">Country code</Label>
                        <div className="relative w-full">
                            <Input
                                id="countryCode"
                                type="text"
                                placeholder="+225"
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
                        <Label htmlFor="phoneNumber" className="block mb-2">Phone number</Label>
                        <Input
                            id="phoneNumber"
                            placeholder="Enter your phone number"
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
                    <Label htmlFor="profilePicture" className="block mb-2">Profile picture</Label>
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
                        <Label htmlFor="country" className="block mb-2">Where are you based?</Label>
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
                        {onboardingForm.formState.errors.country && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.country.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="position" className="block mb-2">Your Position</Label>
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
                        {onboardingForm.formState.errors.position && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.position.message}</p>}
                    </div>
                </div>
            </div>
            <Button type="submit" className="w-full mt-6 h-[48px]">
                Next
            </Button>
        </form>
    );
};

export default OnboardingStep1;
export type { OnboardingStep1Data };