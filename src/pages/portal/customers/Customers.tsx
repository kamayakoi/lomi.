import React, { useState } from 'react'
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
import { PlusCircle, Search, User } from 'lucide-react'

// Mocking the Layout component
const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-background">{children}</div>
)

Layout.Header = React.memo(function LayoutHeader({ children }: { children: React.ReactNode }) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">{children}</div>
        </header>
    )
})

Layout.Body = React.memo(function LayoutBody({ children }: { children: React.ReactNode }) {
    return <main className="container py-6">{children}</main>
})

const TopNav = ({ links }: { links: Array<{ title: string; href: string; isActive: boolean }> }) => (
    <nav className="flex items-center space-x-4 lg:space-x-6">
        {links.map((link, index) => (
            <a
                key={index}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${link.isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
            >
                {link.title}
            </a>
        ))}
    </nav>
)

const UserNav = () => (
    <Button variant="ghost" size="icon">
        <User className="h-5 w-5" />
    </Button>
)

export default function CustomersPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [customers, setCustomers] = useState<Array<{ id: string; name: string; email: string; phone: string; type: string }>>([])

    const topNav = [
        { title: 'Home', href: '', isActive: false },
        { title: 'Customers', href: 'customers', isActive: true },
        { title: 'Settings', href: 'settings', isActive: false },
    ]

    const handleAddCustomer = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const newCustomer = {
            id: formData.get('referenceId') as string,
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            type: formData.get('customerType') as string,
        }
        setCustomers([...customers, newCustomer])
        setIsDialogOpen(false)
    }

    return (
        <Layout>
            <Layout.Header>
                <TopNav links={topNav} />
                <div className='ml-auto flex items-center space-x-4'>
                    <Button variant="ghost" size="icon">
                        <Search className="h-5 w-5" />
                    </Button>
                    <UserNav />
                </div>
            </Layout.Header>

            <Layout.Body>
                <div className='space-y-4'>
                    <div className="flex justify-between items-center">
                        <h1 className='text-2xl font-bold tracking-tight'>Customers</h1>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
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
                                        <Label htmlFor="referenceId">Reference ID</Label>
                                        <Input id="referenceId" name="referenceId" placeholder="A0012" required />
                                    </div>
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
                                                    <SelectValue placeholder="+62" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="+62">+62</SelectItem>
                                                    <SelectItem value="+1">+1</SelectItem>
                                                    <SelectItem value="+44">+44</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input id="phone" name="phone" type="tel" className="flex-1" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="customerType">Customer type</Label>
                                        <Select name="customerType">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select customer type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="individual">Individual</SelectItem>
                                                <SelectItem value="business">Business</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">Next</Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {customers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
                            <div className="rounded-full bg-primary/10 p-3">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-lg font-semibold">No customer data records exists yet.</h2>
                            <p className="text-muted-foreground">Add a customer to begin!</p>
                            <Button onClick={() => setIsDialogOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add a customer
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="p-2 text-left font-medium">ID</th>
                                        <th className="p-2 text-left font-medium">Name</th>
                                        <th className="p-2 text-left font-medium">Email</th>
                                        <th className="p-2 text-left font-medium">Phone</th>
                                        <th className="p-2 text-left font-medium">Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-2">{customer.id}</td>
                                            <td className="p-2">{customer.name}</td>
                                            <td className="p-2">{customer.email}</td>
                                            <td className="p-2">{customer.phone}</td>
                                            <td className="p-2">{customer.type}</td>
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