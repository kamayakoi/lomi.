import { Card, CardContent } from '@/components/ui/card'
import { Check } from 'lucide-react'
import ActivationStep1 from './components/step-1'
import ActivationStep2 from './components/step-2'
import ActivationStep3 from './components/step-3'
import ActivationStep4 from './components/step-4'
import ActivationStep5 from './components/step-5'
import { useToast } from '@/lib/hooks/use-toast';
import { useActivationStatus } from '@/lib/hooks/use-activation-status';
import LoadingButton from '@/components/portal/loader';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import { useEffect, useState } from 'react';
import { useUser } from '@/lib/hooks/use-user';
import { supabase } from '@/utils/supabase/client';
import { useTranslation } from 'react-i18next';

const StepIndicator = ({ step, isCompleted, isActive, children }: { step: number; isCompleted: boolean; isActive: boolean; children: React.ReactNode }) => (
    <div className={`flex items-center mb-8 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${isCompleted || (step === 1 && isActive) ? 'bg-green-500 border-green-500' : isActive ? 'border-primary' : 'border-muted'}`}>
            {isCompleted || (step === 1 && isActive) ? <Check className="w-5 h-5 text-white" /> : step}
        </div>
        <span className="ml-2 text-sm font-medium">{children}</span>
    </div>
)


export type ActivationData = {
    legalName: string;
    taxNumber: string;
    businessDescription: string;
    country: string;
    region: string;
    city: string;
    postalCode: string;
    street: string;
    proofOfBusiness: string;
    businessUrl: string;
    fullName: string;
    email: string;
    countryCode: string;
    mobileNumber: string;
    identityProof?: string;
    addressProof?: string;
    businessRegistration?: string;
};

const initialActivationData: ActivationData = {
    legalName: '',
    taxNumber: '',
    businessDescription: '',
    country: '',
    region: '',
    city: '',
    postalCode: '',
    street: '',
    proofOfBusiness: '',
    businessUrl: '',
    fullName: '',
    email: '',
    countryCode: '',
    mobileNumber: '',
    identityProof: '',
    addressProof: '',
    businessRegistration: '',
};

const steps = [
    { title: "activation.steps.create_account", component: ActivationStep1 },
    { title: "activation.steps.business_details", component: ActivationStep2 },
    { title: "activation.steps.authorized_signatory", component: ActivationStep3 },
    { title: "activation.steps.documents", component: ActivationStep4 },
    { title: "activation.steps.verification", component: ActivationStep5 },
    { title: "activation.steps.activated" },
] as const;

enum KycStatus {
    NotSubmitted = 'not_submitted',
    Pending = 'pending',
    NotAuthorized = 'not_authorized',
    Approved = 'approved',
    Rejected = 'rejected'
}

const Activation: React.FC = () => {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useLocalStorage('kycCurrentStep', 0);
    const [activationData, setActivationData] = useLocalStorage<ActivationData>('kycActivationData', initialActivationData);
    const { toast } = useToast();
    const { isLoading: activationStatusLoading, isActivated, error: activationStatusError } = useActivationStatus();
    const { user, isLoading: userLoading } = useUser();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkActivationStatus = async () => {
            if (user) {
                try {
                    const { data: status, error } = await supabase.rpc('check_activation_state', {
                        p_merchant_id: user.id
                    });
                    if (error) throw error;

                    switch (status as KycStatus) {
                        case KycStatus.NotSubmitted:
                            // Handle not submitted case
                            if (Object.keys(activationData).length === 0) {
                                setCurrentStep(0);
                                setActivationData(initialActivationData);
                            }
                            break;
                        case KycStatus.Approved:
                            setCurrentStep(5); // Move to final step
                            break;
                        case KycStatus.Pending:
                            // If activation is pending, stay on step 5
                            setCurrentStep(4);
                            break;
                        case KycStatus.Rejected:
                            // If rejected, reset activation data but allow proceeding through steps
                            setActivationData(initialActivationData);
                            break;
                        case KycStatus.NotAuthorized:
                            // If not authorized, stay on step 1 and reset activation data
                            setCurrentStep(0);
                            setActivationData(initialActivationData);
                            break;
                    }
                } catch (error) {
                    console.error('Error checking activation status:', error);
                }
            }
        };

        if (!userLoading && user) {
            checkActivationStatus();
        }
    }, [user, userLoading, setCurrentStep, setActivationData, activationData]);

    const handleNext = (stepData: Partial<ActivationData>) => {
        setActivationData((prevData) => ({ ...prevData, ...stepData }));
        setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
    };

    const handlePrevious = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
    };

    const onSubmit = async (completeData: ActivationData) => {
        try {
            setLoading(true);
            setActivationData(completeData);

            if (!user) {
                toast({
                    title: "Error",
                    description: "User not found. Please log in and try again.",
                    variant: "destructive",
                });
                return;
            }

            const { error } = await supabase.rpc('complete_activation', {
                p_merchant_id: user.id,
                p_legal_organization_name: completeData.legalName,
                p_tax_number: completeData.taxNumber,
                p_business_description: completeData.businessDescription,
                p_legal_country: completeData.country,
                p_legal_region: completeData.region,
                p_legal_city: completeData.city,
                p_legal_postal_code: completeData.postalCode,
                p_legal_street: completeData.street,
                p_proof_of_business: completeData.proofOfBusiness,
                p_business_platform_url: completeData.businessUrl,
                p_authorized_signatory_name: completeData.fullName,
                p_authorized_signatory_email: completeData.email,
                p_authorized_signatory_phone_number: completeData.countryCode + completeData.mobileNumber,
                p_legal_representative_id_url: completeData.identityProof,
                p_address_proof_url: completeData.addressProof,
                p_business_registration_url: completeData.businessRegistration,
            });

            if (error) throw error;

            toast({
                title: "KYC Submitted",
                description: "Your KYC details have been submitted successfully.",
            });
            setCurrentStep(4); // Move to verification in progress step
        } catch (error) {
            console.error('Error submitting KYC details:', error);
            toast({
                title: "Error",
                description: "There was a problem submitting your KYC details. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const MobileStepHeader = () => (
        <div className="md:hidden flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center">
                <h2 className="text-lg font-semibold">
                    {t(steps[currentStep]?.title || 'activation.steps.create_account')}
                </h2>
            </div>
            <div className="text-sm text-muted-foreground">
                {t('activation.step_indicator', { step: currentStep + 1, total: steps.length - 1 })}
            </div>
        </div>
    );

    if (userLoading || activationStatusLoading || loading) {
        return <LoadingButton />;
    }

    if (activationStatusError) {
        return <div>Error: {activationStatusError}</div>;
    }

    if (isActivated) {
        return <div>Account already activated</div>;
    }

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <ActivationStep1 onNext={(data) => handleNext(data)} />;
            case 1:
                return <ActivationStep2 onNext={(data) => handleNext(data)} onPrevious={handlePrevious} data={activationData} />;
            case 2:
                return <ActivationStep3 onNext={(data) => handleNext(data)} onPrevious={handlePrevious} data={activationData} />;
            case 3:
                return <ActivationStep4 onSubmit={onSubmit} onPrevious={handlePrevious} data={activationData} />;
            case 4:
                return <ActivationStep5 />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row">
                        <div className="hidden md:block md:w-1/3 pr-6 mb-6 md:mb-0">
                            <h1 className="text-2xl font-bold tracking-tight mb-6">{t('activation.title')}</h1>
                            {steps.map((step, index) => (
                                <StepIndicator
                                    key={index}
                                    step={index + 1}
                                    isCompleted={index < currentStep}
                                    isActive={index === currentStep}
                                >
                                    {t(step.title)}
                                </StepIndicator>
                            ))}
                        </div>
                        <div className="md:w-2/3 md:border-l md:pl-6">
                            <MobileStepHeader />
                            <div className="space-y-6 h-[445px] overflow-y-auto scrollbar-hide p-2">
                                {renderStep()}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Activation