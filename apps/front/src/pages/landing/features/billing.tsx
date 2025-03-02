import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollToTop } from '@/components/landing/scroll-to-top';
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from '@/components/landing/Footer';
import { Toaster } from "@/components/ui/toaster";
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { ButtonExpand } from '@/components/design/button-expand';

export default function BillingPage() {
    const [mounted, setMounted] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isTitleHovered, setIsTitleHovered] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Handle hydration mismatch
    useEffect(() => {
        setMounted(true);
        window.scrollTo(0, 0);
    }, []);

    // Calculate scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPosition = window.scrollY;
            const maxScroll = documentHeight - windowHeight;
            const progress = Math.min((scrollPosition / maxScroll) * 100, 100);
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial calculation

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="relative min-h-screen bg-background">
            {/* Progress bar */}
            <div
                className="fixed top-0 left-0 h-1 bg-blue-500 z-50 transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
            />

            {/* Main Content */}
            <main className="container mx-auto max-w-6xl px-4 pb-32">
                <div className="space-y-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative pt-16 md:pt-20"
                    >
                        <motion.h1
                            className="text-4xl sm:text-5xl md:text-7xl tracking-tighter font-regular text-zinc-800 dark:text-white mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate(-1)}
                            onMouseEnter={() => setIsTitleHovered(true)}
                            onMouseLeave={() => setIsTitleHovered(false)}
                        >
                            <span className="flex items-center">
                                <ArrowLeft className={`mr-2 h-8 w-8 transition-all duration-300 absolute ${isTitleHovered ? 'opacity-100 -translate-x-6' : 'opacity-0 -translate-x-4'}`} />
                                <span className="transition-transform duration-300" style={{ transform: isTitleHovered ? 'translateX(20px)' : 'translateX(0)' }}>
                                    {t('billing.title')}
                                </span>
                            </span>
                        </motion.h1>
                        <p className="text-zinc-600 dark:text-zinc-200 text-base sm:text-lg md:text-xl leading-relaxed tracking-tight max-w-2xl">
                            {t('billing.description')}
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
                                <Card className="w-full max-w-5xl mx-auto bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm">
                                    <CardContent className="p-4 sm:p-6 md:p-8">
                                        {/* Features Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            {/* Feature 1 */}
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                                                    {t('billing.features.invoices.title')}
                                                </h3>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('billing.features.invoices.feature1')}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('billing.features.invoices.feature2')}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Feature 2 */}
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                                                    {t('billing.features.recurring.title')}
                                                </h3>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('billing.features.recurring.feature1')}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('billing.features.recurring.feature2')}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Feature 3 */}
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                                                    {t('billing.features.automation.title')}
                                                </h3>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('billing.features.automation.feature1')}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('billing.features.automation.feature2')}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* How It Works Section */}
                                        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                                            <h3 className="text-lg font-medium mb-4 text-zinc-900 dark:text-white">
                                                {t('billing.howItWorks.title')}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="flex items-start">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                                                        <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">1</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                                            {t('billing.howItWorks.step1.title')}
                                                        </p>
                                                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                                                            {t('billing.howItWorks.step1.description')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                                                        <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">2</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                                            {t('billing.howItWorks.step2.title')}
                                                        </p>
                                                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                                                            {t('billing.howItWorks.step2.description')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                                                        <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">3</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                                            {t('billing.howItWorks.step3.title')}
                                                        </p>
                                                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                                                            {t('billing.howItWorks.step3.description')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA Section */}
                                        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-sm font-medium text-zinc-900 dark:text-white mb-4 sm:mb-0">
                                                    {t('billing.cta.title')}
                                                </p>
                                                <ButtonExpand
                                                    text={t('billing.cta.button')}
                                                    bgColor="bg-blue-50 dark:bg-blue-900/30"
                                                    textColor="text-blue-700 dark:text-blue-300"
                                                    hoverBgColor="hover:bg-blue-100 dark:hover:bg-blue-900/40"
                                                    hoverTextColor="hover:text-blue-800 dark:hover:text-blue-200"
                                                    onClick={() => navigate('/sign-up')}
                                                />
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
        </div>
    );
} 