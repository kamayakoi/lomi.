import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { supabase } from '@/utils/supabase/client'
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Cropper from 'react-easy-crop'
import { Area } from 'react-easy-crop'
import { useTranslation } from 'react-i18next'

interface ProfilePictureUploaderProps {
    currentAvatar: string | null
    onAvatarUpdate: (newAvatarUrl: string) => void
    name: string
}

const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-pink-500', 'bg-purple-500',
    'bg-red-500', 'bg-indigo-500', 'bg-orange-500', 'bg-teal-500', 'bg-cyan-500',
    'bg-lime-500', 'bg-fuchsia-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-violet-500', 'bg-sky-500', 'bg-gray-500', 'bg-slate-500', 'bg-neutral-500'
];

export default function ProfilePictureUploader({ currentAvatar, onAvatarUpdate, name }: ProfilePictureUploaderProps) {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar)

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            if (file.size > 1024 * 1024) {
                toast({ title: "Error", description: t('auth.avatar_uploader.error.file_size') })
                return
            }
            setSelectedFile(file)
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
                    // For preview purposes
                    setPreviewUrl(URL.createObjectURL(croppedImage));

                    // Upload to Supabase
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error('No user found');

                    const fileExt = selectedFile.name.split('.').pop();
                    const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;
                    const filePath = `${fileName}`;

                    const { data, error } = await supabase.storage
                        .from('avatars')
                        .upload(filePath, croppedImage, { contentType: 'image/png' });

                    if (error) {
                        throw error;
                    }

                    if (data) {
                        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);
                        onAvatarUpdate(publicUrl);
                        toast({
                            title: "Success",
                            description: t('auth.avatar_uploader.success'),
                        });
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                toast({
                    title: "Error",
                    description: t('auth.avatar_uploader.error.upload_failed'),
                    variant: "destructive",
                });
            } finally {
                setIsDialogOpen(false);
            }
        }
    }

    const handleRemove = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
        onAvatarUpdate('')
        // Reset the file input value to allow selecting the same file again
        const fileInput = document.getElementById('profile-upload') as HTMLInputElement
        if (fileInput) {
            fileInput.value = ''
        }
    }

    const getInitials = (name: string) => {
        return name.charAt(0).toUpperCase()
    }

    const getBackgroundColor = (name: string) => {
        const index = name.length - 1;
        return colors[index] || colors[colors.length - 1];
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-4">
                <div className={`w-20 h-20 text-white rounded-full flex items-center justify-center overflow-hidden ${getBackgroundColor(name)}`}>
                    {previewUrl ? (
                        <img src={previewUrl} alt="Profile picture" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-3xl font-bold">{name ? getInitials(name) : ''}</span>
                    )}
                </div>
                <div className="space-x-2 mt-2">
                    <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button
                        variant="outline"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('profile-upload')?.click();
                        }}
                        className="rounded-none"
                    >
                        {previewUrl ? t('auth.avatar_uploader.replace_image') : t('auth.avatar_uploader.upload_image')}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleRemove}
                        disabled={!previewUrl}
                        className="rounded-none"
                    >
                        {t('auth.avatar_uploader.remove')}
                    </Button>
                </div>
            </div>
            <p className="text-xs text-muted-foreground">
                {t('auth.avatar_uploader.file_requirements')}
            </p>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t('auth.avatar_uploader.crop.title')}</DialogTitle>
                    </DialogHeader>
                    <div className="relative h-64 w-full">
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
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-none">
                            {t('auth.avatar_uploader.crop.cancel')}
                        </Button>
                        <Button onClick={handleSave} className="rounded-none">
                            {t('auth.avatar_uploader.crop.save')}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}