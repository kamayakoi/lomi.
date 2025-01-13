import { useEffect, useState, useCallback } from 'react';
import SideNav from '@/components/design/side-nav';
import { motion } from 'framer-motion';
import { ScrollToTop } from '@/components/landing/ScrollToTop';
import { useTheme } from '@/lib/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState('introduction');
    const [scrollProgress, setScrollProgress] = useState(0);
    const { theme, setTheme } = useTheme();

    // Handle hydration mismatch
    useEffect(() => {
        setMounted(true);
        // Scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    const handleSectionClick = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 100; // Increased offset to account for header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Find the entry with the largest intersection ratio
                const visibleSection = entries.reduce((max, entry) => {
                    return (entry.intersectionRatio > max.intersectionRatio) ? entry : max;
                });

                if (visibleSection.intersectionRatio > 0) {
                    const sectionId = visibleSection.target.id;
                    setActiveSection(sectionId);
                }
            },
            {
                rootMargin: '-100px 0px -66%',
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
            }
        );

        // Observe all sections
        document.querySelectorAll('[data-section]').forEach((section) => {
            observer.observe(section);
        });

        // Calculate scroll progress
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPosition = window.scrollY;
            const maxScroll = documentHeight - windowHeight;
            const progress = Math.min((scrollPosition / maxScroll) * 100, 100);
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial calculation

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const sections = [
        { id: 'introduction', label: 'Introduction' },
        { id: 'overview', label: 'Overview and Applicability' },
        { id: 'personal-data', label: 'Personal Data We Collect' },
        { id: 'data-usage', label: 'How We Use Personal Data' },
        { id: 'data-disclosure', label: 'How We Disclose Data & Security' },
        { id: 'data-rights', label: 'Data Subject Rights' },
        { id: 'retention', label: 'Retention Period' },
        { id: 'jurisdiction', label: 'Jurisdiction' },
        { id: 'changes', label: 'Changes to Privacy Notice' },
        { id: 'contact', label: 'Contact Us' }
    ];

    if (!mounted) {
        return null;
    }

    return (
        <div className="relative min-h-screen bg-background">
            {/* Back button */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-6 left-6 z-50"
                onClick={() => navigate(-1)}
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Progress bar */}
            <div
                className="fixed top-0 left-0 h-1 bg-blue-500 z-50 transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
            />

            <SideNav
                items={sections}
                activeSection={activeSection}
                onSectionClick={handleSectionClick}
            />

            <main className="container mx-auto max-w-6xl px-4 pb-32 pt-12 lg:pl-72">
                <div className="space-y-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mt-[67px] text-foreground">Privacy Policy</h1>
                        <div className="mt-6 h-8 inline-flex items-center px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Last updated: 20/07/2024 — 6:41 p.m GMT
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="prose prose-zinc dark:prose-invert max-w-none"
                    >
                        <div
                            id="introduction"
                            data-section
                            className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        >
                            <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Introduction</h2>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                Privacy is important to us.
                            </p>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                <strong>lomi.africa Inc.</strong> (&quot;lomi.&quot;, &quot;We&quot; or &quot;Us&quot;) is an operator of payment systems. We offer payment and disbursement services (<strong>Services</strong>) to our clients. In providing our Services, we process personal information (<strong>Personal Data</strong>) about our clients, their authorized representatives, and their customers (collectively, the <strong>Data Subjects</strong>). This processing is governed by applicable data protection laws and regulations in Côte d&apos;Ivoire.
                            </p>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                In certain instances, we partner with our affiliates and third-party vendors for the provision of our Services (e.g., banks, card acquiring partners, payment centers, and e-money issuers, collectively, <strong>Payment Channel Partners</strong>). Whenever there is such a partnership, we execute appropriate agreements with said affiliates and Payment Channel Partners, setting out the extent of their processing in relation to the provision of Services and their obligations over the Personal Data they process on behalf of lomi.
                            </p>
                        </div>

                        <div
                            id="overview"
                            data-section
                            className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        >
                            <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Overview and Applicability</h2>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                The Personal Data we collect depends on how our Services are used. We may receive Personal Data directly from Data Subjects, such as when they create an account on lomi&apos;s dashboard, request information about our services via email, or through our official social media platforms. Other times, we obtain Personal Data by recording interactions with our Services using technologies like cookies and web beacons. For certain services, we also receive Personal Data from our Payment Channel Partners.
                            </p>
                        </div>

                        <div
                            id="personal-data"
                            data-section
                            className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        >
                            <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Personal Data We Collect</h2>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                We call &quot;Personal Data&quot; any data that identifies, or that could reasonably be used to identify, a Data Subject as an individual. We collect Personal Data in different ways. For example, we collect Personal Data when a business registers for a lomi. account, or a customer makes payments or conducts transactions through our Services. We may also collect Personal Data from the identification documents our clients submit to us when we perform our <strong>Know-Your-Customer (KYC)</strong> and <strong>Customer Due Diligence (CDD)</strong> vetting of our clients prior to establishing a business relationship with them.
                                <br />
                                <br />
                                We also receive Personal Data from other sources, such as our partners, financial service providers, identity verification services, and publicly available sources. For clarity, Personal Data does not include data that has been aggregated or made anonymous such that it can no longer be reasonably associated with a specific person. The Personal Data that we may collect includes:
                            </p>
                            <ul className="mt-6 text-base text-zinc-600 dark:text-zinc-400 space-y-4 ml-6">
                                <li>- Full names of Data Subjects.</li>
                                <li>- Contact details, such as name, address, telephone number, email address.</li>
                                <li>- Financial and transactional information, such as credit or debit card number, and bank account information.</li>
                                <li>- Date and place of birth, government-issued identifiers (e.g., Tax Identification Number, National Identification Number, Passport Data), which we collect and process to perform our obligations under applicable anti-money laundering and countering terrorist financing regulations, and such other applicable laws and regulations, and to perform our contractual commitments with our Payment Channel Partners.</li>
                            </ul>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                In using any of our Services, we also collect and gather other Personal Data through a variety of sources. Among the sources for said Personal Data are our technologies that record the use of our Services supported by our website, websites that implement our Services, and the use of our Services generally.
                                <br />
                                <br />The other Personal Data that we may collect include:
                            </p>
                            <ul className="mt-6 text-base text-zinc-600 dark:text-zinc-400 space-y-4 ml-6">
                                <li>- Browser and device data, such as IP address, device type, operating system and Internet browser type, screen resolution, operating system name and version, device manufacturer and model, language, plug-ins, add-ons, and the version of the Services the Data Subjects are using.</li>
                                <li>- Transaction data, such as purchases, purchase amount, date of purchase, and payment methods.</li>
                                <li>- Cookie and tracking technology data, such as time spent on the Services, pages visited, language preferences, and other anonymous traffic data.</li>
                            </ul>
                        </div>

                        <div
                            id="data-usage"
                            data-section
                            className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        >
                            <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">How We Use and Process Personal Data</h2>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                We and our Payment Channel Partners use and process Personal Data to: (i) provide our Services; (ii) detect and prevent fraud; (iii) mitigate financial loss or other harm to clients, their customers, and lomi.; (iv) promote, analyze, and improve our products, systems, and tools; and (v) complete reports to be submitted to regulatory agencies.
                                <br />
                                Examples of how we may use Personal Data include:
                            </p>
                            <ul className="mt-6 text-base text-zinc-600 dark:text-zinc-400 space-y-4 ml-6">
                                <li>- To verify an identity for compliance purposes.</li>
                                <li>- To evaluate an application to use our Services.</li>
                                <li>- To conduct manual or systematic monitoring for fraud and other harmful activity.</li>
                                <li>- To respond to inquiries, send service notices, and provide customer support.</li>
                                <li>- To process a payment using our Services, communicate regarding a payment, and provide related customer service.</li>
                                <li>- For audits, regulatory purposes, and compliance with industry standards.</li>
                                <li>- To develop new products.</li>
                                <li>- To send marketing communications.</li>
                                <li>- To improve or modify our Services.</li>
                                <li>- To conduct aggregate analysis and develop business intelligence that enables us to operate, protect, make informed decisions, and report on the performance of our business.</li>
                            </ul>
                        </div>

                        <div
                            id="data-disclosure"
                            data-section
                            className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        >
                            <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">How We Disclose Data & Security</h2>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                lomi. does not sell or rent Personal Data to marketers or unaffiliated third parties. We share data with trusted third parties, including:
                            </p>
                            <ul className="mt-6 text-base text-zinc-600 dark:text-zinc-400 space-y-4 ml-6">
                                <li>- <strong>To Affiliates:</strong> We share data with our affiliates and subsidiaries to provide our Services or otherwise improve our Services</li>
                                <li>- <strong>To Service Providers:</strong> We share Personal Data with service providers who help us provide the Services. Service providers, which include Payment Channel Partners, help us with things like payment processing, website hosting, data analysis, information technology and related infrastructure, customer service, email delivery, and auditing</li>
                                <li>- <strong>To Our Clients:</strong> We share Personal Data with our clients as necessary to process payments or provide the Services. For example, we share Personal Data with clients about purchases made or services availed of, and paid by their customers through lomi&apos;s Services</li>
                                <li>- <strong>To Authorized Third Parties:</strong> We share Personal Data with parties directly authorized by a client to receive Personal Data, such as when a client authorizes a third-party application provider to access the client&apos;s lomi account. The use of Personal Data by an authorized third party is always subject to said third party&apos;s privacy policy</li>
                                <li>- <strong>To Other Third Parties:</strong> We will share Personal Data with third parties in the event of any reorganization, merger, sale, joint venture, assignment, transfer, or other disposition of all or any portion of our business, assets, or stock (including in connection with any bankruptcy or similar proceedings)</li>
                                <li>- <strong>Safety, Legal Purposes and Law Enforcement:</strong> We use and disclose Personal Data as we believe necessary: (i) under applicable law or payment method rules; (ii) to enforce our Terms and Conditions for the provision of the Services; (iii) to protect our rights, privacy, safety, or property, and/or that of our affiliates and the Data Subjects; and (iv) to respond to requests from courts, law enforcement agencies, regulatory agencies, and other public and government authorities, which may include authorities outside of our Data Subjects&apos; country of residence.</li>
                            </ul>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                We implement reasonable organizational, technical, and administrative measures to protect Personal Data within our organization. Should you have reason to believe that our processing of Personal Data is no longer secure, please contact us immediately.
                            </p>
                        </div>

                        <div
                            id="data-rights"
                            data-section
                            className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        >
                            <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Exercise of Data Subjects&apos; Rights</h2>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                We recognize and acknowledge Data Subjects&apos; rights guaranteed under applicable data protection laws. In particular, we recognize every Data Subject&apos;s right to object to the processing of his/her Personal Data to such extent allowed under the law.
                            </p>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                <strong>Opting out of receiving electronic communications from us:</strong> Should the Data Subjects no longer want to receive marketing-related emails or communications from us on a going-forward basis, the Data Subjects may opt-out via the unsubscribe link included in such emails or communications, or by directly contacting us. We will try to comply with your request(s) as soon as reasonably practicable.
                            </p>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                <strong>How to access or modify Personal Data:</strong> Should Data Subjects wish to review, correct, or update their Personal Data previously disclosed to us, the Data Subjects may do so by contacting hello@lomi.africa.
                            </p>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                When emailing us the request, the Data Subjects are advised to make clear in their request what Personal Data they want modified. For the protection of the Data Subjects, we may only address and implement requests with respect to the Personal Data associated with the particular email address or contact information that the requesting Data Subject used to send us the request, and we may need to verify the Data Subjects&apos; identity before acting on the request. We will try to comply with your request as soon as reasonably practicable.
                            </p>
                        </div>

                        <div
                            id="retention"
                            data-section
                            className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        >
                            <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Retention Period</h2>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                We will retain Personal Data for the period necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or otherwise permitted by law. In general, as a financial institution, we will retain Personal Data for five (5) years following the termination of the Services.
                            </p>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                It should likewise be underscored that we have a variety of obligations to retain the Personal Data that we process, including to ensure that transactions can be appropriately processed, settled, refunded, or charged-back, to help identify fraud, and to comply with anti-money laundering and other laws and rules that apply to us and to our financial service providers. Accordingly, even if clients may have terminated the Services, we will retain certain Personal Data to meet our obligations. There may also be residual Personal Data that will remain, in anonymized format, within our databases and other records, which will not be removed.
                            </p>
                        </div>

                        <div
                            id="jurisdiction"
                            data-section
                            className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        >
                            <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Jurisdiction and Cross-Border Transfer</h2>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                Our Services are global, and Personal Data may be stored and processed in any country where we have operations or where we engage service providers. We may transfer Personal Data to countries outside of Côte d&apos;Ivoire, including the United States and European Union countries, which may have data protection rules that are different from those of the Data Subject&apos;s country.
                                <br />
                                However, we will take appropriate measures to ensure that any such transfers comply with applicable data protection laws and that your Data remains protected to the standards described in our Privacy Policy. In certain circumstances, courts, law enforcement agencies, regulatory agencies, or security authorities in those other countries may be entitled to access your Personal Data.
                            </p>

                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                We may collect, use, disclose, and otherwise process certain Personal Data about customers when acting as the client&apos;s service provider. Our clients are responsible for ensuring that their customers&apos; privacy rights are respected, including ensuring appropriate disclosures about third-party data collection, use, and processing. To the extent that we are acting as a client&apos;s Personal Information Processor, we will process Personal Data only in accordance with the terms of our agreement with the client and the client&apos;s lawful instructions.
                            </p>
                        </div>

                        <div
                            id="changes"
                            data-section
                            className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        >
                            <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Changes to Privacy Notice</h2>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                We may change this Privacy Policy. The &quot;Last updated&quot; legend at the top of the page indicates when our Privacy Policy was last revised. Any changes are effective when we post the revised Privacy Policy on our website.
                            </p>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                We may provide Data Subjects with disclosures and alerts regarding the Privacy Notice or Personal Data collected by posting them on our website or, in the case of our clients and their customers, via email addresses and/or the physical addresses provided to lomi.
                            </p>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                lomi. is always improving. Thus, we may occasionally update our Privacy Notice should there be changes in the way we process Personal Data consequent upon a change or improvement to any of our Services. If we modify the Privacy Notice, we will post the revised copy on our website, and we will also revise the &quot;last updated date&quot; stated above. If we make material changes in the way we use Personal Data, we will notify clients and their customers, where applicable, by posting an announcement on our website, by sending an email, or through instant messaging services or SMS. It remains the responsibility of the Data Subjects to periodically review our Privacy Notice; clients are bound by any changes to the Privacy Notice by using the service after such changes have been first posted.
                            </p>
                        </div>

                        <div
                            id="contact"
                            data-section
                            className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        >
                            <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">How to Contact Us</h2>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                If you have questions or concerns regarding this privacy policy, or any feedback pertaining to the above Privacy Notice and your privacy, please contact:
                            </p>
                            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                <strong>lomi.africa Inc.</strong>
                            </p>
                            <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
                                hello@lomi.africa
                            </p>
                            <hr className="my-4" />
                            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                                Les Perles,
                            </p>
                            <p className="mt-1 text-base text-zinc-600 dark:text-zinc-400">
                                Cocody, II Plateau
                            </p>
                            <p className="mt-1 text-base text-zinc-600 dark:text-zinc-400">
                                Abidjan, Côte d&apos;Ivoire
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Large background text - Only render when mounted */}
            {mounted && (
                <div className="w-full overflow-hidden mt-[-100px] py-[-100px] h-[380px] relative z-0">
                    <div
                        className="text-[#161616] dark:text-blue-100 text-[500px] leading-none text-center font-bold select-none opacity-10 flex items-baseline justify-center"
                        onClick={() => {
                            const newTheme = theme === 'dark' ? 'light' : 'dark';
                            setTheme(newTheme);
                        }}
                    >
                        <span>lomi</span>
                        <div className="w-[100px] h-[100px] bg-current ml-4"></div>
                    </div>
                </div>
            )}

            {/* Scroll to top button */}
            <ScrollToTop />
        </div>
    );
};

export default Privacy;