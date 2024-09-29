import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from '@/utils/supabase/client'
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Cropper from 'react-easy-crop'
import { Area } from 'react-easy-crop'

interface ProfilePictureUploaderProps {
    currentAvatar: string | null
    onAvatarUpdate: (newAvatarUrl: string) => void
    name: string
}

export default function ProfilePictureUploader({ currentAvatar, onAvatarUpdate, name }: ProfilePictureUploaderProps) {
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
                toast({ title: "Error", description: "File size must be less than 1MB" })
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
                )

                if (croppedImage) {
                    // For preview purposes
                    setPreviewUrl(URL.createObjectURL(croppedImage))

                    // Upload to Supabase
                    const { data, error } = await supabase.storage
                        .from('avatars')
                        .upload(`avatar-${Date.now()}.png`, croppedImage, { contentType: 'image/png' })

                    if (error) {
                        throw error
                    }

                    if (data) {
                        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path)
                        onAvatarUpdate(publicUrl)
                        toast({
                            title: "Success",
                            description: "Profile picture updated successfully",
                        })
                    }
                }
            } catch (error) {
                console.error('Error:', error)
                toast({
                    title: "Error",
                    description: "Failed to upload profile picture",
                    variant: "destructive",
                })
            } finally {
                setIsDialogOpen(false)
            }
        }
    }

    const handleRemove = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
        onAvatarUpdate('')
    }

    const getInitials = (name: string) => {
        const names = name.split(' ')
        const initials = names.map(name => name.charAt(0)).join('')
        return initials.toUpperCase().charAt(0)
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                    {previewUrl ? (
                        <AvatarImage src={previewUrl} alt="Profile picture" />
                    ) : (
                        <AvatarFallback className="bg-blue-500 text-white">
                            {name ? getInitials(name) : ''}
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="space-x-2">
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
                    >
                        Upload image
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleRemove}
                        disabled={!previewUrl}
                    >
                        Remove
                    </Button>
                </div>
            </div>
            <p className="text-xs text-muted-foreground">
                *png, *jpeg files up to 1MB at least 200px by 200px
            </p>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Crop Profile Picture</DialogTitle>
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
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}