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
import { countryCodes, countries, employeeRanges, industries, organizationPositions, languages } from '@/data/onboarding';
// import { config } from '@/utils/config';

const phoneRegex = /^(\+\d{1,3}[- ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

const onboardingFormSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    countryCode: z.string().regex(/^\+\d+$/, 'Invalid country code format'),
    phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number format'),
    country: z.string().min(1, 'Country is required'),
    role: z.string().min(1, 'Role is required'),
    orgName: z.string().min(1, 'Organization name is required'),
    orgEmail: z.string().email('Invalid email format'),
    orgCountry: z.string().min(1, 'Organization country is required'),
    orgRegion: z.string().min(1, 'Region is required'),
    orgCity: z.string().min(1, 'City is required'),
    orgAddress: z.string().min(1, 'Address is required'),
    orgPostalCode: z.string().min(1, 'Postal code is required'),
    orgIndustry: z.string().min(1, 'Industry is required'),
    orgWebsite: z.string().url('Invalid website URL').optional().or(z.literal('')),
    orgEmployees: z.string().min(1, 'Number of employees is required'),
    orgDefaultLanguage: z.string().min(1, 'Default language is required')
});

type OnboardingFormData = z.infer<typeof onboardingFormSchema>;

const NewOnboarding: React.FC = () => {
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
            orgDefaultLanguage: 'English'
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
                    // navigate(config.isPortal ? '/' : '/portal');
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

    const onSubmit = async () => {
        try {
            const isValid = await onboardingForm.trigger();
            if (!isValid) return;

            setLoading(true);
            const formData = onboardingForm.getValues();

            if (!user) {
                throw new Error("User not found");
            }

            // Prepend "https://" to the website URL if not present
            const websiteUrl = formData.orgWebsite ? (formData.orgWebsite.startsWith('http') ? formData.orgWebsite : `https://${formData.orgWebsite}`) : '';

            // Call the complete_onboarding function
            const { error } = await supabase.rpc('complete_onboarding', {
                p_merchant_id: user.id,
                p_phone_number: `${formData.countryCode}${formData.phoneNumber}`,
                p_country: formData.country,
                p_org_name: formData.orgName,
                p_org_email: formData.orgEmail,
                p_org_phone_number: `${formData.countryCode}${formData.phoneNumber}`,
                p_org_country: formData.orgCountry,
                p_org_region: formData.orgRegion,
                p_org_city: formData.orgCity,
                p_org_address: formData.orgAddress,
                p_org_postal_code: formData.orgPostalCode,
                p_org_industry: formData.orgIndustry,
                p_org_website_url: websiteUrl,
                p_org_employee_number: formData.orgEmployees,
                p_org_default_language: formData.orgDefaultLanguage
            });

            if (error) {
                throw error;
            }

            // Update the local session to reflect the onboarded status
            await supabase.auth.refreshSession();

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
            <div className='mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[800px] lg:p-12'>
                <Card className={cn('p-6', 'dark:bg-gray-800')}>
                    <h1 className='text-2xl font-semibold tracking-tight mb-6'>Complete your profile</h1>
                    <FormProvider {...onboardingForm}>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-6">
                                <div className="flex space-x-2">
                                    <div className="w-1/2">
                                        <Label htmlFor="firstName" className="mb-1">First name<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="firstName"
                                            placeholder="Jessy"
                                            {...onboardingForm.register("firstName")}
                                            className={cn(
                                                "w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        />
                                        {onboardingForm.formState.errors.firstName && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.firstName.message}</p>}
                                    </div>
                                    <div className="w-1/2">
                                        <Label htmlFor="lastName" className="mb-1">Last name<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="lastName"
                                            placeholder="Luckey"
                                            {...onboardingForm.register("lastName")}
                                            className={cn(
                                                "w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
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
                                        <Label htmlFor="countryCode" className="mb-1">Country ode<span className="text-red-500">*</span></Label>
                                        <div className="relative">
                                            <Input
                                                id="countryCode"
                                                type="text"
                                                placeholder="+225"
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
                                            {onboardingForm.formState.errors.countryCode && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.countryCode.message}</p>}
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
                                        <Label htmlFor="phoneNumber" className="mb-1">Phone number<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="phoneNumber"
                                            placeholder="0160223401"
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
                                        <Label htmlFor="role" className="mb-1">Your role<span className="text-red-500">*</span></Label>
                                        <select
                                            id="role"
                                            {...onboardingForm.register("role")}
                                            className={cn(
                                                "p-2 border rounded-md w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        >
                                            {organizationPositions.map((orgRole) => (
                                                <option key={orgRole} value={orgRole}>
                                                    {orgRole}
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
                                        <Label htmlFor="orgName" className="mb-1">Company name<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="orgName"
                                            placeholder="Ashanti Shoes Inc."
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
                                        <Label htmlFor="orgEmail" className="mb-1">Company email<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="orgEmail"
                                            placeholder="jessy@example.com"
                                            {...onboardingForm.register("orgEmail")}
                                            className={cn(
                                                "w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        />
                                        {onboardingForm.formState.errors.orgEmail && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgEmail.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex space-x-2">
                                    <div className="flex-1">
                                        <Label htmlFor="orgCountry" className="mb-1">Company HQ<span className="text-red-500">*</span></Label>
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
                                    <div className="flex-1">
                                        <Label htmlFor="orgRegion" className="mb-1">Region<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="orgRegion"
                                            placeholder="Lagunes"
                                            {...onboardingForm.register("orgRegion")}
                                            className={cn(
                                                "w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        />
                                        {onboardingForm.formState.errors.orgRegion && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgRegion.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex space-x-2">
                                    <div className="flex-1">
                                        <Label htmlFor="orgCity" className="mb-1">City<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="orgCity"
                                            placeholder="Abidjan"
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
                                            placeholder="123 Rue des Jardins"
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
                                        <Label htmlFor="orgPostalCode" className="mb-1">Postal code<span className="text-red-500">*</span></Label>
                                        <Input
                                            id="orgPostalCode"
                                            placeholder="01015"
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
                                            placeholder="https://www.ashantishoes.com"
                                            {...onboardingForm.register("orgWebsite")}
                                            className={cn(
                                                "w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        />
                                        {onboardingForm.formState.errors.orgWebsite && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgWebsite.message}</p>}
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="orgEmployees" className="mb-1">Number of employees<span className="text-red-500">*</span></Label>
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
                                    <div className="flex-1">
                                        <Label htmlFor="orgDefaultLanguage" className="mb-1">Preferred language<span className="text-red-500">*</span></Label>
                                        <select
                                            id="orgDefaultLanguage"
                                            {...onboardingForm.register("orgDefaultLanguage")}
                                            className={cn(
                                                "p-2 border rounded-md w-full",
                                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            )}
                                        >
                                            {languages.map((language) => (
                                                <option key={language} value={language}>
                                                    {language}
                                                </option>
                                            ))}
                                        </select>
                                        {onboardingForm.formState.errors.orgDefaultLanguage && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgDefaultLanguage.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading} onClick={onSubmit}>
                                {loading ? 'Submitting...' : 'Complete Onboarding'}
                            </Button>
                        </form>
                    </FormProvider>
                </Card>
            </div>
        </div>
    );
};

export default NewOnboarding;