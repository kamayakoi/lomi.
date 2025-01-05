import { useState, useMemo } from 'react'
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
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/lib/hooks/useUser'
import AnimatedLogoLoader from '@/components/dashboard/loader'
import { useQuery } from 'react-query'
import { supabase } from '@/utils/supabase/client'
import { Skeleton } from '@/components/ui/skeleton'
import FeedbackForm from '@/components/dashboard/feedback-form'
import { UsersIcon } from '@heroicons/react/24/outline'
import { Customer } from './dev_customers/types'
import CustomerActions from './dev_customers/actions_customers'
import { cn } from '@/lib/actions/utils'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { countries, countryCodes } from '@/utils/data/onboarding'
import { CustomerFilters } from './dev_customers/filters_customers'
import { EditCustomerForm } from './dev_customers/edit_customer'
import { withActivationCheck } from '@/components/custom/withActivationCheck'
import SupportForm from '@/components/dashboard/support-form'
import { Card, CardContent } from "@/components/ui/card"

function CustomersPage() {
    const { user, isLoading: isUserLoading } = useUser()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
    const [isActionsOpen, setIsActionsOpen] = useState(false)
    const [countryCodeSearch, setCountryCodeSearch] = useState('')
    const [isCountryCodeDropdownOpen, setIsCountryCodeDropdownOpen] = useState(false)
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

    const { data: customers = [], isLoading: isCustomersLoading, refetch: fetchCustomers } = useQuery(
        ['customers', user?.id, searchTerm, customerType],
        async () => {
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
        {
            enabled: !!user?.id,
        }
    )

    const handleAddCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        const { data: organizationData, error: organizationError } = await supabase
            .rpc('fetch_organization_details', { p_merchant_id: user?.id })

        if (organizationError) {
            console.error('Error fetching organization details:', organizationError)
            return
        }

        const { error: customerError } = await supabase.rpc('create_customer', {
            p_merchant_id: user?.id,
            p_organization_id: organizationData[0].organization_id,
            p_name: formData.get('name') as string,
            p_email: formData.get('email') as string,
            p_phone_number: `${countryCodeSearch}${formData.get('phone')}`,
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

    const filteredCountryCodes = useMemo(() => {
        const lowercaseSearch = countryCodeSearch.toLowerCase();
        return Array.from(new Set(countryCodes.filter(code =>
            code.toLowerCase().includes(lowercaseSearch)
        ))).slice(0, 5); // Limit to 5 results
    }, [countryCodeSearch]);

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
            <Layout.Body className="flex flex-col overflow-auto">
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
                            <DialogContent className="rounded-none">
                                <DialogHeader>
                                    <DialogTitle>Add a customer</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details to add a new customer for billing.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddCustomer} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" name="name" placeholder="Individual or business name" required className="rounded-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="johndoe@example.com"
                                            required
                                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                            title="Please enter a valid email address"
                                            className="rounded-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Mobile number</Label>
                                        <div className="flex space-x-2">
                                            <div className="relative w-24">
                                                <Input
                                                    id="countryCode"
                                                    type="text"
                                                    placeholder="+225"
                                                    value={countryCodeSearch}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^[+\d]*$/.test(value)) {
                                                            setCountryCodeSearch(value);
                                                            setIsCountryCodeDropdownOpen(true);
                                                        }
                                                    }}
                                                    onFocus={() => setIsCountryCodeDropdownOpen(true)}
                                                    onBlur={() => setTimeout(() => setIsCountryCodeDropdownOpen(false), 200)}
                                                    className={cn(
                                                        "w-full mb-2 rounded-none",
                                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                    )}
                                                />
                                                {isCountryCodeDropdownOpen && filteredCountryCodes.length > 0 && (
                                                    <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-60 overflow-auto">
                                                        {filteredCountryCodes.map((code: string) => (
                                                            <li
                                                                key={code}
                                                                className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                onClick={() => {
                                                                    setCountryCodeSearch(code);
                                                                    setIsCountryCodeDropdownOpen(false);
                                                                }}
                                                            >
                                                                {code}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            <Input id="phone" name="phone" type="tel" className="flex-1 rounded-none" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <select
                                            id="country"
                                            value={selectedCountry}
                                            onChange={(e) => setSelectedCountry(e.target.value)}
                                            className={cn(
                                                "w-full mb-2 px-3 py-2 border h-10 rounded-none",
                                                "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                                "appearance-none"
                                            )}
                                        >
                                            <option value="">Select a country</option>
                                            {countries.map((country) => (
                                                <option key={country} value={country}>
                                                    {country}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" name="city" placeholder="City" required className="rounded-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input id="address" name="address" placeholder="Address" required className="rounded-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="postalCode">Postal Code</Label>
                                        <Input id="postalCode" name="postalCode" placeholder="Postal Code" required className="rounded-none" />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center h-5">
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
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-none">
                                            Add
                                        </Button>
                                    </div>
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
                        <CardContent className="p-4">
                            <div className="border">
                                <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-hide">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
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
                                                Array.from({ length: 5 }).map((_, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell colSpan={6}>
                                                            <div className="flex flex-col items-center justify-center space-y-2 py-2 text-center">
                                                                <Skeleton className="h-2 w-48 rounded-none" />
                                                                <Skeleton className="h-2 w-32 rounded-none" />
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
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
                                                                <Edit className="h-4 w-4 text-blue-500" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
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

function CustomersWithActivationCheck() {
    return withActivationCheck(CustomersPage)({});
}

export default CustomersWithActivationCheck;
