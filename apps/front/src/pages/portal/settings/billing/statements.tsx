import { useState, useEffect } from 'react'
import ContentSection from '@/components/portal/content-section'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, ChevronRight, Loader2, ArrowDownIcon } from 'lucide-react'
import { supabase } from '@/utils/supabase/client'
import { format } from 'date-fns'
import { toast } from "@/lib/hooks/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import { Alert, AlertDescription } from '@/components/ui/alert'
import InfoBox from '@/components/ui/info-box'

interface StatementMetadata {
    invoice_date: string;
    fee_period_start: string;
    fee_period_end: string;
    monthly_fees: number;
    outstanding_balance: number;
}

interface Statement {
    platform_invoice_id: string;
    monthly_fees: number;
    outstanding_balance: number;
    total_amount: number;
    description: string;
    currency_code: string;
    invoice_date: string;
    status: 'sent' | 'paid' | 'overdue' | 'cancelled';
    created_at: string;
    metadata: StatementMetadata;
}

function Statements() {
    const [last30DaysFees, setLast30DaysFees] = useState(0)
    const [lastMonthFees, setLastMonthFees] = useState(0)
    const [outstandingBalance, setOutstandingBalance] = useState(0)
    const [statements, setStatements] = useState<Statement[]>([])
    const [downloadingId, setDownloadingId] = useState<string | null>(null)
    const [showFeesBreakdown, setShowFeesBreakdown] = useState(false)

    useEffect(() => {
        fetchStatements()
    }, [])

    const fetchStatements = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user found')

            // Get fees for last 30 days and last month
            const { data: feesData, error: feesError } = await supabase
                .rpc('get_merchant_platform_fees', { p_merchant_id: user.id })

            if (feesError) throw feesError

            if (feesData && feesData.length > 0) {
                setLast30DaysFees(feesData[0].last_30_days_fees)
                setLastMonthFees(feesData[0].last_month_fees)
                setOutstandingBalance(feesData[0].outstanding_balance)
            }

            // Fetch monthly statements
            const { data: statementsData, error: statementsError } = await supabase
                .rpc('fetch_billing_statements', { p_merchant_id: user.id })

            if (statementsError) throw statementsError
            setStatements(statementsData || [])

        } catch (error) {
            console.error('Error fetching statements:', error)
            toast({
                title: "Error",
                description: "Failed to fetch statements. Please try again later.",
                variant: "destructive",
            })
        }
    }

    const handleDownload = async (statementId: string) => {
        setDownloadingId(statementId)
        try {
            const statement = statements.find(s => s.platform_invoice_id === statementId)
            if (!statement) throw new Error('Statement not found')

            // Try to download the PDF directly first
            try {
                const { data, error } = await supabase
                    .storage
                    .from('platform-invoices')
                    .download(`${statementId}.pdf`)

                if (error) throw error

                // If we got the data, create a download link
                const url = URL.createObjectURL(data)
                const a = document.createElement('a')
                a.href = url
                a.download = `Platform_Statement_${format(new Date(statement.invoice_date || statement.created_at), 'yyyy-MM')}.pdf`
                document.body.appendChild(a)
                a.click()
                URL.revokeObjectURL(url)
                document.body.removeChild(a)

                toast({
                    title: "Success",
                    description: "Statement downloaded successfully.",
                })
                return
            } catch (downloadError) {
                console.log('PDF not found, trying to generate it...', downloadError)
                // If download fails, try to generate the PDF
            }

            // Generate PDF first since it doesn't exist
            const { error: genError } = await supabase
                .rpc('generate_statement_pdf', {
                    p_invoice_id: statementId
                })

            if (genError) {
                console.error('Error generating PDF:', genError)
                throw new Error(genError.message || 'Failed to generate PDF')
            }

            // Try downloading again after generation
            const { data: newData, error: dlError } = await supabase
                .storage
                .from('platform-invoices')
                .download(`${statementId}.pdf`)

            if (dlError) {
                console.error('Error downloading PDF after generation:', dlError)
                throw dlError
            }

            // Download the file
            const url = URL.createObjectURL(newData)
            const a = document.createElement('a')
            a.href = url
            a.download = `Platform_Statement_${format(new Date(statement.invoice_date || statement.created_at), 'yyyy-MM')}.pdf`
            document.body.appendChild(a)
            a.click()
            URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast({
                title: "Success",
                description: "Statement downloaded successfully.",
            })
        } catch (error) {
            console.error('Error downloading statement:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to download statement. Please try again.",
                variant: "destructive",
            })
        } finally {
            setDownloadingId(null)
        }
    }

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
                title="Billing statements"
                desc="View your platform fees and monthly statements."
            >
                <div className="space-y-6">
                    <Alert variant="info">
                        <AlertDescription>
                            This information helps customers recognize your business, and may appear in your payment statements, invoices, and receipts.
                        </AlertDescription>
                    </Alert>
                    <Card
                        className="rounded-none cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setShowFeesBreakdown(!showFeesBreakdown)}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div>
                                <CardTitle className="text-sm font-medium">
                                    Billing summary
                                </CardTitle>
                            </div>
                            <ArrowDownIcon
                                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${showFeesBreakdown ? 'rotate-180' : ''}`}
                            />
                        </CardHeader>
                        <CardContent>
                            <AnimatePresence mode="wait">
                                {!showFeesBreakdown ? (
                                    <motion.div
                                        key="total"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Last 30 days fees
                                                </p>
                                                <p className="text-2xl font-bold mt-1">
                                                    XOF {last30DaysFees.toLocaleString()}
                                                </p>
                                            </div>
                                            {outstandingBalance > 0 && (
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-red-500">
                                                        Outstanding Balance
                                                    </p>
                                                    <p className="text-2xl font-bold text-red-500 mt-1">
                                                        XOF {outstandingBalance.toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="breakdown"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Last 30 Days</p>
                                                    <p className="text-xl font-semibold mt-1">
                                                        XOF {last30DaysFees.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Last Month</p>
                                                    <p className="text-xl font-semibold mt-1">
                                                        XOF {lastMonthFees.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            {outstandingBalance > 0 && (
                                                <div className="pt-4 border-t">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm font-medium text-red-500">Outstanding Balance</p>
                                                            <p className="text-xl font-semibold text-red-500 mt-1">
                                                                XOF {outstandingBalance.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-red-500/80 mt-2">
                                                        This amount includes pending adjustments such as chargebacks and messaging fees.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">Monthly statements</CardTitle>
                            <CardDescription>Download your monthly platform fee statements</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {statements.length === 0 ? (
                                <div className="text-center py-6">
                                    <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mt-4 text-lg font-semibold">No statements yet</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Your monthly statements are automatically generated on the 25th of each month.
                                        The first statement will be available after the next billing cycle.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {statements.map((statement) => (
                                        <div
                                            key={statement.platform_invoice_id}
                                            className="flex items-center justify-between p-4 border rounded-none hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="space-y-1">
                                                <p className="font-medium">{statement.description}</p>
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        {statement.currency_code} {statement.monthly_fees.toLocaleString()}
                                                    </p>
                                                    {statement.outstanding_balance > 0 && (
                                                        <>
                                                            <span className="text-sm text-muted-foreground">+</span>
                                                            <p className="text-sm text-red-500">
                                                                {statement.outstanding_balance.toLocaleString()} (outstanding)
                                                            </p>
                                                            <span className="text-sm text-muted-foreground">=</span>
                                                            <p className="text-sm font-medium">
                                                                {statement.total_amount.toLocaleString()}
                                                            </p>
                                                        </>
                                                    )}
                                                    <span className="text-sm text-muted-foreground">•</span>
                                                    <p className="text-sm text-muted-foreground">
                                                        Generated on {format(new Date(statement.created_at), 'MMM d, yyyy')}
                                                    </p>
                                                    <span
                                                        className={`px-2 py-0.5 text-xs rounded-full ${statement.status === 'paid'
                                                            ? 'bg-green-100 text-green-700'
                                                            : statement.status === 'overdue'
                                                                ? 'bg-red-100 text-red-700'
                                                                : statement.status === 'cancelled'
                                                                    ? 'bg-gray-100 text-gray-700'
                                                                    : 'bg-yellow-100 text-yellow-700'
                                                            }`}
                                                    >
                                                        {statement.status.charAt(0).toUpperCase() + statement.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="space-x-2"
                                                onClick={() => handleDownload(statement.platform_invoice_id)}
                                                disabled={downloadingId === statement.platform_invoice_id}
                                            >
                                                {downloadingId === statement.platform_invoice_id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Download className="h-4 w-4" />
                                                )}
                                                <span>Download</span>
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <InfoBox mini
                        variant="green"
                        title="Need help?"
                        type="info"
                    >
                        Monthly statements are automatically generated and can be downloaded for your records.
                        Contact <a href="mailto:hello@lomi.africa" className="underline">hello@lomi.africa</a> for any questions about your platform fees, statements, or balance.
                    </InfoBox>
                </div>
            </ContentSection>
        </div>
    )
}

export default Statements;