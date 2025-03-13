import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusCircle, Edit, ArrowUpDown } from 'lucide-react'
import { TopNav } from '@/components/portal/top-nav'
import { UserNav } from '@/components/portal/user-nav'
import Notifications from '@/components/portal/notifications'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/lib/hooks/use-user'
import AnimatedLogoLoader from '@/components/portal/loader'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase/client'
import FeedbackForm from '@/components/portal/feedback-form'
import { UsersIcon } from '@heroicons/react/24/outline'
import { Customer } from './components/types'
import CustomerActions from './components/actions'
import { cn } from '@/lib/actions/utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { countries } from '@/lib/data/onboarding'
import { CustomerFilters } from './components/filters'
import { EditCustomerForm } from './components/edit'
import SupportForm from '@/components/portal/support-form'
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/lib/hooks/use-toast"
import PhoneNumberInput from "@/components/ui/phone-number-input"
import Spinner from '@/components/ui/spinner'

function CustomerCard({ customer, onEditClick, onClick }: {
    customer: Customer,
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
                    <div className="font-medium">{customer.name}</div>
                    <button
                        onClick={onEditClick}
                        className="text-blue-500 hover:text-blue-600 p-1.5"
                    >
                        <Edit className="h-4.5 w-4.5" />
                    </button>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>{customer.phone_number}</span>
                        <span>{customer.country}</span>
                    </div>
                    {customer.whatsapp_number && (
                        <div className="flex items-center gap-2">
                            <span className="flex items-center">
                                <img src="/whatsapp.svg" alt="WhatsApp" className="w-4 h-4 mr-1" />
                                {customer.whatsapp_number}
                            </span>
                        </div>
                    )}
                    <div>
                        <span className={`
                            inline-block px-2 py-1 rounded-none text-xs font-normal
                            ${customer.is_business ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}
                        `}>
                            {customer.is_business ? 'Business' : 'Individual'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CustomersPage() {
    const { user, isLoading: isUserLoading } = useUser()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [isActionsOpen, setIsActionsOpen] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("")
    const [whatsappNumber, setWhatsappNumber] = useState("")
    const [searchTerm, setSearchTerm] = useState('')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false)
    const [sortColumn, setSortColumn] = useState<keyof Customer | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [customerType, setCustomerType] = useState<'all' | 'business' | 'individual'>('all')
    const [selectedCountry, setSelectedCountry] = useState('')
    const [isBusinessCustomer, setIsBusinessCustomer] = useState(false)

    const topNav = [
        { title: 'Customers', href: '/portal/customers', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    type CustomersQueryKey = readonly ['customers', string | undefined, string, 'all' | 'business' | 'individual']

    const { data: customers = [], isLoading: isCustomersLoading, refetch: fetchCustomers } = useQuery<
        Customer[],
        Error,
        Customer[],
        CustomersQueryKey
    >({
        queryKey: ['customers', user?.id, searchTerm, customerType] as const,
        queryFn: async () => {
            if (!user?.id) return []

            const { data, error } = await supabase.rpc('fetch_customers', {
                p_merchant_id: user.id,
                p_search_term: searchTerm,
                p_customer_type: customerType === 'all' ? null : customerType,
                p_page: 1,
                p_page_size: 50,
            })

            if (error) {
                console.error('Error fetching customers:', error)
                return []
            }

            return data as Customer[]
        },
        enabled: !!user?.id,
    })

    const handleAddCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        if (!phoneNumber) {
            toast({
                title: "Error",
                description: "Please enter a valid phone number",
                variant: "destructive",
            })
            return
        }

        const { data: organizationData, error: organizationError } = await supabase
            .rpc('fetch_organization_details', { p_merchant_id: user?.id || '' })

        if (organizationError) {
            console.error('Error fetching organization details:', organizationError)
            return
        }

        const { error: customerError } = await supabase.rpc('create_customer', {
            p_merchant_id: user?.id || '',
            p_organization_id: organizationData[0]?.organization_id || '',
            p_name: formData.get('name') as string,
            p_email: formData.get('email') as string,
            p_phone_number: phoneNumber,
            p_whatsapp_number: whatsappNumber,
            p_country: selectedCountry,
            p_city: formData.get('city') as string,
            p_address: formData.get('address') as string,
            p_postal_code: formData.get('postalCode') as string,
            p_is_business: formData.get('isBusiness') === 'on',
        })

        if (customerError) {
            console.error('Error creating customer:', customerError)
            return
        }

        setIsDialogOpen(false)
        fetchCustomers()
    }

    const handleConfirmDelete = async () => {
        if (deletingCustomerId) {
            const { error } = await supabase.rpc('delete_customer', { p_customer_id: deletingCustomerId })

            if (error) {
                console.error('Error deleting customer:', error)
            } else {
                fetchCustomers()
            }
            setDeletingCustomerId(null)
        }
        setDeleteDialogOpen(false)
    }

    const handleCustomerClick = (customer: Customer) => {
        setSelectedCustomer(customer)
        setIsActionsOpen(true)
    }

    const handleEditCustomer = (customer: Customer) => {
        setSelectedCustomer(customer)
        setIsEditCustomerOpen(true)
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await fetchCustomers()
        setIsRefreshing(false)
    }

    const handleSort = (column: keyof Customer) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const sortCustomers = (customers: Customer[]) => {
        if (!sortColumn) return customers

        return customers.sort((a, b) => {
            const aValue = a[sortColumn]
            const bValue = b[sortColumn]

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
                return sortDirection === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
            } else {
                return 0
            }
        })
    }

    if (isUserLoading) {
        return <AnimatedLogoLoader />
    }

    if (!user || !user.id) {
        return <div><AnimatedLogoLoader /> User data not available.</div>
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
            <SupportForm />
            <Layout.Body className="flex flex-col">
                <div className="space-y-4 pb-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-1 focus:ring-offset-2 focus:ring-blue-500 rounded-none">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-none max-h-[95vh] overflow-y-auto">
                                <DialogHeader className="sm:py-4 py-2">
                                    <DialogTitle>Add a customer</DialogTitle>
                                    <DialogDescription className="text-sm">
                                        Fill in the details to add a new customer for billing.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddCustomer} className="space-y-3 sm:space-y-4">
                                    <div className="space-y-1 sm:space-y-2">
                                        <Label htmlFor="name" className="text-sm">Name</Label>
                                        <Input id="name" name="name" placeholder="Individual or business name" required className="rounded-none h-8 sm:h-10" />
                                    </div>
                                    <div className="space-y-1 sm:space-y-2">
                                        <Label htmlFor="email" className="text-sm">Email address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="johndoe@example.com"
                                            required
                                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                            title="Please enter a valid email address"
                                            className="rounded-none h-8 sm:h-10"
                                        />
                                    </div>
                                    <div className="space-y-1 sm:space-y-2">
                                        <Label htmlFor="phone" className="text-sm">Phone number</Label>
                                        <PhoneNumberInput
                                            value={phoneNumber}
                                            onChange={(value) => setPhoneNumber(value || "")}
                                        />
                                    </div>
                                    <div className="space-y-1 sm:space-y-2">
                                        <Label htmlFor="whatsapp" className="text-sm">WhatsApp</Label>
                                        <PhoneNumberInput
                                            value={whatsappNumber}
                                            onChange={(value) => setWhatsappNumber(value || "")}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        <div className="space-y-1 sm:space-y-2">
                                            <Label htmlFor="country" className="text-sm">Country</Label>
                                            <select
                                                id="country"
                                                value={selectedCountry}
                                                onChange={(e) => setSelectedCountry(e.target.value)}
                                                className={cn(
                                                    "w-full px-3 border rounded-none h-8 sm:h-10",
                                                    "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                                    "appearance-none text-sm"
                                                )}
                                            >
                                                <option value="">Select</option>
                                                {countries.map((country) => (
                                                    <option key={country} value={country}>
                                                        {country}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1 sm:space-y-2">
                                            <Label htmlFor="city" className="text-sm">City</Label>
                                            <Input id="city" name="city" placeholder="City" required className="rounded-none h-8 sm:h-10" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        <div className="space-y-1 sm:space-y-2">
                                            <Label htmlFor="address" className="text-sm">Address</Label>
                                            <Input id="address" name="address" placeholder="Address" required className="rounded-none h-8 sm:h-10" />
                                        </div>
                                        <div className="space-y-1 sm:space-y-2">
                                            <Label htmlFor="postalCode" className="text-sm">Postal Code</Label>
                                            <Input id="postalCode" name="postalCode" placeholder="Postal Code" required className="rounded-none h-8 sm:h-10" />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setIsBusinessCustomer(!isBusinessCustomer)}
                                            className={cn(
                                                "px-3 py-1 text-xs font-medium transition-colors duration-200 cursor-pointer rounded-none",
                                                isBusinessCustomer
                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
                                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800"
                                            )}
                                        >
                                            {isBusinessCustomer ? 'Business Customer' : 'Individual Customer'}
                                        </button>
                                        <input
                                            type="checkbox"
                                            id="isBusiness"
                                            name="isBusiness"
                                            className="hidden"
                                            checked={isBusinessCustomer}
                                            onChange={(e) => setIsBusinessCustomer(e.target.checked)}
                                        />
                                    </div>
                                    <DialogFooter className="sm:pt-4 pt-2">
                                        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-none w-full sm:w-auto">
                                            Add Customer
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <CustomerFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        customerType={customerType}
                        setCustomerType={setCustomerType}
                        refetch={handleRefresh}
                        isRefreshing={isRefreshing}
                    />

                    <Card className="rounded-none">
                        <CardContent className="p-0">
                            <div id="customers-table-container" className="h-[72vh] overflow-auto">
                                {/* Desktop Table View */}
                                <div className="hidden md:block">
                                    <Table className="w-full">
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent border-b bg-muted/50">
                                                <TableHead className="text-center">
                                                    <Button variant="ghost" onClick={() => handleSort('name')} className="rounded-none">
                                                        Name
                                                        {sortColumn === 'name' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    <Button variant="ghost" onClick={() => handleSort('email')} className="rounded-none">
                                                        Email
                                                        {sortColumn === 'email' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    <Button variant="ghost" onClick={() => handleSort('phone_number')} className="rounded-none">
                                                        Phone
                                                        {sortColumn === 'phone_number' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    <Button variant="ghost" onClick={() => handleSort('country')} className="rounded-none">
                                                        Country
                                                        {sortColumn === 'country' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    <Button variant="ghost" onClick={() => handleSort('is_business')} className="rounded-none">
                                                        Type
                                                        {sortColumn === 'is_business' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-center"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isCustomersLoading ? (
                                                <TableRow>
                                                    <TableCell colSpan={6}>
                                                        <div className="flex items-center justify-center h-[65vh]">
                                                            <Spinner />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : customers.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6}>
                                                        <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
                                                            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                                                                <UsersIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                                            </div>
                                                            <div>
                                                                <h2 className="text-xl font-semibold mb-2">No customer data records exist yet</h2>
                                                                <p className="text-gray-500 dark:text-gray-400">Start by adding your first customer.</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                sortCustomers(customers).map((customer) => (
                                                    <TableRow key={customer.customer_id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => handleCustomerClick(customer)}>
                                                        <TableCell className="text-center">{customer.name}</TableCell>
                                                        <TableCell className="text-center">{customer.email}</TableCell>
                                                        <TableCell className="text-center">{customer.phone_number}</TableCell>
                                                        <TableCell className="text-center">{customer.country}</TableCell>
                                                        <TableCell className="text-center">{customer.is_business ? 'Business' : 'Individual'}</TableCell>
                                                        <TableCell className="text-center">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    handleEditCustomer(customer)
                                                                }}
                                                                className="rounded-none"
                                                            >
                                                                <Edit className="h-4.5 w-4.5 text-blue-500" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden">
                                    {isCustomersLoading ? (
                                        <div className="flex items-center justify-center h-[65vh]">
                                            <Spinner />
                                        </div>
                                    ) : customers.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
                                            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                                                <UsersIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold mb-2">No customer data records exist yet</h2>
                                                <p className="text-gray-500 dark:text-gray-400">Start by adding your first customer.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        sortCustomers(customers).map((customer) => (
                                            <CustomerCard
                                                key={customer.customer_id}
                                                customer={customer}
                                                onEditClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditCustomer(customer);
                                                }}
                                                onClick={() => handleCustomerClick(customer)}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Layout.Body>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="rounded-none">
                    <DialogHeader>
                        <DialogTitle>Delete Customer</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this customer? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="destructive" onClick={handleConfirmDelete}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <CustomerActions
                customer={selectedCustomer}
                isOpen={isActionsOpen}
                onClose={() => setIsActionsOpen(false)}
                onUpdate={fetchCustomers}
            />

            <Dialog open={isEditCustomerOpen} onOpenChange={setIsEditCustomerOpen}>
                <DialogContent className="rounded-none">
                    <DialogHeader>
                        <DialogTitle>Edit Customer</DialogTitle>
                        <DialogDescription>
                            Modify the details of the selected customer.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedCustomer && (
                        <EditCustomerForm
                            customerId={selectedCustomer.customer_id}
                            onClose={() => setIsEditCustomerOpen(false)}
                            onSuccess={() => {
                                fetchCustomers()
                                setIsEditCustomerOpen(false)
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Layout>
    )
}

export default CustomersPage;