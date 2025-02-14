'use client'

import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import { motion } from 'framer-motion'
import { cn } from '@/lib/actions/utils'
import { useTranslation } from 'react-i18next'
import { OnboardingLanguageSwitcher } from '@/components/design/OnboardingLanguageSwitcher'
import { ButtonExpand } from '@/components/design/button-expand'
import { supabase } from '@/utils/supabase/client'

interface WelcomeScreenProps {
    onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
    const { t, i18n } = useTranslation()
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
    const [showConfetti, setShowConfetti] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [firstName, setFirstName] = useState<string>('')

    // Initialize language and get user data
    useEffect(() => {
        const initializeData = async () => {
            const savedLanguage = localStorage.getItem('language');
            if (savedLanguage && i18n.language !== savedLanguage) {
                await i18n.changeLanguage(savedLanguage);
            }

            // Get user data
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.['full_name']) {
                const fullName = user.user_metadata['full_name'];
                const firstName = fullName.split(' ')[0];
                setFirstName(firstName);
            } else if (user?.user_metadata?.['first_name']) {
                setFirstName(user.user_metadata['first_name']);
            }

            setMounted(true);
        };

        initializeData();
    }, [i18n]);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        const timer = setTimeout(() => setShowConfetti(true), 500)

        return () => {
            window.removeEventListener('resize', handleResize)
            clearTimeout(timer)
        }
    }, [])

    // Don't render until language is initialized
    if (!mounted) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-background dark:bg-background flex items-center justify-center p-4 overflow-hidden">
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={200}
                    colors={['#D73E57', '#12B881', '#3C82F6']}
                />
            )}
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={cn(
                    "shadow-2xl p-4 sm:p-8 lg:p-12 w-full max-w-[895px] rounded-none border dark:border-gray-800",
                    "bg-white dark:bg-background",
                    "relative overflow-hidden"
                )}
            >
                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D73E57] via-[#12B881] to-[#3C82F6]" />


                <div className="absolute top-4 right-4 z-10">
                    <OnboardingLanguageSwitcher />
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
                    {/* Left side - Image */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="w-full max-w-[280px] lg:w-[380px] relative flex-shrink-0 flex items-center"
                    >
                        <img
                            src="/onboarding/okra_onboarding.svg"
                            alt="Welcome to lomi."
                            className="w-full h-auto object-contain"
                            loading="eager"
                        />
                    </motion.div>

                    {/* Right side - Content */}
                    <div className="flex flex-col flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="flex items-center justify-center lg:justify-start gap-2"
                        >
                            <h1 className={cn(
                                "text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6",
                                "text-gray-900 dark:text-white",
                                "tracking-tight"
                            )}>
                                {t('onboarding.welcome_screen.title')}
                                {firstName && <span className="text-black dark:text-white"> {firstName}</span>} !
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.9 }}
                            className={cn(
                                "text-base sm:text-lg mb-6 lg:mb-10 max-w-[440px] mx-auto lg:mx-0",
                                "text-gray-600 dark:text-gray-300",
                                "leading-relaxed"
                            )}
                        >
                            {t('onboarding.welcome_screen.description.line1')}
                            <br />
                            {t('onboarding.welcome_screen.description.line2')}
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                            className="flex justify-center lg:justify-end"
                        >
                            <ButtonExpand
                                text={t('onboarding.welcome_screen.get_started')}
                                onClick={onGetStarted}
                                bgColor="bg-black dark:bg-gray-800"
                                textColor="text-white"
                                hoverBgColor="hover:bg-gray-900 dark:hover:bg-gray-700"
                                hoverTextColor="hover:text-white"
                                className="w-full mt-10 sm:w-fit"
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
