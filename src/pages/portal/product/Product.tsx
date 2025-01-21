import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { TopNav } from '@/components/portal/top-nav'
import { UserNav } from '@/components/portal/user-nav'
import Notifications from '@/components/portal/notifications'
import { Separator } from "@/components/ui/separator"
import { Layout } from '@/components/custom/layout'
import FeedbackForm from '@/components/portal/feedback-form'
import { useUser } from '@/lib/hooks/useUser'
import { Product } from './components/Products_types'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateProductForm } from './components/form_product'
import { ProductFilters } from './components/filters_product'
import SupportForm from '@/components/portal/support-form'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, Edit, ImageIcon, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from 'react-query'
import ProductActions from './components/actions_product'
import { EditProductForm } from './components/edit_product'
import { withActivationCheck } from '@/components/custom/withActivationCheck'
import { Card, CardContent } from "@/components/ui/card"
import { fetchProducts } from './components/support_product'
import { cn } from '@/lib/actions/utils'

function ProductCard({ product, onEditClick, onClick }: {
    product: Product,
    onEditClick: (e: React.MouseEvent) => void,
    onClick: () => void
}) {
    return (
        <div
            className="p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={onClick}
        >
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="font-medium">{product.name}</div>
                    <div className="flex items-center gap-1.5">
                        <span className={cn(
                            "px-3 py-1 text-xs font-medium",
                            product.is_active
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        )}>
                            {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className={cn(
                            "px-3 py-1 text-xs font-medium",
                            product.display_on_storefront
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        )}>
                            Storefront
                        </span>
                        <button
                            onClick={onEditClick}
                            className="text-blue-500 hover:text-blue-600 p-1.5"
                        >
                            <Edit className="h-4.5 w-4.5" />
                        </button>
                    </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                    {product.description && (
                        <p className="line-clamp-2 leading-relaxed">
                            {product.description}
                        </p>
                    )}
                    <div className="pt-1">
                        <span className="text-lg font-semibold tracking-tight">
                            {product.price.toLocaleString('en-US', {
                                minimumFractionDigits: product.price % 1 !== 0 ? 2 : 0,
                                maximumFractionDigits: product.price % 1 !== 0 ? 2 : 0,
                            })}
                            <span className="text-sm text-muted-foreground ml-1">
                                {product.currency_code}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function calculateTotalPrice(product: Product): number {
    if (!product.fees) return product.price;

    const feeAmount = product.fees.reduce((total, fee) => {
        return total + (product.price * (fee.percentage / 100));
    }, 0);

    return product.price + feeAmount;
}

function ProductsPage() {
    const { user } = useUser()
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive' | 'all' | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isActionsOpen, setIsActionsOpen] = useState(false)
    const [isEditProductOpen, setIsEditProductOpen] = useState(false)
    const [sortColumn] = useState<keyof Product | null>(null)
    const [sortDirection] = useState<'asc' | 'desc'>('asc')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const topNav = [
        { title: 'Products', href: '/portal/product', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: productsData, isLoading: isProductsLoading, refetch } = useQuery(
        ['products', user?.id || '', selectedStatus, currentPage],
        () => fetchProducts(
            user?.id || '',
            selectedStatus === 'active' ? true : selectedStatus === 'inactive' ? false : null,
            itemsPerPage,
            (currentPage - 1) * itemsPerPage
        ),
        {
            enabled: !!user?.id,
        }
    )

    const products = productsData?.products || []
    const totalProducts = productsData?.totalCount || 0
    const totalPages = Math.ceil(totalProducts / itemsPerPage)

    const handleCreateProductSuccess = () => {
        refetch()
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

    const handleEditClick = (product: Product) => {
        setSelectedProduct(product)
        setIsEditProductOpen(true)
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
    }

    const sortProducts = (products: Product[]) => {
        if (!sortColumn) return products

        return products.sort((a, b) => {
            const aValue = a[sortColumn]
            const bValue = b[sortColumn]

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
            } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
                return sortDirection === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
            } else {
                return 0
            }
        })
    }

    return (
        <Layout fixed>
            <Layout.Header>
                <div className='hidden md:block'>
                    <TopNav links={topNav} />
                </div>

                <div className='block md:hidden'>
                    <FeedbackForm />
                </div>

                <div className='ml-auto flex items-center space-x-4'>
                    <div className='hidden md:block'>
                        <FeedbackForm />
                    </div>
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
                                <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-none">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-none [&::backdrop]:bg-black/30 p-0 border border-border">
                                <DialogHeader className="p-6 pb-0">
                                    <DialogTitle>Create a product</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details to create a new product.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="p-6 pt-4">
                                    <CreateProductForm onClose={() => setIsCreateProductOpen(false)} onSuccess={handleCreateProductSuccess} />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <ProductFilters
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                        refetch={handleRefresh}
                        isRefreshing={isRefreshing}
                    />

                    <Card className="rounded-none">
                        <CardContent className="p-4 rounded-none">
                            {isProductsLoading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: itemsPerPage }).map((_, index) => (
                                        <div key={index} className="p-4 border border-border">
                                            <div className="flex gap-4">
                                                <Skeleton className="w-32 h-32 rounded-lg flex-shrink-0" />
                                                <div className="flex-grow space-y-2">
                                                    <Skeleton className="w-1/3 h-6" />
                                                    <Skeleton className="w-2/3 h-4" />
                                                    <Skeleton className="w-24 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                                        <ClipboardList className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <p className="text-xl font-semibold text-gray-500 dark:text-gray-400 mt-4">
                                        No products found
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center mt-2">
                                        Try changing your filter or create a new product.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop View */}
                                    <div className="hidden md:block space-y-4">
                                        {sortProducts(products).map((product: Product) => (
                                            <div
                                                key={product.product_id}
                                                className="p-6 border border-border hover:border-border-hover transition-colors duration-200 cursor-pointer bg-background hover:bg-gray-50/50 dark:hover:bg-gray-900/50"
                                                onClick={() => handleProductClick(product)}
                                            >
                                                <div className="flex gap-6">
                                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 shadow-sm">
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

                                                    <div className="flex-grow min-h-[128px] flex flex-col">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h3 className="font-medium text-foreground text-lg leading-tight">{product.name}</h3>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className={cn(
                                                                    "px-3 py-1 text-xs font-medium",
                                                                    product.is_active
                                                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                                                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                                                )}>
                                                                    {product.is_active ? 'Active' : 'Inactive'}
                                                                </span>
                                                                <span className={cn(
                                                                    "px-3 py-1 text-xs font-medium",
                                                                    product.display_on_storefront
                                                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                                                )}>
                                                                    Storefront
                                                                </span>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        handleEditClick(product)
                                                                    }}
                                                                    className="text-blue-500 hover:text-blue-600 p-1.5"
                                                                >
                                                                    <Edit className="h-4.5 w-4.5" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col flex-grow justify-between">
                                                            {product.description && (
                                                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                                    {product.description}
                                                                </p>
                                                            )}

                                                            <div className="flex items-center gap-2 mt-auto pt-2">
                                                                <div className="flex flex-col">
                                                                    <span className="text-lg font-semibold tracking-tight">
                                                                        {product.price.toLocaleString('en-US', {
                                                                            minimumFractionDigits: product.price % 1 !== 0 ? 2 : 0,
                                                                            maximumFractionDigits: product.price % 1 !== 0 ? 2 : 0,
                                                                        })}
                                                                        <span className="text-sm text-muted-foreground ml-1">
                                                                            {product.currency_code}
                                                                        </span>
                                                                    </span>
                                                                    {product.fees && product.fees.length > 0 && (
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {calculateTotalPrice(product).toLocaleString('en-US', {
                                                                                minimumFractionDigits: product.price % 1 !== 0 ? 2 : 0,
                                                                                maximumFractionDigits: product.price % 1 !== 0 ? 2 : 0,
                                                                            })} {product.currency_code} incl. tax
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mobile View */}
                                    <div className="md:hidden border rounded-none">
                                        {sortProducts(products).map((product: Product) => (
                                            <ProductCard
                                                key={product.product_id}
                                                product={product}
                                                onEditClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(product);
                                                }}
                                                onClick={() => handleProductClick(product)}
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-6 mt-4">
                                            <div className="flex flex-1 justify-between sm:hidden">
                                                <Button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    variant="outline"
                                                >
                                                    Previous
                                                </Button>
                                                <Button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    variant="outline"
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                                                        <span className="font-medium">
                                                            {Math.min(currentPage * itemsPerPage, totalProducts)}
                                                        </span>{' '}
                                                        of <span className="font-medium">{totalProducts}</span> products
                                                    </p>
                                                </div>
                                                <div>
                                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                                        <Button
                                                            variant="outline"
                                                            className="rounded-l-md"
                                                            onClick={() => handlePageChange(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                        >
                                                            <span className="sr-only">Previous</span>
                                                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                                        </Button>
                                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                            <Button
                                                                key={page}
                                                                variant={page === currentPage ? "default" : "outline"}
                                                                onClick={() => handlePageChange(page)}
                                                                className="px-4 py-2"
                                                            >
                                                                {page}
                                                            </Button>
                                                        ))}
                                                        <Button
                                                            variant="outline"
                                                            className="rounded-r-md"
                                                            onClick={() => handlePageChange(currentPage + 1)}
                                                            disabled={currentPage === totalPages}
                                                        >
                                                            <span className="sr-only">Next</span>
                                                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                                        </Button>
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <SupportForm />
            </Layout.Body>

            <ProductActions
                product={selectedProduct}
                isOpen={isActionsOpen}
                onClose={() => setIsActionsOpen(false)}
                onUpdate={refetch}
            />

            <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                            Modify the details of the selected product.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedProduct && (
                        <EditProductForm
                            product={selectedProduct}
                            onClose={() => setIsEditProductOpen(false)}
                            onSuccess={() => {
                                refetch()
                                setIsEditProductOpen(false)
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Layout>
    )
}

function ProductsWithActivationCheck() {
    return withActivationCheck(ProductsPage)({});
}

export default ProductsWithActivationCheck;
