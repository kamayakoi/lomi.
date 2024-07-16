import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

const About = () => {
    return (
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen">
                {/* Hero Section */}
                <section
                    className="relative w-full h-[500px] bg-muted" // Changed to bg-muted
                    style={{ backgroundImage: 'url("/placeholder.svg?height=500&width=1920")' }}
                >
                    <div className="absolute inset-0 bg-background/70 flex flex-col items-center justify-center text-center px-4 md:px-6">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">About Our Company</h1>
                        <p className="max-w-[600px] mt-4 text-muted-foreground md:text-xl">
                            We are a team of passionate individuals dedicated to creating innovative solutions that empower our clients
                            to achieve their goals.
                        </p>
                    </div>
                </section>

                {/* Our Story Section */}
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Story</h2>
                            <p className="text-muted-foreground md:text-xl">
                                Founded in 2015, our company has grown to become a leading provider of cutting-edge technology solutions.
                                We are driven by a passion for innovation and a commitment to delivering exceptional results for our
                                clients.
                            </p>
                            <a
                                href="#"
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            >
                                Learn More
                            </a>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="bg-muted/20 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mt-2">Innovation</h3>
                                <p className="text-muted-foreground mt-1">
                                    We are constantly exploring new technologies and ideas to stay ahead of the curve.
                                </p>
                            </div>
                            <div className="bg-muted/20 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mt-2">Expertise</h3>
                                <p className="text-muted-foreground mt-1">
                                    Our team of experts has the knowledge and experience to deliver exceptional results.
                                </p>
                            </div>
                            <div className="bg-muted/20 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mt-2">Collaboration</h3>
                                <p className="text-muted-foreground mt-1">
                                    We believe in the power of teamwork and work closely with our clients to achieve their goals.
                                </p>
                            </div>
                            <div className="bg-muted/20 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mt-2">Reliability</h3>
                                <p className="text-muted-foreground mt-1">
                                    Our clients can count on us to deliver high-quality solutions on time and within budget.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Our Values Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-cover bg-center bg-no-repeat" // Changed to bg-cover, bg-center, bg-no-repeat
                    style={{ backgroundImage: 'url("/placeholder.svg?height=500&width=1920")' }} // Added background image
                >
                    <div className="container space-y-12 px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Values</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    At the heart of our company are a set of core values that guide our actions and shape our culture. We
                                    believe in integrity, innovation, collaboration, and a relentless commitment to excellence. These values
                                    are the foundation upon which we build lasting relationships with our clients and drive meaningful
                                    change in the world.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                            <div className="grid gap-1">
                                <h3 className="text-lg font-bold">Integrity</h3>
                                <p className="text-sm text-muted-foreground">
                                    We are committed to the highest ethical standards, always striving to do the right thing for our clients
                                    and our community.
                                </p>
                            </div>
                            <div className="grid gap-1">
                                <h3 className="text-lg font-bold">Innovation</h3>
                                <p className="text-sm text-muted-foreground">
                                    We embrace a culture of creativity and exploration, constantly seeking new and better ways to solve
                                    complex problems.
                                </p>
                            </div>
                            <div className="grid gap-1">
                                <h3 className="text-lg font-bold">Collaboration</h3>
                                <p className="text-sm text-muted-foreground">
                                    We believe in the power of teamwork, fostering an environment where diverse perspectives and ideas can
                                    thrive.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div >
            <Footer />
        </>
    );
};

export default About;