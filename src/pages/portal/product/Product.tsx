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
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { CreateProductForm } from './dev_product/form_product'
import { ProductFilters } from './dev_product/filters_product'
import SupportForm from '@/components/dashboard/support-form'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, ArrowUpDown } from 'lucide-react'
import { useQuery } from 'react-query'
import ProductActions from './dev_product/actions_product'
import { EditProductForm } from './dev_product/edit_product'
import { withActivationCheck } from '@/components/custom/withActivationCheck'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Edit } from 'lucide-react'

function ProductsPage() {
    const { user } = useUser()
    const [isCreateProductOpen, setIsCreateProductOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive' | 'all' | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isActionsOpen, setIsActionsOpen] = useState(false)
    const [isEditProductOpen, setIsEditProductOpen] = useState(false)
    const [sortColumn, setSortColumn] = useState<keyof Product | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

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

    const handleSort = (column: keyof Product) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
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
                                    <DialogTitle>Create a product</DialogTitle>
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

                    <Card>
                        <CardContent className="p-4">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center">
                                                <Button variant="ghost" onClick={() => handleSort('name')}>
                                                    Name
                                                    {sortColumn === 'name' && (
                                                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                    )}
                                                </Button>
                                            </TableHead>
                                            <TableHead className="text-center">
                                                <Button variant="ghost" onClick={() => handleSort('description')}>
                                                    Description
                                                    {sortColumn === 'description' && (
                                                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                    )}
                                                </Button>
                                            </TableHead>
                                            <TableHead className="text-center">
                                                <Button variant="ghost" onClick={() => handleSort('price')}>
                                                    Price
                                                    {sortColumn === 'price' && (
                                                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                    )}
                                                </Button>
                                            </TableHead>
                                            <TableHead className="text-center">
                                                <Button variant="ghost" onClick={() => handleSort('is_active')}>
                                                    Status
                                                    {sortColumn === 'is_active' && (
                                                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                    )}
                                                </Button>
                                            </TableHead>
                                            <TableHead className="text-center"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isProductsLoading ? (
                                            Array.from({ length: 5 }).map((_, index) => (
                                                <TableRow key={index}>
                                                    <TableCell colSpan={4}>
                                                        <Skeleton className="w-full h-8" />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : products.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8">
                                                    <div className="flex flex-col items-center justify-center space-y-4">
                                                        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                                                            <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                                        </div>
                                                        <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                                                            No products found
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center">
                                                            Try changing your filter or create a new product.
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            sortProducts(products).map((product: Product) => (
                                                <TableRow
                                                    key={product.product_id}
                                                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                                    onClick={() => handleProductClick(product)}
                                                >
                                                    <TableCell className="text-center">{product.name}</TableCell>
                                                    <TableCell className="text-center">{product.description}</TableCell>
                                                    <TableCell className="text-center">
                                                        {product.price.toLocaleString('en-US', {
                                                            minimumFractionDigits: product.price % 1 !== 0 ? 2 : 0,
                                                            maximumFractionDigits: product.price % 1 !== 0 ? 2 : 0,
                                                        })}{' '}
                                                        {product.currency_code}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={`
                                                            inline-block px-2 py-1 rounded-full text-xs font-normal
                                                            ${product.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}
                                                        `}>
                                                            {product.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleEditClick(product)
                                                            }}
                                                            className="hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            <Edit className="h-4 w-4 text-blue-500" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <SupportForm />
            </Layout.Body>

            <ProductActions
                product={selectedProduct}
                isOpen={isActionsOpen}
                onClose={() => setIsActionsOpen(false)}
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
