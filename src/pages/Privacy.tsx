import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

const Privacy = () => {
    return (
        <>
            <Navbar />
            <div className="bg-background text-dark-text dark:text-light-text"> {/* Adjust text color for light and dark modes */}
                <main className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="space-y-12"> {/* Increased space between sections */}
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1> {/* Increased font size */}
                            <p className="mt-6 text-lg text-muted-foreground">Last updated: [20/07/2024 — 6:41 p.m GMT]</p> {/* Increased font size and margin */}
                        </div>
                        <hr className="my-4" /> {/* Horizontal line with margin */}
                        <div className="space-y-10"> {/* Increased space between subsections */}
                            <div>
                                <h2 className="text-3xl font-bold">Introduction</h2> {/* Increased font size */}
                                <p className="mt-6 text-lg text-muted-foreground font-bold"> {/* Increased font size and margin, added bold */}
                                    Privacy is important to us.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    <strong>lomi.africa Inc.</strong>  (&quot;lomi.&quot;, &quot;lomi&quot;, &quot;We&quot;, &quot;Our&quot; or &quot;Us&quot;) is an operator of payment systems. We offer payment and disbursement services (<strong>Services</strong>) to our clients. In providing our Services, we process personal information (<strong>Personal Data</strong>) about our clients, their authorized representatives, and their customers (collectively, the <strong>Data Subjects</strong>). This processing is governed by applicable data protection laws and regulations in Côte d&apos;Ivoire.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    In certain instances, we partner with our affiliates and third-party vendors for the provision of our Services (e.g., banks, card acquiring partners, payment centers, and e-money issuers, collectively, <strong>Payment Channel Partners</strong>). Whenever there is such a partnership, we execute appropriate agreements with said affiliates and Payment Channel Partners, setting out the extent of their processing in relation to the provision of Services and their obligations over the Personal Data they process on behalf of lomi.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">Overview and Applicability</h2> {/* Increased font size */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    The Personal Data we collect depends on how our Services are used. We may receive Personal Data directly from Data Subjects, such as when they create an account on lomi’s dashboard, request information about our services via email, or through our official social media platforms. Other times, we obtain Personal Data by recording interactions with our Services using technologies like cookies and web beacons. For certain services, we also receive Personal Data from our Payment Channel Partners.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    The collection and processing of Personal Data from a variety of sources are essential to our ability to provide our Services and to help keep them safe and secure. The processing of certain Personal Data, like financial and transaction information, is critical in helping us increase the safety of our Services and reduce the risk of fraud, money laundering, and other harmful activity.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">Personal Data We Collect</h2> {/* New section */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    We call &quot;Personal Data&quot; any data that identifies, or that could reasonably be used to identify, a Data Subject as an individual. We collect Personal Data in different ways. For example, we collect Personal Data when a business registers for a lomi. account, or a customer makes payments or conducts transactions through our Services. We may also collect Personal Data from the identification documents our clients submit to us when we perform our <strong>Know-Your-Customer (KYC)</strong> and <strong>Customer Due Diligence (CDD)</strong> vetting of our clients prior to establishing a business relationship with them.
                                    <br />
                                    <br />
                                    We also receive Personal Data from other sources, such as our partners, financial service providers, identity verification services, and publicly available sources. For clarity, Personal Data does not include data that has been aggregated or made anonymous such that it can no longer be reasonably associated with a specific person. The Personal Data that we may collect includes:
                                </p>
                                <ul className="mt-6 text-lg text-muted-foreground space-y-4 ml-6"> {/* Increased font size, margin, and space between list items */}
                                    <li>- Full names of Data Subjects.</li>
                                    <li>- Contact details, such as name, address, telephone number, email address.</li>
                                    <li>- Financial and transactional information, such as credit or debit card number, and bank account information.</li>
                                    <li>- Date and place of birth, government-issued identifiers (e.g., Tax Identification Number, National Identification Number, Passport Data), which we collect and process to perform our obligations under applicable anti-money laundering and countering terrorist financing regulations, and such other applicable laws and regulations, and to perform our contractual commitments with our Payment Channel Partners.</li>
                                </ul>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    In using any of our Services, we also collect and gather other Personal Data through a variety of sources. Among the sources for said Personal Data are our technologies that record the use of our Services supported by our website, websites that implement our Services, and the use of our Services generally.
                                    <br />
                                    <br />The other Personal Data that we may collect include:
                                </p>
                                <ul className="mt-6 text-lg text-muted-foreground space-y-4 ml-6"> {/* Increased font size, margin, and space between list items */}
                                    <li>- Browser and device data, such as IP address, device type, operating system and Internet browser type, screen resolution, operating system name and version, device manufacturer and model, language, plug-ins, add-ons, and the version of the Services the Data Subjects are using.</li>
                                    <li>- Transaction data, such as purchases, purchase amount, date of purchase, and payment methods.</li>
                                    <li>- Cookie and tracking technology data, such as time spent on the Services, pages visited, language preferences, and other anonymous traffic data.</li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">How We Use and Process Personal Data</h2> {/* New section */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    We and our Payment Channel Partners use and process Personal Data to: (i) provide our Services; (ii) detect and prevent fraud; (iii) mitigate financial loss or other harm to clients, their customers, and lomi.; (iv) promote, analyze, and improve our products, systems, and tools; and (v) complete reports to be submitted to regulatory agencies.
                                    <br />
                                    Examples of how we may use Personal Data include:
                                </p>
                                <ul className="mt-6 text-lg text-muted-foreground space-y-4 ml-6"> {/* Increased font size, margin, and space between list items */}
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
                            <div>
                                <h2 className="text-3xl font-bold">How We Disclose Personal Data</h2> {/* New section */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    lomi. does not sell or rent Personal Data to marketers or unaffiliated third parties. We share data with trusted third parties, including:
                                </p>
                                <ul className="mt-6 text-lg text-muted-foreground space-y-4 ml-6"> {/* Increased font size, margin, and space between list items */}
                                    <li>- <strong>To Affiliates:</strong> We share data with our affiliates and subsidiaries to provide our Services or otherwise improve our Services</li>
                                    <li>- <strong>To Service Providers:</strong> We share Personal Data with service providers who help us provide the Services. Service providers, which include Payment Channel Partners, help us with things like payment processing, website hosting, data analysis, information technology and related infrastructure, customer service, email delivery, and auditing</li>
                                    <li>- <strong>To Our Clients:</strong> We share Personal Data with our clients as necessary to process payments or provide the Services. For example, we share Personal Data with clients about purchases made or services availed of, and paid by their customers through lomi’s Services</li>
                                    <li>- <strong>To Authorized Third Parties:</strong> We share Personal Data with parties directly authorized by a client to receive Personal Data, such as when a client authorizes a third-party application provider to access the client’s lomi account. The use of Personal Data by an authorized third party is always subject to said third party’s privacy policy</li>
                                    <li>- <strong>To Other Third Parties:</strong> We will share Personal Data with third parties in the event of any reorganization, merger, sale, joint venture, assignment, transfer, or other disposition of all or any portion of our business, assets, or stock (including in connection with any bankruptcy or similar proceedings)</li>
                                    <li>- <strong>Safety, Legal Purposes and Law Enforcement:</strong> We use and disclose Personal Data as we believe necessary: (i) under applicable law or payment method rules; (ii) to enforce our Terms and Conditions for the provision of the Services; (iii) to protect our rights, privacy, safety, or property, and/or that of our affiliates and the Data Subjects; and (iv) to respond to requests from courts, law enforcement agencies, regulatory agencies, and other public and government authorities, which may include authorities outside of our Data Subjects’ country of residence.</li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">Security</h2> {/* New section */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    We implement reasonable organizational, technical, and administrative measures to protect Personal Data within our organization. Should you have reason to believe that our processing of Personal Data is no longer secure, please contact us immediately.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">Exercise of Data Subjects’ Rights</h2> {/* New section */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    We recognize and acknowledge Data Subjects’ rights guaranteed under applicable data protection laws. In particular, we recognize every Data Subject’s right to object to the processing of his/her Personal Data to such extent allowed under the law.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    <strong>Opting out of receiving electronic communications from us:</strong> Should the Data Subjects no longer want to receive marketing-related emails or communications from us on a going-forward basis, the Data Subjects may opt-out via the unsubscribe link included in such emails or communications, or by directly contacting us. We will try to comply with your request(s) as soon as reasonably practicable.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    <strong>How to access or modify Personal Data:</strong> Should Data Subjects wish to review, correct, or update their Personal Data previously disclosed to us, the Data Subjects may do so by contacting hello@lomi.africa.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    When emailing us the request, the Data Subjects are advised to make clear in their request what Personal Data they want modified. For the protection of the Data Subjects, we may only address and implement requests with respect to the Personal Data associated with the particular email address or contact information that the requesting Data Subject used to send us the request, and we may need to verify the Data Subjects’ identity before acting on the request. We will try to comply with your request as soon as reasonably practicable.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">Retention Period</h2> {/* New section */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    We will retain Personal Data for the period necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or otherwise permitted by law. In general, as a financial institution, we will retain Personal Data for five (5) years following the termination of the Services.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    It should likewise be underscored that we have a variety of obligations to retain the Personal Data that we process, including to ensure that transactions can be appropriately processed, settled, refunded, or charged-back, to help identify fraud, and to comply with anti-money laundering and other laws and rules that apply to us and to our financial service providers. Accordingly, even if clients may have terminated the Services, we will retain certain Personal Data to meet our obligations. There may also be residual Personal Data that will remain, in anonymized format, within our databases and other records, which will not be removed.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">Jurisdiction and Cross-Border Transfer</h2> {/* New section */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    Our Services are global, and Personal Data may be stored and processed in any country where we have operations or where we engage service providers. We may transfer Personal Data to countries outside of Côte d&apos;Ivoire, including the United States and European Union countries, which may have data protection rules that are different from those of the Data Subject&apos;s country.
                                    <br />
                                    However, we will take appropriate measures to ensure that any such transfers comply with applicable data protection laws and that your Data remains protected to the standards described in our Privacy Policy. In certain circumstances, courts, law enforcement agencies, regulatory agencies, or security authorities in those other countries may be entitled to access your Personal Data.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">lomi. as a Personal Information Processor</h2> {/* New section */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    We may collect, use, disclose, and otherwise process certain Personal Data about customers when acting as the client’s service provider. Our clients are responsible for ensuring that their customers’ privacy rights are respected, including ensuring appropriate disclosures about third-party data collection, use, and processing. To the extent that we are acting as a client’s Personal Information Processor, we will process Personal Data only in accordance with the terms of our agreement with the client and the client’s lawful instructions.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">Updates to Our Privacy Policy and Notifications</h2> {/* New section */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    We may change this Privacy Policy. The “Last updated” legend at the top of the page indicates when our Privacy Policy was last revised. Any changes are effective when we post the revised Privacy Policy on our website.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    We may provide Data Subjects with disclosures and alerts regarding the Privacy Notice or Personal Data collected by posting them on our website or, in the case of our clients and their customers, via email addresses and/or the physical addresses provided to lomi..
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">Changes to Our Privacy Notice</h2> {/* New section */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    lomi. is always improving. Thus, we may occasionally update our Privacy Notice should there be changes in the way we process Personal Data consequent upon a change or improvement to any of our Services. If we modify the Privacy Notice, we will post the revised copy on our website, and we will also revise the “last updated date” stated above. If we make material changes in the way we use Personal Data, we will notify clients and their customers, where applicable, by posting an announcement on our website, by sending an email, or through instant messaging services or SMS. It remains the responsibility of the Data Subjects to periodically review our Privacy Notice; clients are bound by any changes to the Privacy Notice by using the service after such changes have been first posted.
                                </p>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold">How to Contact Us</h2> {/* New section */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    If you have questions or concerns regarding this privacy policy, or any feedback pertaining to the above Privacy Notice and your privacy, please contact:
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    <strong>The Founder</strong>
                                </p>
                                <p className="mt-3 text-lg text-muted-foreground"> {/* Reduced margin */}
                                    lomi.africa Inc.
                                </p>
                                <p className="mt-1 text-lg text-muted-foreground"> {/* Slightly larger margin to separate email */}
                                    hello@lomi.africa
                                </p>
                                <hr className="my-4" /> {/* Horizontal line with margin */}
                                <p className="mt-2 text-base text-muted-foreground"> {/* Reduced margin and smaller text */}
                                    Les Perles,
                                </p>
                                <p className="mt-1 text-base text-muted-foreground"> {/* Reduced margin and smaller text */}
                                    Cocody, II Plateau
                                </p>
                                <p className="mt-1 text-base text-muted-foreground"> {/* Reduced margin and smaller text */}
                                    Abidjan, Côte d&apos;Ivoire
                                </p>
                            </div>
                        </div>
                    </div>
                </main >
            </div >
            <Footer />
        </>
    );
};

export default Privacy;