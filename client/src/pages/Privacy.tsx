import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

const Privacy = () => {
    return (
        <>
            <Navbar />
            <div className="bg-background text-foreground">
                <main className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
                            <p className="mt-4 text-muted-foreground">Effective Date: July 15, 2024</p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold">Introduction</h2>
                                <p className="mt-4 text-muted-foreground">
                                    At Acme Inc., we are committed to protecting the privacy and security of your personal information. This
                                    Privacy Policy explains how we collect, use, and safeguard your data when you use our products and
                                    services.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Information We Collect</h2>
                                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="flex items-start gap-4">
                                        {/* Removed SVG icons */}
                                        <div>
                                            <h3 className="text-lg font-medium">Personal Information</h3>
                                            <p className="mt-2 text-muted-foreground">
                                                We may collect your name, email address, and other contact information when you sign up for our
                                                services.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div>
                                            <h3 className="text-lg font-medium">Usage Data</h3>
                                            <p className="mt-2 text-muted-foreground">
                                                We may collect information about how you use our products and services, such as your browsing
                                                history and device information.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div>
                                            <h3 className="text-lg font-medium">Payment Information</h3>
                                            <p className="mt-2 text-muted-foreground">
                                                If you make a purchase, we may collect payment information such as your credit card details.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div>
                                            <h3 className="text-lg font-medium">Security</h3>
                                            <p className="mt-2 text-muted-foreground">
                                                We may collect information to ensure the security of our products and services, such as login
                                                credentials and device information.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">How We Use Your Information</h2>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium">Providing Our Services</h3>
                                        <p className="mt-2 text-muted-foreground">
                                            We use your information to provide and improve our products and services, to process your payments,
                                            and to communicate with you.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium">Personalization</h3>
                                        <p className="mt-2 text-muted-foreground">
                                            We may use your information to personalize your experience and provide you with tailored content and
                                            recommendations.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium">Security and Compliance</h3>
                                        <p className="mt-2 text-muted-foreground">
                                            We use your information to ensure the security of our products and services, and to comply with
                                            applicable laws and regulations.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">How We Protect Your Information</h2>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium">Data Security</h3>
                                        <p className="mt-2 text-muted-foreground">
                                            We implement industry-standard security measures to protect your personal information from
                                            unauthorized access, disclosure, or misuse.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium">Data Retention</h3>
                                        <p className="mt-2 text-muted-foreground">
                                            We retain your personal information for as long as necessary to fulfill the purposes for which it
                                            was collected, or as required by law.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium">Data Sharing</h3>
                                        <p className="mt-2 text-muted-foreground">
                                            We may share your information with third-party service providers who assist us in operating our
                                            business, but we do not sell or rent your personal information to any third parties.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Your Rights and Choices</h2>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium">Access and Control</h3>
                                        <p className="mt-2 text-muted-foreground">
                                            You have the right to access, update, and delete your personal information. You can also opt-out of
                                            certain data processing activities.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium">Data Portability</h3>
                                        <p className="mt-2 text-muted-foreground">
                                            You have the right to request a copy of your personal information in a structured, commonly used,
                                            and machine-readable format.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium">Contact Us</h3>
                                        <p className="mt-2 text-muted-foreground">
                                            If you have any questions or concerns about our privacy practices, please contact us at
                                            privacy@acme.com.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Changes to This Policy</h2>
                                <p className="mt-4 text-muted-foreground">
                                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                                    new Privacy Policy on our website. Your continued use of our products and services after such changes
                                    constitutes your acceptance of the revised Privacy Policy.
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

export default Privacy;