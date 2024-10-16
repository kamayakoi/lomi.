import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'
import { Separator } from "@/components/ui/separator"
import { Layout } from '@/components/custom/layout'
import FeedbackForm from '@/components/dashboard/feedback-form'
import { useUser } from '@/lib/hooks/useUser'
import { fetchProducts } from './dev_product/support_product'
import { Product } from './dev_product/types'
import { Skeleton } from '@/components/ui/skeleton'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'
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

export default function ProductsPage() {
    const { user } = useUser()
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const pageSize = 50

    const topNav = [
        { title: 'Products', href: '/portal/product', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: productsData, isLoading: isProductsLoading, fetchNextPage, refetch } = useInfiniteQuery(
        ['products', user?.id || '', selectedStatus],
        ({ pageParam = 1 }) =>
            fetchProducts(
                user?.id || '',
                selectedStatus,
                pageParam,
                pageSize
            ),
        {
            getNextPageParam: (lastPage: Product[], allPages: Product[][]) => {
                const nextPage = allPages.length + 1
                return lastPage.length !== 0 ? nextPage : undefined
            },
            enabled: !!user?.id,
        }
    )

    const products = productsData?.pages?.flatMap((page) => page) || []

    const handleCreateProductSuccess = () => {
        refetch()
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
                        refetch={refetch}
                    />

                    <div className="rounded-md border mt-4">
                        <div className="max-h-[calc(100vh-210px)] overflow-y-scroll pr-2 scrollbar-hide">
                            <InfiniteScroll
                                dataLength={products.length}
                                next={() => fetchNextPage()}
                                hasMore={productsData?.pages[productsData.pages.length - 1]?.length === pageSize}
                                loader={<Skeleton className="w-full h-8" />}
                            >
                                {isProductsLoading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <div key={index} className="py-4 px-6 border-b">
                                            <Skeleton className="w-full h-8" />
                                        </div>
                                    ))
                                ) : products.length === 0 ? (
                                    <div className="py-24 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="rounded-full bg-transparent dark:bg-transparent p-4">
                                                <ClipboardDocumentListIcon className="h-40 w-40 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                                                No products found
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center">
                                                Try changing your filter or create a new product.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    products.map((product: Product) => (
                                        <div key={product.product_id} className="py-4 px-6 border-b">
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
                                                    <Button variant="ghost" size="sm">
                                                        View
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </InfiniteScroll>
                        </div>
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    )
}
