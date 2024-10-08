import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface KYCFileUploaderProps {
    documentType: 'legal_representative_ID' | 'address_proof' | 'business_registration';
    onFileUploaded: (url: string) => void;
    currentFile?: string | null;
    organizationId: string;
}

const KYCFileUploader: React.FC<KYCFileUploaderProps> = ({
    documentType,
    onFileUploaded,
    currentFile,
    organizationId
}) => {
    const supabase = useSupabaseClient();
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(currentFile ?? null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) { // 3MB limit
                toast({ title: "Error", description: "File size must be less than 3MB" });
                return;
            }
            setIsUploading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('No user found');

                const fileExt = file.name.split('.').pop();
                const uniqueFileName = `${organizationId}/${documentType}_${Date.now()}.${fileExt}`;

                const { data, error } = await supabase.storage
                    .from('kyc_documents')
                    .upload(uniqueFileName, file);

                if (error) {
                    throw error;
                }

                if (data) {
                    const { data: { publicUrl } } = supabase.storage.from('kyc_documents').getPublicUrl(data.path);
                    setFileName(file.name);

                    // Update the document URL in the database
                    const { error: updateError } = await supabase.rpc('update_kyc_document_url', {
                        p_organization_id: organizationId,
                        p_document_type: documentType,
                        p_document_url: publicUrl
                    });

                    if (updateError) {
                        throw updateError;
                    }

                    onFileUploaded(publicUrl);
                    toast({ title: "Success", description: "Document uploaded successfully" });
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                toast({ title: "Error", description: "Failed to upload document" });
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleRemove = async () => {
        try {
            // Update the document URL to null in the database
            const { error: updateError } = await supabase.rpc('update_kyc_document_url', {
                p_organization_id: organizationId,
                p_document_type: documentType,
                p_document_url: null
            });

            if (updateError) {
                throw updateError;
            }

            setFileName(null);
            onFileUploaded('');
            const fileInput = document.getElementById(`kyc-file-upload-${documentType}`) as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
            toast({ title: "Success", description: "Document removed successfully" });
        } catch (error) {
            console.error('Error removing file:', error);
            toast({ title: "Error", description: "Failed to remove document" });
        }
    };

    return (
        <div className="space-y-2">
            <input
                id={`kyc-file-upload-${documentType}`}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
            />
            <div className="flex items-center space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        document.getElementById(`kyc-file-upload-${documentType}`)?.click();
                    }}
                    disabled={isUploading}
                >
                    <FileUp className="mr-2 h-4 w-4" />
                    {isUploading ? 'Uploading...' : (fileName ? 'Change file' : 'Upload document')}
                </Button>
                {fileName && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemove}
                    >
                        Remove
                    </Button>
                )}
            </div>
            {fileName && (
                <p className="text-sm text-muted-foreground">
                    Uploaded: {fileName}
                </p>
            )}
        </div>
    );
};

export default KYCFileUploader;