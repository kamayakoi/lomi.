import React, { useCallback, useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileUp } from "lucide-react";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ActivationData } from "./activation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ActivationStep4Props {
    formData: ActivationData;
    onFormDataChange: (data: Partial<ActivationData>) => void;
    setIsFormValid: (isValid: boolean) => void;
}

const ActivationStep4: React.FC<ActivationStep4Props> = ({ formData, onFormDataChange, setIsFormValid }) => {
    const supabase = useSupabaseClient();

    const [identityProof, setIdentityProof] = useState(formData.identityProof);
    const [addressProof, setAddressProof] = useState(formData.addressProof);
    const [businessRegistration, setBusinessRegistration] = useState(formData.businessRegistration);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>, docType: 'identityProof' | 'addressProof' | 'businessRegistration') => {
        const file = event.target.files?.[0];
        if (file) {
            onFormDataChange({ [docType]: file.name });

            const { data, error } = await supabase.storage
                .from('kyc_documents')
                .upload(`${docType}/${file.name}`, file);

            if (error) {
                console.error('Error uploading file:', error);
                setUploadError('Failed to upload the file. Please try again.');
            } else {
                const { data: publicUrlData } = supabase.storage
                    .from('kyc_documents')
                    .getPublicUrl(data.path);

                onFormDataChange({ [docType]: publicUrlData.publicUrl });
                switch (docType) {
                    case 'identityProof':
                        setIdentityProof(publicUrlData.publicUrl);
                        break;
                    case 'addressProof':
                        setAddressProof(publicUrlData.publicUrl);
                        break;
                    case 'businessRegistration':
                        setBusinessRegistration(publicUrlData.publicUrl);
                        break;
                }
                setUploadError(null);
            }
        }
    }, [onFormDataChange, supabase]);

    useEffect(() => {
        const isValid = Boolean(identityProof && addressProof && businessRegistration);
        setIsFormValid(isValid);
    }, [identityProof, addressProof, businessRegistration, setIsFormValid]);

    return (
        <div className="space-y-6 overflow-hidden">
            <h2 className="text-lg font-semibold mb-2">Documents</h2>
            {uploadError && (
                <Alert variant="destructive">
                    <AlertTitle>Upload Error</AlertTitle>
                    <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
            )}
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
                        <Input
                            id={doc.id}
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, doc.id as keyof Pick<ActivationData, 'identityProof' | 'addressProof' | 'businessRegistration'>)}
                        />
                        <div
                            onClick={() => document.getElementById(doc.id)?.click()}
                            className="w-full px-2 py-1 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer flex items-center"
                        >
                            <FileUp className="mr-2 h-3 w-3" />
                            <span>{formData[doc.id as keyof Pick<ActivationData, 'identityProof' | 'addressProof' | 'businessRegistration'>] || 'Choose file'}</span>
                        </div>
                    </div>
                </div>
            ))}
            <div className="text-xs text-muted-foreground bg-muted p-1.5 rounded-md">
                <p>
                    Please ensure all documents are clear, legible, and in PDF, JPG, or PNG format. Maximum file size: 3MB per document.
                </p>
            </div>
        </div>
    )
}

export default ActivationStep4;