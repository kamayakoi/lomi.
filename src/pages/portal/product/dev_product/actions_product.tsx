import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Product, Transaction } from './types'
import { Separator } from "@/components/ui/separator"
import { LifeBuoy, ImageIcon, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { fetchProductTransactions } from './support_product'
import { updateProduct } from './support_product'
import { cn } from '@/lib/actions/utils'
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

type ProductActionsProps = {
    product: Product | null
    isOpen: boolean
    onClose: () => void
    onUpdate?: () => void
}

export default function ProductActions({ product, isOpen, onClose, onUpdate }: ProductActionsProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isEditingName, setIsEditingName] = useState(false)
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [editedName, setEditedName] = useState('')
    const [editedDescription, setEditedDescription] = useState('')
    const nameInputRef = useRef<HTMLInputElement>(null)
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null)

    const handleContactSupport = () => {
        const subject = encodeURIComponent(`[Support] — Product Issue: ${product?.product_id} (id)`)
        const mailtoLink = `mailto:hello@lomi.africa?subject=${subject}`
        window.location.href = mailtoLink
    }

    useEffect(() => {
        if (product?.product_id) {
            fetchProductTransactions(product.product_id).then(setTransactions)
            setEditedName(product.name || '')
            setEditedDescription(product.description || '')
        }
    }, [product?.product_id, product?.name, product?.description])

    const handleNameChange = async (newName: string) => {
        if (!product) return
        setEditedName(newName)
        // Update product immediately in UI
        product.name = newName
        try {
            await updateProduct(product.product_id, {
                ...product,
                name: newName
            })
            onUpdate?.()
        } catch (error) {
            console.error('Failed to update product name:', error)
            setEditedName(product.name || '')
            // Revert product name on error
            product.name = editedName
        }
    }

    const handleDescriptionChange = async (newDescription: string) => {
        if (!product) return
        setEditedDescription(newDescription)
        // Update product immediately in UI
        product.description = newDescription
        try {
            await updateProduct(product.product_id, {
                ...product,
                description: newDescription
            })
            onUpdate?.()
        } catch (error) {
            console.error('Failed to update product description:', error)
            setEditedDescription(product.description || '')
            // Revert product description on error
            product.description = editedDescription
        }
    }

    useEffect(() => {
        if (isEditingName && nameInputRef.current) {
            nameInputRef.current.focus()
        }
    }, [isEditingName])

    const handleStartEditingName = () => {
        setIsEditingName(true)
    }

    const handleStartEditingDescription = () => {
        setIsEditingDescription(true)
    }

    const handleToggleActive = async () => {
        if (!product) return
        const newValue = !product.is_active
        // Update UI immediately
        product.is_active = newValue
        // Force re-render
        setTransactions([...transactions])

        try {
            await updateProduct(product.product_id, {
                ...product,
                name: product.name,
                description: product.description,
                price: product.price,
                image_url: product.image_url,
                is_active: newValue,
                display_on_storefront: product.display_on_storefront
            })
            onUpdate?.()
        } catch (error) {
            // Revert on error
            product.is_active = !newValue
            setTransactions([...transactions])
            console.error('Failed to toggle active status:', error)
        }
    }

    const handleToggleStorefront = async () => {
        if (!product) return
        const newValue = !product.display_on_storefront
        // Update UI immediately
        product.display_on_storefront = newValue
        // Force re-render
        setTransactions([...transactions])

        try {
            await updateProduct(product.product_id, {
                ...product,
                name: product.name,
                description: product.description,
                price: product.price,
                image_url: product.image_url,
                is_active: product.is_active,
                display_on_storefront: newValue
            })
            onUpdate?.()
        } catch (error) {
            // Revert on error
            product.display_on_storefront = !newValue
            setTransactions([...transactions])
            console.error('Failed to toggle storefront status:', error)
        }
    }

    if (!product) return null

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent
                    className="sm:max-w-2xl overflow-y-auto focus:outline-none focus-visible:outline-none [&:has(:focus)]:outline-none [&:focus-within]:outline-none [&>button]:hidden"
                >
                    <Card className="border-0 shadow-none">
                        <CardHeader className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-medium">Product details</CardTitle>
                            <button onClick={onClose} className="text-muted-foreground hover:text-foreground md:hidden">
                                <X className="h-4 w-4" />
                            </button>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4 overflow-auto">
                            <div className="space-y-3 text-sm">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 self-stretch min-h-[140px] w-[140px]">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                                <ImageIcon className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-grow flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-muted-foreground">Status</span>
                                            <button
                                                onClick={handleToggleActive}
                                                className={cn(
                                                    "px-2 py-0.5 text-xs font-medium transition-colors duration-200",
                                                    product.is_active
                                                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-800"
                                                        : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                                                )}
                                            >
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </div>

                                        <div className="flex-grow flex flex-col justify-between overflow-hidden">
                                            <div className="space-y-2">
                                                <div>
                                                    <span className="text-sm text-muted-foreground block">Name</span>
                                                    {isEditingName ? (
                                                        <input
                                                            ref={nameInputRef}
                                                            type="text"
                                                            value={editedName}
                                                            onChange={(e) => handleNameChange(e.target.value)}
                                                            className="text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Escape') {
                                                                    setIsEditingName(false)
                                                                    setEditedName(product.name || '')
                                                                }
                                                            }}
                                                            onBlur={() => setIsEditingName(false)}
                                                        />
                                                    ) : (
                                                        <p
                                                            className="text-sm font-medium line-clamp-1 cursor-pointer hover:text-blue-500"
                                                            onClick={handleStartEditingName}
                                                        >
                                                            {product.name}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <span className="text-sm text-muted-foreground block">Description</span>
                                                    {isEditingDescription ? (
                                                        <textarea
                                                            ref={descriptionInputRef}
                                                            value={editedDescription}
                                                            onChange={(e) => handleDescriptionChange(e.target.value)}
                                                            className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full resize-none line-clamp-3"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Escape') {
                                                                    setIsEditingDescription(false)
                                                                    setEditedDescription(product.description || '')
                                                                }
                                                            }}
                                                            onBlur={() => setIsEditingDescription(false)}
                                                            rows={2}
                                                        />
                                                    ) : (
                                                        <p
                                                            className="text-sm line-clamp-3 cursor-pointer hover:text-blue-500"
                                                            onClick={handleStartEditingDescription}
                                                        >
                                                            {product.description || 'Add a description...'}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Product ID</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(product.product_id);
                                            toast({
                                                description: "Copied to clipboard",
                                                duration: 1000
                                            });
                                        }}
                                        className="font-mono text-xs text-blue-500 hover:text-blue-500"
                                    >
                                        {product.product_id}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Price</span>
                                    <span>{formatCurrency(product.price, product.currency_code)}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Display on storefront</span>
                                    <button
                                        onClick={handleToggleStorefront}
                                        className={cn(
                                            "px-2 py-0.5 text-xs font-medium transition-colors duration-200",
                                            product.display_on_storefront
                                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                                : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                        )}
                                    >
                                        {product.display_on_storefront ? 'Yes' : 'No'}
                                    </button>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium">Transactions</h3>
                                    {transactions.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No transactions found for this product.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {transactions.map((transaction) => (
                                                <div key={transaction.transaction_id} className="border rounded-none p-2 space-y-1">
                                                    <div className="font-medium text-sm">{transaction.description}</div>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <span>{formatDate(transaction.created_at)}</span>
                                                        <span>{formatCurrency(transaction.gross_amount, transaction.currency_code)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button variant="outline" className="w-full sm:w-auto rounded-none" onClick={handleContactSupport}>
                                    <LifeBuoy className="mr-2 h-4 w-4" />
                                    Contact Support
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </SheetContent>
            </Sheet>
            <Toaster />
        </>
    )
}

function formatCurrency(amount: number, currency: string): string {
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })} ${currency}`;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
