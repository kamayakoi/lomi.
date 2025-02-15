import { useState, useEffect } from 'react'
import ContentSection from '@/components/portal/content-section'
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from '@/utils/supabase/client'
import { useSidebarData } from '@/lib/hooks/use-sidebar-data'
import Loader from '@/components/portal/loader'

interface PaymentMethod {
    channel: string;
    type: string;
    number: string | null;
    logo: string;
    provider_code: string;
}

interface ProviderSetting {
    provider_code: string;
    is_connected: boolean;
    phone_number: string | null;
    is_phone_verified: boolean;
}

const paymentMethods: PaymentMethod[] = [
    { channel: 'Visa', type: 'Card', number: null, logo: '/checkout-visa.webp', provider_code: 'ECOBANK' },
    { channel: 'Mastercard', type: 'Card', number: null, logo: '/checkout-mastercard.webp', provider_code: 'ECOBANK' },
    { channel: 'Orange', type: 'Mobile Money', number: null, logo: '/orange.webp', provider_code: 'ORANGE' },
    { channel: 'MTN', type: 'Mobile Money', number: null, logo: '/mtn.webp', provider_code: 'MTN' },
    { channel: 'Wave', type: 'E-Wallet', number: null, logo: '/wave.webp', provider_code: 'WAVE' },
]

export default function PaymentMethods() {
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [methods, setMethods] = useState<PaymentMethod[]>(paymentMethods)
    const { sidebarData, isLoading: isSidebarLoading } = useSidebarData()

    useEffect(() => {
        async function fetchProviderNumbers() {
            if (!sidebarData?.organization_id) return;

            const { data: settings, error } = await supabase
                .rpc('fetch_organization_providers_settings', {
                    p_organization_id: sidebarData.organization_id
                })

            if (!error && settings) {
                setMethods(currentMethods =>
                    currentMethods.map(method => {
                        const providerSetting = settings.find((s: ProviderSetting) => s.provider_code === method.provider_code)
                        return {
                            ...method,
                            number: providerSetting?.is_connected && providerSetting?.phone_number ? providerSetting.phone_number : null
                        }
                    })
                )
            }
        }

        if (sidebarData?.organization_id) {
            fetchProviderNumbers()
        }
    }, [sidebarData?.organization_id])

    if (isSidebarLoading) {
        return <Loader />
    }

    const filteredMethods = methods
        .filter(method => filter === 'all' || method.type.toLowerCase() === filter)
        .filter(method =>
            method.channel.toLowerCase().includes(search.toLowerCase()) ||
            method.type.toLowerCase().includes(search.toLowerCase())
        )

    return (
        <div style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: '100vh',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
        }}>
            <style>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <ContentSection
                title="Payment methods"
                desc="Activate and configure bank transfers, cards, e-wallets and other payment methods."
            >
                <div className="space-y-6">
                    <Alert variant="info">
                        <AlertDescription>
                            Configure the payment methods you want to accept from your customers. Each method has its own processing time and fees.
                        </AlertDescription>
                    </Alert>

                    <Card>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 my-6">
                                <Select value={filter} onValueChange={setFilter}>
                                    <SelectTrigger className="w-full sm:w-[200px] rounded-none">
                                        <SelectValue placeholder="Filter by type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="card">Card</SelectItem>
                                        <SelectItem value="e-wallet">E-Wallet</SelectItem>
                                        <SelectItem value="mobile money">Mobile Money</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="relative w-full sm:w-auto">
                                    <Input
                                        placeholder="Search payment methods..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full sm:w-[300px] pl-8 rounded-none"
                                    />
                                </div>
                            </div>
                            <div className="rounded-none border">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="rounded-none">
                                            <TableHead className="w-[25%] text-center rounded-none"></TableHead>
                                            <TableHead className="w-[25%] rounded-none">CHANNEL</TableHead>
                                            <TableHead className="w-[25%] rounded-none">TYPE</TableHead>
                                            <TableHead className="w-[25%] rounded-none">NUMBER</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMethods.map((method, index) => (
                                            <TableRow key={index} className="rounded-none">
                                                <TableCell className="text-center rounded-none">
                                                    <img
                                                        src={method.logo}
                                                        alt={method.channel}
                                                        width={32}
                                                        height={32}
                                                        className="object-contain inline-block rounded-[2px]"
                                                    />
                                                </TableCell>
                                                <TableCell>{method.channel}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span>{method.type}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {method.number ? (
                                                        <span className="text-sm font-medium">
                                                            {method.number}
                                                        </span>
                                                    ) : method.type === 'Card' ? (
                                                        <span className="text-muted-foreground text-sm">—</span>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">Not Connected</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {filteredMethods.length === 0 && (
                                <p className="text-center text-muted-foreground my-4">No payment methods found.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </ContentSection>
        </div>
    )
}