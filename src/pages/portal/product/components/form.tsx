import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createProduct, uploadProductImage } from './support'
import InputRightAddon from "@/components/ui/input-right-addon"
import { useUser } from '@/lib/hooks/use-user'
import { Loader2, X, Upload } from 'lucide-react'
import { toast } from "@/lib/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { supabase } from '@/utils/supabase/client'

interface CreateProductFormProps {
    onClose: () => void
    onSuccess: () => void
}

interface Fee {
    fee_type_id: string;
    name: string;
    percentage: number;
    is_enabled: boolean;
}

interface ProductFormData {
    name: string
    description: string | null
    price: number
    image: FileList
    image_url: string | null
    currency_code: string
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({ onClose, onSuccess }) => {
    const { user } = useUser()
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const { register, handleSubmit, setValue, watch } = useForm<ProductFormData>()
    const [availableFees, setAvailableFees] = useState<Fee[]>([])
    const [selectedFees, setSelectedFees] = useState<string[]>([])
    const [selectedCurrency, setSelectedCurrency] = useState('XOF')

    // Fetch available fees
    useEffect(() => {
        const fetchFees = async () => {
            if (!user?.id) return;

            const { data, error } = await supabase
                .rpc('fetch_organization_fees', {
                    p_merchant_id: user.id
                });

            if (error) {
                console.error('Error fetching fees:', error);
                return;
            }

            setAvailableFees(data || []);
        };

        fetchFees();
    }, [user?.id]);

    // Calculate total price with fees
    const calculateTotalPrice = (price: number) => {
        const selectedFeesList = availableFees.filter(fee =>
            selectedFees.includes(fee.fee_type_id)
        );

        const feeAmount = selectedFeesList.reduce((total, fee) => {
            return total + (price * (fee.percentage / 100));
        }, 0);

        return price + feeAmount;
    };

    // Handle fee selection
    const toggleFee = (feeId: string) => {
        setSelectedFees(prev =>
            prev.includes(feeId)
                ? prev.filter(id => id !== feeId)
                : [...prev, feeId]
        );
    };

    const onSubmit = async (data: ProductFormData) => {
        if (!user?.id) return

        try {
            setIsUploading(true)
            await createProduct({
                name: data.name,
                description: data.description,
                price: data.price,
                image_url: data.image_url,
                display_on_storefront: true,
                fee_type_ids: selectedFees,
                currency_code: selectedCurrency
            })

            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error creating product:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create product",
                variant: "destructive"
            })
        } finally {
            setIsUploading(false)
        }
    }

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !user?.id) return

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
            const uploadedUrl = await uploadProductImage(file, user.id)
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
        setValue('image_url', null)
        const dt = new DataTransfer()
        setValue('image', dt.files)
    }

    const formatAmount = (amount: number | undefined) => {
        return amount ? amount.toLocaleString("en-US") : "";
    };

    const parseAmount = (amount: string) => {
        return parseFloat(amount.replace(/,/g, ""));
    };

    // Calculate display price including fees
    const basePrice = watch("price") || 0;
    const finalPrice = calculateTotalPrice(basePrice);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    placeholder="Enter product name"
                    {...register('name', { required: true })}
                    className="rounded-none"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Enter product description"
                    {...register('description')}
                    className="rounded-none"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <InputRightAddon
                    id="price"
                    type="text"
                    placeholder="Enter amount"
                    value={formatAmount(watch("price"))}
                    onChange={(value) => setValue("price", parseAmount(value))}
                    currency={selectedCurrency}
                    onCurrencyChange={setSelectedCurrency}
                />
            </div>
            <div className="space-y-4">
                <Label>Additional Fees</Label>
                {availableFees.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                        {availableFees.map(fee => (
                            <Badge
                                key={fee.fee_type_id}
                                variant={selectedFees.includes(fee.fee_type_id) ? "default" : "outline"}
                                className="cursor-pointer rounded-none w-full flex items-center justify-between px-4 py-2"
                                onClick={() => toggleFee(fee.fee_type_id)}
                            >
                                <span>{fee.name}</span>
                                <span>({fee.percentage}%)</span>
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No fees available. Create fees in the checkout settings.</p>
                )}
            </div>

            {basePrice > 0 && selectedFees.length > 0 && (
                <Card className="p-4 space-y-3 rounded-none">
                    <h3 className="font-medium">Price Breakdown</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Base Price:</span>
                            <span>{formatAmount(basePrice)} XOF</span>
                        </div>
                        {availableFees
                            .filter(fee => selectedFees.includes(fee.fee_type_id))
                            .map(fee => {
                                const feeAmount = basePrice * (fee.percentage / 100);
                                return (
                                    <div key={fee.fee_type_id} className="flex justify-between text-muted-foreground">
                                        <span>{fee.name} ({fee.percentage}%):</span>
                                        <span>+ {formatAmount(feeAmount)} XOF</span>
                                    </div>
                                );
                            })
                        }
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                            <span>Final Price:</span>
                            <span>{formatAmount(finalPrice)} XOF</span>
                        </div>
                    </div>
                </Card>
            )}
            <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="mt-1.5">
                    <div className="flex items-center gap-4">
                        {previewUrl && (
                            <div className="relative w-56 h-36 overflow-hidden border border-border">
                                <img
                                    src={previewUrl}
                                    alt="Product preview"
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
        </form>
    )
}
