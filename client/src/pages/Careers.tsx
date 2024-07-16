import { useState } from 'react'; // Import useState hook
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer'; // Import Footer component
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Careers = () => {
    const [emailClicked, setEmailClicked] = useState(false); // State to track if email is clicked

    const handleEmailClick = () => {
        navigator.clipboard.writeText('work@lomi.africa'); // Copy email to clipboard
        setEmailClicked(true); // Update state to show the message
        setTimeout(() => setEmailClicked(false), 2000); // Reset message after 2 seconds
    };

    return (
        <>
            <Navbar />
            <section className="bg-muted py-12 md:py-24 lg:py-32">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Join our growing team</h1>
                            <p className="mt-4 max-w-md text-muted-foreground md:text-xl">
                                At Acme Inc., we're passionate about building innovative products that make a difference. Come be a
                                part of our mission.
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-2">
                                <Button>View Open Roles</Button>
                                <Button variant="secondary">Learn More</Button>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <img src="/placeholder.svg" width="550" height="400" alt="Team" className="rounded-lg object-cover" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-12 md:py-24 lg:py-32">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid gap-8">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Open Positions</h2>
                            <p className="mt-2 text-muted-foreground md:text-xl">
                                Check out our current job openings and apply today.
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Software Engineer</CardTitle>
                                    <CardDescription>Help build the next generation of our web application.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <p className="text-muted-foreground">Full-time | Remote</p>
                                        <a
                                            href="#"
                                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                        >
                                            Apply
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Software Engineer Intern</CardTitle>
                                    <CardDescription>Assist in building and maintaining our web application.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <p className="text-muted-foreground">Internship | Remote</p>
                                        <a
                                            href="#"
                                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                        >
                                            Apply
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-muted py-12 md:py-24 lg:py-32">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <img src="/placeholder.svg" width="550" height="400" alt="Team" className="rounded-lg object-cover" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Contact Us</h2>
                            <p className="mt-4 max-w-md text-muted-foreground md:text-xl">
                                Don't see anything interesting for you here and still interested in joining our team? Reach out to
                            </p>
                            <div
                                className="mt-2 w-48 h-11 p-2 border rounded-lg bg-blue-100 shadow-md cursor-pointer hover:bg-blue-200 transition"
                                onClick={handleEmailClick}
                            >
                                <p className="text-lg text-blue-800 text-center">
                                    {emailClicked ? "📧 Email copied!" : "work@lomi.africa"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer /> {/* Add the Footer component here */}
        </>
    );
};

export default Careers;