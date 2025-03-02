import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollToTop } from '@/components/landing/scroll-to-top';
import { Footer } from '@/components/landing/Footer';
import { Toaster } from "@/components/ui/toaster"
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    index: number;
    toggleItem: (index: number) => void;
}

const FAQItem = ({ question, answer, isOpen, index, toggleItem }: FAQItemProps) => {
    return (
        <div className="mb-3">
            <button
                className="w-full text-left p-3 sm:p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-center"
                onClick={() => toggleItem(index)}
            >
                <span className="font-medium text-zinc-900 dark:text-white text-base">{question}</span>
                <ChevronDown className={`h-4 w-4 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-800 border-x border-b border-zinc-200 dark:border-zinc-700 rounded-none">
                            <div className="text-zinc-600 dark:text-zinc-300 text-sm" dangerouslySetInnerHTML={{ __html: answer }} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function FAQPage() {
    const [mounted, setMounted] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [openItemIndex, setOpenItemIndex] = useState<number | null>(0); // Default open the first item
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Toggle FAQ item - accordion style
    const toggleItem = (index: number) => {
        setOpenItemIndex(openItemIndex === index ? null : index);
    };

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

    // FAQ data - using only 5 questions to fit better on one page
    const faqItems = [
        {
            question: t("faq.items.pricing.question"),
            answer: t("faq.items.pricing.answer")
        },
        {
            question: t("faq.items.funds.question"),
            answer: t("faq.items.funds.answer")
        },
        {
            question: t("faq.items.payment_methods.question"),
            answer: t("faq.items.payment_methods.answer")
        },
        {
            question: t("faq.items.minimum_amount.question"),
            answer: t("faq.items.minimum_amount.answer")
        },
        {
            question: t("faq.items.security.question"),
            answer: t("faq.items.security.answer")
        }
        // Removed the international question to fit better on one page
    ];

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
                            {t("faq.title")}
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-200 text-base sm:text-lg md:text-xl leading-relaxed tracking-tight max-w-2xl">
                            {t("faq.subtitle")}
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
                                    <CardContent className="p-4 sm:p-6 md:p-8 max-h-[calc(100vh-240px)] overflow-y-auto">
                                        <div className="space-y-3">
                                            {faqItems.map((item, index) => (
                                                <FAQItem
                                                    key={index}
                                                    question={item.question}
                                                    answer={item.answer}
                                                    isOpen={openItemIndex === index}
                                                    index={index}
                                                    toggleItem={toggleItem}
                                                />
                                            ))}
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
                                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                                {t("faq.still_have_questions")}{' '}
                                                <a
                                                    href="https://developers.lomi.africa/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 hover:underline hover:decoration-[1px] hover:underline-offset-4"
                                                >
                                                    {t("faq.visit_docs")}
                                                </a>
                                            </p>
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