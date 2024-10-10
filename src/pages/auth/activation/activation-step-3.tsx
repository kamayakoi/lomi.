import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { countryCodes } from '@/utils/data/onboarding';
import { ActivationData } from "./activation";
import { Button } from "@/components/ui/button";

const phoneRegex = /^(\+\d{1,3}[- ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?\(?([0-9]{2})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$|^(\+\d{1,3}[- ]?)?([0-9]{4})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$|^(\+\d{1,3}[- ]?)?([0-9]{3})[-. ]?([0-9]{6})$|^(\+\d{1,3}[- ]?)?([0-9]{2})[-. ]?([0-9]{8})$|^(\+\d{1,3}[- ]?)?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{5})[-. ]?([0-9]{5})$|^(\+\d{1,3}[- ]?)?([0-9]{5})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$|^(\+\d{1,3}[- ]?)?([0-9]{4})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{2})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{1})[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$|^(\+\d{1,3}[- ]?)?([0-9]{1})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{2})[-. ]?([0-9]{3})[-. ]?([0-9]{2})[-. ]?([0-9]{2})$|^(\+\d{1,3}[- ]?)?([0-9]{3})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$|^(\+\d{1,3}[- ]?)?([0-9]{2})[-. ]?([0-9]{2})[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/;

const activationStep3Schema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    countryCode: z.string().regex(/^\+\d+$/, 'Country code must start with + followed by numbers'),
    mobileNumber: z.string().regex(phoneRegex, 'Invalid phone number format'),
});

type ActivationStep3Data = z.infer<typeof activationStep3Schema>;

interface ActivationStep3Props {
    onNext: (data: ActivationStep3Data) => void;
    onPrevious: () => void;
    data: ActivationData;
}

const ActivationStep3: React.FC<ActivationStep3Props> = ({ onNext, onPrevious, data }) => {
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
            <h2 className="text-lg font-semibold">Authorized Signatory</h2>
            <div>
                <Label htmlFor="fullName">Full name</Label>
                <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="fullName"
                            placeholder="e.g. Jessy Luckey"
                            {...field}
                        />
                    )}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="email"
                            type="email"
                            placeholder="e.g. jessy@gmail.com"
                            {...field}
                        />
                    )}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <Label htmlFor="mobileNumber">Mobile number</Label>
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
                                        placeholder="+225"
                                        value={countryCodeSearch}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setCountryCodeSearch(value);
                                            field.onChange(value);
                                            setIsCountryCodeDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsCountryCodeDropdownOpen(true)}
                                        onBlur={() => setTimeout(() => setIsCountryCodeDropdownOpen(false), 200)}
                                        className="w-full mb-2"
                                    />
                                    {isCountryCodeDropdownOpen && filteredCountryCodes.length > 0 && (
                                        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-60 overflow-auto">
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
                        {errors.countryCode && <p className="text-red-500 text-sm mt-1">{errors.countryCode.message}</p>}
                    </div>
                    <div className="flex-1 ml-2">
                        <Controller
                            name="mobileNumber"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="mobileNumber"
                                    placeholder="01 60 223 401"
                                    {...field}
                                />
                            )}
                        />
                        {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber.message}</p>}
                    </div>
                </div>
            </div>
            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onPrevious}>
                    Back
                </Button>
                <Button type="submit">Next</Button>
            </div>
        </form>
    )
}

export default ActivationStep3;
export type { ActivationStep3Data };