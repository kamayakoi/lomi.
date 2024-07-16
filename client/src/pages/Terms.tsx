import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

const Terms = () => {
    return (
        <>
            <Navbar />
            <div className="bg-background text-foreground">
                <main className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms and Conditions</h1>
                            <p className="mt-4 text-muted-foreground">Effective Date: July 15, 2024</p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold">Introduction</h2>
                                <p className="mt-4 text-muted-foreground">
                                    Welcome to Acme Inc. These terms and conditions outline the rules and regulations for the use of our website and services.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">User Responsibilities</h2>
                                <p className="mt-4 text-muted-foreground">
                                    By accessing this website, we assume you accept these terms and conditions. Do not continue to use Acme Inc. if you do not agree to all of the terms and conditions stated on this page.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">License</h2>
                                <p className="mt-4 text-muted-foreground">
                                    Unless otherwise stated, Acme Inc. and/or its licensors own the intellectual property rights for all material on Acme Inc. All intellectual property rights are reserved. You may access this from Acme Inc. for your own personal use subjected to restrictions set in these terms and conditions.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Prohibited Activities</h2>
                                <p className="mt-4 text-muted-foreground">
                                    You must not:
                                    <ul className="list-disc list-inside mt-2">
                                        <li>Republish material from Acme Inc.</li>
                                        <li>Sell, rent or sub-license material from Acme Inc.</li>
                                        <li>Reproduce, duplicate or copy material from Acme Inc.</li>
                                        <li>Redistribute content from Acme Inc.</li>
                                    </ul>
                                </p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Limitation of Liability</h2>
                                <p className="mt-4 text-muted-foreground">
                                    In no event shall Acme Inc., nor any of its officers, directors, and employees, be liable for anything arising out of or in any way connected with your use of this website whether such liability is under contract. Acme Inc., including its officers, directors, and employees shall not be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of this website.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Changes to These Terms</h2>
                                <p className="mt-4 text-muted-foreground">
                                    We may update these terms and conditions from time to time. We will notify you of any changes by posting the new terms and conditions on our website. Your continued use of our products and services after such changes constitutes your acceptance of the revised terms and conditions.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
};

export default Terms;