import React, { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Cropper from 'react-easy-crop'
import { Area } from 'react-easy-crop'
import { supabase } from '@/utils/supabase/client'
import { toast } from "@/components/ui/use-toast"

interface ProfilePictureUploaderProps {
    currentAvatar: string | null
    onAvatarUpdate: (newAvatarUrl: string) => void
}

export default function ProfilePictureUploader({ currentAvatar, onAvatarUpdate }: ProfilePictureUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0]
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
                    const { data, error } = await supabase.storage
                        .from('avatars')
                        .upload(`avatar-${Date.now()}.png`, croppedImage, { contentType: 'image/png' })

                    if (error) {
                        throw error
                    }

                    if (data) {
                        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path)
                        onAvatarUpdate(publicUrl)
                        toast({ title: "Success", description: "Profile picture updated successfully" })
                    }
                }
            } catch (error) {
                console.error('Error:', error)
                toast({ title: "Error", description: "Failed to upload profile picture" })
            } finally {
                setIsDialogOpen(false)
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <div className="h-20 w-20 bg-gray-200 flex items-center justify-center overflow-hidden rounded-full">
                    {currentAvatar ? (
                        <img src={currentAvatar} alt="Profile picture" className="object-cover w-full h-full" />
                    ) : (
                        <span className="text-gray-500">Avatar</span>
                    )}
                </div>
                <div className="space-y-2">
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        id="avatar-upload"
                        className="hidden"
                    />
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <Button variant="outline" asChild>
                            <span>Choose file</span>
                        </Button>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                        Must be smaller than 1MB
                    </p>
                </div>
            </div>

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