import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createSubscriptionPlan, uploadPlanImage } from './support'
import { frequency, failed_payment_action } from './types'
import InputRightAddon from "@/components/ui/input-right-addon"
import { Loader2, X, Upload } from 'lucide-react'
import { cn } from '@/lib/actions/utils'
import { toast } from "@/lib/hooks/use-toast"

interface CreatePlanFormProps {
    onClose: () => void
    onSuccess: () => void
    merchantId: string
}

type SubscriptionLength = 'automatic' | 'fixed'
type CollectionDateType = 'maintain' | 'specific_day'

interface SubscriptionPlanFormData {
    name: string
    description: string | null
    billing_frequency: frequency
    amount: number
    failed_payment_action?: failed_payment_action
    collection_date_type: CollectionDateType
    collection_day?: number
    subscription_length: SubscriptionLength
    fixed_charges?: number
    first_payment_type: 'initial' | 'prorated'
    merchant_id: string
    currency_code: string
    metadata: Record<string, unknown>
    image: FileList
    image_url: string
}

const frequencyOptions: frequency[] = ['weekly', 'bi-weekly', 'monthly', 'bi-monthly', 'quarterly', 'semi-annual', 'yearly', 'one-time']
const fixedChargesOptions: number[] = [3, 6, 9, 12, 18, 24, 36, 48, 60, 72, 84, 96]
const collectionDayOptions: number[] = Array.from({ length: 31 }, (_, i) => i + 1)

export function CreatePlanForm({ onClose, onSuccess, merchantId }: CreatePlanFormProps) {
    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<SubscriptionPlanFormData>({
        defaultValues: {
            merchant_id: merchantId,
            currency_code: 'XOF',
            subscription_length: 'automatic',
            first_payment_type: 'initial',
            collection_date_type: 'maintain',
            metadata: {},
            amount: 0,
        },
    })

    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const subscriptionLength = watch('subscription_length')
    const collectionDateType = watch('collection_date_type')
    const billingFrequency = watch('billing_frequency')

    const isOneTimeFrequency = billingFrequency === 'one-time'

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

            // Upload image
            const uploadedUrl = await uploadPlanImage(file, merchantId)
            if (!uploadedUrl) {
                throw new Error('Failed to upload image')
            }
            setValue('image_url', uploadedUrl)
        } catch (error) {
            console.error('Error handling image:', error)
            toast({ title: "Error", description: "Failed to upload image", variant: "destructive" })
            setPreviewUrl(null)
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.preventDefault()
        setPreviewUrl(null)
        const dt = new DataTransfer()
        setValue('image', dt.files)
    }

    const onSubmit = async (data: SubscriptionPlanFormData) => {
        if (!merchantId) return

        try {
            setIsUploading(true)
            const metadata: Record<string, unknown> = {
                subscription_length: data.subscription_length,
                fixed_charges: data.fixed_charges,
            }

            await createSubscriptionPlan({
                name: data.name,
                description: data.description,
                billing_frequency: data.billing_frequency,
                amount: data.amount,
                failed_payment_action: data.failed_payment_action,
                charge_day: data.collection_date_type === 'specific_day' ? data.collection_day : undefined,
                metadata: metadata,
                first_payment_type: data.first_payment_type,
                display_on_storefront: true,
                image_url: data.image_url
            })
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error creating subscription plan:', error)
            toast({ title: "Error", description: "Failed to create subscription plan", variant: "destructive" })
        } finally {
            setIsUploading(false)
        }
    }

    const formatAmount = (amount: number | undefined) => {
        return amount ? amount.toLocaleString("en-US") : ""
    }

    const parseAmount = (amount: string) => {
        return parseFloat(amount.replace(/,/g, ""))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="max-w-lg">
                <div className="max-h-[70vh] overflow-y-auto">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Create subscription plan</CardTitle>
                            <CardDescription>Set up a new subscription plan for your customers</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="image">Plan Image</Label>
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
                                    className="rounded-none w-full"
                                    {...register('name', { required: 'Plan name is required' })}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Plan description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the plan"
                                    className="rounded-none"
                                    {...register('description')}
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
                                {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="billing_frequency">Plan frequency</Label>
                                <Controller
                                    name="billing_frequency"
                                    control={control}
                                    rules={{ required: 'Billing frequency is required' }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full rounded-none">
                                                <SelectValue placeholder="Select billing frequency">
                                                    {frequencyOptions.find(f => f === field.value)?.charAt(0).toUpperCase() + (frequencyOptions.find(f => f === field.value)?.slice(1) ?? '')}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className="rounded-none">
                                                {frequencyOptions.map((frequency) => (
                                                    <SelectItem key={frequency} value={frequency}>
                                                        {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.billing_frequency && <p className="text-sm text-red-500">{errors.billing_frequency.message}</p>}
                            </div>

                            {!isOneTimeFrequency && (
                                <>
                                    <div className="space-y-3">
                                        <Label>Subscription length</Label>
                                        <RadioGroup
                                            defaultValue="automatic"
                                            onValueChange={(value: SubscriptionLength) => setValue('subscription_length', value)}
                                            className="rounded-none space-y-3"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem value="automatic" id="automatic" />
                                                <Label htmlFor="automatic">Automatic renewal</Label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem value="fixed" id="fixed" />
                                                <Label htmlFor="fixed">End after specific charges</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {subscriptionLength === 'fixed' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="fixed_charges">Number of charges</Label>
                                            <Controller
                                                name="fixed_charges"
                                                control={control}
                                                rules={{ required: 'Number of charges is required' }}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                                        <SelectTrigger className="w-full rounded-none">
                                                            <SelectValue placeholder="Select number of charges" />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-60 overflow-y-auto rounded-none">
                                                            {fixedChargesOptions.map((option) => (
                                                                <SelectItem key={option} value={option.toString()}>
                                                                    End after {option} charges
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.fixed_charges && <p className="text-sm text-red-500">{errors.fixed_charges.message}</p>}
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                                    className={cn(
                                        "px-3 py-1 text-xs font-medium transition-colors duration-200 cursor-pointer rounded-none",
                                        showAdvancedSettings
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
                                            : "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                                    )}
                                >
                                    Advanced Settings
                                </button>
                            </div>

                            {showAdvancedSettings && !isOneTimeFrequency && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label>Collection Date</Label>
                                        <RadioGroup
                                            defaultValue="maintain"
                                            onValueChange={(value: CollectionDateType) => setValue('collection_date_type', value)}
                                            className="space-y-3"
                                        >
                                            <div className="flex items-start space-x-3">
                                                <RadioGroupItem value="maintain" id="maintain" className="mt-1" />
                                                <Label htmlFor="maintain" className="leading-tight">Maintain the collection date according to the frequency of the subscription</Label>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <RadioGroupItem value="specific_day" id="specific_day" className="mt-1" />
                                                <Label htmlFor="specific_day" className="leading-tight">Charge subscription on a specific day of the month</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {collectionDateType === 'specific_day' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="collection_day">Collection day of the month</Label>
                                            <Controller
                                                name="collection_day"
                                                control={control}
                                                rules={{ required: 'Collection day is required' }}
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                                        <SelectTrigger className="w-full rounded-none">
                                                            <SelectValue placeholder="Select collection day" />
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-60 overflow-y-auto rounded-none">
                                                            {collectionDayOptions.map((day) => (
                                                                <SelectItem key={day} value={day.toString()}>
                                                                    {day}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.collection_day && <p className="text-sm text-red-500">{errors.collection_day.message}</p>}
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <Label>First payment of the subscription</Label>
                                        <Controller
                                            name="first_payment_type"
                                            control={control}
                                            render={({ field }) => (
                                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-4">
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <Card className="rounded-none">
                                                            <CardHeader className="px-4">
                                                                <CardTitle className="flex items-center">
                                                                    <RadioGroupItem value="initial" id="initial" className="mr-3" />
                                                                    <Label htmlFor="initial">Initial charge</Label>
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="px-4 text-sm text-muted-foreground">
                                                                The subscription will be charged at the beginning and in each subsequent period.
                                                            </CardContent>
                                                        </Card>
                                                        <Card className="rounded-none">
                                                            <CardHeader className="px-4">
                                                                <CardTitle className="flex items-center">
                                                                    <RadioGroupItem value="non_initial" id="non_initial" className="mr-3" />
                                                                    <Label htmlFor="non_initial">Non-initial charge</Label>
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="px-4 text-sm text-muted-foreground">
                                                                Subscription will be initiated without charge. A charge will be applied on the nearest selected debit day.
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </RadioGroup>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="failed_payment_action">Failed Payment Action</Label>
                                        <Controller
                                            name="failed_payment_action"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-full rounded-none">
                                                        <SelectValue placeholder="Select action" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-none">
                                                        <SelectItem value="cancel">Cancel subscription</SelectItem>
                                                        <SelectItem value="pause">Pause subscription</SelectItem>
                                                        <SelectItem value="continue">Continue subscription</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isUploading}
                        className="px-4 py-2 h-10 rounded-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isUploading}
                        className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 h-10 rounded-none"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create'
                        )}
                    </Button>
                </div>
            </div>
        </form>
    )
}
