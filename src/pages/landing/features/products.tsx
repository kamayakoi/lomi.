import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrbitingCirclesDemo } from "@/components/landing/orbiting-circles";
import { useTranslation } from 'react-i18next';
import { ScrollToTop } from '@/components/landing/scroll-to-top';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ShoppingCart, Tag, BarChart3, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from "@/components/ui/toaster";
import { ButtonExpand } from '@/components/design/button-expand';

// Smaller version of OrbitingCirclesDemo for the products page
const CompactOrbitingCircles = () => {
    return (
        <div className="scale-[0.6] md:scale-[0.75] lg:scale-[0.6] origin-center transform-gpu -mt-6">
            <div className="w-[400px] h-[300px] overflow-visible">
                <OrbitingCirclesDemo />
            </div>
        </div>
    );
};

const Products = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isTitleHovered, setIsTitleHovered] = useState(false);

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
                                    {t('products.title', 'Sell products')}
                                </span>
                            </span>
                        </motion.h1>
                        <p className="text-zinc-600 dark:text-zinc-200 text-base sm:text-lg md:text-xl leading-relaxed tracking-tight max-w-2xl">
                            {t('products.description', 'Create, manage, and sell your products with our comprehensive product management system. Easily track inventory, set pricing, and analyze sales performance.')}
                        </p>

                        {/* Orbiting circles - positioned absolutely */}
                        <div className="absolute top-16 right-0 md:top-20 lg:top-12 transform translate-x-0 md:-translate-x-8 lg:translate-x-12 xl:translate-x-24 hidden md:block z-10">
                            <CompactOrbitingCircles />
                        </div>

                        {/* Mobile orbiting circles - only visible on small screens */}
                        <div className="flex justify-center md:hidden mt-12 mb-8">
                            <CompactOrbitingCircles />
                        </div>
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
                                        {/* Product Management Features */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            {/* Feature 1: Product Catalog */}
                                            <div className="space-y-3">
                                                <div className="flex items-center mb-2">
                                                    <ShoppingCart className="h-5 w-5 text-blue-500 mr-2" />
                                                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                                                        {t('products.features.catalog.title', 'Product Catalog')}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    {t('products.features.catalog.description', 'Create and manage your product catalog with detailed descriptions, images, and variants.')}
                                                </p>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('products.features.catalog.feature1', 'Unlimited products')}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('products.features.catalog.feature2', 'Multiple images per product')}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Feature 2: Pricing & Inventory */}
                                            <div className="space-y-3">
                                                <div className="flex items-center mb-2">
                                                    <Tag className="h-5 w-5 text-blue-500 mr-2" />
                                                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                                                        {t('products.features.pricing.title', 'Pricing & Inventory')}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    {t('products.features.pricing.description', 'Set flexible pricing options and track inventory levels in real-time.')}
                                                </p>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('products.features.pricing.feature1', 'Tiered pricing options')}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('products.features.pricing.feature2', 'Low stock alerts')}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Feature 3: Analytics */}
                                            <div className="space-y-3">
                                                <div className="flex items-center mb-2">
                                                    <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                                                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                                                        {t('products.features.analytics.title', 'Sales Analytics')}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    {t('products.features.analytics.description', 'Track product performance with detailed sales analytics and reports.')}
                                                </p>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('products.features.analytics.feature1', 'Sales performance dashboards')}
                                                        </span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            {t('products.features.analytics.feature2', 'Customer insights')}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* How It Works Section */}
                                        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 mb-6">
                                            <h3 className="text-lg font-medium mb-4 text-zinc-900 dark:text-white">
                                                {t('products.howItWorks.title', 'How It Works')}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
                                                    <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
                                                        {t('products.howItWorks.step1.title', '1. Create Products')}
                                                    </h4>
                                                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                                        {t('products.howItWorks.step1.description', 'Add your products with descriptions, images, pricing, and inventory levels.')}
                                                    </p>
                                                </div>
                                                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
                                                    <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
                                                        {t('products.howItWorks.step2.title', '2. Sell Anywhere')}
                                                    </h4>
                                                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                                        {t('products.howItWorks.step2.description', 'Sell your products through your website, WhatsApp, or payment links.')}
                                                    </p>
                                                </div>
                                                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
                                                    <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
                                                        {t('products.howItWorks.step3.title', '3. Track Performance')}
                                                    </h4>
                                                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                                        {t('products.howItWorks.step3.description', 'Monitor sales, inventory, and customer behavior with detailed analytics.')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA Section */}
                                        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-sm font-medium text-zinc-900 dark:text-white mb-4 sm:mb-0">
                                                    {t('products.cta.title', 'Ready to manage your products efficiently?')}
                                                </p>
                                                <ButtonExpand
                                                    text={t('products.cta.button', 'Get Started')}
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
};

export default Products;
