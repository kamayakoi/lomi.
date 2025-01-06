import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateSubscriptionPlan, deleteSubscriptionPlan, uploadPlanImage, deletePlanImage } from './support_subscriptions'
import { SubscriptionPlan, frequency, failed_payment_action } from './types'
import InputRightAddon from "@/components/ui/input-right-addon"
import { Loader2, X, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface EditPlanFormProps {
    plan: SubscriptionPlan
    onClose: () => void
    onSuccess: () => void
}

interface PlanFormData {
    name: string;
    description: string | null;
    billing_frequency: frequency;
    amount: number;
    failed_payment_action: failed_payment_action;
    charge_day: number | null;
    metadata: Record<string, unknown>;
    display_on_storefront: boolean;
    image: FileList;
}

const frequencyOptions: frequency[] = ['weekly', 'bi-weekly', 'monthly', 'bi-monthly', 'quarterly', 'semi-annual', 'yearly', 'one-time']

export const EditPlanForm: React.FC<EditPlanFormProps> = ({ plan, onClose, onSuccess }) => {
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(plan.image_url)
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PlanFormData>({
        defaultValues: {
            name: plan.name,
            description: plan.description,
            billing_frequency: plan.billing_frequency,
            amount: plan.amount,
            failed_payment_action: plan.failed_payment_action,
            charge_day: plan.charge_day,
            metadata: plan.metadata,
            display_on_storefront: plan.display_on_storefront,
        },
    })

    const onSubmit = async (data: PlanFormData) => {
        try {
            setIsUploading(true)
            await updateSubscriptionPlan(plan.plan_id, {
                name: data.name,
                description: data.description,
                billing_frequency: data.billing_frequency,
                amount: data.amount,
                failed_payment_action: data.failed_payment_action,
                charge_day: data.charge_day,
                metadata: data.metadata,
                display_on_storefront: data.display_on_storefront,
                image_url: plan.image_url,
            })
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error updating plan:', error)
            toast({ title: "Error", description: "Failed to update plan", variant: "destructive" })
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async () => {
        try {
            if (plan.image_url) {
                await deletePlanImage(plan.image_url)
            }
            await deleteSubscriptionPlan(plan.plan_id)
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error deleting plan:', error)
        }
    }

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file size
        if (file.size > 3 * 1024 * 1024) {
            toast({ title: "Error", description: "File size must be less than 3MB", variant: "destructive" })
            return
        }

        // Validate file type
        const fileType = file.type.toLowerCase()
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(fileType)) {
            toast({ title: "Error", description: "Only JPG and PNG files are allowed", variant: "destructive" })
            return
        }

        try {
            setIsUploading(true)
            // Create preview
            const previewUrl = URL.createObjectURL(file)
            setPreviewUrl(previewUrl)

            // Delete old image if it exists
            if (plan.image_url) {
                await deletePlanImage(plan.image_url)
            }

            // Upload new image
            const uploadedUrl = await uploadPlanImage(file, plan.merchant_id)
            if (!uploadedUrl) {
                throw new Error('Failed to upload image')
            }

            // Update plan with new image URL
            await updateSubscriptionPlan(plan.plan_id, {
                ...plan,
                image_url: uploadedUrl
            })
        } catch (error) {
            console.error('Error handling image:', error)
            toast({ title: "Error", description: "Failed to upload image", variant: "destructive" })
            setPreviewUrl(plan.image_url) // Revert to original image
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemoveImage = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (plan.image_url) {
            try {
                await deletePlanImage(plan.image_url)
                setPreviewUrl(null)
                await updateSubscriptionPlan(plan.plan_id, {
                    ...plan,
                    image_url: null
                })
            } catch (error) {
                console.error('Error removing image:', error)
            }
        } else {
            setPreviewUrl(null)
        }
    }

    const formatAmount = (amount: number | undefined) => {
        return amount ? amount.toLocaleString("en-US") : "";
    };

    const parseAmount = (amount: string) => {
        return parseFloat(amount.replace(/,/g, ""));
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="max-w-lg">
                    <div className="max-h-[70vh] overflow-y-auto">
                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle>Edit subscription plan</CardTitle>
                                <CardDescription>Update your subscription plan details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="image">Plan image</Label>
                                    <div className="mt-1.5">
                                        <div className="flex items-center gap-4">
                                            {previewUrl && (
                                                <div className="relative w-56 h-36 overflow-hidden border border-border">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Plan preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        onClick={handleRemoveImage}
                                                        className="absolute top-1 right-1 p-1 bg-red-500/90 hover:bg-red-500 text-white transition-colors"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                            <label
                                                htmlFor="image"
                                                className="flex flex-col items-center justify-center w-full h-36 cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors duration-200 bg-gray-50 dark:bg-gray-800/50"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="h-8 w-8 text-gray-400 mb-3" />
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-medium">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        PNG, JPG up to 3MB
                                                    </p>
                                                </div>
                                                <Input
                                                    id="image"
                                                    type="file"
                                                    accept="image/*"
                                                    {...register('image')}
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Plan name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter plan name"
                                        {...register('name', { required: 'Plan name is required' })}
                                        className="rounded-none w-full"
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Plan description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the plan"
                                        value={watch("description") || ""}
                                        onChange={(e) => setValue("description", e.target.value)}
                                        className="rounded-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amount">Plan price</Label>
                                    <InputRightAddon
                                        id="amount"
                                        type="text"
                                        placeholder="Enter amount"
                                        value={formatAmount(watch("amount"))}
                                        onChange={(value) => setValue("amount", parseAmount(value))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="billing_frequency">Frequency</Label>
                                    <Select
                                        value={watch("billing_frequency")}
                                        onValueChange={(value) => setValue("billing_frequency", value as frequency)}
                                    >
                                        <SelectTrigger className="w-full rounded-none">
                                            <SelectValue placeholder="Select billing frequency" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none">
                                            {frequencyOptions.map((frequency) => (
                                                <SelectItem key={frequency} value={frequency}>
                                                    {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button
                                        type="button"
                                        onClick={() => setShowDeleteAlert(true)}
                                        disabled={isUploading}
                                        className="bg-red-500 text-white hover:bg-red-600 rounded-none"
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isUploading}
                                        className="rounded-none bg-blue-500 text-white hover:bg-blue-600"
                                    >
                                        {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent className="rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this plan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the subscription plan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 text-white hover:bg-red-600 rounded-none"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
