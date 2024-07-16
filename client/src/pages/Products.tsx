import { Link } from "react-router-dom";
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

const Products = () => {
    return (
        <div className="flex flex-col min-h-[100dvh]">
            <Navbar />
            <section className="py-12 md:py-24 lg:py-32"> {/* First section with default background */}
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                    Elevate Your Shopping Experience with Our Premium Products
                                </h1>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                    Discover a curated collection of high-quality products that combine style, functionality, and
                                    exceptional value.
                                </p>
                                <Link
                                    to="#"
                                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                >
                                    Shop Now
                                </Link>
                            </div>
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
            <section className="bg-muted py-12 md:py-24 lg:py-32"> {/* Second section with muted background */}
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Discover Our Featured Products</h2>
                            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Explore our curated selection of top-selling and highly rated products that offer exceptional quality
                                and value.
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <div className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
                            <Link to="#" className="absolute inset-0 z-10">
                                <span className="sr-only">View Product</span>
                            </Link>
                            <img
                                src="/placeholder.svg"
                                alt="Product 1"
                                width={500}
                                height={400}
                                className="object-cover w-full h-64"
                            />
                            <div className="p-4 bg-background">
                                <h3 className="text-xl font-bold">Premium T-Shirt</h3>
                                <p className="text-sm text-muted-foreground">Soft and Comfortable</p>
                                <h4 className="text-lg font-semibold md:text-xl">$29.99</h4>
                            </div>
                        </div>
                        <div className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
                            <Link to="#" className="absolute inset-0 z-10">
                                <span className="sr-only">View Product</span>
                            </Link>
                            <img
                                src="/placeholder.svg"
                                alt="Product 2"
                                width={500}
                                height={400}
                                className="object-cover w-full h-64"
                            />
                            <div className="p-4 bg-background">
                                <h3 className="text-xl font-bold">Wireless Headphones</h3>
                                <p className="text-sm text-muted-foreground">Immersive Audio Experience</p>
                                <h4 className="text-lg font-semibold md:text-xl">$99.99</h4>
                            </div>
                        </div>
                        <div className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
                            <Link to="#" className="absolute inset-0 z-10">
                                <span className="sr-only">View Product</span>
                            </Link>
                            <img
                                src="/placeholder.svg"
                                alt="Product 3"
                                width={500}
                                height={400}
                                className="object-cover w-full h-64"
                            />
                            <div className="p-4 bg-background">
                                <h3 className="text-xl font-bold">Ergonomic Office Chair</h3>
                                <p className="text-sm text-muted-foreground">Comfortable and Supportive</p>
                                <h4 className="text-lg font-semibold md:text-xl">$199.99</h4>
                            </div>
                        </div>
                        <div className="relative overflow-hidden transition-transform duration-300 ease-in-out rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2">
                            <Link to="#" className="absolute inset-0 z-10">
                                <span className="sr-only">View Product</span>
                            </Link>
                            <img
                                src="/placeholder.svg"
                                alt="Product 4"
                                width={500}
                                height={400}
                                className="object-cover w-full h-64"
                            />
                            <div className="p-4 bg-background">
                                <h3 className="text-xl font-bold">Outdoor Adventure Backpack</h3>
                                <p className="text-sm text-muted-foreground">Durable and Versatile</p>
                                <h4 className="text-lg font-semibold md:text-xl">$79.99</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Products;