import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/utils/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { cn } from '@/lib/actions/utils'
import OnboardingStep1 from './onboarding-step-1';
import OnboardingStep2 from './onboarding-step-2';
import OnboardingStep3 from './onboarding-step-3';
import OnboardingStep4, { type OnboardingStep4Data } from './onboarding-step-4';
import { Button } from '@/components/ui/button';
import LoadingButton from '@/components/dashboard/loader';

const steps = [
    { title: 'Let\'s get to know you', component: OnboardingStep1 },
    { title: 'Register your company', component: OnboardingStep2 },
    { title: 'Help us customize your experience', component: OnboardingStep3 },
    { title: 'A few more details and you\'re all set!', component: OnboardingStep4 },
];

const initialOnboardingData = {
    firstName: '',
    lastName: '',
    countryCode: '',
    phoneNumber: '',
    country: '',
    position: '',
    orgName: '',
    orgEmail: '',
    orgEmployees: '',
    orgCountry: '',
    orgRegion: '',
    orgCity: '',
    orgDistrict: '',
    orgPostalCode: '',
    orgStreet: '',
    orgWebsite: '',
    orgIndustry: '',
    orgDefaultLanguage: '',
    workspaceHandle: '',
    avatarUrl: '',
    logoUrl: '',
    howDidYouHearAboutUs: '',
};

export type OnboardingData = typeof initialOnboardingData;

const Onboarding: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [onboardingData, setOnboardingData] = useState<OnboardingData>(initialOnboardingData);
    const [showWelcome, setShowWelcome] = useState(true);

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

                const { data: isOnboarded, error: onboardingError } = await supabase
                    .rpc('check_onboarding_status', { p_merchant_id: session.user.id });

                if (onboardingError) {
                    console.error('Error checking onboarding status:', onboardingError);
                    setLoading(false);
                    return;
                }

                if (isOnboarded) {
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

    const onNext = (stepData: Partial<OnboardingData>) => {
        setOnboardingData((prevData) => ({ ...prevData, ...stepData }));
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const onPrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const onSubmit = async (stepData: OnboardingStep4Data) => {
        try {
            setOnboardingData((prevData) => ({ ...prevData, ...stepData }));
            setLoading(true);

            if (!user) {
                throw new Error("User not found");
            }

            const formData = { ...onboardingData, ...stepData };

            // Normalize the website URL
            const websiteUrl = formData.orgWebsite ? formData.orgWebsite.replace(/^(https?:\/\/)?(www\.)?/i, '') : '';

            // Prepend "portal.lomi.africa/" to the workspace handle
            const completeWorkspaceHandle = `portal.lomi.africa/${formData.workspaceHandle}`;

            // Call the complete_onboarding function
            const { error } = await supabase.rpc('complete_onboarding', {
                p_merchant_id: user.id,
                p_phone_number: `${formData.countryCode}${formData.phoneNumber.replace(/\s/g, '')}`,
                p_country: formData.country,
                p_org_name: formData.orgName,
                p_org_email: formData.orgEmail,
                p_org_phone_number: `${formData.countryCode}${formData.phoneNumber.replace(/\s/g, '')}`,
                p_org_country: formData.orgCountry,
                p_org_region: formData.orgRegion,
                p_org_city: formData.orgCity,
                p_org_street: formData.orgStreet,
                p_org_district: formData.orgDistrict,
                p_org_postal_code: formData.orgPostalCode,
                p_org_industry: formData.orgIndustry,
                p_org_website_url: `https://${websiteUrl}`,
                p_org_employee_number: formData.orgEmployees,
                p_preferred_language: formData.orgDefaultLanguage,
                p_workspace_handle: completeWorkspaceHandle,
                p_how_did_you_hear_about_us: formData.howDidYouHearAboutUs,
                p_avatar_url: formData.avatarUrl,
                p_logo_url: formData.logoUrl,
                p_organization_position: formData.position,
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

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <OnboardingStep1 onNext={onNext} data={onboardingData} />;
            case 1:
                return <OnboardingStep2 onNext={onNext} onPrevious={onPrevious} data={onboardingData} />;
            case 2:
                return <OnboardingStep3 onNext={onNext} onPrevious={onPrevious} data={onboardingData} />;
            case 3:
                return <OnboardingStep4 onSubmit={onSubmit} onPrevious={onPrevious} data={onboardingData} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWelcome(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingButton />;
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
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            {showWelcome ? (
                <Card className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            Welcome to lomi. !
                        </CardTitle>
                    </CardHeader>
                </Card>
            ) : (
                <Card className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            {steps[currentStep]?.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-8">
                            <div className="flex h-2 w-full bg-gray-200 dark:bg-gray-700">
                                {steps.map((_, index) => (
                                    <div key={index} className="flex-1 flex">
                                        <div
                                            className={`flex-1 ${index <= currentStep ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                                                } transition-all duration-300 ease-out`}
                                        />
                                        {index < steps.length - 1 && <div className="w-1 bg-white dark:bg-gray-800" />}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2">
                                {steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className={`text-xs ${index <= currentStep
                                            ? 'text-blue-600 dark:text-blue-400 font-bold'
                                            : 'text-gray-400 dark:text-gray-500'
                                            }`}
                                    >
                                        {step.title}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {renderStep()}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Onboarding;