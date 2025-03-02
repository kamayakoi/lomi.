import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollToTop } from '@/components/landing/scroll-to-top';
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from '@/components/landing/Footer';
import { Toaster } from "@/components/ui/toaster";
import { Button } from '@/components/ui/button';
import { ChevronLeft, CheckCircle2, Code, Globe, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { ButtonExpand } from '@/components/design/button-expand';

export default function WebsiteSalesPage() {
    const [mounted, setMounted] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
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

            {/* Desktop back button - hidden on mobile */}
            <div className="fixed left-0 bottom-25 hidden h-screen w-80 lg:block">
                <div className="flex h-full flex-col overflow-hidden">
                    {/* Back button */}
                    <div className="absolute top-15 left-15">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-10 left-10 inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-black/50 text-gray-700 hover:text-gray-900 dark:text-sage-100 dark:hover:text-sage-200 dark:hover:bg-zinc-900 dark:border-zinc-800 border border-gray-200 h-10 w-10 rounded-none transition-colors"
                            onClick={() => navigate(-1)}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto max-w-6xl px-4 pb-32">
                <div className="space-y-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative pt-16 md:pt-20"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-7xl tracking-tighter font-regular text-zinc-800 dark:text-white mb-6">
                            {t('websiteSales.title', 'Sell on your website')}
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-200 text-base sm:text-lg md:text-xl leading-relaxed tracking-tight max-w-2xl">
                            {t('websiteSales.description', 'Integrate our payment solution into your existing website or use our hosted checkout pages to sell your products and services online.')}
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
                                <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm">
                                    <CardContent className="p-4 sm:p-6 md:p-8">
                                        {/* Integration Options */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            {/* Option 1: API Integration */}
                                            <div className="space-y-3">
                                                <div className="flex items-center mb-2">
                                                    <Code className="h-5 w-5 text-blue-500 mr-2" />
                                                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                                                        {t('websiteSales.options.api.title', 'API Integration')}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    {t('websiteSales.options.api.description', 'Integrate our payment API directly into your website for a seamless checkout experience.')}
                                                </p>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('websiteSales.options.api.feature1', 'Full customization control')}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('websiteSales.options.api.feature2', 'Seamless user experience')}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Option 2: Hosted Checkout */}
                                            <div className="space-y-3">
                                                <div className="flex items-center mb-2">
                                                    <Globe className="h-5 w-5 text-blue-500 mr-2" />
                                                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                                                        {t('websiteSales.options.hosted.title', 'Hosted Checkout')}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    {t('websiteSales.options.hosted.description', 'Use our pre-built checkout pages that you can embed or redirect to from your website.')}
                                                </p>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('websiteSales.options.hosted.feature1', 'No coding required')}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('websiteSales.options.hosted.feature2', 'Secure payment processing')}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Option 3: Payment Links */}
                                            <div className="space-y-3">
                                                <div className="flex items-center mb-2">
                                                    <ShoppingCart className="h-5 w-5 text-blue-500 mr-2" />
                                                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                                                        {t('websiteSales.options.links.title', 'Payment Links')}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    {t('websiteSales.options.links.description', 'Create shareable payment links that you can add to your website, emails, or social media.')}
                                                </p>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('websiteSales.options.links.feature1', 'Quick setup')}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('websiteSales.options.links.feature2', 'Works with any website')}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Benefits Section */}
                                        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 mb-6">
                                            <h3 className="text-lg font-medium mb-4 text-zinc-900 dark:text-white">
                                                {t('websiteSales.benefits.title', 'Benefits of Selling on Your Website')}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
                                                    <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
                                                        {t('websiteSales.benefits.control.title', 'Complete Control')}
                                                    </h4>
                                                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                                        {t('websiteSales.benefits.control.description', 'Maintain full control over your brand experience, customer journey, and checkout process.')}
                                                    </p>
                                                </div>
                                                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
                                                    <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
                                                        {t('websiteSales.benefits.fees.title', 'Lower Fees')}
                                                    </h4>
                                                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                                        {t('websiteSales.benefits.fees.description', 'Avoid marketplace commissions and keep more of your revenue with our competitive payment processing rates.')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA Section */}
                                        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-sm font-medium text-zinc-900 dark:text-white mb-4 sm:mb-0">
                                                    {t('websiteSales.cta.title', 'Ready to start selling on your website?')}
                                                </p>
                                                <ButtonExpand
                                                    text={t('websiteSales.cta.button', 'Get Started')}
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
