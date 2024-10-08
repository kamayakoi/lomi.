import React, { useState, useCallback } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface FileUploaderProps {
    bucketName: string;
    folderPath: string;
    onFileUploaded: (url: string) => void;
    acceptedFileTypes?: string;
    maxFileSizeMB?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
    bucketName,
    folderPath,
    onFileUploaded,
    acceptedFileTypes = ".jpg,.jpeg,.png,.pdf",
    maxFileSizeMB = 3
}) => {
    const supabase = useSupabaseClient();
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('File upload triggered');
        const file = event.target.files?.[0];
        if (file) {
            console.log('File selected:', file.name);
            if (file.size > maxFileSizeMB * 1024 * 1024) {
                console.log('File too large');
                toast({ title: "Error", description: `File size must be less than ${maxFileSizeMB}MB` });
                return;
            }

            setIsUploading(true);
            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${folderPath}/${Date.now()}.${fileExt}`;
                console.log('Uploading file:', fileName);

                const { data, error } = await supabase.storage
                    .from(bucketName)
                    .upload(fileName, file);

                if (error) {
                    console.error('Supabase upload error:', error);
                    throw error;
                }

                if (data) {
                    console.log('Upload successful:', data);
                    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(data.path);
                    console.log('Public URL:', publicUrl);
                    onFileUploaded(publicUrl);
                    toast({ title: "Success", description: "File uploaded successfully" });
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                toast({ title: "Error", description: "Failed to upload file" });
            } finally {
                setIsUploading(false);
            }
        }
    }, [supabase, bucketName, folderPath, maxFileSizeMB, onFileUploaded]);

    return (
        <div>
            <input
                id={`file-upload-${folderPath}`}
                type="file"
                accept={acceptedFileTypes}
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
            />
            <Button
                type="button"
                variant="outline"
                onClick={() => {
                    console.log('Upload button clicked');
                    document.getElementById(`file-upload-${folderPath}`)?.click();
                }}
                disabled={isUploading}
            >
                <FileUp className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Choose file'}
            </Button>
        </div>
    );
};

export default FileUploader;