import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollToTop } from '@/components/landing/scroll-to-top';
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Footer } from '@/components/landing/Footer';
import { Toaster } from "@/components/ui/toaster"
import BusinessOutreach from "@/components/ui/business-outreach"

export default function PricingPage() {
    const [mounted, setMounted] = useState(false);
    const [titleNumber, setTitleNumber] = useState(0);

    // Calculator state
    const [currency, setCurrency] = useState<"USD" | "XOF">("XOF")
    const [amount, setAmount] = useState<number>(1000)

    const prices = useMemo(
        () => [
            "$0.50",
            "200 XOF"
        ],
        []
    );

    // Handle price animation
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === prices.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 20000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, prices.length]);

    // Handle hydration mismatch
    useEffect(() => {
        setMounted(true);
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (currency === "USD") {
            setAmount(Math.min(amount, 10000))
        } else {
            setAmount(Math.min(amount, 6550000))
        }
    }, [currency, amount])

    const calculateFees = () => {
        return amount * 0.032 // 3.2% flat fee
    }

    const fees = calculateFees()
    const amountReceived = amount - fees

    const formatAmount = (value: number) => {
        const formatter = new Intl.NumberFormat(currency === "USD" ? "en-US" : "fr-FR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true,
        });

        const formattedNumber = formatter.format(value);

        if (currency === "USD") {
            return `$${formattedNumber}`;
        } else {
            // Add extra space between thousands for better readability in XOF
            return formattedNumber.replace(/\s/g, ' ') + ' XOF';
        }
    }

    if (!mounted) {
        return null;
    }

    return (
        <div className="relative min-h-screen bg-background">
            {/* Main Content */}
            <main className="container mx-auto max-w-6xl px-4 pb-32">
                <div className="space-y-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative pt-24"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-7xl tracking-tighter font-regular text-zinc-800 dark:text-white mb-6">
                            <div className="flex items-center h-14 sm:h-20">
                                <span>3.2% +</span>
                                <div className="relative flex items-center min-w-[280px] ml-4">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={titleNumber}
                                            className="absolute text-zinc-800 dark:text-white"
                                            initial={{ opacity: 0, y: titleNumber === 0 ? -50 : 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: titleNumber === 0 ? 50 : -50 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 30,
                                                duration: 2,
                                                exit: { duration: 1.5 }
                                            }}
                                        >
                                            {prices[titleNumber]}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                            </div>
                            <span>per transaction</span>
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-200 text-base sm:text-lg md:text-xl leading-relaxed tracking-tight max-w-2xl">
                            We only earn when you do — no surprises, no hidden fees, no monthly costs.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="mb-16"
                            >
                                <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none">
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-8 flex flex-col justify-between h-full">
                                                <div>
                                                    <Label className="text-lg font-semibold mb-4 block text-zinc-900 dark:text-white">Currency</Label>
                                                    <ToggleGroup
                                                        type="single"
                                                        value={currency}
                                                        onValueChange={(value: "USD" | "XOF") => setCurrency(value)}
                                                        className="justify-start border border-zinc-200 dark:border-zinc-800 rounded-none inline-flex [&>*:not(:first-child)]:border-l-0"
                                                    >
                                                        <ToggleGroupItem
                                                            value="XOF"
                                                            aria-label="Toggle XOF"
                                                            className="data-[state=on]:bg-zinc-100 dark:data-[state=on]:bg-zinc-800 data-[state=on]:text-zinc-900 dark:data-[state=on]:text-white px-6 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-transparent border-r border-zinc-200 dark:border-zinc-800 rounded-none transition-colors"
                                                        >
                                                            XOF
                                                        </ToggleGroupItem>
                                                        <ToggleGroupItem
                                                            value="USD"
                                                            aria-label="Toggle USD"
                                                            className="data-[state=on]:bg-zinc-100 dark:data-[state=on]:bg-zinc-800 data-[state=on]:text-zinc-900 dark:data-[state=on]:text-white px-6 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-transparent rounded-none transition-colors"
                                                        >
                                                            USD
                                                        </ToggleGroupItem>
                                                    </ToggleGroup>
                                                </div>

                                                <div className="flex-grow">
                                                    <Label className="text-lg font-semibold mb-4 block text-zinc-900 dark:text-white">
                                                        Transaction Amount
                                                    </Label>
                                                    <div className="text-2xl font-medium text-zinc-900 dark:text-white mb-4 tracking-wide">
                                                        {formatAmount(amount)}
                                                    </div>
                                                    <div className="bg-zinc-100 dark:bg-zinc-800 rounded-none overflow-hidden">
                                                        <Slider
                                                            min={100}
                                                            max={currency === "USD" ? 10000 : 6550000}
                                                            step={currency === "USD" ? 100 : 6550}
                                                            value={[amount]}
                                                            onValueChange={(value) => setAmount(value[0] ?? 0)}
                                                            className="w-full p-2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-16 flex flex-col justify-center border-l border-zinc-200 dark:border-zinc-800 pl-8 h-full">
                                                <div>
                                                    <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400 mb-2 flex items-center gap-1">
                                                        Our fee (3.2%)
                                                        <span className="text-red-500">*</span>
                                                    </p>
                                                    <p className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                                        {formatAmount(fees)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400 mb-2 flex items-center gap-1">
                                                        You receive
                                                    </p>
                                                    <p className="text-4xl sm:text-5xl font-bold tracking-tight text-green-500">
                                                        {formatAmount(amountReceived)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                                            <div className="flex items-start gap-2">
                                                <span className="text-red-500 text-xs -mr-1">*</span>
                                                <div className="space-y-0">
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                        The Premium have been removed from this calculator for simplicity.
                                                        <a
                                                            href="https://developers.lomi.africa/pricing"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center ml-1"
                                                        >
                                                            See how our fees apply
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.section>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>

            <ScrollToTop />
            <Footer />
            <Toaster />
            <BusinessOutreach />
        </div>
    );
}
