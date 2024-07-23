import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

interface IntegrationAccordionProps {
    title: string;
    icon?: ReactNode;
    children: ReactNode[];
}

const IntegrationAccordion = ({ title, icon, children }: IntegrationAccordionProps) => {
    return (
        <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md w-full">
            <div className="flex flex-col items-center mb-4">
                {icon && <div className="text-4xl mb-2">{icon}</div>}
                <h3 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">
                    {title}
                </h3>
            </div>
            <hr className="my-2 border-gray-300 dark:border-gray-600" />
            <div className="mt-2 text-gray-700 dark:text-gray-300">
                {children.map((child, index) => (
                    <div key={index}>
                        <div className="flex items-center my-2">
                            <div className="w-8 h-8 mr-2 bg-gray-200 flex-shrink-0"></div>
                            <p>{child}</p>
                        </div>
                        {index < children.length - 1 && (
                            <hr className="my-2 border-gray-300 dark:border-gray-600" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


const Products = () => {
    return (
        <div className="flex flex-col min-h-[100dvh] bg-gray-100 dark:bg-gray-900">
            <Navbar />
            {/* Hero Section */}
            <section className="py-12 md:py-24 lg:py-32 text-left">
                <div className="container px-4 md:px-6 flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl text-gray-900 dark:text-gray-100">
                            Frictionless payments for businesses and entrepreneurs
                        </h1>
                        <p className="mt-4 max-w-[600px] text-lg md:text-2xl text-gray-700 dark:text-gray-300 text-left">
                            Integrate online payments and invoicing in minutes.
                            <br />
                            Accept mobile money, card, Wave and bank payments with API, low-code, or no-code integration options.
                        </p>
                        <Link to="/log-in">
                            <button className="mt-8 bg-blue-600 text-white font-semibold text-2xl px-10 py-4 rounded-lg shadow-lg hover:bg-blue-700">
                                Get Started
                            </button>
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

            {/* Sections for Collect Money, Manage Money, and Send Money */}
            <section className="dark:bg-gray-900 py-8 md:py-16 lg:py-24  p-4 bg-muted rounded-lg shadow-md w-full">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-gray-900 dark:text-gray-100 text-center mb-4">
                                Collect Money
                            </h2>
                            <p className="mt-2 text-gray-700 dark:text-gray-300 md:text-lg text-justify">
                                Accept payments via Card, mobile money, e-wallets, and Pay by bank. Our platform ensures seamless integration and quick processing, making it easy for your customers to pay.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-gray-900 dark:text-gray-100 text-center mb-4">
                                Manage Money
                            </h2>
                            <p className="mt-2 text-gray-700 dark:text-gray-300 md:text-lg text-justify">
                                Orchestrate and reconcile payments seamlessly across different methods and providers. Our robust tools help you manage your finances efficiently and accurately.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl text-gray-900 dark:text-gray-100 text-center mb-4">
                                Send Money
                            </h2>
                            <p className="mt-2 text-gray-700 dark:text-gray-300 md:text-lg text-justify">
                                Send payouts quickly and efficiently to anywhere your money needs to go. Our secure and reliable system ensures that your funds reach their destination safely.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section for Integrations */}
            <section className="bg-white py-8 md:py-16 lg:py-24 dark:bg-muted">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900 dark:text-gray-100">Payment Channel Partners</h2>
                            <p className="max-w-[900px] text-gray-700 dark:text-gray-300 md:text-xl">
                                Our platform integrates with a variety of services to enhance your business operations.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                            <IntegrationAccordion
                                title="Mobile Money"
                                icon="📱"
                            >
                                {["Orange", "MTN", "Airtel"]}
                            </IntegrationAccordion>
                            <IntegrationAccordion
                                title="e-wallets"
                                icon="💳"
                            >
                                {["Wave", "MTN"]}
                            </IntegrationAccordion>
                            <IntegrationAccordion
                                title="Pay by bank"
                                icon="🏦"
                            >
                                {["Ecobank", "UBA"]}
                            </IntegrationAccordion>
                            <IntegrationAccordion
                                title="Pay by card"
                                icon="💳"
                            >
                                {["Visa", "Mastercard", "Apple Pay"]}
                            </IntegrationAccordion>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Products;