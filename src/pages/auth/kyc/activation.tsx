import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import ActivationStep1 from './activation-step-1'
import ActivationStep2 from './activation-step-2'
import ActivationStep3 from './activation-step-3'
import ActivationStep4 from './activation-step-4'
import ActivationStep5 from './activation-step-5'
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';

const StepIndicator = ({ step, isCompleted, isActive, children }: { step: number; isCompleted: boolean; isActive: boolean; children: React.ReactNode }) => (
    <div className={`flex items-center mb-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
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
    identityProof: string;
    addressProof: string;
    businessRegistration: string;
};

const steps = [
    { title: "Create your account", component: ActivationStep1 },
    { title: "Business details", component: ActivationStep2 },
    { title: "Authorized signatory", component: ActivationStep3 },
    { title: "Documents", component: ActivationStep4 },
    { title: "Verification in progress", component: ActivationStep5 },
    { title: "Account activated" },
]

const Activation: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [activationData, setActivationData] = useState<ActivationData>({
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
    });
    const supabase = useSupabaseClient();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchActivationStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase.rpc('check_activation_status', { p_merchant_id: user.id });
                if (error) {
                    console.error('Error fetching activation status:', error);
                } else if (data) {
                    const { data: kycData, error: kycError } = await supabase
                        .from('organization_kyc')
                        .select('status')
                        .eq('organization_id', data)
                        .single();

                    if (kycError) {
                        console.error('Error fetching KYC status:', kycError);
                    } else if (kycData && kycData.status === 'pending') {
                        setCurrentStep(4);
                    }
                }
            }
        };

        fetchActivationStatus();
    }, [supabase]);

    const handleNext = async () => {
        if (currentStep === steps.length - 3) {
            handleSubmit();
        } else {
            if (currentStep === 0 || isFormValid) {
                setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
            } else {
                // Trigger form validation
                setIsFormValid(false);
            }
        }
    }

    const handlePrevious = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 0))
    }

    const handleActivationDataChange = (data: Partial<ActivationData>) => {
        setActivationData((prevData) => ({ ...prevData, ...data }));
    };

    const handleSubmit = async () => {
        if (!showConfirmation) {
            setShowConfirmation(true);
            return;
        }

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error("User not found");
            }

            const { data: organizationData, error: organizationError } = await supabase
                .rpc('fetch_organization_details_for_kyc_by_merchant', { p_merchant_id: user.id });

            if (organizationError || !organizationData || organizationData.length === 0) {
                throw new Error("Organization not found");
            }

            const organizationId = organizationData[0].organization_id;

            const { error } = await supabase.rpc('update_organization_kyc_details', {
                p_organization_id: organizationId,
                p_legal_organization_name: activationData.legalName,
                p_tax_number: activationData.taxNumber,
                p_business_description: activationData.businessDescription,
                p_legal_country: activationData.country,
                p_legal_region: activationData.region,
                p_legal_city: activationData.city,
                p_legal_postal_code: activationData.postalCode,
                p_legal_street: activationData.street,
                p_proof_of_business: activationData.proofOfBusiness,
                p_business_platform_url: activationData.businessUrl,
                p_authorized_signatory_name: activationData.fullName,
                p_authorized_signatory_email: activationData.email,
                p_authorized_signatory_phone_number: activationData.countryCode + activationData.mobileNumber,
                p_legal_representative_ID_url: activationData.identityProof,
                p_address_proof_url: activationData.addressProof,
                p_business_registration_url: activationData.businessRegistration,
            });

            if (error) {
                throw error;
            }

            toast({
                title: "KYC Submitted",
                description: "Your KYC details have been submitted successfully.",
            });
            setCurrentStep(4);
        } catch (error) {
            console.error('Error submitting KYC details:', error);
            toast({
                title: "Error",
                description: "There was a problem submitting your KYC details. Please try again.",
                variant: "destructive",
            });
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <ActivationStep1 />;
            case 1:
                return <ActivationStep2 formData={activationData} onFormDataChange={handleActivationDataChange} setIsFormValid={setIsFormValid} />;
            case 2:
                return <ActivationStep3 formData={activationData} onFormDataChange={handleActivationDataChange} setIsFormValid={setIsFormValid} />;
            case 3:
                return <ActivationStep4 formData={activationData} onFormDataChange={handleActivationDataChange} setIsFormValid={setIsFormValid} />;
            case 4:
            case 5:
                return <ActivationStep5 />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl">
                <CardContent className="p-6">
                    <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Final Review</DialogTitle>
                                <DialogDescription>
                                    Please review your information carefully. Once confirmed, you cannot make further changes. Are you ready to proceed?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit}>Confirm</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 pr-6 mb-6 md:mb-0">
                            <h1 className="text-2xl font-bold tracking-tight mb-6">Account Activation</h1>
                            {steps.map((step, index) => (
                                <StepIndicator
                                    key={index}
                                    step={index + 1}
                                    isCompleted={index < currentStep}
                                    isActive={index === currentStep}
                                >
                                    {step.title}
                                </StepIndicator>
                            ))}
                        </div>
                        <div className="md:w-2/3 md:border-l md:pl-6">
                            <div className="space-y-6 h-[420px] overflow-y-auto scrollbar-hide p-2">
                                {renderStep()}
                            </div>
                            {currentStep < 4 && ( // Only show back and next buttons for steps before ActivationStep5
                                <div className="flex justify-between mt-6">
                                    <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                                        Back
                                    </Button>
                                    <Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
                                        {currentStep === steps.length - 3 ? 'Submit' : 'Next'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Activation