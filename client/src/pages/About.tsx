import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

const About = () => {
    return (
        <>
            <Navbar />
            {/* Hero Section */}
            <section className="relative w-full h-[700px] bg-background overflow-hidden"> {/* Increased height */}
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{
                        backgroundImage: 'url("/transition-star.png")',
                        backgroundPosition: '55% 12%',
                        backgroundSize: '105%'  // Dezoom the image
                    }}
                ></div>
                <div className="container relative h-full flex flex-col justify-center items-center px-4 md:px-6 z-10">
                    <p className="text-5xl tracking-tighter sm:text-6xl md:text-5xl lg:text-5xl text-center text-white">
                        Our mission is to make online payments simple, secure, and accessible for businesses across West Africa.
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">Our story</h2>
                        <p className="text-muted-foreground md:text-xl">
                            Founded in 2024, lomi. emerged to address the challenges businesses face in managing transactions and enabling customer payments in a fragmented ecosystem.
                        </p>
                        <p className="text-muted-foreground md:text-xl">
                            Managing diverse and growing payment methods is a headache for businesses and entrepreneurs alike. We provide you with the tools you need to sell your products and services, maximize your reach, and connect with your customers wherever they are.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mt-2 text-gray-900 dark:text-gray-100">
                                Innovation
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">
                                Constantly evolving to meet our clients needs.
                            </p>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mt-2 text-gray-900 dark:text-gray-100">
                                Customer Focus
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">
                                Providing exceptional service and exceptional support.
                            </p>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mt-2 text-gray-900 dark:text-gray-100">
                                Integrity
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">
                                Ensuring trust and transparency in all our operations.
                            </p>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mt-2 text-gray-900 dark:text-gray-100">
                                Collaboration
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 mt-1">
                                Building strong partnerships to create value.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default About;