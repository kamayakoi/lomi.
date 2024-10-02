import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import PulsatingButton from '@/components/ui/pulsating-button';

// Import the logo images
import orangeLogo from '/orange.png';
import mtnLogo from '/mtn.png';
import waveLogo from '/wave.png';
import ecobankLogo from '/ecobank.png';
import sepaLogo from '/sepa.png';
import visaLogo from '/visa.png';
import mastercardLogo from '/mastercard.png';
import applePayLogo from '/apple-pay.png';

interface IntegrationAccordionProps {
    title: string;
    icon?: ReactNode;
    logos: { src: string; alt: string }[];
}

const IntegrationAccordion = ({ title, icon, logos }: IntegrationAccordionProps) => {
    const showComingSoonMessage = title === 'Mobile Money' || title === 'e-wallets' || title === 'Pay by bank';

    return (
        <div className="p-4 bg-card dark:bg-card rounded-lg shadow-md w-full">
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
                            More integrations coming soon...
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};


const Products = () => {
    return (
        <div className="flex flex-col min-h-[100dvh] bg-background dark:bg-background">
            <Navbar />
            {/* Hero Section */}
            <section className="py-12 md:py-24 lg:py-32 text-left">
                <div className="container px-4 md:px-6 flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl text-foreground dark:text-foreground">
                            Frictionless payments for businesses
                        </h1>
                        <p className="mt-4 max-w-[600px] text-lg md:text-2xl text-muted-foreground dark:text-muted-foreground text-left">
                            Enable online payments and invoicing in minutes.
                            <br />
                            Accept mobile money, cards, eWallets and bank payments with API, low-code, or no-code integration options.
                        </p>
                        <Link to="/sign-in">
                            <PulsatingButton className="mt-8 bg-blue-600 text-white font-semibold text-2xl px-10 py-4 rounded-lg shadow-lg hover:bg-blue-700">
                                <span className="font-bold text-white">Start</span>
                                <span className="text-lg ml-2 text-white">— in minutes</span>
                            </PulsatingButton>
                        </Link>
                    </div>
                    <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center items-center">
                        <div className="w-full max-w-3xl relative">
                            <img
                                src="/cube.png"
                                alt="Payment Integration Cube"
                                className="w-full h-auto rounded-2xl shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section for Integrations */}
            <section className="dark:bg-muted py-4 md:py-8 lg:py-12 p-4 bg-muted rounded-lg shadow-md w-full">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground dark:text-foreground">Payment Channel Partners</h2>
                            <p className="max-w-[900px] text-muted-foreground dark:text-muted-foreground md:text-xl">
                                lomi. integrates with a variety of providers to support your customers where they are.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                            <IntegrationAccordion
                                title="Mobile Money"
                                logos={[
                                    { src: orangeLogo, alt: "Orange" },
                                    { src: mtnLogo, alt: "MTN" }
                                ]}
                            />
                            <IntegrationAccordion
                                title="e-wallets"
                                logos={[
                                    { src: waveLogo, alt: "Wave" }
                                ]}
                            />
                            <IntegrationAccordion
                                title="Pay by bank"
                                logos={[
                                    { src: ecobankLogo, alt: "Ecobank" },
                                    { src: sepaLogo, alt: "SEPA" }
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

            {/* Sections for Collect Money, Manage Money, and Send Money */}
            <section className="bg-background py-8 md:py-16 lg:py-24 dark:bg-muted">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="p-6 bg-card dark:bg-card rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-card-foreground dark:text-card-foreground text-center mb-4">
                                Collect
                            </h2>
                            <p className="mt-2 text-muted-foreground dark:text-muted-foreground md:text-lg text-justify">
                                Our platform ensures seamless integration with the payment method you want, making it easy for your customers to pay.
                            </p>
                        </div>
                        <div className="p-6 bg-card dark:bg-card rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-card-foreground dark:text-card-foreground text-center mb-4">
                                Manage
                            </h2>
                            <p className="mt-2 text-muted-foreground dark:text-muted-foreground md:text-lg text-justify">
                                Orchestrate and reconcile payments seamlessly across different methods. Our tools help you manage your finances efficiently and accurately.
                            </p>
                        </div>
                        <div className="p-6 bg-card dark:bg-card rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-card-foreground dark:text-card-foreground text-center mb-4">
                                Send
                            </h2>
                            <p className="mt-2 text-muted-foreground dark:text-muted-foreground md:text-lg text-justify">
                                Send payouts quickly and efficiently to anywhere your money needs to go. We make sure that your funds reach their destination.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Products;