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
import { PlusCircle, Trash2 } from 'lucide-react'
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
import { Checkbox } from "@/components/ui/checkbox"
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
import { countryCodes } from '@/utils/data/onboarding'
import { CustomerFilters } from './dev_customers/filters_customers'

export default function CustomersPage() {
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

    const topNav = [
        { title: 'Customers', href: '/portal/customers', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: customers = [], isLoading: isCustomersLoading, refetch: fetchCustomers } = useQuery(
        ['customers', user?.id, searchTerm],
        async () => {
            if (!user?.id) return []

            const { data, error } = await supabase.rpc('fetch_customers', {
                p_merchant_id: user.id,
                p_search_term: searchTerm,
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
            p_country: 'Senegal',
            p_city: '',
            p_address: '',
            p_postal_code: '',
            p_is_business: formData.get('isBusiness') === 'on',
        })

        if (customerError) {
            console.error('Error creating customer:', customerError)
            return
        }

        setIsDialogOpen(false)
        fetchCustomers()
    }

    const handleDeleteClick = (customerId: string) => {
        setDeletingCustomerId(customerId)
        setDeleteDialogOpen(true)
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

    if (isUserLoading) {
        return <AnimatedLogoLoader />
    }

    if (!user || !user.id) {
        return <div><AnimatedLogoLoader /> User data not available.</div>
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

            <Layout.Body className="flex flex-col overflow-auto">
                <div className="space-y-4 pb-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add a customer
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add A Customer</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details to add a new customer.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddCustomer} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" name="name" placeholder="Individual or business name" required />
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
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Mobile number</Label>
                                        <div className="flex space-x-2">
                                            <div className="relative">
                                                <Input
                                                    id="countryCode"
                                                    type="text"
                                                    placeholder="+225"
                                                    value={countryCodeSearch}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setCountryCodeSearch(value);
                                                        setIsCountryCodeDropdownOpen(true);
                                                    }}
                                                    onFocus={() => setIsCountryCodeDropdownOpen(true)}
                                                    onBlur={() => setTimeout(() => setIsCountryCodeDropdownOpen(false), 200)}
                                                    className={cn(
                                                        "w-full mb-2",
                                                        "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
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
                                            <Input id="phone" name="phone" type="tel" className="flex-1" required />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center h-5">
                                            <Checkbox id="isBusiness" name="isBusiness" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                        </div>
                                        <div className="ml-2 text-sm">
                                            <Label htmlFor="isBusiness" className="font-medium text-gray-700">
                                                Business customer
                                            </Label>
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">Add Customer</Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <CustomerFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        refetch={handleRefresh}
                        isRefreshing={isRefreshing}
                    />

                    <div className="rounded-md border">
                        <div className="max-h-[calc(100vh-210px)] overflow-y-scroll pr-2 scrollbar-hide">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isCustomersLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
                                                    <Skeleton className="h-8 w-64" />
                                                    <Skeleton className="h-4 w-48" />
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
                                        customers.map((customer) => (
                                            <TableRow key={customer.customer_id} className="cursor-pointer" onClick={() => handleCustomerClick(customer)}>
                                                <TableCell>{customer.name}</TableCell>
                                                <TableCell>{customer.email}</TableCell>
                                                <TableCell>{customer.phone_number}</TableCell>
                                                <TableCell>{customer.country}</TableCell>
                                                <TableCell>{customer.is_business ? 'Business' : 'Individual'}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteClick(customer.customer_id) }}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </Layout.Body>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
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

            <CustomerActions customer={selectedCustomer} isOpen={isActionsOpen} onClose={() => setIsActionsOpen(false)} />
        </Layout>
    )
}
