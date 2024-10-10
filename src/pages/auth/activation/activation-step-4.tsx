import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { ActivationData } from "./activation";
import { Button } from "@/components/ui/button";
import KYCFileUploader from "@/components/auth/kyc-file-uploader";
import { useUser } from '@/lib/hooks/useUser';

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

    const handleFileUploaded = (docType: keyof ActivationStep4Data) => (url: string) => {
        console.log(`File uploaded for ${docType}:`, url);
        setDocuments(prev => ({ ...prev, [docType]: url }));
    };

    const handleSubmit = () => {
        const completeData: ActivationData = {
            ...data,
            ...documents
        };
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
                <Button onClick={handleSubmit}>Submit</Button>
            </div>
        </div>
    )
}

export default ActivationStep4;
export type { ActivationStep4Data };
