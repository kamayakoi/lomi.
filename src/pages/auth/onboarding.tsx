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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';

const countryCodes = [
    { code: '+225', name: 'Côte d\'Ivoire' },
    { code: '+1', name: 'United States' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+233', name: 'Ghana' },
    { code: '+234', name: 'Nigeria' },
];

const countries = [
    'United States', 'United Kingdom', 'Ghana', 'Nigeria',
];

const roles = [
    'Founder',
    'Entrepreneur',
    'Chief Executive Officer',
    'Chief Technology Officer',
    'Chief Operations Officer',
    'Product Manager',
    'Software Engineer',
    'Marketing/Sales Officer',
    'Other'
];

const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Retail',
    'Manufacturing',
    'Agriculture',
    'Entertainment',
    'Transportation',
    'Other'
];

const employeeRanges = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
];

const phoneRegex = /^\d{1,14}$/;

const formSchema = z.object({
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

type FormData = z.infer<typeof formSchema>;

const Onboarding: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            countryCode: '+225', // Set default country code to +225
        }
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

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
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

    const createOrganization = async (formData: FormData) => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('organizations')
            .insert([
                {
                    name: formData.orgName,
                    email: user.email,
                    phone_number: formData.phoneNumber,
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

    const updateUserProfile = async (formData: FormData, organizationId: string) => {
        if (!user) return;

        const { error } = await supabase
            .from('users')
            .update({
                phone_number: `${formData.countryCode}${formData.phoneNumber}`,
                country: formData.country,
                onboarded: true,
            })
            .eq('user_id', user.id);

        if (error) throw error;

        // Create user-organization link
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

    const onSubmit = async (formData: FormData) => {
        try {
            setLoading(true);
            const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;
            const organization = await createOrganization({
                ...formData,
                phoneNumber: fullPhoneNumber,
            });
            if (organization) {
                await updateUserProfile({
                    ...formData,
                    phoneNumber: fullPhoneNumber,
                }, organization.organization_id);
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
            <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
                <Card className='p-6'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Loading...</h1>
                    <p>Please wait while we set up your account.</p>
                </Card>
            </div>
        );
    }

    if (!isEmailVerified) {
        return (
            <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
                <Card className='p-6'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Email Verification Required</h1>
                    <p>Please verify your email to continue with onboarding.</p>
                    <Button onClick={handleResendVerification} className="mt-4">Resend Verification Email</Button>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
                <Card className='p-6'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Authentication Required</h1>
                    <p>Please sign in to complete your onboarding.</p>
                    <Button onClick={() => navigate('/sign-in')} className="mt-4">Sign In</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[800px] lg:p-8'>
                <Card className='p-6'>
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div
                            ref={scrollContainerRef}
                            className="flex overflow-x-hidden w-full"
                            style={{ scrollSnapType: "x mandatory" }}
                        >
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="w-full flex-shrink-0"
                                    style={{ scrollSnapAlign: "start" }}
                                >
                                    <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                                    <div className="space-y-4">
                                        {step.fields.includes("phoneNumber") && (
                                            <div className="flex space-x-2">
                                                <div className="w-1/3">
                                                    <Label htmlFor="countryCode">Country Code*</Label>
                                                    <select
                                                        id="countryCode"
                                                        className={cn(
                                                            "p-2 border rounded-md w-full",
                                                            "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none"
                                                        )}
                                                        {...register("countryCode")}
                                                    >
                                                        {countryCodes.map((code) => (
                                                            <option key={code.code} value={code.code}>
                                                                {code.code}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex-1">
                                                    <Label htmlFor="phoneNumber">Phone Number*</Label>
                                                    <Input
                                                        id="phoneNumber"
                                                        placeholder="01 60 223 401"
                                                        {...register("phoneNumber")}
                                                        className={cn(
                                                            "w-full",
                                                            "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none"
                                                        )}
                                                    />
                                                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                                                </div>
                                            </div>
                                        )}
                                        {step.fields.includes("country") && (
                                            <div className="flex space-x-2">
                                                <div className="flex-1">
                                                    <Label htmlFor="country">Country*</Label>
                                                    <select
                                                        id="country"
                                                        {...register("country")}
                                                        className={cn(
                                                            "p-2 border rounded-md w-full",
                                                            "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none"
                                                        )}
                                                    >
                                                        {countries.map((country) => (
                                                            <option key={country} value={country}>
                                                                {country}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                                                </div>
                                                <div className="flex-1">
                                                    <Label htmlFor="role">Your Role*</Label>
                                                    <select
                                                        id="role"
                                                        {...register("role")}
                                                        className={cn(
                                                            "p-2 border rounded-md w-full",
                                                            "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none"
                                                        )}
                                                    >
                                                        {roles.map((role) => (
                                                            <option key={role} value={role}>
                                                                {role}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                                                </div>
                                            </div>
                                        )}
                                        {step.fields.includes("orgName") && (
                                            <div className="flex space-x-2">
                                                <div className="flex-1">
                                                    <Label htmlFor="orgName">Company Name*</Label>
                                                    <Input
                                                        id="orgName"
                                                        placeholder="e.g., Ashanti Shoes Inc."
                                                        {...register("orgName")}
                                                        className={cn(
                                                            "w-full",
                                                            "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none"
                                                        )}
                                                    />
                                                    {errors.orgName && <p className="text-red-500 text-sm">{errors.orgName.message}</p>}
                                                </div>
                                                <div className="flex-1">
                                                    <Label htmlFor="orgCountry">Country*</Label>
                                                    <select
                                                        id="orgCountry"
                                                        {...register("orgCountry")}
                                                        className={cn(
                                                            "p-2 border rounded-md w-full",
                                                            "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none"
                                                        )}
                                                    >
                                                        {countries.map((country) => (
                                                            <option key={country} value={country}>
                                                                {country}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.orgCountry && <p className="text-red-500 text-sm">{errors.orgCountry.message}</p>}
                                                </div>
                                            </div>
                                        )}
                                        {step.fields.includes("orgCity") && (
                                            <div className="flex space-x-2">
                                                <div className="flex-1">
                                                    <Label htmlFor="orgCity">City*</Label>
                                                    <Input
                                                        id="orgCity"
                                                        placeholder="e.g., Kumasi"
                                                        {...register("orgCity")}
                                                        className={cn(
                                                            "w-full",
                                                            "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none"
                                                        )}
                                                    />
                                                    {errors.orgCity && <p className="text-red-500 text-sm">{errors.orgCity.message}</p>}
                                                </div>
                                                <div className="flex-1">
                                                    <Label htmlFor="orgAddress">Address*</Label>
                                                    <Input
                                                        id="orgAddress"
                                                        placeholder="e.g., 123 Main St"
                                                        {...register("orgAddress")}
                                                        className={cn(
                                                            "w-full",
                                                            "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none"
                                                        )}
                                                    />
                                                    {errors.orgAddress && <p className="text-red-500 text-sm">{errors.orgAddress.message}</p>}
                                                </div>
                                            </div>
                                        )}
                                        {step.fields.includes("orgPostalCode") && (
                                            <div className="flex space-x-2">
                                                <div className="flex-1">
                                                    <Label htmlFor="orgPostalCode">Postal Code*</Label>
                                                    <Input
                                                        id="orgPostalCode"
                                                        placeholder="e.g., 12345"
                                                        {...register("orgPostalCode")}
                                                        className={cn(
                                                            "w-full",
                                                            "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none"
                                                        )}
                                                    />
                                                    {errors.orgPostalCode && <p className="text-red-500 text-sm">{errors.orgPostalCode.message}</p>}
                                                </div>
                                                <div className="flex-1">
                                                    <Label htmlFor="orgIndustry">Industry*</Label>
                                                    <select
                                                        id="orgIndustry"
                                                        {...register("orgIndustry")}
                                                        className={cn(
                                                            "p-2 border rounded-md w-full",
                                                            "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none"
                                                        )}
                                                    >
                                                        {industries.map((industry) => (
                                                            <option key={industry} value={industry}>
                                                                {industry}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.orgIndustry && <p className="text-red-500 text-sm">{errors.orgIndustry.message}</p>}
                                                </div>
                                            </div>
                                        )}
                                        {step.fields.includes("orgWebsite") && (
                                            <div className="flex space-x-2">
                                                <div className="flex-1">
                                                    <Label htmlFor="orgWebsite">Website</Label>
                                                    <Input
                                                        id="orgWebsite"
                                                        placeholder="e.g., www.example.com"
                                                        {...register("orgWebsite")}
                                                        className={cn(
                                                            "w-full",
                                                            "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none"
                                                        )}
                                                    />
                                                    {errors.orgWebsite && <p className="text-red-500 text-sm">{errors.orgWebsite.message}</p>}
                                                </div>
                                                <div className="flex-1">
                                                    <Label htmlFor="orgEmployees">Number of Employees*</Label>
                                                    <select
                                                        id="orgEmployees"
                                                        {...register("orgEmployees")}
                                                        className={cn(
                                                            "p-2 border rounded-md w-full",
                                                            "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none"
                                                        )}
                                                    >
                                                        {employeeRanges.map((range) => (
                                                            <option key={range} value={range}>
                                                                {range}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.orgEmployees && <p className="text-red-500 text-sm">{errors.orgEmployees.message}</p>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-6">
                            <Button
                                onClick={handlePrevious}
                                disabled={currentStep === 0}
                                variant="outline"
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                            </Button>
                            {currentStep === steps.length - 1 ? (
                                <Button type="submit">
                                    Finish <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button onClick={handleNext}>
                                    Next <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Onboarding;