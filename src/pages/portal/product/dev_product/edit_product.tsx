import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateProduct, deleteProduct, uploadProductImage, deleteProductImage } from './support_product'
import { Product } from './types'
import InputRightAddon from "@/components/ui/input-right-addon"
import { Loader2, X, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface EditProductFormProps {
    product: Product
    onClose: () => void
    onSuccess: () => void
}

interface ProductFormData {
    name: string
    description: string | null
    price: number
    is_active: boolean
    image: FileList
}

export const EditProductForm: React.FC<EditProductFormProps> = ({ product, onClose, onSuccess }) => {
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(product.image_url)
    const { register, handleSubmit, setValue, watch } = useForm<ProductFormData>({
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            is_active: product.is_active,
        },
    })

    const onSubmit = async (data: ProductFormData) => {
        try {
            setIsUploading(true)
            let imageUrl = product.image_url

            // Handle image upload if a new image is selected
            if (data.image?.[0]) {
                // Delete old image if it exists
                if (product.image_url) {
                    await deleteProductImage(product.image_url)
                }
                // Upload new image
                imageUrl = await uploadProductImage(data.image[0], product.merchant_id)
            }

            await updateProduct(product.product_id, {
                name: data.name,
                description: data.description,
                price: data.price,
                is_active: data.is_active,
                image_url: imageUrl,
            })
            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error updating product:', error)
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
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleRemoveImage = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (product.image_url) {
            try {
                await deleteProductImage(product.image_url)
                setPreviewUrl(null)
                await updateProduct(product.product_id, {
                    ...product,
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
            <div className="flex justify-end space-x-2">
                <Button
                    type="button"
                    onClick={handleDelete}
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
    )
}
