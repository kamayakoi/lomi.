import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from '@/components/portal/top-nav'
import { UserNav } from '@/components/portal/user-nav'
import Notifications from '@/components/portal/notifications'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/lib/hooks/use-user'
import AnimatedLogoLoader from '@/components/portal/loader'
import { useBalanceBreakdown, useConversionRates, convertCurrencyDB } from './components/support'
import PayoutFilters from './components/filters'
import PayoutActions from './components/actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DateRange } from 'react-day-picker'
import { payout_status, Payout, BankAccount, BalanceBreakdown, currency_code } from './components/types'
import { fetchPayouts, applySearch, applyDateFilter, fetchBankAccounts, initiateWithdrawal } from './components/support'
import { Skeleton } from '@/components/ui/skeleton'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from '@tanstack/react-query'
import { FcfaIcon } from '@/components/custom/cfa'
import { ArrowUpDown, ArrowDownIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import FeedbackForm from '@/components/portal/feedback-form'
import SupportForm from '@/components/portal/support-form'
import { formatCurrency } from '@/utils/fees/currency-converter'
import { supabase } from '@/utils/supabase/client'
// import CurrencyConverter from './components/CurrencyConverter'

type PayoutsResponse = Payout[]

// Define the order of currencies to display
const CURRENCY_DISPLAY_ORDER: currency_code[] = ['XOF', 'USD'];

// Define an interface for the provider settings
interface ProviderSetting {
    provider_code: string;
    is_connected: boolean;
    phone_number?: string;
    is_phone_verified?: boolean;
}

function BalancePage() {
    const { user, isLoading: isUserLoading } = useUser()
    const [searchTerm, setSearchTerm] = useState("")
    const [sortColumn, setSortColumn] = useState<keyof Payout | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['pending', 'processing', 'completed', 'failed'])
    const [selectedDateRange, setSelectedDateRange] = useState<string | null>('24H')
    const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>()
    const pageSize = 50
    const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null)
    const [columns, setColumns] = useState<string[]>([
        'Payout ID',
        'Amount',
        'Currency',
        'Status',
        'Date',
    ])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isWithdrawing, setIsWithdrawing] = useState(false)
    const [withdrawalAmount, setWithdrawalAmount] = useState("")
    const [selectedBankAccount, setSelectedBankAccount] = useState("")
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
    const { toast } = useToast()
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [showBalanceBreakdown, setShowBalanceBreakdown] = useState<Record<string, boolean>>({})
    const [selectedWithdrawalCurrency, setSelectedWithdrawalCurrency] = useState<currency_code>('XOF')
    const [preferredCurrency] = useState<currency_code>('XOF')
    const { data: conversionRates } = useConversionRates()
    const [withdrawalMethod, setWithdrawalMethod] = useState<'bank' | 'mobile_money'>('bank')
    const [waveEnabled, setWaveEnabled] = useState(false)
    const [isDownloadOpen, setIsDownloadOpen] = useState(false)

    const topNav = [
        { title: 'Balance', href: '/portal/balance', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: balanceBreakdown, isLoading: isBalanceBreakdownLoading, refetch: refetchBalanceBreakdown } = useBalanceBreakdown(user?.id || null)

    const { data: payoutsData, isLoading: isPayoutsLoading, fetchNextPage, refetch: refetchPayouts } = useInfiniteQuery<PayoutsResponse, Error>({
        queryKey: ['payouts', user?.id || '', selectedStatuses],
        queryFn: ({ pageParam }) =>
            fetchPayouts(
                user?.id || '',
                selectedStatuses as payout_status[],
                pageParam as number,
                pageSize
            ),
        initialPageParam: 1,
        getNextPageParam: (lastPage: PayoutsResponse, allPages: PayoutsResponse[]) => {
            return lastPage.length !== 0 ? allPages.length + 1 : undefined
        },
        enabled: !!user?.id,
    })

    const payouts = (payoutsData?.pages?.flatMap((page) => page) || []) as Payout[]

    useEffect(() => {
        if (user?.id) {
            fetchBankAccounts(user.id).then(setBankAccounts);

            // Check if Wave is enabled for this merchant
            const checkWaveEnabled = async () => {
                try {
                    // 1. Get the organization ID using the RPC function
                    const { data: orgData, error: orgError } = await supabase
                        .rpc('get_merchant_organization_id', {
                            p_merchant_id: user.id
                        });

                    if (orgError || !orgData) {
                        console.error('Error getting organization ID:', orgError);
                        setWaveEnabled(false);
                        return;
                    }

                    // 2. Get provider settings using the RPC function
                    const { data: providerSettings, error: providerError } = await supabase
                        .rpc('fetch_organization_providers_settings', {
                            p_organization_id: orgData
                        });

                    if (providerError || !providerSettings) {
                        console.error('Error fetching provider settings:', providerError);
                        setWaveEnabled(false);
                        return;
                    }

                    // 3. Find the Wave provider and check if it's configured properly
                    const waveProvider = providerSettings.find(
                        (p: ProviderSetting) => p.provider_code === 'WAVE'
                    );

                    const isWaveReady = waveProvider?.is_connected === true &&
                        !!waveProvider?.phone_number;

                    console.log('Wave provider settings:', waveProvider);
                    console.log('Wave enabled:', isWaveReady);

                    setWaveEnabled(isWaveReady);
                } catch (error) {
                    console.error('Error checking Wave status:', error);
                    setWaveEnabled(false);
                }
            };

            checkWaveEnabled();
        }
    }, [user?.id]);

    // Global scroll lock implementation for Balance page
    useEffect(() => {
        // Store original styles to restore them later
        const originalStyle = window.getComputedStyle(document.body).overflow;
        const originalHTMLStyle = window.getComputedStyle(document.documentElement).overflow;

        // Lock scrolling on body and html
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // Prevent wheel events on the document
        const preventWheel = (e: WheelEvent) => {
            // Only allow wheel events in the table container
            const tableContainer = document.getElementById('balance-table-container');
            if (tableContainer && !tableContainer.contains(e.target as Node)) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        // Prevent touchmove events that might cause scrolling
        const preventTouch = (e: TouchEvent) => {
            const tableContainer = document.getElementById('balance-table-container');
            if (tableContainer && !tableContainer.contains(e.target as Node)) {
                e.preventDefault();
            }
        };

        // Prevent scrolling with keyboard
        const preventKeyScroll = (e: KeyboardEvent) => {
            // Prevent the default action for keys that can scroll the page
            if (['Space', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
                // Allow keyboard navigation within the table container
                const tableContainer = document.getElementById('balance-table-container');
                const activeElement = document.activeElement;

                // Only prevent if we're not inside the table container
                if (!(tableContainer && tableContainer.contains(activeElement as Node))) {
                    e.preventDefault();
                }
            }
        };

        // Add event listeners with passive: false to ensure preventDefault works
        document.addEventListener('wheel', preventWheel, { passive: false });
        document.addEventListener('touchmove', preventTouch, { passive: false });
        document.addEventListener('keydown', preventKeyScroll, { passive: false });

        // Add style tag for global CSS
        const style = document.createElement('style');
        style.id = 'no-scroll-style-balance';
        style.innerHTML = `
            html, body {
                overflow: hidden !important;
                height: 100% !important;
                position: fixed !important;
                width: 100% !important;
            }
            #__next {
                height: 100% !important;
                overflow: hidden !important;
            }
        `;
        document.head.appendChild(style);

        // Cleanup function
        return () => {
            // Restore original styles
            document.body.style.overflow = originalStyle;
            document.documentElement.style.overflow = originalHTMLStyle;

            // Remove event listeners
            document.removeEventListener('wheel', preventWheel);
            document.removeEventListener('touchmove', preventTouch);
            document.removeEventListener('keydown', preventKeyScroll);

            // Remove style tag
            const styleElement = document.getElementById('no-scroll-style-balance');
            if (styleElement) {
                styleElement.remove();
            }
        };
    }, []);

    const handleSort = (column: keyof Payout) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const sortPayouts = (payouts: Payout[]) => {
        if (!sortColumn) return payouts

        return payouts.sort((a, b) => {
            const aValue = a[sortColumn]
            const bValue = b[sortColumn]

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
            } else {
                return 0
            }
        })
    }

    const handleCustomDateRangeApply = () => {
        if (customDateRange && customDateRange.from && customDateRange.to) {
            setSelectedDateRange('custom')
        }
    }

    const handleWithdraw = async () => {
        if (withdrawalMethod === 'bank' && (!withdrawalAmount || !selectedBankAccount)) {
            toast({
                title: "Error",
                description: "Please enter an amount and select a bank account.",
                variant: "destructive",
            });
            return;
        }

        if (withdrawalMethod === 'mobile_money' && !withdrawalAmount) {
            toast({
                title: "Error",
                description: "Please enter an amount for mobile money withdrawal.",
                variant: "destructive",
            });
            return;
        }

        const amount = parseFloat(withdrawalAmount);
        if (isNaN(amount) || amount <= 0) {
            toast({
                title: "Invalid amount",
                description: "Please enter a valid amount.",
                variant: "destructive",
            });
            return;
        }

        // Calculate estimated fees for display
        if (withdrawalMethod === 'mobile_money') {
            // Get organization ID first
            const { data: merchantData } = await supabase
                .from('merchants')
                .select('organization_id')
                .eq('merchant_id', user?.id || '')
                .single();

            // Get fee settings
            const { data: feeSettings } = await supabase
                .from('organization_fees')
                .select('*')
                .eq('organization_id', merchantData?.organization_id)
                .eq('fee_type', 'payout')
                .eq('currency_code', selectedWithdrawalCurrency)
                .single();

            // Default Wave fee is 1%
            const waveFeePercentage = 0.01;
            const platformFeePercentage = feeSettings?.percentage || 0;

            const waveFeeAmount = parseFloat((amount * waveFeePercentage).toFixed(2));
            const platformFeeAmount = parseFloat((amount * platformFeePercentage).toFixed(2));
            const totalFeeAmount = waveFeeAmount + platformFeeAmount;

            // Show fee breakdown in toast
            toast({
                title: "Fee Information",
                description: (
                    <div className="space-y-2 mt-2">
                        <p>Withdrawal amount: {formatCurrency(amount, selectedWithdrawalCurrency)}</p>
                        <p>Wave fee (1%): {formatCurrency(waveFeeAmount, selectedWithdrawalCurrency)}</p>
                        {platformFeePercentage > 0 && (
                            <p>Platform fee ({(platformFeePercentage * 100).toFixed(1)}%): {formatCurrency(platformFeeAmount, selectedWithdrawalCurrency)}</p>
                        )}
                        <div className="border-t pt-1 mt-1">
                            <p className="font-semibold">Total deduction: {formatCurrency(amount + totalFeeAmount, selectedWithdrawalCurrency)}</p>
                        </div>
                    </div>
                ),
            });
        }

        setIsWithdrawing(true);
        try {
            let finalAmount = amount;
            if (selectedWithdrawalCurrency !== preferredCurrency) {
                finalAmount = await convertCurrencyDB(amount, selectedWithdrawalCurrency, preferredCurrency);
            }

            const result = await initiateWithdrawal(
                user?.id || '',
                finalAmount,
                selectedBankAccount,
                selectedWithdrawalCurrency,
                withdrawalMethod
            );

            if (result.success) {
                toast({
                    title: "Withdrawal Initiated",
                    description: result.message || `${formatCurrency(finalAmount, selectedWithdrawalCurrency)} has been withdrawn from your account.`,
                });
                setIsDialogOpen(false);
                setWithdrawalAmount("");
                setSelectedBankAccount("");
                setSelectedWithdrawalCurrency('XOF');
                setWithdrawalMethod('bank');
                refetchBalanceBreakdown();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            toast({
                title: "Withdrawal Failed",
                description: error instanceof Error ? error.message : "An unexpected error occurred",
                variant: "destructive",
            });
        } finally {
            setIsWithdrawing(false);
        }
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await Promise.all([refetchBalanceBreakdown(), refetchPayouts()])
        setIsRefreshing(false)
    }

    const getSortedBalances = (): BalanceBreakdown[] => {
        if (!balanceBreakdown || balanceBreakdown.length === 0) return [];

        return [...balanceBreakdown].sort((a, b) => {
            const indexA = CURRENCY_DISPLAY_ORDER.indexOf(a.currency_code);
            const indexB = CURRENCY_DISPLAY_ORDER.indexOf(b.currency_code);

            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }

            if (indexA !== -1) {
                return -1;
            }

            if (indexB !== -1) {
                return 1;
            }

            return a.currency_code.localeCompare(b.currency_code);
        });
    };

    const toggleBalanceBreakdown = (currency: string) => {
        setShowBalanceBreakdown(prev => ({
            ...prev,
            [currency]: !prev[currency]
        }));
    };

    const getBalanceValue = (value: number | undefined) => {
        return value?.toLocaleString() || '0';
    };

    const handleDownload = () => {
        const filteredPayouts = applySearch(applyDateFilter(sortPayouts(payouts), selectedDateRange, customDateRange), searchTerm)
        const csvData = convertToCSV(filteredPayouts)
        downloadCSV(csvData)
        setIsDownloadOpen(false)
    }

    function convertToCSV(data: (Payout | undefined)[]): string {
        const filteredData = data.filter((item): item is Payout => item !== undefined);

        if (filteredData.length === 0) {
            return '';
        }

        const headers = Object.keys(filteredData[0] || {}).join(',');
        const rows = filteredData.map(payout => {
            if (!payout) return '';
            return Object.values(payout)
                .map(value => {
                    if (typeof value === 'string') {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                })
                .join(',');
        }).join('\n');

        return `${headers}\n${rows}`;
    }

    function downloadCSV(csvData: string) {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', 'payouts.csv')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    function copyAsJSON() {
        const filteredPayouts = applySearch(applyDateFilter(sortPayouts(payouts), selectedDateRange, customDateRange), searchTerm)
        const jsonData = JSON.stringify(filteredPayouts, null, 2)
        navigator.clipboard.writeText(jsonData)
        setIsDownloadOpen(false)
    }

    if (isUserLoading) {
        return <AnimatedLogoLoader />
    }

    if (!user || !user.id) {
        return <div><AnimatedLogoLoader /> User data not available.</div>
    }

    return (
        <Layout fixed className="h-screen overflow-hidden">
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
                <div className="h-full overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="space-y-4 pb-8 max-w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold tracking-tight">Balance</h1>
                            {/* Currency Converter button commented out temporarily
                            <Button
                                variant="outline"
                                className="rounded-none"
                                onClick={() => setShowCurrencyConverter(!showCurrencyConverter)}
                            >
                                <DollarSign className="h-4 w-4 mr-2" />
                                Currency Converter
                            </Button>
                            */}
                        </div>

                        {/* Currency converter component commented out temporarily
                        {showCurrencyConverter && (
                            <CurrencyConverter conversionRates={conversionRates} />
                        )}
                        */}

                        <div
                            className="grid gap-4 mb-6"
                            style={{
                                gridTemplateColumns: `repeat(${getSortedBalances().length > 0 ? Math.min(getSortedBalances().length, 3) : 1}, 1fr)`
                            }}
                        >
                            {isBalanceBreakdownLoading || isRefreshing ? (
                                <Card className="rounded-none col-span-full md:col-span-1">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Balance</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="w-32 h-8 rounded-none" />
                                    </CardContent>
                                </Card>
                            ) : getSortedBalances().length === 0 ? (
                                <Card className="rounded-none col-span-full md:col-span-1">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Balance</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">XOF 0</div>
                                    </CardContent>
                                </Card>
                            ) : (
                                getSortedBalances().map((balance) => (
                                    <Card key={balance.currency_code} className="rounded-none">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium cursor-pointer" onClick={() => toggleBalanceBreakdown(balance.currency_code)}>
                                                {balance.currency_code} Balance
                                            </CardTitle>
                                            <ArrowDownIcon className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => toggleBalanceBreakdown(balance.currency_code)} />
                                        </CardHeader>
                                        <CardContent>
                                            <AnimatePresence mode="wait">
                                                {!showBalanceBreakdown[balance.currency_code] ? (
                                                    <motion.div
                                                        key={`available-${balance.currency_code}`}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="flex justify-between items-center"
                                                    >
                                                        <div>
                                                            <div className="text-2xl font-bold cursor-pointer" onClick={() => toggleBalanceBreakdown(balance.currency_code)}>
                                                                {formatCurrency(balance.available_balance, balance.currency_code)}
                                                            </div>
                                                            {balance.currency_code !== preferredCurrency && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    ≈ {formatCurrency(
                                                                        balance.currency_code === 'USD'
                                                                            ? balance.available_balance * (
                                                                                conversionRates?.find(rate =>
                                                                                    rate.from_currency === 'USD' && rate.to_currency === 'XOF'
                                                                                )?.rate || 605
                                                                            )
                                                                            : balance.available_balance * (
                                                                                conversionRates?.find(rate =>
                                                                                    rate.from_currency === 'XOF' && rate.to_currency === 'USD'
                                                                                )?.rate || 0.00165
                                                                            ),
                                                                        preferredCurrency
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="default"
                                                                    className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 dark:text-white rounded-none"
                                                                    onClick={() => setSelectedWithdrawalCurrency(balance.currency_code)}
                                                                >
                                                                    Withdraw
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[425px] rounded-none">
                                                                <DialogHeader>
                                                                    <DialogTitle>Withdraw {selectedWithdrawalCurrency}</DialogTitle>
                                                                    <DialogDescription>
                                                                        Select withdrawal method and enter amount
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="grid gap-4 py-4">
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label htmlFor="currency" className="text-right">Currency</Label>
                                                                        <Select
                                                                            value={selectedWithdrawalCurrency}
                                                                            onValueChange={(value) => {
                                                                                setSelectedWithdrawalCurrency(value as currency_code);
                                                                                // Reset withdrawal method to 'bank' if not XOF
                                                                                if (value !== 'XOF') {
                                                                                    setWithdrawalMethod('bank');
                                                                                }
                                                                            }}
                                                                        >
                                                                            <SelectTrigger className="col-span-3 rounded-none">
                                                                                <SelectValue placeholder="Select currency" />
                                                                            </SelectTrigger>
                                                                            <SelectContent className="rounded-none">
                                                                                {getSortedBalances().map((balance) => (
                                                                                    <SelectItem
                                                                                        key={balance.currency_code}
                                                                                        value={balance.currency_code}
                                                                                        className="rounded-none"
                                                                                    >
                                                                                        {balance.currency_code} - Available: {getBalanceValue(balance.available_balance)}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label htmlFor="withdrawal-method" className="text-right">Method</Label>
                                                                        <Select
                                                                            value={withdrawalMethod}
                                                                            onValueChange={(value) => setWithdrawalMethod(value as 'bank' | 'mobile_money')}
                                                                        >
                                                                            <SelectTrigger className="col-span-3 rounded-none">
                                                                                <SelectValue placeholder="Select withdrawal method" />
                                                                            </SelectTrigger>
                                                                            <SelectContent className="rounded-none">
                                                                                <SelectItem value="bank" className="rounded-none">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bank" viewBox="0 0 16 16">
                                                                                            <path d="M8 0l6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.501.501 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89L8 0ZM3.777 3h8.447L8 1 3.777 3ZM2 6v7h1V6H2Zm2 0v7h2.5V6H4Zm3.5 0v7h1V6h-1Zm2 0v7H12V6H9.5ZM13 6v7h1V6h-1Zm2-1V4H1v1h14Zm-.39 9H1.39l-.25 1h13.72l-.25-1Z" />
                                                                                        </svg>
                                                                                        <span>Bank Account</span>
                                                                                    </div>
                                                                                </SelectItem>
                                                                                {waveEnabled && selectedWithdrawalCurrency === 'XOF' ? (
                                                                                    <SelectItem value="mobile_money" className="rounded-none">
                                                                                        <div className="flex items-center gap-2">
                                                                                            <img src="/payment_channels/wave.webp" alt="Wave" className="h-4 w-4 object-contain rounded-xs" />
                                                                                            <span>Wave</span>
                                                                                        </div>
                                                                                    </SelectItem>
                                                                                ) : null}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>

                                                                    {withdrawalMethod === 'bank' && (
                                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                                            <Label htmlFor="bank-account" className="text-right">Bank Account</Label>
                                                                            <Select onValueChange={setSelectedBankAccount} value={selectedBankAccount}>
                                                                                <SelectTrigger className="col-span-3 rounded-none">
                                                                                    <SelectValue placeholder="Select a bank account" />
                                                                                </SelectTrigger>
                                                                                <SelectContent className="rounded-none">
                                                                                    {bankAccounts.map((account) => (
                                                                                        <SelectItem key={account.bank_account_id} value={account.bank_account_id} className="rounded-none">
                                                                                            <div className="flex items-center">
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-credit-card mr-2" viewBox="0 0 16 16">
                                                                                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z" />
                                                                                                    <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z" />
                                                                                                </svg>
                                                                                                {account.bank_name} - {account.account_number}
                                                                                            </div>
                                                                                        </SelectItem>
                                                                                    ))}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                    )}

                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label htmlFor="amount" className="text-right">Amount</Label>
                                                                        <Input
                                                                            id="amount"
                                                                            type="text"
                                                                            value={withdrawalAmount}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value;
                                                                                if (/^\d*\.?\d*$/.test(value)) {
                                                                                    setWithdrawalAmount(value);
                                                                                }
                                                                            }}
                                                                            className="col-span-3 rounded-none"
                                                                            placeholder={`Enter amount in ${selectedWithdrawalCurrency}`}
                                                                        />
                                                                    </div>

                                                                    <div className="flex justify-end mt-4 space-x-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            onClick={() => {
                                                                                setIsDialogOpen(false);
                                                                                setWithdrawalAmount("");
                                                                                setSelectedBankAccount("");
                                                                            }}
                                                                            className="rounded-sm"
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                        <Button
                                                                            onClick={handleWithdraw}
                                                                            disabled={isWithdrawing}
                                                                            className="rounded-sm bg-blue-500 hover:bg-blue-600 text-white"
                                                                        >
                                                                            {isWithdrawing ? (
                                                                                <>
                                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                    Processing...
                                                                                </>
                                                                            ) : (
                                                                                'Withdraw'
                                                                            )}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key={`breakdown-${balance.currency_code}`}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="flex justify-between items-start"
                                                    >
                                                        <div className="space-y-1 w-4/5 pr-4">
                                                            <div className="flex justify-between">
                                                                <span className="text-sm cursor-pointer" onClick={() => toggleBalanceBreakdown(balance.currency_code)}>
                                                                    Total
                                                                </span>
                                                                <span className="text-sm font-medium">
                                                                    {formatCurrency(balance.total_balance, balance.currency_code)}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-blue-500 dark:text-yellow-500 cursor-pointer" onClick={() => toggleBalanceBreakdown(balance.currency_code)}>
                                                                    Pending
                                                                </span>
                                                                <span className="text-sm font-medium text-blue-500 dark:text-yellow-500">
                                                                    {formatCurrency(balance.pending_balance, balance.currency_code)}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-green-500 cursor-pointer" onClick={() => toggleBalanceBreakdown(balance.currency_code)}>
                                                                    Available
                                                                </span>
                                                                <span className="text-sm font-medium text-green-500">
                                                                    {formatCurrency(balance.available_balance, balance.currency_code)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="default"
                                                                    className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 dark:text-white rounded-none"
                                                                    onClick={() => setSelectedWithdrawalCurrency(balance.currency_code)}
                                                                >
                                                                    Withdraw
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[425px] rounded-none">
                                                                <DialogHeader>
                                                                    <DialogTitle>Withdraw {selectedWithdrawalCurrency}</DialogTitle>
                                                                    <DialogDescription>
                                                                        Select withdrawal method and enter amount
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="grid gap-4 py-4">
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label htmlFor="currency" className="text-right">Currency</Label>
                                                                        <Select
                                                                            value={selectedWithdrawalCurrency}
                                                                            onValueChange={(value) => {
                                                                                setSelectedWithdrawalCurrency(value as currency_code);
                                                                                // Reset withdrawal method to 'bank' if not XOF
                                                                                if (value !== 'XOF') {
                                                                                    setWithdrawalMethod('bank');
                                                                                }
                                                                            }}
                                                                        >
                                                                            <SelectTrigger className="col-span-3 rounded-none">
                                                                                <SelectValue placeholder="Select currency" />
                                                                            </SelectTrigger>
                                                                            <SelectContent className="rounded-none">
                                                                                {getSortedBalances().map((balance) => (
                                                                                    <SelectItem
                                                                                        key={balance.currency_code}
                                                                                        value={balance.currency_code}
                                                                                        className="rounded-none"
                                                                                    >
                                                                                        {balance.currency_code} - Available: {getBalanceValue(balance.available_balance)}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label htmlFor="withdrawal-method" className="text-right">Method</Label>
                                                                        <Select
                                                                            value={withdrawalMethod}
                                                                            onValueChange={(value) => setWithdrawalMethod(value as 'bank' | 'mobile_money')}
                                                                        >
                                                                            <SelectTrigger className="col-span-3 rounded-none">
                                                                                <SelectValue placeholder="Select withdrawal method" />
                                                                            </SelectTrigger>
                                                                            <SelectContent className="rounded-none">
                                                                                <SelectItem value="bank" className="rounded-none">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bank" viewBox="0 0 16 16">
                                                                                            <path d="M8 0l6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.501.501 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89L8 0ZM3.777 3h8.447L8 1 3.777 3ZM2 6v7h1V6H2Zm2 0v7h2.5V6H4Zm3.5 0v7h1V6h-1Zm2 0v7H12V6H9.5ZM13 6v7h1V6h-1Zm2-1V4H1v1h14Zm-.39 9H1.39l-.25 1h13.72l-.25-1Z" />
                                                                                        </svg>
                                                                                        <span>Bank Account</span>
                                                                                    </div>
                                                                                </SelectItem>
                                                                                {waveEnabled && selectedWithdrawalCurrency === 'XOF' ? (
                                                                                    <SelectItem value="mobile_money" className="rounded-none">
                                                                                        <div className="flex items-center gap-2">
                                                                                            <img src="/payment_channels/wave.webp" alt="Wave" className="h-4 w-4 object-contain rounded-xs" />
                                                                                            <span>Wave</span>
                                                                                        </div>
                                                                                    </SelectItem>
                                                                                ) : null}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>

                                                                    {withdrawalMethod === 'bank' && (
                                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                                            <Label htmlFor="bank-account" className="text-right">Bank Account</Label>
                                                                            <Select onValueChange={setSelectedBankAccount} value={selectedBankAccount}>
                                                                                <SelectTrigger className="col-span-3 rounded-none">
                                                                                    <SelectValue placeholder="Select a bank account" />
                                                                                </SelectTrigger>
                                                                                <SelectContent className="rounded-none">
                                                                                    {bankAccounts.map((account) => (
                                                                                        <SelectItem key={account.bank_account_id} value={account.bank_account_id} className="rounded-none">
                                                                                            <div className="flex items-center">
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-credit-card mr-2" viewBox="0 0 16 16">
                                                                                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z" />
                                                                                                    <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z" />
                                                                                                </svg>
                                                                                                {account.bank_name} - {account.account_number}
                                                                                            </div>
                                                                                        </SelectItem>
                                                                                    ))}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                    )}

                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label htmlFor="amount" className="text-right">Amount</Label>
                                                                        <Input
                                                                            id="amount"
                                                                            type="text"
                                                                            value={withdrawalAmount}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value;
                                                                                if (/^\d*\.?\d*$/.test(value)) {
                                                                                    setWithdrawalAmount(value);
                                                                                }
                                                                            }}
                                                                            className="col-span-3 rounded-none"
                                                                            placeholder={`Enter amount in ${selectedWithdrawalCurrency}`}
                                                                        />
                                                                    </div>

                                                                    <div className="flex justify-end mt-4 space-x-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            onClick={() => {
                                                                                setIsDialogOpen(false);
                                                                                setWithdrawalAmount("");
                                                                                setSelectedBankAccount("");
                                                                            }}
                                                                            className="rounded-sm"
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                        <Button
                                                                            onClick={handleWithdraw}
                                                                            disabled={isWithdrawing}
                                                                            className="rounded-sm bg-blue-500 hover:bg-blue-600 text-white"
                                                                        >
                                                                            {isWithdrawing ? (
                                                                                <>
                                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                    Processing...
                                                                                </>
                                                                            ) : (
                                                                                'Withdraw'
                                                                            )}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        <PayoutFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedDateRange={selectedDateRange}
                            setSelectedDateRange={setSelectedDateRange}
                            customDateRange={customDateRange}
                            setCustomDateRange={setCustomDateRange}
                            handleCustomDateRangeApply={handleCustomDateRangeApply}
                            selectedStatuses={selectedStatuses}
                            setSelectedStatuses={setSelectedStatuses}
                            columns={columns}
                            setColumns={setColumns}
                            refetch={handleRefresh}
                            isRefreshing={isRefreshing}
                            isDownloadOpen={isDownloadOpen}
                            setIsDownloadOpen={setIsDownloadOpen}
                            handleDownload={handleDownload}
                            copyAsJSON={copyAsJSON}
                        />

                        <Card className="rounded-none border shadow-sm">
                            <CardContent className="p-0">
                                <div
                                    id="balance-table-container"
                                    className="h-[47vh] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                                    onWheel={(e) => {
                                        // When scrolled at the boundaries, prevent default to avoid page scrolling
                                        const container = e.currentTarget;
                                        const { scrollTop, scrollHeight, clientHeight } = container;

                                        // Check if we're at the top or bottom boundary
                                        const isAtBottom = scrollTop + clientHeight >= scrollHeight;
                                        const isAtTop = scrollTop <= 0;

                                        // If at boundaries and trying to scroll further, prevent default
                                        if ((isAtBottom && e.deltaY > 0) || (isAtTop && e.deltaY < 0)) {
                                            e.preventDefault();
                                        }

                                        // In any case, stop propagation to contain scroll within this element
                                        e.stopPropagation();
                                    }}
                                >
                                    <InfiniteScroll
                                        dataLength={payouts.length}
                                        next={() => fetchNextPage()}
                                        hasMore={payoutsData?.pages?.[payoutsData.pages.length - 1]?.length === pageSize}
                                        loader={<div className="p-4"><Skeleton className="w-full h-8 rounded-none" /></div>}
                                        scrollableTarget="balance-table-container"
                                        className="overflow-visible"
                                    >
                                        <Table className="w-full">
                                            <TableHeader>
                                                <TableRow className="hover:bg-transparent border-b bg-muted/50">
                                                    {columns.includes('Payout ID') && (
                                                        <TableHead className="text-center w-[25%] md:w-auto h-12 text-xs uppercase font-semibold text-muted-foreground">
                                                            <Button variant="ghost" onClick={() => handleSort('payout_id')} className="rounded-none whitespace-nowrap px-2 md:px-4 h-full">
                                                                Payout ID
                                                                {sortColumn === 'payout_id' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Amount') && (
                                                        <TableHead className="text-center w-[25%] md:w-auto h-12 text-xs uppercase font-semibold text-muted-foreground">
                                                            <Button variant="ghost" onClick={() => handleSort('amount')} className="rounded-none whitespace-nowrap px-2 md:px-4 h-full">
                                                                Amount
                                                                {sortColumn === 'amount' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Currency') && (
                                                        <TableHead className="text-center w-[25%] md:w-auto h-12 text-xs uppercase font-semibold text-muted-foreground">
                                                            <Button variant="ghost" onClick={() => handleSort('currency_code')} className="rounded-none whitespace-nowrap px-2 md:px-4 h-full">
                                                                Currency
                                                                {sortColumn === 'currency_code' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Status') && (
                                                        <TableHead className="text-center w-[25%] md:w-auto h-12 text-xs uppercase font-semibold text-muted-foreground">
                                                            <Button variant="ghost" onClick={() => handleSort('status')} className="rounded-none whitespace-nowrap px-2 md:px-4 h-full">
                                                                Status
                                                                {sortColumn === 'status' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Date') && (
                                                        <TableHead className="text-center w-[25%] md:w-auto h-12 text-xs uppercase font-semibold text-muted-foreground">
                                                            <Button variant="ghost" onClick={() => handleSort('created_at')} className="rounded-none whitespace-nowrap px-2 md:px-4 h-full">
                                                                Date
                                                                {sortColumn === 'created_at' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {isPayoutsLoading ? (
                                                    <TableRow>
                                                        <TableCell colSpan={columns.length} className="text-center p-4">
                                                            <Skeleton className="w-full h-8 rounded-none" />
                                                        </TableCell>
                                                    </TableRow>
                                                ) : payouts.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={columns.length} className="text-center py-8">
                                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                                <div className="bg-transparent dark:bg-transparent p-4">
                                                                    <FcfaIcon className="h-40 w-40 text-gray-400 dark:text-gray-500" />
                                                                </div>
                                                                <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                                                                    No payout history found
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center">
                                                                    Make some withdrawals to see your payout history.
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    applySearch(applyDateFilter(sortPayouts(payouts), selectedDateRange, customDateRange), searchTerm).map((payout: Payout) => (
                                                        <TableRow key={payout.payout_id} className="cursor-pointer border-b hover:bg-muted/30">
                                                            {columns.includes('Payout ID') && (
                                                                <TableCell className="text-center py-4">
                                                                    <span className="font-mono text-xs">{shortenPayoutId(payout.payout_id)}</span>
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Amount') && (
                                                                <TableCell className="text-center py-4">
                                                                    <span className="font-medium">{formatAmount(payout.amount)}</span>
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Currency') && (
                                                                <TableCell className="text-center py-4">
                                                                    {payout.currency_code}
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Status') && (
                                                                <TableCell className="text-center py-4">
                                                                    <div className="flex justify-center">
                                                                        <span
                                                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${payout.status === 'completed'
                                                                                ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                                                                                : payout.status === 'failed'
                                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                                                                                    : payout.status === 'pending' || payout.status === 'processing'
                                                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400'
                                                                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400'
                                                                                }`}
                                                                        >
                                                                            {formatPayoutStatus(payout.status)}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Date') && (
                                                                <TableCell className="text-center py-4">
                                                                    <span className="text-sm text-muted-foreground">{formatDate(payout.created_at)}</span>
                                                                </TableCell>
                                                            )}
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </InfiniteScroll>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <SupportForm />
            </Layout.Body>

            <PayoutActions payout={selectedPayout} isOpen={!!selectedPayout} onClose={() => setSelectedPayout(null)} />
        </Layout>
    )
}

function shortenPayoutId(payoutId: string): string {
    return `${payoutId.slice(0, 6)}...${payoutId.slice(-4)}`
}

function formatPayoutStatus(status: payout_status): string {
    switch (status) {
        case 'pending':
            return 'Pending'
        case 'processing':
            return 'Processing'
        case 'completed':
            return 'Completed'
        case 'failed':
            return 'Failed'
        default:
            return status
    }
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatAmount(amount: number): string {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 0 })
}

export default BalancePage;