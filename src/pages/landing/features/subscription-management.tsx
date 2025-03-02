import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollToTop } from '@/components/landing/scroll-to-top';
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from '@/components/landing/Footer';
import { Toaster } from "@/components/ui/toaster";
import { Button } from '@/components/ui/button';
import { ChevronLeft, CheckCircle2, Calendar, CreditCard, BarChart3, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { ButtonExpand } from '@/components/design/button-expand';

export default function SubscriptionManagementPage() {
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
                            {t('subscriptionManagement.title', 'Sell subscriptions')}
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-200 text-base sm:text-lg md:text-xl leading-relaxed tracking-tight max-w-2xl">
                            {t('subscriptionManagement.description', 'Create and manage recurring revenue streams with our powerful subscription management tools. Perfect for SaaS, memberships, and recurring services.')}
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            {/* Feature 1: Flexible Billing */}
                                            <div className="space-y-3">
                                                <div className="flex items-center mb-2">
                                                    <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                                                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                                                        {t('subscriptionManagement.features.billing.title', 'Flexible billing options')}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    {t('subscriptionManagement.features.billing.description', 'Set up daily, weekly, bi-weekly, monthly, quarterly, or annual billing cycles with customizable pricing tiers and trial periods.')}
                                                </p>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('subscriptionManagement.features.billing.feature1', 'Highly flexible billing frequencies')}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('subscriptionManagement.features.billing.feature2', 'Free and paid trial options')}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Feature 2: Payment Processing */}
                                            <div className="space-y-3">
                                                <div className="flex items-center mb-2">
                                                    <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
                                                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                                                        {t('subscriptionManagement.features.payment.title', 'Automated recurring payments billing')}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    {t('subscriptionManagement.features.payment.description', 'Automatically charge customers on their billing cycle if they have cards on file. If they didn\'t pay with cards, we\'ll automatically follow up with them by email and phone to get them to continue their subscription.')}
                                                </p>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('subscriptionManagement.features.payment.feature1', 'PCI DSS compliant')}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('subscriptionManagement.features.payment.feature2', 'Modular retry logic')}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Feature 3: Analytics */}
                                            <div className="space-y-3">
                                                <div className="flex items-center mb-2">
                                                    <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                                                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                                                        {t('subscriptionManagement.features.analytics.title', 'Analytics')}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    {t('subscriptionManagement.features.analytics.description', 'Track key metrics like MRR, churn rate, customer lifetime value, and subscription growth with detailed charts.')}
                                                </p>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('subscriptionManagement.features.analytics.feature1', 'Customer Lifetime Value and revenue forecasting')}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('subscriptionManagement.features.analytics.feature2', 'Churn analysis')}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Feature 4: Customer Management */}
                                            <div className="space-y-3">
                                                <div className="flex items-center mb-2">
                                                    <Settings className="h-5 w-5 text-blue-500 mr-2" />
                                                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                                                        {t('subscriptionManagement.features.management.title', 'Customer self-service')}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    {t('subscriptionManagement.features.management.description', 'Empower customers to manage their own subscriptions with a user-friendly portal for upgrades, downgrades, cancellations and support requests.')}
                                                </p>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('subscriptionManagement.features.management.feature1', 'Plan switching')}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('subscriptionManagement.features.management.feature2', 'Payment method updates')}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Use Cases Section */}
                                        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 mb-6">
                                            <h3 className="text-lg font-medium mb-4 text-zinc-900 dark:text-white">
                                                {t('subscriptionManagement.useCases.title', 'Perfect for')}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
                                                    <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
                                                        {t('subscriptionManagement.useCases.saas.title', 'SaaS Businesses')}
                                                    </h4>
                                                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                                        {t('subscriptionManagement.useCases.saas.description', 'Manage tiered pricing plans, free trials, and annual vs. monthly billing for your software service.')}
                                                    </p>
                                                </div>
                                                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
                                                    <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
                                                        {t('subscriptionManagement.useCases.membership.title', 'Membership Sites')}
                                                    </h4>
                                                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                                        {t('subscriptionManagement.useCases.membership.description', 'Create recurring membership plans with different access levels and automated billing.')}
                                                    </p>
                                                </div>
                                                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
                                                    <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
                                                        {t('subscriptionManagement.useCases.services.title', 'Service Providers')}
                                                    </h4>
                                                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                                        {t('subscriptionManagement.useCases.services.description', 'Offer recurring services like cleaning, maintenance, or consulting with flexible scheduling options.')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA Section */}
                                        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-sm font-medium text-zinc-900 dark:text-white mb-4 sm:mb-0">
                                                    {t('subscriptionManagement.cta.title', 'Ready to grow your recurring revenue?')}
                                                </p>
                                                <ButtonExpand
                                                    text={t('subscriptionManagement.cta.button', 'Get Started')}
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