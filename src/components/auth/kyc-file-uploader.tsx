import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { FileUp, X, CheckCircle, AlertCircle, FileIcon, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useUser } from '@/lib/hooks/useUser';
import { supabase } from '@/utils/supabase/client';

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
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(currentFile ?? null);
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<"idle" | "uploading" | "completed" | "failed">("idle");
    const { user } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (file && status === "uploading") {
            timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress >= 100) {
                        clearInterval(timer);
                        return 100;
                    }
                    const increment = Math.random() * 10;
                    return Math.min(oldProgress + increment, 100);
                });
            }, 200);
        }
        return () => clearInterval(timer);
    }, [file, status]);

    const getFileTypeColor = (fileName: string): string => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return 'bg-red-100 text-red-500';
            case 'jpg':
            case 'jpeg':
                return 'bg-blue-100 text-blue-500';
            case 'png':
                return 'bg-green-100 text-green-500';
            default:
                return 'bg-gray-100 text-gray-500';
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        if (selectedFile.size > 3 * 1024 * 1024) {
            toast({ title: "Error", description: "File size must be less than 3MB", variant: "destructive" });
            return;
        }

        const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
        if (!['pdf', 'jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
            toast({ title: "Error", description: "Only PDF, JPG, or PNG files are allowed", variant: "destructive" });
            return;
        }

        setFile(selectedFile);
        setStatus("uploading");
        setIsUploading(true);
        setProgress(0);

        try {
            if (!user) throw new Error('No user found');

            const fileExt = selectedFile.name.split('.').pop();
            const uniqueFileName = `${organizationId}/${documentType}_${Date.now()}.${fileExt}`;

            const { data, error } = await supabase.storage
                .from('kyc_documents')
                .upload(uniqueFileName, selectedFile);

            if (error) {
                if (error.message.includes('network')) {
                    throw new Error('Network error. Please check your internet connection.');
                } else {
                    throw error;
                }
            }

            if (data) {
                const { data: { publicUrl } } = supabase.storage.from('kyc_documents').getPublicUrl(data.path);

                const { error: updateError } = await supabase.rpc('update_kyc_document_url', {
                    p_organization_id: organizationId,
                    p_document_type: documentType,
                    p_document_url: publicUrl
                });

                if (updateError) throw updateError;

                setFileName(selectedFile.name);
                onFileUploaded(publicUrl);
                setStatus("completed");
                toast({ title: "Success", description: "Document uploaded successfully" });
            }
        } catch (error: Error | unknown) {
            console.error('Error uploading file:', error);
            setStatus("failed");
            const errorMessage = error instanceof Error ? error.message : "Failed to upload document";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = async (): Promise<void> => {
        try {
            const { error: updateError } = await supabase.rpc('update_kyc_document_url', {
                p_organization_id: organizationId,
                p_document_type: documentType,
                p_document_url: null
            });

            if (updateError) throw updateError;

            setFileName(null);
            setFile(null);
            setStatus("idle");
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            toast({ title: "Success", description: "Document removed successfully" });
        } catch (error: Error | unknown) {
            console.error('Error removing file:', error);
            const errorMessage = error instanceof Error ? error.message : "Failed to remove document";
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 KB";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + " " + sizes[i];
    };

    const handleTryAgain = (): void => {
        if (file) {
            setStatus("uploading");
            handleFileChange({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            fileInputRef.current?.click();
        }
    };

    return (
        <div className="space-y-2">
            <input
                ref={fileInputRef}
                id={`kyc-file-upload-${documentType}`}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
            />
            {!file && (
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        onKeyPress={handleKeyPress}
                        disabled={isUploading}
                        className="w-full sm:w-auto"
                    >
                        <FileUp className="mr-2 h-4 w-4" />
                        {isUploading ? 'Uploading...' : (fileName ? 'Change file' : 'Upload document')}
                    </Button>
                    {fileName && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleRemove}
                            className="w-full sm:w-auto"
                        >
                            Remove
                        </Button>
                    )}
                </div>
            )}
            {file && (
                <div className="border rounded-lg p-4 relative">
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                        <div className={`p-2 rounded ${getFileTypeColor(file.name)}`}>
                            <FileIcon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatFileSize(progress / 100 * file.size)} of {formatFileSize(file.size)}
                            </p>
                        </div>
                        {status === "uploading" && (
                            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                        )}
                        {status === "completed" && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {status === "failed" && (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                    </div>
                    {status === "uploading" && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                    {status === "failed" && (
                        <button
                            onClick={handleTryAgain}
                            className="mt-2 text-sm text-red-500 hover:underline"
                        >
                            Try Again
                        </button>
                    )}
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
            {fileName && !file && (
                <p className="text-sm text-muted-foreground">
                    Uploaded: {fileName}
                </p>
            )}
        </div>
    );
};

export default KYCFileUploader;