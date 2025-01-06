import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { ActivationData } from "./activation";
import { Button } from "@/components/ui/button";
import KYCFileUploader from "@/components/auth/kyc-file-uploader";
import { useUser } from '@/lib/hooks/useUser';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from '@/components/ui/use-toast';

type ActivationStep4Data = {
    identityProof: string;
    addressProof: string;
    businessRegistration: string;
};

interface ActivationStep4Props {
    onSubmit: (data: ActivationData) => void;
    onPrevious: () => void;
    data: ActivationData;
}

const ActivationStep4: React.FC<ActivationStep4Props> = ({ onSubmit, onPrevious, data }) => {
    const { user } = useUser();
    const [documents, setDocuments] = useState<ActivationStep4Data>({
        identityProof: data.identityProof || '',
        addressProof: data.addressProof || '',
        businessRegistration: data.businessRegistration || '',
    });
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [errors, setErrors] = useState<Record<keyof ActivationStep4Data, boolean>>({
        identityProof: false,
        addressProof: false,
        businessRegistration: false,
    });

    const handleFileUploaded = (docType: keyof ActivationStep4Data) => (url: string) => {
        console.log(`File uploaded for ${docType}:`, url);
        setDocuments(prev => ({ ...prev, [docType]: url }));
        setErrors(prev => ({ ...prev, [docType]: false }));
    };

    const validateDocuments = () => {
        const missingDocuments = Object.entries(documents)
            .filter(([, value]) => !value)
            .map(([key]) => key as keyof ActivationStep4Data);

        // Update error states for each document
        const newErrors = {
            identityProof: false,
            addressProof: false,
            businessRegistration: false,
        };
        missingDocuments.forEach(doc => {
            newErrors[doc] = true;
        });
        setErrors(newErrors);

        if (missingDocuments.length > 0) {
            toast({
                title: "Missing Documents",
                description: `Please upload all required documents: ${missingDocuments.join(', ')}`,
                variant: "destructive",
            });
            return false;
        }
        return true;
    };

    const handleSubmitClick = () => {
        if (validateDocuments()) {
            setShowConfirmDialog(true);
        }
    };

    const handleConfirmedSubmit = () => {
        const completeData: ActivationData = {
            ...data,
            ...documents
        };
        setShowConfirmDialog(false);
        onSubmit(completeData);
    };

    return (
        <div className="space-y-6 overflow-hidden">
            <h2 className="text-lg font-semibold mb-2">Documents</h2>
            {[
                { id: "identityProof", label: "Identity proof", description: "National ID, Passport", documentType: 'legal_representative_ID' },
                { id: "addressProof", label: "Address proof", description: "Utility Bill, Bank Statement", documentType: 'address_proof' },
                { id: "businessRegistration", label: "Business registration document", description: "Certificate of Incorporation, Business License, Tax Registration Certificate", documentType: 'business_registration' },
            ].map((doc) => (
                <div key={doc.id} className="space-y-1">
                    <Label htmlFor={doc.id} className="text-sm font-medium">
                        {doc.label}
                        <span className="text-destructive ml-1">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground -mt-0.5">{doc.description}</p>
                    <KYCFileUploader
                        documentType={doc.documentType as 'legal_representative_ID' | 'address_proof' | 'business_registration'}
                        onFileUploaded={handleFileUploaded(doc.id as keyof ActivationStep4Data)}
                        currentFile={documents[doc.id as keyof ActivationStep4Data]}
                        organizationId={user?.id || ''}
                    />
                    {errors[doc.id as keyof ActivationStep4Data] && (
                        <div className="flex items-center gap-2 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500">
                                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-red-500">This document is required</p>
                        </div>
                    )}
                </div>
            ))}
            <div className="text-xs text-muted-foreground bg-muted p-1.5 rounded-md">
                <p>
                    Please ensure all documents are clear, legible, and in PDF, JPG, or PNG format. Maximum file size: 3MB per document.
                </p>
            </div>
            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onPrevious}>
                    Back
                </Button>
                <Button onClick={handleSubmitClick} className="bg-green-500 hover:bg-green-600 text-white">
                    Submit
                </Button>
            </div>

            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Activate my account</DialogTitle>
                        <DialogDescription>
                            Please ensure all uploaded documents are correct and legible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex space-x-2">
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmedSubmit} className="bg-green-500 hover:bg-green-600 text-white">
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ActivationStep4;
export type { ActivationStep4Data };
