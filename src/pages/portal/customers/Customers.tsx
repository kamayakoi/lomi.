import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusCircle } from 'lucide-react'
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

type Customer = {
    customer_id: string
    name: string
    email: string
    phone_number: string
    country: string
    city: string
    address: string
    postal_code: string
    is_business: boolean
}

export default function CustomersPage() {
    const { user, isLoading: isUserLoading } = useUser()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const topNav = [
        { title: 'Customers', href: '/portal/customers', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: customers = [], isLoading: isCustomersLoading } = useQuery(
        ['customers', user?.id],
        async () => {
            if (!user?.id) return []

            const { data, error } = await supabase.rpc('fetch_customers', {
                p_merchant_id: user.id,
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
            p_phone_number: `${formData.get('countryCode')}${formData.get('phone')}`,
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

            <Layout.Body>
                <div className='space-y-4'>
                    <div className="flex justify-between items-center">
                        <h1 className='text-2xl font-bold tracking-tight'>Customers</h1>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
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
                                        <Input id="email" name="email" type="email" placeholder="johndoe@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Mobile number</Label>
                                        <div className="flex space-x-2">
                                            <Select name="countryCode">
                                                <SelectTrigger className="w-[80px]">
                                                    <SelectValue placeholder="+221" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="+221">+221</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input id="phone" name="phone" type="tel" className="flex-1" required />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="isBusiness" name="isBusiness" />
                                        <Label htmlFor="isBusiness">Business customer</Label>
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

                    {isCustomersLoading ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-4 w-48" />
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
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-2 text-left font-medium">Name</th>
                                        <th className="p-2 text-left font-medium">Email</th>
                                        <th className="p-2 text-left font-medium">Phone</th>
                                        <th className="p-2 text-left font-medium">Country</th>
                                        <th className="p-2 text-left font-medium">Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer) => (
                                        <tr key={customer.customer_id} className="border-b">
                                            <td className="p-2">{customer.name}</td>
                                            <td className="p-2">{customer.email}</td>
                                            <td className="p-2">{customer.phone_number}</td>
                                            <td className="p-2">{customer.country}</td>
                                            <td className="p-2">{customer.is_business ? 'Business' : 'Individual'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Layout.Body>
        </Layout>
    )
}
