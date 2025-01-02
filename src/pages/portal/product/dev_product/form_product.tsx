import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createProduct, uploadProductImage } from './support_product'
import InputRightAddon from "@/components/ui/input-right-addon"
import { useUser } from '@/lib/hooks/useUser'
import { Loader2, X, Upload } from 'lucide-react'

interface CreateProductFormProps {
    onClose: () => void
    onSuccess: () => void
}

interface ProductFormData {
    name: string
    description: string | null
    price: number
    image: FileList
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({ onClose, onSuccess }) => {
    const { user } = useUser()
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const { register, handleSubmit, setValue, watch } = useForm<ProductFormData>()

    const onSubmit = async (data: ProductFormData) => {
        if (!user?.id) return

        try {
            setIsUploading(true)
            let imageUrl: string | null = null

            // Upload image if selected
            if (data.image?.[0]) {
                imageUrl = await uploadProductImage(data.image[0], user.id)
            }

            await createProduct({
                name: data.name,
                description: data.description,
                price: data.price,
                image_url: imageUrl,
            })

            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error creating product:', error)
        } finally {
            setIsUploading(false)
        }
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.preventDefault()
        setPreviewUrl(null)
        // Create an empty DataTransfer to get an empty FileList
        const dt = new DataTransfer()
        setValue('image', dt.files)
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
                    {...register('name', { required: true })}
                    className="rounded-none"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
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
