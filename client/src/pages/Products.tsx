import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

const Products = () => {
    return (
        <div className="flex flex-col min-h-[100dvh]">
            <Navbar />
            {/* Hero Section */}
            <section className="py-12 md:py-24 lg:py-32 text-left">
                <div className="container px-4 md:px-6 flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl">
                            Frictionless payments for businesses
                        </h1>
                        <p className="mt-4 max-w-[600px] text-lg md:text-2xl">
                            Integrate online payments and invoicing in minutes. Accept ACH, card, and cross-border payments with API, low-code, or no-code integration options.
                        </p>
                        <button className="mt-8 bg-orange-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-orange-600">
                            Get Started
                        </button>
                    </div>
                    <div className="lg:w-1/2 mt-8 lg:mt-0">
                        <img
                            src="/images/hero-image.svg"
                            alt="Payment Integration"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </section>

            {/* Sections for Collect Money, Manage Money, and Send Money */}
            <section className="bg-muted py-8 md:py-16 lg:py-24">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="p-4 bg-white rounded-lg shadow-md text-center">
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                                Collect Money
                            </h2>
                            <p className="mt-2 text-muted-foreground md:text-lg">
                                Accept payments via Card, Mobile Money, e-wallets, and Pay by bank. Our platform ensures seamless integration and quick processing, making it easy for your customers to pay.
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md text-center">
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                                Manage Money
                            </h2>
                            <p className="mt-2 text-muted-foreground md:text-lg">
                                Orchestrate and reconcile payments seamlessly across different methods and providers. Our robust tools help you manage your finances efficiently and accurately.
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md text-center">
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                                Send Money
                            </h2>
                            <p className="mt-2 text-muted-foreground md:text-lg">
                                Send payouts quickly and efficiently to anywhere your money needs to go. Our secure and reliable system ensures that your funds reach their destination safely.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section for Integrations */}
            <section className="py-8 md:py-16 lg:py-24">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Integrations</h2>
                            <p className="max-w-[900px] text-muted-foreground md:text-xl">
                                Our platform integrates with a variety of services to enhance your business operations:
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="p-4 bg-white rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold">Integration 1</h3>
                                <p className="mt-2 text-muted-foreground">Description of Integration 1.</p>
                            </div>
                            <div className="p-4 bg-white rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold">Integration 2</h3>
                                <p className="mt-2 text-muted-foreground">Description of Integration 2.</p>
                            </div>
                            <div className="p-4 bg-white rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold">Integration 3</h3>
                                <p className="mt-2 text-muted-foreground">Description of Integration 3.</p>
                            </div>
                            {/* Add more integration boxes as needed */}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Products;