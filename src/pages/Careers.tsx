import { useState } from 'react'; // Import useState hook
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer'; // Import Footer component
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Careers = () => {
    const [emailClicked, setEmailClicked] = useState(false); // State to track if email is clicked

    const handleEmailClick = () => {
        navigator.clipboard.writeText('hello@lomi.africa'); // Copy email to clipboard
        setEmailClicked(true); // Update state to show the message
        setTimeout(() => setEmailClicked(false), 2000); // Reset message after 2 seconds
    };

    return (
        <>
            <Navbar />
            <section className=" py-12 md:py-24 lg:py-32">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-4xl font-bold tracking-tight">Join our team</h2>
                            <p className="mt-4 max-w-md text-muted-foreground md:text-xl">
                                Don&apos;t see anything interesting for you here and still interested in joining our team? Reach out to:
                            </p>
                            <div
                                className="mt-4 w-64 h-12 p-2 border-radius rounded-lg bg-white shadow-md cursor-pointer hover:border-green-700 transition"
                                onClick={handleEmailClick}
                            >
                                <p className="text-lg text-black text-center flex items-center justify-between px-4">
                                    {emailClicked ? "Copied! Say 👋🏼" : "hello@lomi.africa"}
                                    <span className="text-xl">→</span>
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <img src="/placeholder.svg" width="550" height="400" alt="Team" className="rounded-lg object-cover" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-12 md:py-24 lg:py-32 bg-muted">
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
                                    <CardTitle>Software Engineer Intern</CardTitle>
                                    <CardDescription>Assist in building our SaaS platform and its required features.</CardDescription>
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
            <div className="border-b border-gray-300 dark:border-gray-700"></div>
            <Footer />
        </>
    );
};

export default Careers;

