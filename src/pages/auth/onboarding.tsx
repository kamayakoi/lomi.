import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/utils/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Briefcase, Phone } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { countryCodes, countries, roles, employeeRanges, industries } from '@/data/onboarding';

const phoneRegex = /^\d{1,14}$/;

const userFormSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    countryCode: z.string().min(1, 'Country code is required'),
    phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number format'),
    country: z.string().min(1, 'Country is required'),
    role: z.string().min(1, 'Role is required'),
});

const organizationFormSchema = z.object({
    orgName: z.string().min(1, 'Organization name is required'),
    orgCountry: z.string().min(1, 'Organization country is required'),
    orgCity: z.string().min(1, 'City is required'),
    orgAddress: z.string().min(1, 'Address is required'),
    orgPostalCode: z.string().min(1, 'Postal code is required'),
    orgIndustry: z.string().min(1, 'Industry is required'),
    orgWebsite: z.string().url('Invalid website URL').optional().or(z.literal('')),
    orgEmployees: z.string().min(1, 'Number of employees is required'),
});

type UserFormData = z.infer<typeof userFormSchema>;
type OrganizationFormData = z.infer<typeof organizationFormSchema>;

const Onboarding: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const userForm = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        mode: 'onChange',
        defaultValues: {
            countryCode: '+225',
        }
    });

    const organizationForm = useForm<OrganizationFormData>({
        resolver: zodResolver(organizationFormSchema),
        mode: 'onChange',
    });

    const steps = [
        { title: "Contact Info", icon: Phone, fields: ["phoneNumber", "country", "role"] },
        { title: "Organization Info", icon: Briefcase, fields: ["orgName", "orgCountry", "orgCity", "orgAddress", "orgPostalCode", "orgIndustry", "orgWebsite", "orgEmployees"] },
    ];

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
                    .from('users')
                    .select('onboarded')
                    .eq('user_id', session.user.id)
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

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                left: currentStep * scrollContainerRef.current.offsetWidth,
                behavior: "smooth",
            });
        }
    }, [currentStep]);

    const handleNext = async () => {
        if (currentStep === 0) {
            const isValid = await userForm.trigger();
            if (isValid) {
                setCurrentStep(1);
            }
        } else {
            await onSubmit();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

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

    const createOrganization = async (formData: OrganizationFormData) => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('organizations')
            .insert([
                {
                    name: formData.orgName,
                    email: user.email,
                    phone_number: `${userForm.getValues('countryCode')}${userForm.getValues('phoneNumber')}`,
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

    const updateUserProfile = async (formData: UserFormData, organizationId: string) => {
        if (!user) return;

        const { error: userError } = await supabase
            .from('users')
            .update({
                name: `${formData.firstName} ${formData.lastName}`,
                phone_number: `${formData.countryCode}${formData.phoneNumber}`,
                country: formData.country,
                onboarded: true,
            })
            .eq('user_id', user.id);

        if (userError) throw userError;

        const { error: linkError } = await supabase
            .from('user_organization_links')
            .insert([
                {
                    user_id: user.id,
                    organization_id: organizationId,
                    role: 'admin',
                }
            ]);

        if (linkError) throw linkError;
    };

    const onSubmit = async () => {
        try {
            const isValid = await organizationForm.trigger();
            if (!isValid) return;

            setLoading(true);
            const userFormData = userForm.getValues();
            const organizationFormData = organizationForm.getValues();

            const organization = await createOrganization(organizationFormData);
            if (organization) {
                await updateUserProfile(userFormData, organization.organization_id);
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
                    <h1 className='text-2xl font-semibold tracking-tight'>Complete Your Profile</h1>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">Onboarding</h2>
                        <div className="flex justify-center space-x-4">
                            {steps.map((step, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${index <= currentStep ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-400"
                                            } transition-all duration-300 ease-in-out`}
                                    >
                                        <step.icon className="w-5 h-5" />
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`h-1 w-24 ${index < currentStep ? "bg-primary" : "bg-gray-200"
                                                } transition-all duration-300 ease-in-out mt-2`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-hidden w-full"
                        style={{ scrollSnapType: "x mandatory" }}
                    >
                        <div className="w-full flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
                            <h3 className="text-xl font-semibold mb-4">{steps[0].title}</h3>
                            <FormProvider {...userForm}>
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <div className="flex space-x-2">
                                        <div className="w-1/3">
                                            <Label htmlFor="countryCode">Country Code*</Label>
                                            <select
                                                id="countryCode"
                                                className={cn(
                                                    "p-2 border rounded-md w-full",
                                                    "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                )}
                                                {...userForm.register("countryCode")}
                                            >
                                                {countryCodes.map((code) => (
                                                    <option key={code} value={code}>
                                                        {code}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="phoneNumber">Phone Number*</Label>
                                            <Input
                                                id="phoneNumber"
                                                placeholder="01 60 223 401"
                                                {...userForm.register("phoneNumber")}
                                                className={cn(
                                                    "w-full",
                                                    "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                )}
                                            />
                                            {userForm.formState.errors.phoneNumber && <p className="text-red-500 text-sm">{userForm.formState.errors.phoneNumber.message}</p>}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className="flex-1">
                                            <Label htmlFor="country">Country*</Label>
                                            <select
                                                id="country"
                                                {...userForm.register("country")}
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
                                            {userForm.formState.errors.country && <p className="text-red-500 text-sm">{userForm.formState.errors.country.message}</p>}
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="role">Your Role*</Label>
                                            <select
                                                id="role"
                                                {...userForm.register("role")}
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
                                            {userForm.formState.errors.role && <p className="text-red-500 text-sm">{userForm.formState.errors.role.message}</p>}
                                        </div>
                                    </div>
                                </form>
                            </FormProvider>
                        </div>
                        <div className="w-full flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
                            <h3 className="text-xl font-semibold mb-4">{steps[1].title}</h3>
                            <FormProvider {...organizationForm}>
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <div className="flex space-x-2">
                                        <div className="flex-1">
                                            <Label htmlFor="orgName">Company Name*</Label>
                                            <Input
                                                id="orgName"
                                                placeholder="e.g., Ashanti Shoes Inc."
                                                {...organizationForm.register("orgName")}
                                                className={cn(
                                                    "w-full",
                                                    "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                )}
                                            />
                                            {organizationForm.formState.errors.orgName && <p className="text-red-500 text-sm">{organizationForm.formState.errors.orgName.message}</p>}
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="orgCountry">Country*</Label>
                                            <select
                                                id="orgCountry"
                                                {...organizationForm.register("orgCountry")}
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
                                            {organizationForm.formState.errors.orgCountry && <p className="text-red-500 text-sm">{organizationForm.formState.errors.orgCountry.message}</p>}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className="flex-1">
                                            <Label htmlFor="orgCity">City*</Label>
                                            <Input
                                                id="orgCity"
                                                placeholder="e.g., Kumasi"
                                                {...organizationForm.register("orgCity")}
                                                className={cn(
                                                    "w-full",
                                                    "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                )}
                                            />
                                            {organizationForm.formState.errors.orgCity && <p className="text-red-500 text-sm">{organizationForm.formState.errors.orgCity.message}</p>}
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="orgAddress">Address*</Label>
                                            <Input
                                                id="orgAddress"
                                                placeholder="e.g., 123 Main St"
                                                {...organizationForm.register("orgAddress")}
                                                className={cn(
                                                    "w-full",
                                                    "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                )}
                                            />
                                            {organizationForm.formState.errors.orgAddress && <p className="text-red-500 text-sm">{organizationForm.formState.errors.orgAddress.message}</p>}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className="flex-1">
                                            <Label htmlFor="orgPostalCode">Postal Code*</Label>
                                            <Input
                                                id="orgPostalCode"
                                                placeholder="e.g., 12345"
                                                {...organizationForm.register("orgPostalCode")}
                                                className={cn(
                                                    "w-full",
                                                    "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                )}
                                            />
                                            {organizationForm.formState.errors.orgPostalCode && <p className="text-red-500 text-sm">{organizationForm.formState.errors.orgPostalCode.message}</p>}
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="orgIndustry">Industry*</Label>
                                            <select
                                                id="orgIndustry"
                                                {...organizationForm.register("orgIndustry")}
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
                                            {organizationForm.formState.errors.orgIndustry && <p className="text-red-500 text-sm">{organizationForm.formState.errors.orgIndustry.message}</p>}
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className="flex-1">
                                            <Label htmlFor="orgWebsite">Website</Label>
                                            <Input
                                                id="orgWebsite"
                                                placeholder="e.g., www.example.com"
                                                {...organizationForm.register("orgWebsite")}
                                                className={cn(
                                                    "w-full",
                                                    "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                )}
                                            />
                                            {organizationForm.formState.errors.orgWebsite && <p className="text-red-500 text-sm">{organizationForm.formState.errors.orgWebsite.message}</p>}
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="orgEmployees">Number of Employees*</Label>
                                            <select
                                                id="orgEmployees"
                                                {...organizationForm.register("orgEmployees")}
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
                                            {organizationForm.formState.errors.orgEmployees && <p className="text-red-500 text-sm">{organizationForm.formState.errors.orgEmployees.message}</p>}
                                        </div>
                                    </div>
                                </form>
                            </FormProvider>
                        </div>
                    </div>
                    <div className="flex justify-between mt-6">
                        <Button
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            variant="outline"
                            className="dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                        </Button>
                        <Button onClick={handleNext} className="dark:bg-primary-600 dark:hover:bg-primary-700">
                            {currentStep === steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Onboarding;