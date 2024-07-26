import { Navbar } from '../components/landing/Navbar-About';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <>
            <Navbar />
            {/* Main Container with Background Image */}
            <div className="relative w-full min-h-screen bg-background overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{
                        backgroundImage: 'url("/transition-star.png")',
                        backgroundPosition: '55% 12%',
                        backgroundSize: '105%',  // Dezoom the image
                        backgroundRepeat: 'no-repeat'  // Prevent the image from repeating
                    }}
                ></div>
                <div className="relative z-10">
                    {/* Hero Section */}
                    <section className="w-full h-[1100px] flex flex-col justify-center items-center px-4 md:px-6">
                        <p className="text-5xl tracking-tighter sm:text-6xl md:text-6xl lg:text-5xl text-center text-white mt-[-295px] mx-auto max-w-6xl"> {/* Added mx-auto and max-w-4xl */}
                            Our mission is to make online payments simple, secure, and accessible for businesses across West Africa.
                        </p>
                    </section>

                    {/* Our Story Section */}
                    <section className="w-full py-12 md:py-24 lg:py-32">
                        <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6 text-white dark:text-white">Our story</h2> {/* Adjusted text color */}
                                <p className="text-white dark:text-white md:text-xl">
                                    Founded in 2024, lomi. emerged to address the challenges businesses face in managing transactions and enabling customer payments in a fragmented ecosystem.
                                </p>
                                <p className="text-white dark:text-white md:text-xl">
                                    Managing diverse and growing payment methods is a headache for businesses and entrepreneurs alike. We provide you with the tools you need to sell your products and services, maximize your reach, and connect with your customers wherever they are.
                                </p>
                                {/* Get Started Button */}
                                <Link to="/integration">
                                    <button className="text-xl mt-4 px-6 py-3 bg-red-700 text-white font-semibold rounded-lg shadow-lg  hover:bg-red-800 transition-colors duration-300">
                                        Get Started
                                    </button>
                                </Link>
                            </div>

                            {/* Our Values Section */}
                            <div className="space-y-4 mt-12 lg:mt-0 lg:ml-28"> {/* Added margin-top for spacing on smaller screens */}
                                <h2 className="text-4xl text-justify font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6 text-white dark:text-white ">Our values</h2> {/* New heading */}
                                <div className="bg-transparent p-4 rounded-lg hover:bg-gray-800 transition-colors duration-300">
                                    <h3 className="text-lg font-semibold mt-0 text-white">
                                        Innovation
                                    </h3>
                                    <p className="text-white mt-1">
                                        Constantly evolving to exceed our clients' and partners' expectations.
                                    </p>
                                </div>
                                <div className="bg-transparent p-4 rounded-lg hover:bg-gray-800 transition-colors duration-300">
                                    <h3 className="text-lg font-semibold mt-0 text-white">
                                        Customer obsession
                                    </h3>
                                    <p className="text-white mt-1">
                                        Delivering unparalleled service, great support.
                                    </p>
                                </div>
                                <div className="bg-transparent p-4 rounded-lg hover:bg-gray-800 transition-colors duration-300">
                                    <h3 className="text-lg font-semibold mt-0 text-white">
                                        Integrity
                                    </h3>
                                    <p className="text-white mt-1">
                                        Upholding trust and transparency in every interaction.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default About;