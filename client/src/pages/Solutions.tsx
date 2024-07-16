import { Navbar } from '../components/landing/Navbar'; // Ensure this path is correct
import { Footer } from '../components/landing/Footer'; // Ensure this path is correct
import { Link } from 'react-router-dom'; // Updated to use 'react-router-dom'

const Solutions = () => {
    return (
        <div className="flex flex-col min-h-[100dvh]">
            <Navbar /> {/* Ensure Navbar component is working */}
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                    Elevate Your Fintech Solutions
                                </h1>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                    Unlock the power of our cutting-edge fintech solutions to transform your business and stay ahead of the curve.
                                </p>
                            </div>
                            <Link
                                to="#"
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            >
                                Explore Solutions
                            </Link>
                        </div>
                        <img
                            src="/placeholder.svg"
                            width="550"
                            height="550"
                            alt="Hero"
                            className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:order-last lg:aspect-square"
                        />
                    </div>
                </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <div className="flex flex-col items-start gap-4">
                            <h3 className="text-xl font-bold">Digital Wallets</h3>
                            <p className="text-muted-foreground">
                                Empower your customers with secure and user-friendly digital wallets for seamless financial transactions.
                            </p>
                        </div>
                        <div className="flex flex-col items-start gap-4">
                            <h3 className="text-xl font-bold">Payment Processing</h3>
                            <p className="text-muted-foreground">
                                Streamline your payment processing with our robust and reliable solutions, ensuring a frictionless experience for your customers.
                            </p>
                        </div>
                        <div className="flex flex-col items-start gap-4">
                            <h3 className="text-xl font-bold">Analytics and Insights</h3>
                            <p className="text-muted-foreground">
                                Unlock valuable insights and make data-driven decisions with our advanced analytics tools, tailored to your fintech business.
                            </p>
                        </div>
                        <div className="flex flex-col items-start gap-4">
                            <h3 className="text-xl font-bold">Compliance and Security</h3>
                            <p className="text-muted-foreground">
                                Ensure the safety and compliance of your fintech solutions with our robust security measures and regulatory expertise.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer /> {/* Ensure Footer component is working */}
        </div>
    );
};

export default Solutions;