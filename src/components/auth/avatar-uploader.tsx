import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { supabase } from '@/utils/supabase/client'
import { toast } from "@/lib/hooks/use-toast"
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
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar)

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file size
        if (file.size > 1024 * 1024) {
            toast({ title: "Error", description: t('auth.avatar_uploader.error.file_size') })
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
            // Get the current session first
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session) {
                console.error('Session error:', sessionError);
                toast({
                    title: "Authentication Error",
                    description: t('auth.avatar_uploader.error.session_expired'),
                    variant: "destructive"
                });
                return;
            }

            // Use the session user directly
            const user = session.user;
            if (!user) {
                console.error('No user in session');
                toast({
                    title: "Authentication Error",
                    description: t('auth.avatar_uploader.error.user_not_found'),
                    variant: "destructive"
                });
                return;
            }

            // Always use jpg extension since we're converting to JPEG
            const fileName = `${user.id}/avatar-${Date.now()}.jpg`;

            const { data: storageData, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, {
                    contentType: file.type,
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                toast({
                    title: "Upload Error",
                    description: t('auth.avatar_uploader.error.upload_failed'),
                    variant: "destructive"
                });
                return;
            }

            if (!storageData) {
                toast({
                    title: "Upload Error",
                    description: t('auth.avatar_uploader.error.upload_failed'),
                    variant: "destructive"
                });
                return;
            }

            // Get public URL for the uploaded file
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(storageData.path);

            // Update merchant avatar with public URL
            const { error: updateError } = await supabase.rpc('update_merchant_avatar', {
                p_merchant_id: user.id,
                p_avatar_url: publicUrl
            });

            if (updateError) {
                console.error('Update error:', updateError);
                toast({
                    title: "Update Error",
                    description: t('auth.avatar_uploader.error.update_failed'),
                    variant: "destructive"
                });
                return;
            }

            // Update preview and parent component
            setPreviewUrl(publicUrl);
            onAvatarUpdate(publicUrl);

            // Trigger a refresh event
            window.dispatchEvent(new Event('merchant-profile-updated'));
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: "Error",
                description: t('auth.avatar_uploader.error.unexpected'),
                variant: "destructive"
            });
        }
    }

    const getInitials = (name: string) => {
        return name.charAt(0).toUpperCase()
    }

    const getBackgroundColor = (name: string) => {
        const index = name.length - 1;
        return colors[index] || colors[colors.length - 1];
    }

    const handleRemove = () => {
        setPreviewUrl(null)
        onAvatarUpdate('')
        const fileInput = document.getElementById('profile-upload') as HTMLInputElement
        if (fileInput) {
            fileInput.value = ''
        }
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
        </div>
    )
}