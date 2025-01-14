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
import OnboardingStep4 from './onboarding-step-4';
import { Button } from '@/components/ui/button';
import LoadingButton from '@/components/portal/loader';
import WelcomeScreen from './welcome-screen';
import { useTranslation } from 'react-i18next';

// Import types from each step
import type { OnboardingStep1Data } from './onboarding-step-1';
import type { OnboardingStep2Data } from './onboarding-step-2';
import type { OnboardingStep3Data } from './onboarding-step-3';
import type { OnboardingStep4Data } from './onboarding-step-4';

type StepData = OnboardingStep1Data | OnboardingStep2Data | OnboardingStep3Data | OnboardingStep4Data;

type StepProps = {
    onNext?: (data: StepData) => void;
    onSubmit?: (data: StepData) => void;
    onPrevious?: () => void;
    initialData?: OnboardingData;
    data?: OnboardingData;
};

const steps = [
    { title: 'onboarding.steps.step1', component: OnboardingStep1 as React.ComponentType<StepProps> },
    { title: 'onboarding.steps.step2', component: OnboardingStep2 as React.ComponentType<StepProps> },
    { title: 'onboarding.steps.step3', component: OnboardingStep3 as React.ComponentType<StepProps> },
    { title: 'onboarding.steps.step4', component: OnboardingStep4 as React.ComponentType<StepProps> },
] as const;

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
    const { t } = useTranslation();
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

                // Extract name from user metadata if available
                const userMetadata = session.user.user_metadata;
                if (userMetadata) {
                    let firstName = '';
                    let lastName = '';

                    // Handle different OAuth providers
                    if (userMetadata['full_name']) {
                        // Split full name into first and last name
                        const nameParts = userMetadata['full_name'].split(' ');
                        firstName = nameParts[0] || '';
                        lastName = nameParts.slice(1).join(' ') || '';
                    } else if (userMetadata['name']) {
                        // Some providers use 'name' instead of 'full_name'
                        const nameParts = userMetadata['name'].split(' ');
                        firstName = nameParts[0] || '';
                        lastName = nameParts.slice(1).join(' ') || '';
                    } else {
                        // Try to get first_name and last_name directly
                        firstName = userMetadata['first_name'] || userMetadata['given_name'] || '';
                        lastName = userMetadata['last_name'] || userMetadata['family_name'] || '';
                    }

                    // Update onboarding data with the extracted names
                    if (firstName || lastName) {
                        setOnboardingData(prev => ({
                            ...prev,
                            firstName,
                            lastName,
                            orgEmail: session.user.email || ''
                        }));
                    }
                }

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

    const handleNext = (stepData: StepData) => {
        const updatedData = { ...onboardingData, ...stepData };
        setOnboardingData(updatedData);
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = async (stepData: StepData) => {
        const finalData = { ...onboardingData, ...stepData };
        // Handle final submission
        console.log('Final data:', finalData);
    };

    const renderStep = () => {
        const StepComponent = steps[currentStep]?.component;
        if (!StepComponent) return null;

        const commonProps = {
            data: onboardingData,
            initialData: onboardingData,
            onPrevious: handlePrevious,
            onNext: handleNext,
            onSubmit: handleSubmit,
        };

        return <StepComponent {...commonProps} />;
    };

    if (loading) {
        return <LoadingButton />;
    }

    if (!isEmailVerified) {
        return (
            <div className={cn('container grid h-svh flex-col items-center justify-center bg-background lg:max-w-none lg:px-0', 'dark:bg-gray-900')}>
                <Card className={cn('p-6', 'dark:bg-gray-800')}>
                    <h1 className='text-2xl font-semibold tracking-tight'>{t('onboarding.verification.title')}</h1>
                    <p>{t('onboarding.verification.description')}</p>
                    <Button onClick={handleResendVerification} className="mt-4 dark:bg-primary-600 dark:hover:bg-primary-700">
                        {t('onboarding.verification.resend_button')}
                    </Button>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={cn('container grid h-svh flex-col items-center justify-center bg-background lg:max-w-none lg:px-0', 'dark:bg-gray-900')}>
                <Card className={cn('p-6', 'dark:bg-gray-800')}>
                    <h1 className='text-2xl font-semibold tracking-tight'>{t('onboarding.auth.title')}</h1>
                    <p>{t('onboarding.auth.description')}</p>
                    <Button onClick={() => navigate('/sign-in')} className="mt-4 dark:bg-primary-600 dark:hover:bg-primary-700">
                        {t('onboarding.auth.sign_in_button')}
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background dark:bg-background flex items-center justify-center p-4">
            {showWelcome ? (
                <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />
            ) : (
                <Card className="w-full max-w-4xl bg-white dark:bg-background shadow-xl rounded-none border dark:border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            {currentStep >= 0 && currentStep < steps.length && steps[currentStep] ? t(steps[currentStep].title) : ''}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-8">
                            <div className="flex h-2 w-full bg-gray-200 dark:bg-gray-700">
                                {steps.map((_, index) => (
                                    <div key={index} className="flex-1 flex">
                                        <div
                                            className={`flex-1 ${index <= currentStep ? 'bg-blue-500 dark:bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                                } transition-all duration-300 ease-out`}
                                        />
                                        {index < steps.length - 1 && <div className="w-1 bg-white dark:bg-background" />}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2">
                                {steps.map((step) => (
                                    <div
                                        key={step.title}
                                        className={`text-xs ${steps.indexOf(step) <= currentStep
                                            ? 'text-blue-500 dark:text-blue-600 font-bold'
                                            : 'text-gray-400 dark:text-gray-500'
                                            }`}
                                    >
                                        {t(step.title)}
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
