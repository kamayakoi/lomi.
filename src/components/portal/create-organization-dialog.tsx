import { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2Icon } from 'lucide-react'
import { supabase } from '@/utils/supabase/client'
import { toast } from '@/lib/hooks/use-toast'
import { useUser } from '@/lib/hooks/use-user'
import NewOrganizationLogoUploader from '@/components/auth/new-org-logo-uploader'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const createOrgSchema = z.object({
    name: z.string().min(2, "Organization name must be at least 2 characters").max(50, "Organization name must be less than 50 characters"),
});

type CreateOrgFormValues = z.infer<typeof createOrgSchema>

interface CreateOrganizationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateOrganizationDialog({ open, onOpenChange }: CreateOrganizationDialogProps) {
    const { user } = useUser()
    const [loading, setLoading] = useState(false)
    const [logoUrl, setLogoUrl] = useState<string | null>(null)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateOrgFormValues>({
        resolver: zodResolver(createOrgSchema),
        defaultValues: {
            name: "",
        },
    })

    const orgName = watch('name')

    const onSubmit = async (data: CreateOrgFormValues) => {
        setLoading(true)
        try {
            if (!user) throw new Error('No user found');

            // Create a basic organization and link it to the merchant
            const { data: orgData, error } = await supabase.rpc('create_organization', {
                p_merchant_id: user.id,
                p_name: data.name
            });

            if (error) throw error;

            if (!orgData || orgData.length === 0) {
                throw new Error('No organization data returned');
            }

            const [newOrg] = orgData;
            if (!newOrg.organization_id) {
                throw new Error('No organization ID returned');
            }

            // If we have a logo, upload it directly
            if (logoUrl) {
                try {
                    // Convert the blob URL to a blob
                    const response = await fetch(logoUrl);
                    const blob = await response.blob();

                    // Create a unique path for the new organization's logo
                    const uniqueLogoPath = `${newOrg.organization_id}/logo.png`;

                    // Upload the logo
                    const { error: uploadError } = await supabase
                        .storage
                        .from('logos')
                        .upload(uniqueLogoPath, blob, {
                            contentType: 'image/png',
                            upsert: true
                        });

                    if (uploadError) throw uploadError;

                    // Update the organization with the logo path
                    await supabase.rpc('update_organization_logo', {
                        p_organization_id: newOrg.organization_id,
                        p_logo_url: uniqueLogoPath
                    });
                } catch (error) {
                    console.error('Error handling logo:', error);
                    toast({
                        title: "Warning",
                        description: "Organization created but logo upload failed",
                        variant: "destructive",
                    });
                }
            }

            toast({
                title: "Success",
                description: "Organization created successfully",
            });

            // Close the dialog
            onOpenChange(false);

            // Redirect to the new organization's portal
            window.location.href = `${window.location.pathname}?org=${newOrg.organization_id}`;
        } catch (error) {
            console.error('Error creating organization:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create organization",
                variant: "destructive",
            });
        } finally {
            setLoading(false)
        }
    }

    const handleLogoUpdate = (newLogoUrl: string) => {
        setLogoUrl(newLogoUrl)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] w-[95vw] bg-background/95 backdrop-blur-sm border-border/40 rounded-none p-4 sm:p-6">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-xl font-semibold">Create New Organization</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-6">
                        <NewOrganizationLogoUploader
                            currentLogo={logoUrl}
                            onLogoUpdate={handleLogoUpdate}
                            companyName={orgName || 'New Organization'}
                        />

                        <div className="space-y-3">
                            <Label htmlFor="name" className="text-sm font-medium">Organization Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter organization name"
                                {...register('name')}
                                className="rounded-none bg-background border-border/40 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 px-4"
                                disabled={loading}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full rounded-none h-12 bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 border-none"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Organization"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
} 