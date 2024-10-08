import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { ActivationData } from "./activation";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/file-uploader";

type ActivationStep4Data = {
    identityProof: string;
    addressProof: string;
    businessRegistration: string;
};

interface ActivationStep4Props {
    onSubmit: (data: ActivationData) => void;
    onPrevious: () => void;
    data: ActivationData;
    organizationId: string | null;
}

const ActivationStep4: React.FC<ActivationStep4Props> = ({ onSubmit, onPrevious, data, organizationId }) => {
    const [documents, setDocuments] = useState<ActivationStep4Data>({
        identityProof: data.identityProof || '',
        addressProof: data.addressProof || '',
        businessRegistration: data.businessRegistration || '',
    });

    const handleFileUploaded = (docType: keyof ActivationStep4Data) => async (url: string) => {
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
                { id: "identityProof", label: "Identity proof", description: "National ID, Passport" },
                { id: "addressProof", label: "Address proof", description: "Utility Bill, Bank Statement" },
                { id: "businessRegistration", label: "Business registration document", description: "Certificate of Incorporation, Business License, Tax Registration Certificate" },
            ].map((doc) => (
                <div key={doc.id} className="space-y-1">
                    <Label htmlFor={doc.id} className="text-sm font-medium">
                        {doc.label}
                        <span className="text-destructive ml-1">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground -mt-0.5">{doc.description}</p>
                    <div className="flex items-center space-x-2">
                        <FileUploader
                            bucketName="kyc_documents"
                            folderPath={`${organizationId}/${doc.id}`}
                            onFileUploaded={handleFileUploaded(doc.id as keyof ActivationStep4Data)}
                        />
                        {documents[doc.id as keyof ActivationStep4Data] && (
                            <span className="text-sm text-muted-foreground">File uploaded</span>
                        )}
                    </div>
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