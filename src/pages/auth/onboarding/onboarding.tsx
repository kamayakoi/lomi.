import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/utils/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/lib/hooks/use-toast';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { cn } from '@/lib/actions/utils'
import OnboardingStep1 from './components/step-1';
import OnboardingStep2 from './components/step-2';
import OnboardingStep3 from './components/step-3';
import OnboardingStep4 from './components/step-4';
import { Button } from '@/components/ui/button';
import LoadingButton from '@/components/portal/loader';
import WelcomeScreen from './components/step-0';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Import types from each step
import type { OnboardingStep1Data } from './components/step-1';
import type { OnboardingStep2Data } from './components/step-2';
import type { OnboardingStep3Data } from './components/step-3';
import type { OnboardingStep4Data } from './components/step-4';

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
    storeHandle: '',
    avatarUrl: '',
    logoUrl: '',
    howDidYouHearAboutUs: '',
};

export type OnboardingData = {
    firstName: string;
    lastName: string;
    countryCode: string;
    phoneNumber: string;
    country: string;
    position: string;
    orgName: string;
    orgEmail: string;
    orgEmployees: string;
    orgCountry: string;
    orgRegion: string;
    orgCity: string;
    orgDistrict: string;
    orgPostalCode: string;
    orgStreet: string;
    orgWebsite: string;
    orgIndustry: string;
    orgDefaultLanguage: string;
    storeHandle: string;
    avatarUrl: string;
    logoUrl: string;
    howDidYouHearAboutUs: string;
};

type StepData = OnboardingStep1Data | OnboardingStep2Data | OnboardingStep3Data | OnboardingStep4Data;

type StepProps = {
    onNext?: (data: StepData) => void;
    onSubmit?: (data: StepData) => void;
    onPrevious?: () => void;
    initialData?: OnboardingData;
    data?: OnboardingData;
    onAvatarUpdate?: (avatarUrl: string) => void;
    onLogoUpdate?: (logoUrl: string) => void;
};

const steps = [
    { title: 'onboarding.steps.step1', component: OnboardingStep1 as React.ComponentType<StepProps> },
    { title: 'onboarding.steps.step2', component: OnboardingStep2 as React.ComponentType<StepProps> },
    { title: 'onboarding.steps.step3', component: OnboardingStep3 as React.ComponentType<StepProps> },
    { title: 'onboarding.steps.step4', component: OnboardingStep4 as React.ComponentType<StepProps> },
] as const;

const Onboarding: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [onboardingData, setOnboardingData] = useState<OnboardingData>(initialOnboardingData);
    const [showWelcome, setShowWelcome] = useState(true);
    const [languageInitialized, setLanguageInitialized] = useState(false);

    // Initialize language from localStorage
    useEffect(() => {
        const initializeLanguage = async () => {
            const savedLanguage = localStorage.getItem('language');
            if (savedLanguage && i18n.language !== savedLanguage) {
                await i18n.changeLanguage(savedLanguage);
            }
            setLanguageInitialized(true);
        };
        initializeLanguage();
    }, [i18n]);

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

    const handleAvatarUpdate = (avatarUrl: string) => {
        setOnboardingData(prev => ({
            ...prev,
            avatarUrl: avatarUrl // Store the full URL
        }));
    };

    const handleLogoUpdate = (logoUrl: string) => {
        setOnboardingData(prev => ({
            ...prev,
            logoUrl: logoUrl // Store the full URL
        }));
    };

    const handleNext = (stepData: StepData) => {
        const updatedData = {
            ...onboardingData,
            ...stepData,
            // Ensure we keep the existing URLs if not provided in the current step
            avatarUrl: ('avatarUrl' in stepData && stepData.avatarUrl) || onboardingData.avatarUrl,
            logoUrl: ('logoUrl' in stepData && stepData.logoUrl) || onboardingData.logoUrl
        };
        setOnboardingData(updatedData);
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = async (stepData: StepData) => {
        try {
            setOnboardingData((prevData) => ({ ...prevData, ...stepData }));
            setLoading(true);

            if (!user) {
                throw new Error("User not found");
            }

            const formData = { ...onboardingData, ...stepData };

            // Normalize the website URL
            const websiteUrl = formData.orgWebsite ? formData.orgWebsite.replace(/^(https?:\/\/)?(www\.)?/i, '') : '';

            // Prepend "store.lomi.africa/" to the store handle
            const completeStoreHandle = `store.lomi.africa/${formData.storeHandle}`;

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
                p_store_handle: completeStoreHandle,
                p_how_did_you_hear_about_us: formData.howDidYouHearAboutUs,
                p_avatar_url: formData.avatarUrl || '',
                p_logo_url: formData.logoUrl || '',
                p_organization_position: formData.position,
            });

            if (error) {
                // Handle specific error cases
                if (error.message.includes('already taken')) {
                    if (error.message.includes('store_handle')) {
                        toast({
                            title: t('onboarding.error.store_taken.title'),
                            description: t('onboarding.error.store_taken.description'),
                            variant: "destructive",
                        });
                    } else if (error.message.includes('org_email')) {
                        toast({
                            title: t('onboarding.error.email_taken.title'),
                            description: t('onboarding.error.email_taken.description'),
                            variant: "destructive",
                        });
                    } else if (error.message.includes('phone_number')) {
                        toast({
                            title: t('onboarding.error.phone_taken.title'),
                            description: t('onboarding.error.phone_taken.description'),
                            variant: "destructive",
                        });
                    }
                    return;
                }

                // Handle database constraint violations
                if (error.code === '23505') { // Unique violation
                    toast({
                        title: t('onboarding.error.duplicate.title'),
                        description: t('onboarding.error.duplicate.description'),
                        variant: "destructive",
                    });
                    return;
                }

                // Handle other database errors
                if (error.code?.startsWith('23')) {
                    toast({
                        title: t('onboarding.error.database.title'),
                        description: t('onboarding.error.database.description'),
                        variant: "destructive",
                    });
                    return;
                }

                throw error;
            }

            // Update the local session to reflect the onboarded status
            await supabase.auth.refreshSession();

            toast({
                title: t('onboarding.success.title'),
                description: t('onboarding.success.description'),
            });

            // Redirect to portal after successful onboarding
            navigate('/portal');
        } catch (error) {
            console.error('Error during onboarding:', error);

            // Handle network errors
            if (error instanceof Error && error.message.includes('network')) {
                toast({
                    title: t('onboarding.error.network.title'),
                    description: t('onboarding.error.network.description'),
                    variant: "destructive",
                });
                return;
            }

            // Generic error message
            toast({
                title: t('onboarding.error.generic.title'),
                description: t('onboarding.error.generic.description'),
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
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
            onAvatarUpdate: handleAvatarUpdate,
            onLogoUpdate: handleLogoUpdate,
        };

        return <StepComponent {...commonProps} />;
    };

    // Don't render until language is initialized
    if (!languageInitialized || loading) {
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

    return showWelcome ? (
        <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />
    ) : (
        <div className="min-h-screen bg-background dark:bg-background flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <Card className="w-full max-w-[1250px] bg-white dark:bg-background shadow-xl rounded-none border dark:border-gray-800 mx-auto my-4 sm:my-0">
                <CardHeader className="px-4 sm:px-6 pt-8 sm:pt-6">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-center">
                        {currentStep >= 0 && currentStep < steps.length && steps[currentStep] ? t(steps[currentStep].title) : ''}
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                    <div className="mb-6 sm:mb-8">
                        <div className="relative flex h-2 w-full bg-gray-200 dark:bg-gray-700">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{
                                    width: `${(currentStep + 1) * 25}%`
                                }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className={cn(
                                    "absolute inset-0 bg-gradient-to-r from-[#D73E57] via-[#12B881] to-[#3C82F6]"
                                )}
                            />
                            <div className="absolute inset-0 flex">
                                {steps.map((_, index) => (
                                    <div key={index} className="flex-1 flex items-center">
                                        {index > 0 && (
                                            <div className="w-[5px] h-full bg-white dark:bg-background" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between mt-2">
                            {steps.map((step) => (
                                <div
                                    key={step.title}
                                    className={cn(
                                        "text-[11px] leading-tight sm:text-xs sm:leading-normal",
                                        "px-1 sm:px-0",
                                        "text-center max-w-[80px] sm:max-w-none",
                                        "mt-1 sm:mt-2",
                                        steps.indexOf(step) <= currentStep
                                            ? "text-[#894CEE] dark:text-[#FBC6F1] font-bold"
                                            : "text-gray-400 dark:text-gray-500"
                                    )}
                                >
                                    {t(step.title)}
                                </div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                            "flex flex-col",
                            // Steps 1 & 2 share same height
                            (currentStep === 0 || currentStep === 1) && "min-h-[400px]",
                            // Steps 3 & 4 share same height
                            (currentStep === 2 || currentStep === 3) && "min-h-[260px]"
                        )}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{
                                duration: 0.3,
                                opacity: { duration: 0.15 },
                                x: { duration: 0.3 }
                            }}
                        >
                            {renderStep()}
                        </motion.div>
                    </motion.div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Onboarding;
