import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/utils/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ChevronLeft, ChevronRight, Briefcase, Globe, Phone } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { User as SupabaseUser } from '@supabase/supabase-js';

const countryCodes = [
    { code: '+1', name: 'United States' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+233', name: 'Ghana' },
    { code: '+234', name: 'Nigeria' },
    // Add more country codes as needed
];

const countries = [
    'United States', 'United Kingdom', 'Ghana', 'Nigeria',
    // Add more countries as needed
];

const Onboarding: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState(countryCodes[0].code);
    const [formData, setFormData] = useState({
        phoneNumber: '',
        country: '',
        accountType: 'personal',
        preferences: '',
        orgName: '',
        orgCountry: '',
    });
    const [currentStep, setCurrentStep] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const steps = [
        { title: "Contact Info", icon: Phone, fields: ["phoneNumber", "country"] },
        { title: "Account Type", icon: Briefcase, fields: ["accountType"] },
        { title: "Preferences", icon: Globe, fields: ["preferences"] },
        { title: "Organization Info", icon: Briefcase, fields: ["orgName", "orgCountry"] },
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
                    .select('onboarded, phone_number')
                    .eq('user_id', session.user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching user profile:', profileError);
                    setLoading(false);
                    return;
                }

                if (profile) {
                    if (profile.onboarded) {
                        navigate('/portal');
                    } else {
                        setPhoneNumber(profile.phone_number || '');
                        setLoading(false);
                    }
                } else {
                    console.error('User profile not found');
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
    };

    const handleRadioChange = (value: string) => {
        setFormData((prevData) => ({ ...prevData, accountType: value }));
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

    const handleOnboardingComplete = async () => {
        try {
            if (!user) throw new Error('No user found');

            const { error: profileError } = await supabase
                .from('users')
                .update({
                    onboarded: true,
                    phone_number: `${countryCode} ${phoneNumber}`,
                    verified: true, // Assuming email verification is complete at this point
                    ...formData,
                })
                .eq('user_id', user.id);

            if (profileError) throw profileError;

            toast({
                title: "Onboarding Complete",
                description: "Your account has been set up successfully.",
            });
            navigate('/portal');
        } catch (error) {
            console.error('Error updating user:', error);
            toast({
                title: "Error",
                description: "There was a problem completing your onboarding. Please try again.",
                variant: "destructive",
            });
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
            <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
                <Card className='p-6'>
                    <h1 className='text-2xl font-semibold tracking-tight'>Complete Your Profile</h1>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">Onboarding</h2>
                        <div className="flex justify-between">
                            {steps.map((step, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${index <= currentStep ? "bg-primary text-primary-foreground" : "bg-gray-200 text-gray-400"
                                            } transition-all duration-300 ease-in-out`}
                                    >
                                        <step.icon className="w-5 h-5" />
                                    </div>
                                    <div
                                        className={`h-1 w-24 ${index < steps.length - 1 ? "block" : "hidden"} ${index < currentStep ? "bg-primary" : "bg-gray-200"
                                            } transition-all duration-300 ease-in-out mt-2`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
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
                                <form className="space-y-4">
                                    {step.fields.includes("phoneNumber") && (
                                        <div>
                                            <Label htmlFor="phoneNumber">Phone Number</Label>
                                            <div className="flex space-x-2">
                                                <select
                                                    id="countryCode"
                                                    value={countryCode}
                                                    onChange={(e) => setCountryCode(e.target.value)}
                                                    className="p-2 border rounded-md"
                                                >
                                                    {countryCodes.map((code) => (
                                                        <option key={code.code} value={code.code}>
                                                            {code.name} ({code.code})
                                                        </option>
                                                    ))}
                                                </select>
                                                <Input
                                                    id="phoneNumber"
                                                    placeholder="Enter your phone number"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {step.fields.includes("country") && (
                                        <div>
                                            <Label htmlFor="country">Country</Label>
                                            <select
                                                id="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                className="p-2 border rounded-md w-full"
                                            >
                                                {countries.map((country) => (
                                                    <option key={country} value={country}>
                                                        {country}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    {step.fields.includes("accountType") && (
                                        <div>
                                            <Label>Account Type</Label>
                                            <RadioGroup value={formData.accountType} onValueChange={handleRadioChange}>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="personal" id="personal" />
                                                    <Label htmlFor="personal">Personal</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="business" id="business" />
                                                    <Label htmlFor="business">Business</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    )}
                                    {step.fields.includes("preferences") && (
                                        <div>
                                            <Label htmlFor="preferences">Preferences</Label>
                                            <Input id="preferences" placeholder="Enter your preferences" value={formData.preferences} onChange={handleChange} />
                                        </div>
                                    )}
                                    {step.fields.includes("orgName") && (
                                        <div>
                                            <Label htmlFor="orgName">Organization Name</Label>
                                            <Input id="orgName" placeholder="Enter your organization name" value={formData.orgName} onChange={handleChange} />
                                        </div>
                                    )}
                                    {step.fields.includes("orgCountry") && (
                                        <div>
                                            <Label htmlFor="orgCountry">Organization Country</Label>
                                            <select
                                                id="orgCountry"
                                                value={formData.orgCountry}
                                                onChange={handleChange}
                                                className="p-2 border rounded-md w-full"
                                            >
                                                {countries.map((country) => (
                                                    <option key={country} value={country}>
                                                        {country}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </form>
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
                            <Button onClick={handleOnboardingComplete}>
                                Finish <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button onClick={handleNext}>
                                Next <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Onboarding;