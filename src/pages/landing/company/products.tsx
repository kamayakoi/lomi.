import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import PulsatingButton from '@/components/ui/pulsating-button';
import { OrbitingCirclesDemo } from '@/components/landing/orbiting-circles';
import { useTranslation } from 'react-i18next';

// Import the logo images
import orangeLogo from '/payment_channels/orange.webp';
import mtnLogo from '/payment_channels/mtn.webp';
import waveLogo from '/payment_channels/wave.webp';
import ecobankLogo from '/payment_channels/ecobank.webp';
import visaLogo from '/payment_channels/visa.webp';
import mastercardLogo from '/payment_channels/mastercard.webp';
import applePayLogo from '/payment_channels/apple_pay.webp';

interface IntegrationAccordionProps {
    title: string;
    icon?: ReactNode;
    logos: { src: string; alt: string }[];
}

const IntegrationAccordion = ({ title, icon, logos }: IntegrationAccordionProps) => {
    const { t } = useTranslation();
    const showComingSoonMessage = title === 'Mobile Money' || title === 'eWallets' || title === 'Pay by bank';

    return (
        <div className="p-4 bg-[#F8F9FB] dark:bg-[#0D0D15] rounded-lg shadow-md w-full">
            <div className="flex flex-col items-center mb-4">
                {icon && <div className="text-4xl mb-2">{icon}</div>}
                <h3 className="text-2xl font-semibold text-center text-card-foreground dark:text-card-foreground">
                    {title}
                </h3>
            </div>
            <hr className="my-2 border-border dark:border-border" />
            <div className="mt-2 text-muted-foreground dark:text-muted-foreground">
                {logos.map((logo, index) => (
                    <div key={index}>
                        <div className="flex items-center my-2">
                            <div className="w-8 h-8 mr-2 flex-shrink-0 border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
                                {/* Render the logo image */}
                                <img src={logo.src} alt={logo.alt} className="w-full h-full object-contain" />
                            </div>
                            <p>{logo.alt}</p>
                        </div>
                        {index < logos.length - 1 && (
                            <hr className="my-2 border-border dark:border-border" />
                        )}
                    </div>
                ))}
                {showComingSoonMessage && (
                    <>
                        <hr className="my-2 border-border dark:border-border" />
                        <div className="mt-4 text-center text-sm text-muted-foreground dark:text-muted-foreground">
                            {t('products.integrations.comingSoon')}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const Products = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col min-h-[100dvh] bg-background dark:bg-background">
            <div className="h-24 md:hidden"></div>
            {/* Hero Section */}
            <section className="py-12 md:py-24 lg:py-32 text-left">
                <div className="container px-4 md:px-6 flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl text-foreground dark:text-foreground">
                            {t('products.hero.title')}
                        </h1>
                        <p className="mt-4 max-w-[600px] text-lg md:text-2xl text-muted-foreground dark:text-muted-foreground text-left">
                            {t('products.hero.description')}
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <Link to="/sign-in">
                                <PulsatingButton className="mt-8 bg-blue-600 text-white font-semibold text-2xl px-10 py-4 rounded-lg shadow-lg hover:bg-blue-700">
                                    <span className="font-bold text-white">{t('products.hero.start')}</span>
                                    <span className="text-lg ml-2 text-white">{t('products.hero.inMinutes')}</span>
                                </PulsatingButton>
                            </Link>
                        </div>
                    </div>
                    <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center items-center">
                        <div className="w-full max-w-3xl relative hidden lg:block">
                            <OrbitingCirclesDemo />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section for Integrations */}
            <section className="bg-background py-4 md:py-8 lg:py-12 p-4 rounded-lg shadow-md w-full dark:bg-muted">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground dark:text-foreground mb-4">
                            {t('products.integrations.title')}
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground dark:text-muted-foreground md:text-xl">
                            {t('products.integrations.description')}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-8">
                            <IntegrationAccordion
                                title="Mobile Money"
                                logos={[
                                    { src: orangeLogo, alt: "Orange" },
                                    { src: mtnLogo, alt: "MTN" }
                                ]}
                            />
                            <IntegrationAccordion
                                title="eWallets"
                                logos={[
                                    { src: waveLogo, alt: "Wave" }
                                ]}
                            />
                            <IntegrationAccordion
                                title="Pay by bank"
                                logos={[
                                    { src: ecobankLogo, alt: "Ecobank" },
                                ]}
                            />
                            <IntegrationAccordion
                                title="Pay by card"
                                logos={[
                                    { src: visaLogo, alt: "Visa" },
                                    { src: mastercardLogo, alt: "Mastercard" },
                                    { src: applePayLogo, alt: "Apple Pay" }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Products;
