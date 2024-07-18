import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

const About = () => {
    return (
        <>
            <Navbar />
            {/* Hero Section */}
            <section
                className="relative w-full h-[500px] bg-muted"
                style={{ backgroundImage: 'url("/placeholder.svg?height=500&width=1920")' }}
            >
                <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center text-center px-4 md:px-6">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">About us</h1>
                    <p className="max-w-[600px] mt-4 text-muted-foreground md:text-xl">
                        Our mission is to transform the payments landscape in West Africa.<br />
                        We strive to provide seamless, secure, and scalable payment solutions.
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our story</h2>
                        <p className="text-muted-foreground md:text-xl">
                            Founded in 2024, lomi. emerged to address the need for better payment solutions in West Africa. Our founder recognized the challenges businesses face in managing transactions and enabling customer payments in a fragmented ecosystem.
                        </p>
                        <p className="text-muted-foreground md:text-xl">
                            With many payment methods and a growing demand for innovative solutions, lomi. focuses on simplicity, security, and scalability, giving businesses and entrepreneurs the tools they need to succeed.
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
