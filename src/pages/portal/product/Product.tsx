import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'
import { Separator } from "@/components/ui/separator"
import { Layout } from '@/components/custom/layout'
import FeedbackForm from '@/components/dashboard/feedback-form'
import { useUser } from '@/lib/hooks/useUser'
import { fetchProducts, deleteProduct } from './dev_product/support_product'
import { Product } from './dev_product/types'
import { Skeleton } from '@/components/ui/skeleton'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { CreateProductForm } from './dev_product/form_product'
import { ProductFilters } from './dev_product/filters_product'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from 'lucide-react'
import { useQuery } from 'react-query'
import ProductActions from './dev_product/actions_product'

export default function ProductsPage() {
    const { user } = useUser()
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive' | 'all' | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isActionsOpen, setIsActionsOpen] = useState(false)

    const topNav = [
        { title: 'Products', href: '/portal/product', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: productsData, isLoading: isProductsLoading, refetch } = useQuery(
        ['products', user?.id || '', selectedStatus],
        () => fetchProducts(user?.id || '', selectedStatus === 'active' ? true : selectedStatus === 'inactive' ? false : null),
        {
            enabled: !!user?.id,
        }
    )

    const products = productsData || []

    const handleCreateProductSuccess = () => {
        refetch()
    }

    const handleDeleteProduct = async (productId: string) => {
        try {
            await deleteProduct(productId)
            refetch()
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await refetch()
        setIsRefreshing(false)
    }

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product)
        setIsActionsOpen(true)
    }

    return (
        <Layout fixed>
            <Layout.Header>
                <TopNav links={topNav} />
                <div className='ml-auto flex items-center space-x-4'>
                    <FeedbackForm />
                    <Notifications />
                    <UserNav />
                </div>
            </Layout.Header>

            <Separator className='my-0' />

            <Layout.Body>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                        <Dialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create Product
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Product</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details to create a new product.
                                    </DialogDescription>
                                </DialogHeader>
                                <CreateProductForm onClose={() => setIsCreateProductOpen(false)} onSuccess={handleCreateProductSuccess} />
                            </DialogContent>
                        </Dialog>
                    </div>

                    <ProductFilters
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                        refetch={handleRefresh}
                        isRefreshing={isRefreshing}
                    />

                    <div className="rounded-md border mt-4">
                        <div className="max-h-[calc(100vh-210px)] overflow-y-scroll pr-2 scrollbar-hide">
                            {isProductsLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <div key={index} className="py-4 px-6 border-b">
                                        <Skeleton className="w-full h-8" />
                                    </div>
                                ))
                            ) : products.length === 0 ? (
                                <div className="py-24 text-center">
                                    <div className="flex justify-center mb-6">
                                        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                                            <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                                        No products found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                                        Try changing your filter or create a new product.
                                    </p>
                                </div>
                            ) : (
                                products.map((product: Product) => (
                                    <div
                                        key={product.product_id}
                                        className="py-4 px-6 border-b cursor-pointer"
                                        onClick={() => handleProductClick(product)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-lg font-semibold">{product.name}</p>
                                                <p className="text-sm text-muted-foreground">{product.description}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className={`
                            inline-block px-2 py-1 rounded-full text-xs font-normal
                            ${product.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}
                          `}>
                                                    {product.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.product_id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </Layout.Body>

            <ProductActions
                product={selectedProduct}
                isOpen={isActionsOpen}
                onClose={() => setIsActionsOpen(false)}
            />
        </Layout>
    )
}
