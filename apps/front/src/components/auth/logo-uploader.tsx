import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { supabase } from '@/utils/supabase/client'
import { toast } from "@/lib/hooks/use-toast"
import { useTranslation } from 'react-i18next'

interface LogoUploaderProps {
    currentLogo: string | null
    onLogoUpdate: (newLogoUrl: string) => void
    companyName: string
}

export default function LogoUploader({ currentLogo, onLogoUpdate, companyName }: LogoUploaderProps) {
    const { t } = useTranslation();
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogo)

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file size
        if (file.size > 1024 * 1024) {
            toast({ title: "Error", description: t('auth.logo_uploader.error.file_size') })
            return
        }

        // Validate file type
        const fileType = file.type.toLowerCase();
        if (!fileType.match(/^image\/(jpeg|jpg|png)$/)) {
            toast({
                title: "Error",
                description: "Only JPEG and PNG files are allowed",
                variant: "destructive"
            });
            return;
        }

        handleUpload(file)
    }

    const handleUpload = async (file: File) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/logo-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data, error } = await supabase.storage
                .from('logos')
                .upload(filePath, file, {
                    contentType: file.type,
                    upsert: true
                });

            if (error) {
                throw error;
            }

            if (data) {
                const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(data.path);
                setPreviewUrl(publicUrl);
                onLogoUpdate(publicUrl);

                const { data: organizationDetails, error: organizationError } = await supabase
                    .rpc('fetch_organization_details', { p_merchant_id: user.id });

                if (organizationError) {
                    console.error('Error fetching organization details:', organizationError);
                    throw new Error('Failed to fetch organization details');
                }

                if (organizationDetails && organizationDetails.length > 0) {
                    const organizationId = organizationDetails[0]?.organization_id;
                    if (organizationId) {
                        await supabase.rpc('update_organization_logo', {
                            p_organization_id: organizationId,
                            p_logo_url: data.path,
                        });

                        window.dispatchEvent(new Event('organization-logo-updated'));
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast({ title: "Error", description: t('auth.logo_uploader.error.upload_failed') });
        }
    }

    const getInitial = (companyName: string) => {
        return companyName.charAt(0).toUpperCase()
    }

    const handleRemove = () => {
        setPreviewUrl(null)
        onLogoUpdate('')
        const fileInput = document.getElementById('logo-upload') as HTMLInputElement
        if (fileInput) {
            fileInput.value = ''
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-blue-500 text-white rounded-lg flex items-center justify-center">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Company logo" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                        <span className="text-3xl font-bold">{companyName ? getInitial(companyName) : ''}</span>
                    )}
                </div>
                <div className="space-x-2">
                    <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button
                        variant="outline"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('logo-upload')?.click();
                        }}
                        className="rounded-none"
                    >
                        {previewUrl ? t('auth.logo_uploader.replace_image') : t('auth.logo_uploader.upload_image')}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleRemove}
                        disabled={!previewUrl}
                        className="rounded-none"
                    >
                        {t('auth.logo_uploader.remove')}
                    </Button>
                </div>
            </div>
            <p className="text-xs text-muted-foreground">
                {t('auth.logo_uploader.file_requirements')}
            </p>
        </div>
    )
}