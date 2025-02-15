import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { countryCodes } from '@/lib/data/onboarding';
import { ActivationData } from "../Activation";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/design/language-switcher';

const phoneRegex = /^(\+\d{1,3}[- ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?\(?([0-9]{2})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$|^(\+\d{1,3}[- ]?)?([0-9]{4})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$|^(\+\d{1,3}[- ]?)?([0-9]{3})[-. ]?([0-9]{6})$|^(\+\d{1,3}[- ]?)?([0-9]{2})[-. ]?([0-9]{8})$|^(\+\d{1,3}[- ]?)?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{5})[-. ]?([0-9]{5})$|^(\+\d{1,3}[- ]?)?([0-9]{5})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$|^(\+\d{1,3}[- ]?)?([0-9]{4})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{2})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{1})[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$|^(\+\d{1,3}[- ]?)?([0-9]{1})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{2})[-. ]?([0-9]{3})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$|^(\+\d{1,3}[- ]?)?([0-9]{3})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{2})[-. ]?([0-9]{2})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/;

const activationStep3Schema = z.object({
    fullName: z.string().min(1, 'activation.step3.full_name.error'),
    email: z.string().email('activation.step3.email.error'),
    countryCode: z.string().regex(/^\+\d+$/, 'activation.step3.mobile.country_code.error'),
    mobileNumber: z.string().regex(phoneRegex, 'activation.step3.mobile.number.error'),
});

type ActivationStep3Data = z.infer<typeof activationStep3Schema>;

interface ActivationStep3Props {
    onNext: (data: ActivationStep3Data) => void;
    onPrevious: () => void;
    data: ActivationData;
}

const ActivationStep3: React.FC<ActivationStep3Props> = ({ onNext, onPrevious, data }) => {
    const { t } = useTranslation();
    const { control, handleSubmit, formState: { errors } } = useForm<ActivationStep3Data>({
        resolver: zodResolver(activationStep3Schema),
        mode: 'onChange',
        defaultValues: {
            fullName: data.fullName,
            email: data.email,
            countryCode: data.countryCode,
            mobileNumber: data.mobileNumber,
        },
    });

    const onSubmit = (data: ActivationStep3Data) => {
        onNext(data);
    };

    const getErrorMessage = (error: { message?: string }) => {
        if (!error.message) return '';
        return t(error.message);
    };

    const [countryCodeSearch, setCountryCodeSearch] = useState('');
    const [isCountryCodeDropdownOpen, setIsCountryCodeDropdownOpen] = useState(false);

    const filteredCountryCodes = React.useMemo(() => {
        const lowercaseSearch = countryCodeSearch.toLowerCase();
        return Array.from(new Set(countryCodes.filter(code =>
            code.toLowerCase().includes(lowercaseSearch)
        ))).slice(0, 2);
    }, [countryCodeSearch]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="absolute top-4 right-4">
                <LanguageSwitcher />
            </div>
            <h2 className="text-lg font-semibold">{t('activation.step3.title')}</h2>
            <div>
                <Label htmlFor="fullName" className="block mb-4">{t('activation.step3.full_name.label')}</Label>
                <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="fullName"
                            placeholder={t('activation.step3.full_name.placeholder')}
                            className="rounded-none"
                            {...field}
                        />
                    )}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.fullName)}</p>}
            </div>
            <div>
                <Label htmlFor="email" className="block mb-4">{t('activation.step3.email.label')}</Label>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="email"
                            type="email"
                            placeholder={t('activation.step3.email.placeholder')}
                            className="rounded-none"
                            {...field}
                        />
                    )}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.email)}</p>}
            </div>
            <div>
                <Label htmlFor="mobileNumber" className="block mb-4">{t('activation.step3.mobile.label')}</Label>
                <div className="flex">
                    <div className="relative w-1/3">
                        <Controller
                            name="countryCode"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Input
                                        id="countryCode"
                                        type="text"
                                        placeholder={t('activation.step3.mobile.country_code.placeholder')}
                                        value={countryCodeSearch}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setCountryCodeSearch(value);
                                            field.onChange(value);
                                            setIsCountryCodeDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsCountryCodeDropdownOpen(true)}
                                        onBlur={() => setTimeout(() => setIsCountryCodeDropdownOpen(false), 200)}
                                        className="w-full mb-2 rounded-none"
                                    />
                                    {isCountryCodeDropdownOpen && filteredCountryCodes.length > 0 && (
                                        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-none mt-1 max-h-60 overflow-auto">
                                            {filteredCountryCodes.map((code: string) => (
                                                <li
                                                    key={code}
                                                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    onClick={() => {
                                                        setCountryCodeSearch(code);
                                                        field.onChange(code);
                                                        setIsCountryCodeDropdownOpen(false);
                                                    }}
                                                >
                                                    {code}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        />
                        {errors.countryCode && <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.countryCode)}</p>}
                    </div>
                    <div className="flex-1 ml-2">
                        <Controller
                            name="mobileNumber"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="mobileNumber"
                                    placeholder={t('activation.step3.mobile.number.placeholder')}
                                    className="rounded-none"
                                    {...field}
                                />
                            )}
                        />
                        {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.mobileNumber)}</p>}
                    </div>
                </div>
            </div>
            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onPrevious}>
                    {t('common.back')}
                </Button>
                <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                    {t('common.next')}
                </Button>
            </div>
        </form>
    )
}

export default ActivationStep3;
export type { ActivationStep3Data };