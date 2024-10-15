import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, InfoIcon, Search, X } from 'lucide-react'
import { format } from 'date-fns'
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Layout } from '@/components/custom/layout'
import FeedbackForm from '@/components/dashboard/feedback-form'



const CreatePlanForm = ({ onClose }: { onClose: () => void }) => {
  const [startDate, setStartDate] = useState<Date>()

  return (
    <div className="fixed inset-0 z-50 bg-background p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create New Plan</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Plan Details</TabsTrigger>
            <TabsTrigger value="schedule">Plan Schedule</TabsTrigger>
            <TabsTrigger value="notifications">Customer Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reference-id">Reference ID</Label>
              <Input id="reference-id" placeholder="Enter reference ID" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-id">Customer ID</Label>
              <Input id="customer-id" placeholder="Enter customer ID" />
              <a href="#" className="text-sm text-blue-600 hover:underline">I don&apos;t have a Customer ID</a>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-description">Plan description</Label>
              <Textarea id="plan-description" placeholder="Describe the plan" />
            </div>
            <div className="space-y-2">
              <Label>Payment details</Label>
              <RadioGroup defaultValue="amount-only">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="amount-only" id="amount-only" />
                  <Label htmlFor="amount-only">Show payment amount only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="amount-with-items" id="amount-with-items" />
                  <Label htmlFor="amount-with-items">Show payment amount with items</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Payment amount per cycle</Label>
              <div className="flex space-x-2">
                <Select>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="VND" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vnd">VND</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                  </SelectContent>
                </Select>
                <Input id="payment-amount" type="number" placeholder="Enter amount" className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Do you want to charge your customer immediately?</Label>
              <RadioGroup defaultValue="no">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="charge-yes" />
                  <Label htmlFor="charge-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="charge-no" />
                  <Label htmlFor="charge-no">No</Label>
                </div>
              </RadioGroup>
              <p className="text-sm text-muted-foreground">
                If yes, your customer will be charged right after they link their payment method. If the charge fails, this plan will not be activated.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-2">
              <Label>Start date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
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
            </div>
            {/* Add more schedule-related fields here */}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            {/* Add notification settings here */}
            <p>Configure customer notifications for this plan.</p>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button>Create Plan</Button>
        </div>
      </div>
    </div>
  )
}

export default function SubscriptionsPage() {
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [isAlertVisible, setIsAlertVisible] = useState(true)

  const topNav = [
    { title: 'Subscriptions', href: '/portal/subscription', isActive: true },
    { title: 'Settings', href: '/portal/settings/profile', isActive: false },
  ]

  const handleCloseAlert = () => {
    setIsAlertVisible(false)
    localStorage.setItem('paymentChannelAlertClosed', 'true')
  }

  useEffect(() => {
    const alertClosed = localStorage.getItem('paymentChannelAlertClosed')
    if (alertClosed) {
      setIsAlertVisible(false)
    }
  }, [])

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
        {isAlertVisible && (
          <Alert style={{
            marginBottom: '1.5rem',
            backgroundColor: '#EFF6FF',
            color: '#1E40AF',
            borderLeft: '0px solid #2563EB',
            padding: '0.75rem',
            width: '60%',
            '@media (prefers-color-scheme: dark)': {
              backgroundColor: '#1E3A8A',
              color: '#93C5FD',
              borderColor: '#1D4ED8',
            },
          } as React.CSSProperties}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <InfoIcon style={{ height: '1.25rem', width: '1.25rem', color: '#2563EB', '@media (prefers-color-scheme: dark)': { color: '#60A5FA' } } as React.CSSProperties} />
                <AlertTitle style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Activate payment channels
                </AlertTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseAlert}
                style={{
                  color: '#2563EB',
                  ':hover': {
                    color: '#1D4ED8',
                    backgroundColor: '#DBEAFE',
                  },
                  '@media (prefers-color-scheme: dark)': {
                    color: '#60A5FA',
                    ':hover': {
                      color: '#BFDBFE',
                      backgroundColor: '#1D4ED8',
                    },
                  },
                } as React.CSSProperties}
              >
                <X style={{ height: '1rem', width: '1rem' }} />
              </Button>
            </div>
            <AlertDescription style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#1E40AF', marginLeft: '1.8rem', '@media (prefers-color-scheme: dark)': { color: '#93C5FD' } } as React.CSSProperties}>
              Payment channels are not active by default. Follow{' '}
              <a
                href="https://devs.lomi.africa/guide/payment-channels"
                style={{
                  fontWeight: 500,
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                  ':hover': {
                    color: '#1E3A8A',
                  },
                  '@media (prefers-color-scheme: dark)': {
                    ':hover': {
                      color: '#BFDBFE',
                    },
                  },
                } as React.CSSProperties}
              >
                this guide
              </a>{' '}
              to ensure they&apos;re activated before you go live.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
            <Button onClick={() => setIsCreatePlanOpen(true)}>Create Plan</Button>
          </div>

          <Tabs defaultValue="plans">
            <TabsList>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="cycles">Cycles</TabsTrigger>
            </TabsList>

            <TabsContent value="plans">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                <Select>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter (0)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="active">Active Plans</SelectItem>
                    <SelectItem value="inactive">Inactive Plans</SelectItem>
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
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Plan ID" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plan-id">Plan ID</SelectItem>
                      <SelectItem value="customer-id">Customer ID</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-8" />
                  </div>
                </div>

                <Button variant="secondary">Export</Button>
              </div>

              <div className="rounded-md border mt-4">
                <div className="py-24 text-center">
                  <h2 className="text-xl font-semibold">No subscription plans found.</h2>
                  <p className="text-muted-foreground">Try changing your filter or create a new plan.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cycles">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                <Select>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter (0)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cycles</SelectItem>
                    <SelectItem value="active">Active Cycles</SelectItem>
                    <SelectItem value="completed">Completed Cycles</SelectItem>
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
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Cycle ID" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cycle-i">Cycle ID</SelectItem>
                      <SelectItem value="plan-id">Plan ID</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-8" />
                  </div>
                </div>

                <Button variant="secondary">Export</Button>
              </div>

              <div className="rounded-md border mt-4">
                <div className="py-24 text-center">
                  <h2 className="text-xl font-semibold">No cycles found.</h2>
                  <p className="text-muted-foreground">Try changing your filter.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout.Body>

      {isCreatePlanOpen && <CreatePlanForm onClose={() => setIsCreatePlanOpen(false)} />}
    </Layout>
  )
}