import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Search, Link2Icon, DownloadIcon, Settings2Icon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Layout as DashboardLayout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'

export default function PaymentLinksPage() {
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const topNav = [
    { title: 'Payment Links', href: 'payment-links', isActive: true },
    { title: 'Settings', href: 'settings', isActive: false },
  ]

  return (
    <DashboardLayout>
      <DashboardLayout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Notifications />
          <UserNav />
        </div>
      </DashboardLayout.Header>

      <Separator className='my-0' />

      <DashboardLayout.Body>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Payment Links | Invoices</h1>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Learn More</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>See benefits</DropdownMenuItem>
                  <DropdownMenuItem>See how it works</DropdownMenuItem>
                  <DropdownMenuItem>Book a demo</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => setIsCreateLinkOpen(true)}>Create Payment Link</Button>
            </div>
          </div>

          <Tabs defaultValue="single">
            <TabsList>
              <TabsTrigger value="single">Single Payment Links</TabsTrigger>
              <TabsTrigger value="multiple">Multiple Payment Links</TabsTrigger>
            </TabsList>

            <TabsContent value="single">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                    <Select>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Links</SelectItem>
                        <SelectItem value="active">Active Links</SelectItem>
                        <SelectItem value="expired">Expired Links</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex space-x-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Start date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>End date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex flex-1 space-x-2">
                      <Select>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="External ID" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="external-id">External ID</SelectItem>
                          <SelectItem value="customer-id">Customer ID</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search External ID" className="pl-8" />
                      </div>
                      <Button variant="secondary">Search</Button>
                    </div>

                    <Button variant="outline">
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      CSV
                    </Button>
                    <Button variant="outline">
                      <Settings2Icon className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-8 flex flex-col items-center justify-center space-y-4 py-12">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Link2Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">No Payment Links Yet :(</h2>
                    <p className="text-muted-foreground text-center">
                      Your customers might be looking for a way to pay you.<br />
                      To start accepting payments, create a Payment Link and share it with them.
                    </p>
                    <Button onClick={() => setIsCreateLinkOpen(true)}>Create Payment Link</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="multiple">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center space-y-4 py-12">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Link2Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">No Multiple Payment Links Yet :(</h2>
                    <p className="text-muted-foreground text-center">
                      Your customers might be looking for a way to pay you.<br />
                      To start accepting payments, create a Multiple Payment Link and share it with them.
                    </p>
                    <Button onClick={() => setIsCreateLinkOpen(true)}>Create Payment Link</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout.Body>

      <Dialog open={isCreateLinkOpen} onOpenChange={setIsCreateLinkOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Create Payment Link</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new payment link.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reference-id" className="text-right">
                Reference ID
              </Label>
              <Input id="reference-id" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount Due
              </Label>
              <Input id="amount" type="number" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Enable Multiple Payments</Label>
              <Switch />
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCreateLinkOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsCreateLinkOpen(false)}>Create Payment Link</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}