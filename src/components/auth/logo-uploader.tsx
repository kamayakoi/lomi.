import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Cropper from 'react-easy-crop'
import { Area } from 'react-easy-crop'
import { supabase } from '@/utils/supabase/client'
import { toast } from "@/components/ui/use-toast"
import { useTranslation } from 'react-i18next'

interface LogoUploaderProps {
    currentLogo: string | null
    onLogoUpdate: (newLogoUrl: string) => void
    companyName: string
}

export default function LogoUploader({ currentLogo, onLogoUpdate, companyName }: LogoUploaderProps) {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogo)

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0]
            if (file && file.size > 1024 * 1024) {
                toast({ title: "Error", description: t('auth.logo_uploader.error.file_size') })
                return
            }
            setSelectedFile(file || null)
            setIsDialogOpen(true)
        }
    }

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image()
            image.addEventListener('load', () => resolve(image))
            image.addEventListener('error', error => reject(error))
            image.setAttribute('crossOrigin', 'anonymous')
            image.src = url
        })

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: Area
    ): Promise<Blob | null> => {
        const image = await createImage(imageSrc)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            return null
        }

        canvas.width = 200
        canvas.height = 200

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            200,
            200
        )

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob)
            }, 'image/png')
        })
    }

    const handleSave = async () => {
        if (selectedFile && croppedAreaPixels) {
            try {
                const croppedImage = await getCroppedImg(
                    URL.createObjectURL(selectedFile),
                    croppedAreaPixels
                );

                if (croppedImage) {
                    setPreviewUrl(URL.createObjectURL(croppedImage));

                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error('No user found');

                    const fileExt = selectedFile.name.split('.').pop();
                    const fileName = `${user.id}/logo-${Date.now()}.${fileExt}`;
                    const filePath = `${fileName}`;

                    const { data, error } = await supabase.storage
                        .from('logos')
                        .upload(filePath, croppedImage, { contentType: 'image/png' });

                    if (error) {
                        throw error;
                    }

                    if (data) {
                        const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(data.path);
                        onLogoUpdate(publicUrl);

                        const { data: { user } } = await supabase.auth.getUser();
                        if (user) {
                            const { data: organizationDetails, error: organizationError } = await supabase
                                .rpc('fetch_organization_details', { p_merchant_id: user.id });

                            if (organizationError) {
                                console.error('Error fetching organization details:', organizationError);
                                throw new Error('Failed to fetch organization details');
                            }

                            if (organizationDetails && organizationDetails.length > 0) {
                                const organizationId = organizationDetails[0].organization_id;
                                await supabase.rpc('update_organization_logo', {
                                    p_organization_id: organizationId,
                                    p_logo_url: publicUrl,
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                toast({ title: "Error", description: t('auth.logo_uploader.error.upload_failed') });
            } finally {
                setIsDialogOpen(false);
            }
        }
    }

    const getInitial = (companyName: string) => {
        return companyName.charAt(0).toUpperCase()
    }

    const handleRemove = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
        onLogoUpdate('')
        // Reset the file input value to allow selecting the same file again
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">{t('auth.logo_uploader.crop.title')}</DialogTitle>
                    </DialogHeader>
                    <div className="relative h-[50vh] sm:h-64 w-full">
                        {selectedFile && (
                            <Cropper
                                image={URL.createObjectURL(selectedFile)}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="w-full sm:w-auto h-[48px] text-base font-medium rounded-none"
                        >
                            {t('auth.logo_uploader.crop.cancel')}
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="w-full sm:w-auto h-[48px] text-base font-medium rounded-none"
                        >
                            {t('auth.logo_uploader.crop.save')}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}