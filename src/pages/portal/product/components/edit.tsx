import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateProduct, deleteProduct, uploadProductImage, deleteProductImage, fetchProductFees } from './support'
import { Product } from './products'
import InputRightAddon from "@/components/ui/input-right-addon"
import { Loader2, X, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from "@/lib/hooks/use-toast"
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
import { useUser } from '@/lib/hooks/use-user'
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { supabase } from '@/utils/supabase/client'

interface EditProductFormProps {
    product: Product
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
    is_active: boolean
    image: FileList
    image_url: string | null
    display_on_storefront: boolean
}

export const EditProductForm: React.FC<EditProductFormProps> = ({ product, onClose, onSuccess }) => {
    const { user } = useUser()
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(product.image_url)
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const { register, handleSubmit, setValue, watch } = useForm<ProductFormData>({
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            image_url: product.image_url,
            is_active: product.is_active,
            display_on_storefront: product.display_on_storefront
        },
    })
    const [availableFees, setAvailableFees] = useState<Fee[]>([])
    const [selectedFees, setSelectedFees] = useState<string[]>([])

    // Fetch available fees and current product fees
    useEffect(() => {
        const fetchFees = async () => {
            if (!user?.id) return;

            // Fetch all available fees
            const { data: allFees, error: feesError } = await supabase
                .rpc('fetch_organization_fees', {
                    p_merchant_id: user.id
                });

            if (feesError) {
                console.error('Error fetching fees:', feesError);
                return;
            }

            setAvailableFees(allFees || []);

            // Fetch current product fees
            const productFees = await fetchProductFees(product.product_id);
            setSelectedFees(productFees.map((fee: Fee) => fee.fee_type_id));
        };

        fetchFees();
    }, [user?.id, product.product_id]);

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
            await updateProduct(product.product_id, {
                name: data.name,
                description: data.description,
                price: data.price,
                image_url: data.image_url,
                is_active: data.is_active,
                display_on_storefront: data.display_on_storefront,
                fee_type_ids: selectedFees
            })
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error updating product:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update product",
                variant: "destructive"
            })
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async () => {
        try {
            if (product.image_url) {
                await deleteProductImage(product.image_url)
            }
            await deleteProduct(product.product_id)
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error deleting product:', error)
            toast({ title: "Error", description: "Failed to delete product", variant: "destructive" })
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

            // Delete old image if it exists
            if (product.image_url) {
                await deleteProductImage(product.image_url)
            }

            // Upload new image
            const uploadedUrl = await uploadProductImage(file, product.merchant_id)
            if (!uploadedUrl) {
                throw new Error('Failed to upload image')
            }

            setPreviewUrl(uploadedUrl)
            setValue('image_url', uploadedUrl) // Set the image_url in the form data
            product.image_url = uploadedUrl // Update the product reference
        } catch (error) {
            console.error('Error handling image:', error)
            toast({ title: "Error", description: "Failed to upload image", variant: "destructive" })
            setPreviewUrl(product.image_url) // Revert to original image
            setValue('image_url', product.image_url) // Reset the form data
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemoveImage = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (product.image_url) {
            try {
                setIsUploading(true)
                await deleteProductImage(product.image_url)
                setPreviewUrl(null)
                setValue('image_url', null) // Set the image_url to null in form data
                product.image_url = null // Update the product reference
            } catch (error) {
                console.error('Error removing image:', error)
                toast({ title: "Error", description: "Failed to remove image", variant: "destructive" })
                setPreviewUrl(product.image_url) // Revert on error
                setValue('image_url', product.image_url) // Reset the form data
            } finally {
                setIsUploading(false)
            }
        } else {
            setPreviewUrl(null)
            setValue('image_url', null) // Set the image_url to null in form data
        }
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
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                        id="name"
                        placeholder="Enter product name"
                        {...register('name')}
                        className="rounded-none"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Product Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Enter product description"
                        value={watch("description") || ""}
                        onChange={(e) => setValue("description", e.target.value)}
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
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="image">Product Image</Label>
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

                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        onClick={() => setShowDeleteAlert(true)}
                        disabled={isUploading}
                        className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 h-10 rounded-none"
                    >
                        Delete
                    </Button>
                    <Button
                        type="submit"
                        disabled={isUploading}
                        className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 h-10 rounded-none"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save'
                        )}
                    </Button>
                </div>
            </form>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent className="rounded-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product
                            and remove all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 rounded-none"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
