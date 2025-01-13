import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollToTop } from '@/components/landing/ScrollToTop';
import SideNav from '@/components/design/side-nav';
import { useTheme } from '@/lib/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState('interpretation');
    const [scrollProgress, setScrollProgress] = useState(0);
    const { theme, setTheme } = useTheme();

    // Handle hydration mismatch
    useEffect(() => {
        setMounted(true);
        // Scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    const scrollToSection = useCallback((id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Increased offset to account for header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        setActiveSection(sectionId);
                    }
                });
            },
            {
                rootMargin: '-100px 0px -66%',
                threshold: 0.1
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

    const navItems = [
        { id: 'interpretation', label: 'Interpretation' },
        { id: 'service-fees', label: 'Service Fees' },
        { id: 'disbursement-services', label: 'Disbursement Services' },
        { id: 'collection-services', label: 'Collection Services' },
        { id: 'card-processing-services', label: 'Card Processing Services' },
        { id: 'invalid-payments-and-other-liabilities', label: 'Invalid Payments and Other Liabilities' },
        { id: 'security-and-fraud', label: 'Security and Fraud' },
        { id: 'license-and-intellectual-property', label: 'License and Intellectual Property' },
        { id: 'representations-and-warranties', label: 'Representations and Warranties' },
        { id: 'restricted-activities', label: 'Restricted Activities' },
        { id: 'disclaimers', label: 'Disclaimers' },
        { id: 'indemnification-and-liability', label: 'Indemnification and Liability' },
        { id: 'confidential-information', label: 'Confidential Information' },
        { id: 'miscellaneous', label: 'Miscellaneous' },
    ];

    if (!mounted) {
        return null; // Prevent hydration issues by not rendering until mounted
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

            {/* Side Navigation */}
            <SideNav
                items={navItems}
                activeSection={activeSection}
                onSectionClick={scrollToSection}
            />

            {/* Main Content */}
            <main className="container mx-auto max-w-6xl px-4 pb-32 pt-12 lg:pl-72">
                <div className="space-y-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mt-[67px]  text-foreground">Terms and Conditions</h1>
                        <div className="inline-flex h-10 mt-6 items-center px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Last updated: 20/07/2024 — 8:56 p.m GMT
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="prose prose-zinc dark:prose-invert max-w-none"
                    >
                        <div className="p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mb-16">
                            <p className="text-base text-zinc-600 dark:text-zinc-400">
                                We, <strong>lomi.africa Inc.</strong> (&quot;lomi.&quot;, &quot;We&quot; or &quot;Us&quot;), are a corporation organized and existing under the laws of Côte d&apos;Ivoire. We offer payment and disbursement services (<strong>Services</strong>) to our clients. We act as the <strong>First Party</strong> in these following Terms and Conditions (<strong>Conditions</strong>).
                            </p>
                        </div>

                        {/* Content sections */}
                        <AnimatePresence mode="wait">
                            <motion.section
                                key="interpretation"
                                id="interpretation"
                                data-section
                                className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Interpretation</h2>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    Definitions — all capitalized terms that are not defined in these Conditions will have the meanings ascribed to them in the Services Agreement.
                                </p>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    For the purposes of these Conditions, and except where the context requires otherwise:
                                </p>
                                <ul className="mt-6 text-base text-zinc-600 dark:text-zinc-400 space-y-4 ml-6">
                                    <li>- <strong>Affiliates</strong> shall mean a parent, subsidiary, brother or sister company, or other company or entity which controls the First Party or which the First Party controls or which is under common control with the First Party.</li>
                                    <li>- <strong>API</strong> means the application programming interfaces, a set of subroutine definitions, protocols, and tools for building software and application interfaces, provided by the First Party that may be used by the Second Party to access the Services.</li>
                                    <li>- <strong>Card Processing Services</strong> shall mean:
                                        <ul className="ml-6">
                                            <li className="mt-2">i. Processing services, which enable the Second Party to accept credit cards and debit cards as modes of payment on a website or mobile platform and to receive inbound payments from cardholders through such modes of payment, including a bank-sponsored merchant account, fraud protection tools, recurring billing functionality, payment card storage, foreign currency acceptance, white glove customer support, and other necessary software, APIs, services, and technology as described in the Services Documentation.</li>
                                            <li className="mt-2">ii. Gateway services, which equip the Second Party with the software and connectivity required to allow real-time secure data transmission for the processing of credit and debit card payments on a website or mobile platform.</li>
                                        </ul>
                                    </li>
                                    <li>- <strong>Cardholder</strong> means a natural or legal person holding a debit or credit card, issued by a bank or an institution allowed to issue said cards.</li>
                                    <li>- <strong>Charge</strong> means a credit or debit instruction to authorize or capture funds from an account that a cardholder maintains with a bank or other financial institution in connection with a transaction between the cardholder and the Second Party.</li>
                                    <li>- <strong>Chargeback</strong> means a challenge to a payment to the Second Party that an End-User files directly with his or her credit or debit card issuer.</li>
                                    <li>- <strong>Confidential Information</strong> means any data or information, oral or written, treated as confidential that relates to either Party&apos;s (or, if either Party is bound to protect the confidentiality of any third party&apos;s information, such third party&apos;s) past, present, or future research or development activities, including any unannounced products and services, any information relating to developments, Services Documentation (in whatever form or media provided), inventions, processes, plans, financial or due diligence information, personally identifiable data of End-Users, to such extent that said data is not otherwise subject to a separate agreement between the Parties, and the financial terms of the Services Agreement.</li>
                                </ul>
                            </motion.section>

                            <motion.section
                                key="service-fees"
                                id="service-fees"
                                data-section
                                className="scroll-mt-32 mb-12 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Service Fees</h2>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    Unless agreed otherwise between the Parties in writing, the service fees to be paid by the Second Party to the First Party for the Services (including, where applicable, any foreign currency and other fees which shall be borne by the Second Party) shall be as set out in the Fee Schedule of the Service Agreement and incorporated herein by this reference.
                                </p>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    The Second Party shall pay the service fees for the Services to the First Party in accordance with the terms set forth in the Service Agreement.
                                </p>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    A Disbursement shall be considered executed when funds specified in the instructions of the Second Party (in the case of a Disbursement via API) in the relevant API or (in the case of a Disbursement by way of manual upload) in the .XLSX file uploaded by the Second Party for a single transaction are successfully transferred from the balance of the Second Party to the relevant bank account designated by the Second Party for the purpose of receiving such funds.
                                </p>
                            </motion.section>

                            <motion.section
                                key="disbursement-services"
                                id="disbursement-services"
                                data-section
                                className="scroll-mt-32 mb-12 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Disbursement Services</h2>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    Any Disbursements performed or to be performed by the First Party on behalf of the Second Party are subject always to the following conditions:
                                </p>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    1. Instructions to perform any Disbursement can only be delivered by the Second Party to the First Party via the API or by way of manual upload on the Dashboard. All such instructions shall only be valid if made in accordance with such forms or templates agreed upon by the First Party in the Services Documentation and/or the Services Agreement.
                                </p>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    2. All instructions received to perform any Disbursement delivered with the Second Party&apos;s API key are considered final and irrevocable at the time of delivery, which shall be the moment at which the Second Party posts a request to create a Disbursement via the API.
                                </p>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    3. All instructions received to perform any Disbursement delivered by the Second Party by way of manual upload to the Dashboard are considered final and irrevocable at the time of delivery, which shall be the moment at which the .XLSX document containing the Second Party&apos;s instructions in respect of such Disbursement has been successfully uploaded to the Dashboard.
                                </p>
                            </motion.section>

                            <motion.section
                                key="collection-services"
                                id="collection-services"
                                data-section
                                className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Collection Services</h2>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    Any Collections performed or to be performed by the First Party on behalf of the Second Party via Retail Outlets or E-wallets are subject to the following conditions:
                                </p>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    1. Configuration of Collection Method
                                    <br />
                                    The Second Party shall configure its elected method for Collections to be performed by the First Party by notifying any authorized representative, employee, officer, or director of the First Party of its election for Collections to be performed via Retail Outlets or E-Wallets, via Instant Messaging Service or otherwise in writing.
                                </p>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    2. Creation of Invoice
                                    <br />
                                    The Second Party shall create an invoice via the API or the Invoice UI for each transaction with any End-User in respect of which a Collection is to be performed by the First Party on behalf of the Second Party.
                                </p>
                            </motion.section>

                            <motion.section
                                key="card-processing-services"
                                id="card-processing-services"
                                data-section
                                className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Card Processing Services</h2>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    Any Card Processing Services performed or to be performed by the First Party on behalf of the Second Party are subject to the following conditions:
                                </p>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    1. Methods of Card Processing Services:
                                    <br /><br />
                                    a. Aggregator Method: The First Party acts as an aggregator. The Second Party may enjoy Card Processing Services using the merchant account and unique merchant identification number(s) of the First Party with its appointed acquiring bank(s).
                                    <br /><br />
                                    b. Switcher Method: The First Party assists the Second Party in obtaining its own Merchant ID with the First Party&apos;s partner Banks.
                                </p>
                            </motion.section>

                            <motion.section
                                key="invalid-payments-and-other-liabilities"
                                id="invalid-payments-and-other-liabilities"
                                data-section
                                className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Invalid Payments and Other Liabilities</h2>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    1. The Second Party acknowledges and agrees that the First Party and each of its Affiliates shall not be liable or responsible in any respect, and that the Second Party shall be liable for all Losses incurred by the First Party arising out of:
                                    <br /><br />
                                    a. Any over-payment, payment error, refund, or other invalid payment caused by the Second Party or its End-Users.
                                    <br /><br />
                                    b. Any error, default, negligence, misconduct, or fraud by the Second Party, employees, directors, officers, representatives of the Second Party, or anyone acting on behalf of the Second Party.
                                </p>
                            </motion.section>

                            <motion.section
                                key="security-and-fraud"
                                id="security-and-fraud"
                                data-section
                                className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Security and Fraud</h2>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    1. The Second Party represents and warrants that, at all times while the Service Agreement is in effect, the Second Party shall maintain and adhere to all reasonable security measures to protect the Second Party Computer Systems and the data contained therein from unauthorized control, tampering, or any other unauthorized access.
                                </p>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    2. Unless caused solely by the First Party&apos;s gross negligence, fraud, or willful or deliberate act, the Second Party shall be responsible for all Losses incurred when there has been a compromise of username or password of the Second Party or any other unauthorized use or modification of the account of the Second Party on the First Party&apos;s platform.
                                </p>
                            </motion.section>

                            <motion.section
                                key="license-and-intellectual-property"
                                id="license-and-intellectual-property"
                                data-section
                                className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">License and Intellectual Property</h2>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    1. Grant of License
                                    <br />
                                    Subject to the terms of these Conditions, the First Party hereby grants to the Second Party, and the Second Party hereby accepts from the First Party, a personal, limited, non-exclusive, non-transferable license and right to use the First Party&apos;s API and accompanying Services Documentation for the following purposes:
                                    <br /><br />
                                    a. Install and use the API on as many machines as reasonably necessary.
                                    <br /><br />
                                    b. Use the accompanying Services Documentation solely for the purpose of using the APIs and Services.
                                </p>
                            </motion.section>

                            <motion.section
                                key="representations-and-warranties"
                                id="representations-and-warranties"
                                data-section
                                className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Representations and Warranties</h2>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    1. First Party&apos;s Representations and Warranties
                                    <br /><br />
                                    a. The Services and APIs provided to the Second Party hereunder will conform to the specifications set forth in the applicable Services Documentation.
                                    <br /><br />
                                    b. The First Party further represents and warrants that the First Party will maintain compliance with all applicable laws, rules, and regulations.
                                </p>
                            </motion.section>

                            <motion.section
                                key="restricted-activities"
                                id="restricted-activities"
                                data-section
                                className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Restricted Activities</h2>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    The Second Party acknowledges that the First Party is prohibited from engaging in or providing services in activities restricted under Ivoirian laws, including Unlawful Activities as defined under the Anti-Money Laundering laws, as amended, and its Implementing Rules and Regulations.
                                </p>
                            </motion.section>

                            <motion.section
                                key="disclaimers"
                                id="disclaimers"
                                data-section
                                className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Disclaimers</h2>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    Except as expressly set forth in the Services Agreement or these Conditions, the products and services provided hereunder are provided &quot;as is&quot; with all faults and without any representations or warranties. The entire risk as to satisfactory quality, performance, accuracy, and effort is with the Second Party.
                                </p>
                            </motion.section>

                            <motion.section
                                key="indemnification-and-liability"
                                id="indemnification-and-liability"
                                data-section
                                className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Indemnification and Liability</h2>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    1. The First Party shall defend, hold harmless, and indemnify, at its expense, the Second Party, its affiliates, and each of their respective officers, directors, employees, and the successors and assigns of the foregoing against any third-party legal cause of action, claim, suit, proceeding, or regulatory action.
                                </p>
                            </motion.section>

                            <motion.section
                                key="confidential-information"
                                id="confidential-information"
                                data-section
                                className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Confidential Information</h2>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    1. Each Party (the &quot;Receiving Party&quot;) hereby agrees:
                                    <br /><br />
                                    a. To hold the other Party&apos;s Confidential Information in strict confidence and to take reasonable precautions to protect such Confidential Information.
                                    <br /><br />
                                    b. Not to divulge any such Confidential Information or any information derived therefrom to any third party except as is strictly necessary to provide or use the Services.
                                </p>
                            </motion.section>

                            <motion.section
                                key="miscellaneous"
                                id="miscellaneous"
                                data-section
                                className="scroll-mt-32 mb-16 p-8 rounded-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <h2 className="text-2xl font-medium mb-6 text-zinc-900 dark:text-white">Miscellaneous</h2>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    1. The Parties shall perform all of their duties under the Services Agreement (including these Conditions) as independent contractors. Nothing in the Services Agreement shall be construed to give either Party the power to direct or control the daily activities of the other Party, or to constitute the Parties as principal and agent, employer and employee, franchiser and franchisee, partners, joint capital venturers, co-owners, or otherwise as participants in a joint undertaking.
                                </p>
                                <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                                    2. In performing any of the Services under the Services Agreement and these Conditions, from time to time, to the extent permitted under the law, the Second Party hereby agrees to authorize the First Party, at the First Party&apos;s sole discretion, to delegate any of its duties and obligations hereunder to any of its Affiliates and/or trusted third parties.
                                </p>
                            </motion.section>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </main>

            {/* Large background text - Only render when mounted */}

            {mounted && (
                <div className="w-full -z-200 overflow-hidden mt-[-100px] py-[-100px] h-[380px] relative z-0">
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
}