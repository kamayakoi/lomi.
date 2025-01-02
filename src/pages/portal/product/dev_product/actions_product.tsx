import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Product, Transaction } from './types'
import { Separator } from "@/components/ui/separator"
import { LifeBuoy, ImageIcon } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { fetchProductTransactions } from './support_product'
import { updateProduct } from './support_product'

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
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                className="sm:max-w-2xl overflow-y-auto focus:outline-none focus-visible:outline-none [&:has(:focus)]:outline-none [&:focus-within]:outline-none [&>button]:hidden"
            >
                <Card className="border-0 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Product details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <section className="flex gap-4 items-start">
                                <div className="relative w-36 h-36 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="h-12 w-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow h-36 flex flex-col">
                                    <div className="flex-1 min-h-0">
                                        <div>
                                            {isEditingName ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        ref={nameInputRef}
                                                        type="text"
                                                        value={editedName}
                                                        onChange={(e) => handleNameChange(e.target.value)}
                                                        className="flex-grow text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Escape') {
                                                                setIsEditingName(false)
                                                                setEditedName(product.name || '')
                                                            }
                                                        }}
                                                        onBlur={() => setIsEditingName(false)}
                                                    />
                                                </div>
                                            ) : (
                                                <h3
                                                    className="text-lg font-medium cursor-pointer hover:text-blue-500"
                                                    onClick={handleStartEditingName}
                                                >
                                                    {product.name}
                                                </h3>
                                            )}
                                        </div>

                                        <div className="mt-2">
                                            {isEditingDescription ? (
                                                <div className="w-[450px]">
                                                    <textarea
                                                        ref={descriptionInputRef}
                                                        value={editedDescription}
                                                        onChange={(e) => handleDescriptionChange(e.target.value)}
                                                        className="w-full text-sm text-muted-foreground bg-transparent border-none focus:outline-none focus:ring-0 p-0 resize-none overflow-y-auto max-h-[40px] scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Escape') {
                                                                setIsEditingDescription(false)
                                                                setEditedDescription(product.description || '')
                                                            }
                                                        }}
                                                        onBlur={() => setIsEditingDescription(false)}
                                                        rows={2}
                                                    />
                                                </div>
                                            ) : (
                                                <p
                                                    className="text-sm text-muted-foreground cursor-pointer hover:text-blue-500 whitespace-pre-wrap break-words overflow-y-auto max-h-[40px] w-[450px] scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent"
                                                    onClick={handleStartEditingDescription}
                                                >
                                                    {product.description || 'Add a description...'}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-2">
                                            <span className="text-lg font-medium">
                                                {formatCurrency(product.price, product.currency_code)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-1">
                                        <button
                                            onClick={handleToggleActive}
                                            className={`
                                                px-3 py-1 text-xs font-medium transition-colors duration-200 cursor-pointer
                                                ${product.is_active
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                                                }
                                            `}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                        <button
                                            onClick={handleToggleStorefront}
                                            className={`
                                                px-3 py-1 text-xs font-medium transition-colors duration-200 cursor-pointer
                                                ${product.display_on_storefront
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }
                                            `}>
                                            Storefront
                                        </button>
                                    </div>
                                </div>
                            </section>
                            <Separator />
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Transactions</h3>
                                {transactions.length === 0 ? (
                                    <p className="text-sm text-gray-500">No transactions found for this product.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {transactions.map((transaction) => (
                                            <li key={transaction.transaction_id} className="border rounded p-2">
                                                <div className="font-medium">{transaction.description}</div>
                                                <div className="text-sm text-gray-500">{formatCurrency(transaction.gross_amount, transaction.currency_code)}</div>
                                                <div className="text-sm text-gray-500">{formatDate(transaction.created_at)}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button variant="outline" className="w-full sm:w-auto" onClick={handleContactSupport}>
                            <LifeBuoy className="mr-2 h-4 w-4" />
                            Contact Support
                        </Button>
                    </CardFooter>
                </Card>
            </SheetContent>
        </Sheet>
    )
}

function formatCurrency(amount: number, currency: string): string {
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })} ${currency}`;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
