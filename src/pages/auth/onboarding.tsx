import React, { useEffect, useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/utils/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { countryCodes, countries, roles, employeeRanges, industries } from '@/data/onboarding';

const phoneRegex = /^(\+\d{1,3}[- ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

const onboardingFormSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    countryCode: z.string().min(1, 'Country code is required'),
    phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number format'),
    country: z.string().min(1, 'Country is required'),
    role: z.string().min(1, 'Role is required'),
    orgName: z.string().min(1, 'Organization name is required'),
    orgCountry: z.string().min(1, 'Organization country is required'),
    orgCity: z.string().min(1, 'City is required'),
    orgAddress: z.string().min(1, 'Address is required'),
    orgPostalCode: z.string().min(1, 'Postal code is required'),
    orgIndustry: z.string().min(1, 'Industry is required'),
    orgWebsite: z.string().url('Invalid website URL').optional().or(z.literal('')),
    orgEmployees: z.string().min(1, 'Number of employees is required'),
});

type OnboardingFormData = z.infer<typeof onboardingFormSchema>;

const Onboarding: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const navigate = useNavigate();
    const [countryCodeSearch, setCountryCodeSearch] = useState('');
    const [isCountryCodeDropdownOpen, setIsCountryCodeDropdownOpen] = useState(false);

    const onboardingForm = useForm<OnboardingFormData>({
        resolver: zodResolver(onboardingFormSchema),
        mode: 'onChange',
        defaultValues: {
            countryCode: '+225',
        }
    });

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error getting session:', error);
                navigate('/sign-in');
                return;
            }

            if (session?.user) {
                setUser(session.user);
                setIsEmailVerified(session.user.email_confirmed_at !== null);
                const { data: profile, error: profileError } = await supabase
                    .from('merchants')
                    .select('onboarded')
                    .eq('merchant_id', session.user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching user profile:', profileError);
                    setLoading(false);
                    return;
                }

                if (profile && profile.onboarded) {
                    navigate('/portal');
                } else {
                    setLoading(false);
                }
            } else {
                navigate('/sign-in');
            }
        };
        checkUser();
    }, [navigate]);

    const filteredCountryCodes = useMemo(() => {
        const lowercaseSearch = countryCodeSearch.toLowerCase();
        return Array.from(new Set(countryCodes.filter(code =>
            code.toLowerCase().includes(lowercaseSearch)
        ))).slice(0, 5); // Limit to 5 results
    }, [countryCodeSearch]);

    const handleResendVerification = async () => {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: user?.email || '',
            });
            if (error) throw error;
            toast({
                title: "Verification Email Sent",
                description: "Please check your inbox for the verification link.",
            });
        } catch (error) {
            console.error('Error resending verification email:', error);
            toast({
                title: "Error",
                description: "There was a problem sending the verification email. Please try again.",
                variant: "destructive",
            });
        }
    };

    const createOrganization = async (formData: OnboardingFormData) => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('organizations')
            .insert([
                {
                    name: formData.orgName,
                    email: user.email,
                    phone_number: `${formData.countryCode}${formData.phoneNumber}`,
                    country: formData.orgCountry,
                    city: formData.orgCity,
                    address: formData.orgAddress,
                    postal_code: formData.orgPostalCode,
                    industry: formData.orgIndustry,
                    website_url: formData.orgWebsite,
                    created_by: user.id,
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    };

    const updateMerchantProfile = async (formData: OnboardingFormData, organizationId: string) => {
        if (!user) return;

        const { error: merchantError } = await supabase
            .from('merchants')
            .update({
                name: `${formData.firstName} ${formData.lastName}`,
                phone_number: `${formData.countryCode}${formData.phoneNumber}`,
                country: formData.country,
                onboarded: true,
            })
            .eq('merchant_id', user.id);

        if (merchantError) throw merchantError;

        const { error: linkError } = await supabase
            .from('merchant_organization_links')
            .insert([
                {
                    merchant_id: user.id,
                    organization_id: organizationId,
                    role: 'admin',
                }
            ]);

        if (linkError) throw linkError;
    };

    const onSubmit = async () => {
        try {
            const isValid = await onboardingForm.trigger();
            if (!isValid) return;

            setLoading(true);
            const formData = onboardingForm.getValues();

            const organization = await createOrganization(formData);
            if (organization) {
                await updateMerchantProfile(formData, organization.organization_id);
            }
            toast({
                title: "Onboarding Complete",
                description: "Your account has been set up successfully.",
            });
            navigate('/portal');
        } catch (error) {
            console.error('Error completing onboarding:', error);
            toast({
                title: "Error",
                description: "There was a problem completing your onboarding. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={cn('container grid h-svh flex-col items-center justify-center bg-background lg:max-w-none lg:px-0', 'dark:bg-gray-900')}>
                <Card className={cn('p-6', 'dark:bg-gray-800')}>
                    <h1 className='text-2xl font-semibold tracking-tight'>Loading...</h1>
                    <p>Please wait while we set up your account.</p>
                </Card>
            </div>
        );
    }

    if (!isEmailVerified) {
        return (
            <div className={cn('container grid h-svh flex-col items-center justify-center bg-background lg:max-w-none lg:px-0', 'dark:bg-gray-900')}>
                <Card className={cn('p-6', 'dark:bg-gray-800')}>
                    <h1 className='text-2xl font-semibold tracking-tight'>Email Verification Required</h1>
                    <p>Please verify your email to continue with onboarding.</p>
                    <Button onClick={handleResendVerification} className="mt-4 dark:bg-primary-600 dark:hover:bg-primary-700">Resend Verification Email</Button>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={cn('container grid h-svh flex-col items-center justify-center bg-background lg:max-w-none lg:px-0', 'dark:bg-gray-900')}>
                <Card className={cn('p-6', 'dark:bg-gray-800')}>
                    <h1 className='text-2xl font-semibold tracking-tight'>Authentication Required</h1>
                    <p>Please sign in to complete your onboarding.</p>
                    <Button onClick={() => navigate('/sign-in')} className="mt-4 dark:bg-primary-600 dark:hover:bg-primary-700">Sign In</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className={cn('container grid h-svh flex-col items-center justify-center bg-background lg:max-w-none lg:px-0', 'dark:bg-gray-900')}>
            <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[800px] lg:p-8'>
                <Card className={cn('p-6', 'dark:bg-gray-800')}>
                    <h1 className='text-2xl font-semibold tracking-tight mb-6'>Complete Your Profile</h1>
                    <FormProvider {...onboardingForm}>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-6">
                                <div className="flex space-x-2">
                                    <div className="w-1/3">
                                        <Label htmlFor="countryCode" className="mb-1">Country Code<span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Input
                                                id="countryCode"
                                                type="text"
                                                placeholder="Search country code"
                                                value={countryCodeSearch}
                                                onChange={(e) => {
                                                    setCountryCodeSearch(e.target.value);
                                                    setIsCountryCodeDropdownOpen(true);
                                                }}
                                                onFocus={() => setIsCountryCodeDropdownOpen(true)}
                                                onBlur={() => setTimeout(() => setIsCountryCodeDropdownOpen(false), 200)}
                                                className={cn(
                                                    "w-full",
                                                    "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                )}
                                            />
                                            {isCountryCodeDropdownOpen && filteredCountryCodes.length > 0 && (
                                                <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-60 overflow-auto">
                                                    {filteredCountryCodes.map((code: string) => (
                                                        <li
                                                            key={code}
                                                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            onClick={() => {
                                                                setCountryCodeSearch(code);
                                                                onboardingForm.setValue("countryCode", code);
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
                                        <Label htmlFor="phoneNumber" className="mb-1">Phone Number<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="phoneNumber"
                                            placeholder="01 60 223 401"
                                            {...onboardingForm.register("phoneNumber")}
                                            className={cn(
                                                "w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        />
                                        {onboardingForm.formState.errors.phoneNumber && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.phoneNumber.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex space-x-2">
                                    <div className="flex-1">
                                        <Label htmlFor="country" className="mb-1">Country<span className="text-red-500">*</span></Label>
                                        <select
                                            id="country"
                                            {...onboardingForm.register("country")}
                                            className={cn(
                                                "p-2 border rounded-md w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                                    <div className="flex-1">
                                        <Label htmlFor="role" className="mb-1">Your Role<span className="text-red-500">*</span></Label>
                                        <select
                                            id="role"
                                            {...onboardingForm.register("role")}
                                            className={cn(
                                                "p-2 border rounded-md w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        >
                                            {roles.map((role) => (
                                                <option key={role} value={role}>
                                                    {role}
                                                </option>
                                            ))}
                                        </select>
                                        {onboardingForm.formState.errors.role && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.role.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex space-x-2">
                                    <div className="flex-1">
                                        <Label htmlFor="orgName" className="mb-1">Company Name<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="orgName"
                                            placeholder="e.g., Ashanti Shoes Inc."
                                            {...onboardingForm.register("orgName")}
                                            className={cn(
                                                "w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        />
                                        {onboardingForm.formState.errors.orgName && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgName.message}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="orgCountry" className="mb-1">Country<span className="text-red-500">*</span></Label>
                                        <select
                                            id="orgCountry"
                                            {...onboardingForm.register("orgCountry")}
                                            className={cn(
                                                "p-2 border rounded-md w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        >
                                            {countries.map((country) => (
                                                <option key={country} value={country}>
                                                    {country}
                                                </option>
                                            ))}
                                        </select>
                                        {onboardingForm.formState.errors.orgCountry && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgCountry.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex space-x-2">
                                    <div className="flex-1">
                                        <Label htmlFor="orgCity" className="mb-1">City<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="orgCity"
                                            placeholder="e.g., Kumasi"
                                            {...onboardingForm.register("orgCity")}
                                            className={cn(
                                                "w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        />
                                        {onboardingForm.formState.errors.orgCity && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgCity.message}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="orgAddress" className="mb-1">Address<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="orgAddress"
                                            placeholder="e.g., 123 Main St"
                                            {...onboardingForm.register("orgAddress")}
                                            className={cn(
                                                "w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        />
                                        {onboardingForm.formState.errors.orgAddress && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgAddress.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex space-x-2">
                                    <div className="flex-1">
                                        <Label htmlFor="orgPostalCode" className="mb-1">Postal Code<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="orgPostalCode"
                                            placeholder="e.g., 12345"
                                            {...onboardingForm.register("orgPostalCode")}
                                            className={cn(
                                                "w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        />
                                        {onboardingForm.formState.errors.orgPostalCode && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgPostalCode.message}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="orgIndustry" className="mb-1">Industry<span className="text-red-500">*</span></Label>
                                        <select
                                            id="orgIndustry"
                                            {...onboardingForm.register("orgIndustry")}
                                            className={cn(
                                                "p-2 border rounded-md w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        >
                                            {industries.map((industry) => (
                                                <option key={industry} value={industry}>
                                                    {industry}
                                                </option>
                                            ))}
                                        </select>
                                        {onboardingForm.formState.errors.orgIndustry && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgIndustry.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex space-x-2">
                                    <div className="flex-1">
                                        <Label htmlFor="orgWebsite" className="mb-1">Website</Label>
                                        <Input
                                            id="orgWebsite"
                                            placeholder="e.g., example.com"
                                            {...onboardingForm.register("orgWebsite", {
                                                setValueAs: (value) => {
                                                    if (!value) return '';
                                                    const url = value.toLowerCase();
                                                    if (url.startsWith('http://') || url.startsWith('https://')) {
                                                        return url;
                                                    } else {
                                                        return `https://${url.startsWith('www.') ? url : `www.${url}`}`;
                                                    }
                                                },
                                            })}
                                            className={cn(
                                                "w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        />
                                        {onboardingForm.formState.errors.orgWebsite && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgWebsite.message}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="orgEmployees" className="mb-1">Number of Employees<span className="text-red-500">*</span></Label>
                                        <select
                                            id="orgEmployees"
                                            {...onboardingForm.register("orgEmployees")}
                                            className={cn(
                                                "p-2 border rounded-md w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        >
                                            {employeeRanges.map((range) => (
                                                <option key={range} value={range}>
                                                    {range}
                                                </option>
                                            ))}
                                        </select>
                                        {onboardingForm.formState.errors.orgEmployees && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgEmployees.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={onSubmit}
                                className="mt-6 dark:bg-primary-600 dark:hover:bg-primary-700"
                            >
                                Finish
                            </Button>
                        </form>
                    </FormProvider>
                </Card>
            </div>
        </div>
    );
};

export default Onboarding;