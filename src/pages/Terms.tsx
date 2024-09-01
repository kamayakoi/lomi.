import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import SideNav from '../components/landing/Sidenav';
import { ScrollToTop } from "../components/landing/ScrollToTop";

const Terms = () => {
    const navItems = [
        { id: 'interpretation', label: 'Interpretation' },
        { id: 'service-fees', label: 'Service Fees' },
        { id: 'disbursement-services', label: 'Disbursement Services' },
        { id: 'collection-services', label: 'Collection Services' }, // Added
        { id: 'card-processing-services', label: 'Card Processing Services' }, // Added
        { id: 'invalid-payments-and-other-liabilities', label: 'Invalid Payments and Other Liabilities' }, // Added
        { id: 'security-and-fraud', label: 'Security and Fraud' }, // Added
        { id: 'license-and-intellectual-property', label: 'License and Intellectual Property' }, // Added
        { id: 'representations-and-warranties', label: 'Representations and Warranties' }, // Added
        { id: 'restricted-activities', label: 'Restricted Activities' }, // Added
        { id: 'disclaimers', label: 'Disclaimers' }, // Added
        { id: 'indemnification-and-liability', label: 'Indemnification and Liability' }, // Added
        { id: 'confidential-information', label: 'Confidential Information' }, // Added
    ];

    return (
        <>
            <Navbar />
            <SideNav items={navItems} /> {/* Pass the navigation items as props */}
            <div className="bg-background text-dark-text dark:text-light-text"> {/* Adjust text color for light and dark modes */}
                <main className="container mx-auto max-w-6xl px-8 py-12 sm:px-10 lg:px-12">
                    <div className="space-y-12"> {/* Increased space between sections */}
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Terms and Conditions</h1> {/* Increased font size */}
                            <p className="mt-6 text-lg text-muted-foreground">Last updated: [20/07/2024 — 8:56 p.m GMT]</p>
                        </div>
                        <hr className="my-4" /> {/* Horizontal line with margin */}
                        <div className="space-y-10"> {/* Increased space between subsections */}
                            <div>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin, added bold */}
                                    We,  <strong>lomi.africa Inc.</strong> (&quot;lomi.&quot;, &quot;We&quot; or &quot;Us&quot;), are a corporation organized and existing under the laws of Côte d&apos;Ivoire. We offer payment and disbursement services (<strong>Services</strong>) to our clients. We act as the  <strong>First Party</strong> in these following Terms and Conditions (<strong>Conditions</strong>). You shall be considered as the <strong>Second Party</strong>. The First Party and Second Party are collectively referred to as the <strong>Parties</strong> and individually as a <strong>Party</strong>.
                                </p>
                                <hr className="my-4" /> {/* Horizontal line with margin */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    The First Party shall be entitled to amend, modify, or supplement the Conditions at any time and (subject to law) for an unlimited number of times subsequently without restriction in its sole and absolute discretion by posting a revised version of these Conditions. The First Party will provide fourteen (14) calendar days’ prior notice (the “Notice Period“) to the Second Party before the effective date of any amendment, modification, or supplement. Such notice will be given via electronic mail transmission or otherwise in writing.
                                    <br />
                                    <br />
                                    Upon receipt of such notice from the First Party, the Second Party shall be entitled to terminate the <strong>Service Agreement</strong> immediately by submitting a written notice to the First Party of its intention to terminate within the Notice Period. Upon the lapse of the Notice Period and to the extent that no notice has been received by the First Party, the Second Party hereby agrees to accept and be bound by any amendment, modification, or supplement made to these Conditions. These Terms and Conditions that have been amended, modified, or supplemented shall supersede and replace all previous versions.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    These Conditions shall form part of the Services Agreement. These Conditions shall not be interpreted independently of any Services Agreements, unless otherwise provided herein and/or in the Services Agreements. In the event of conflict between the Services Agreement and these Conditions, the latter shall prevail.
                                </p>
                            </div>
                            <div id="interpretation"> {/* Add id for navigation */}
                                <h2 className="text-3xl font-bold">Interpretation</h2> {/* Increased font size */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    Definitions — all capitalized terms that are not defined in these Conditions will have the meanings ascribed to them in the Services Agreement.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    For the purposes of these Conditions, and except where the context requires otherwise:
                                </p>
                                <ul className="mt-6 text-lg text-muted-foreground space-y-4 ml-6"> {/* Increased font size, margin, and space between list items */}
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
                                    <li>- <strong>Confidential Information</strong> means any data or information, oral or written, treated as confidential that relates to either Party’s (or, if either Party is bound to protect the confidentiality of any third party’s information, such third party’s) past, present, or future research or development activities, including any unannounced products and services, any information relating to developments, Services Documentation (in whatever form or media provided), inventions, processes, plans, financial or due diligence information, personally identifiable data of End-Users, to such extent that said data is not otherwise subject to a separate agreement between the Parties, and the financial terms of the Services Agreement. Notwithstanding the foregoing, Confidential Information shall not be deemed to include information if:
                                        <ul className="ml-6">
                                            <li className="mt-2">i. It was already known to the receiving party prior to the Effective Date of the Services Agreement, as established by documentary evidence;</li>
                                            <li className="mt-2">ii. It is in or has entered the public domain through no breach of the Services Agreement or other wrongful act of the receiving party;</li>
                                            <li className="mt-2">iii. It has been rightfully received by the receiving party from a third party and without breach of any obligation of confidentiality of such third party to the owner of the Confidential Information;</li>
                                            <li className="mt-2">iv. It has been approved for release by written authorization of the owner of the Confidential Information;</li>
                                            <li className="mt-2">v. It has been independently developed by a party without access to or use of the Confidential Information of the other party.</li>
                                        </ul>
                                    </li>
                                    <li>- <strong>Dashboard</strong> means a web-based reporting platform provided by the First Party to the Second Party.</li>
                                    <li>- <strong>Destination Account</strong> means the bank account or E-wallet specified by the Second Party into which, upon the instruction of the Second Party made in accordance with the procedure stipulated by the First Party, funds will be transferred by the First Party.</li>
                                    <li>- <strong>Disbursement</strong> means the act done by the First Party on behalf of the Second Party which sets in motion a movement of funds from a Top-Up Account either to a Destination Account or the in-person collection of funds by payees from Retail Outlets via API or by way of manual upload; and “Disbursements” shall mean any two or more of such instances of such acts.</li>
                                    <li>- <strong>Electronic Wallets or E-Wallets</strong> shall mean electronic accounts through which owners of the accounts store electronic money (e-money) or monetary value and are created by banks or duly-authorized non-bank issuers of e-money.</li>
                                    <li>- <strong>End-User</strong> means a person or entity that uses the services or products of the Second Party.</li>
                                    <li>- <strong>Invoice UI</strong> means the user interface hosted payment page provided by the First Party.</li>
                                    <li>- <strong>Losses</strong> shall mean any losses, damages, liability, costs, and expenses (including reasonable fees and expenses of legal and other advisers, court costs, and other dispute resolution costs) suffered or incurred by a party.</li>
                                    <li>- <strong>XOF</strong> means the lawful currency for the time being of Côte d&apos;Ivoire.</li>
                                    <li>- <strong>Refund</strong> means an instruction initiated by the Second Party to return funds to an End-User for an existing Charge.</li>
                                    <li>- <strong>Retail Outlets</strong> shall mean payment or collection centers with whom the First Party has agreements or arrangements allowing the in-person collection of payments by End-Users or the in-person collection by payees of Disbursements.</li>
                                    <li>- <strong>Reversal</strong> means an instruction initiated by any bank, money services business, payment network, or other financial intermediary, or the First Party to return funds for an existing Charge. Reversals may result from:
                                        <ul className="ml-6">
                                            <li className="mt-2">i. Invalidation of a charge by a bank, money services business, payment network, or other financial intermediary;</li>
                                            <li className="mt-2">ii. Funds settled to the Second Party in error or without authorization;</li>
                                            <li className="mt-2">iii. Submission of a Charge in violation of Network Rules, or where submission of the Charge or use of the Card Processing Services by the Second Party violates these Conditions or the Services Agreement.</li>
                                        </ul>
                                    </li>
                                    <li>- <strong>Services Agreements</strong> means an agreement entered into between the Parties in relation to the Services provided by the First Party to the Second Party.</li>
                                    <li>- <strong>Services Documentation</strong> means collectively, the operating instructions, user manuals, and help files, in written or electronic form, made available to the Second Party (including, but not limited to, the information found on <a href="https://www.lomi.africa" target="_blank" rel="noopener noreferrer">www.lomi.africa</a>), and that are intended for use in connection with the Services.</li>
                                    <li>- <strong>Top-Up</strong> means any topping up of the balance in the Top-Up Account.</li>
                                    <li>- <strong>Top-Up Account(s)</strong> means bank account(s) created and administered in any bank appointed by the First Party designated for the purpose of storing the balance of the Second Party’s funds for and throughout the Second Party’s use of the Services.</li>
                                </ul>
                            </div>
                            <div id="service-fees"> {/* Add id for navigation */}
                                <h2 className="text-3xl font-bold">Service Fees</h2> {/* Increased font size */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    Unless agreed otherwise between the Parties in writing, the service fees to be paid by the Second Party to the First Party for the Services (including, where applicable, any foreign currency and other fees which shall be borne by the Second Party) shall be as set out in the Fee Schedule of the Service Agreement and incorporated herein by this reference. Where the Second Party begins using any Service of the First Party without prior agreement or negotiation with the First Party, the fees and charges applicable and payable shall be those as specified in the fee list at www.lomi.africa which are deemed incorporated herein by reference.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    The Second Party shall pay the service fees for the Services to the First Party in accordance with the terms set forth in the Service Agreement.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    A Disbursement shall be considered executed when funds specified in the instructions of the Second Party (in the case of a Disbursement via API) in the relevant API or (in the case of a Disbursement by way of manual upload) in the .XLSX file uploaded by the Second Party for a single transaction are successfully transferred from the balance of the Second Party to the relevant bank account designated by the Second Party for the purpose of receiving such funds.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    The First Party shall be entitled to revise the Fee Schedule and the fees and charges agreed therein at any time, provided that notification of such change has been provided to the Second Party in accordance with the Conditions.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    The Second Party agrees that the First Party is entitled to immediately offset any expenses, fees, costs, or charges owed by the Second Party.
                                </p>
                            </div>
                            <div id="disbursement-services"> {/* Add id for navigation */}
                                <h2 className="text-3xl font-bold">Disbursement Services</h2> {/* Section title */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Section content */}
                                    Any Disbursements performed or to be performed by the First Party on behalf of the Second Party are subject always to the following conditions:
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground">
                                    1. Instructions to perform any Disbursement can only be delivered by the Second Party to the First Party via the API or by way of manual upload on the Dashboard. All such instructions shall only be valid if made in accordance with such forms or templates agreed upon by the First Party in the Services Documentation and/or the Services Agreement. The First Party shall not be obligated to initiate any Disbursement on behalf of the Second Party until instructions for any Disbursement are delivered pursuant to this Condition 3.1.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground">
                                    2. All instructions received to perform any Disbursement delivered with the Second Party’s API key are considered final and irrevocable at the time of delivery, which shall be the moment at which the Second Party posts a request to create a Disbursement via the API. The timestamp appearing in the response returned by the First Party’s API following such a request by the Second Party shall be conclusive evidence of the time of delivery of such request.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground">
                                    3. All instructions received to perform any Disbursement delivered by the Second Party by way of manual upload to the Dashboard are considered final and irrevocable at the time of delivery, which shall be the moment at which the .XLSX document containing the Second Party’s instructions in respect of such Disbursement has been successfully uploaded to the Dashboard.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground">
                                    4. Under no circumstances shall the First Party be obligated to perform any Disbursement on behalf of the Second Party unless and until the balance in the Top-Up Account is equal to or greater than the sum of the value of such Disbursements requested by the Second Party and the service fees in respect of such Disbursements, as set out in the Fee Schedule. The Second Party may add to the balance in its Top-Up Account in accordance with the instructions found at www.lomi.africa.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground">
                                    5. If the balance in the Top-Up Account is equal to or greater than the requested Disbursement amount plus service fees, the First Party will perform the Disbursement under the following conditions:
                                </p>
                                <ul className="mt-6 text-lg text-muted-foreground space-y-4 ml-6">
                                    <li>- If the Disbursement request is received by 3:00 PM Côte d&apos;Ivoire Time on a business day, or if it is received after 3:00 PM but the amount is less than XOF 100,000.00, the Disbursement will be processed on the same day.</li>
                                    <li>- If the Disbursement request is for an amount over XOF 100,000.00 and is received after 3:00 PM on a business day or on a non-business day, the Disbursement will be processed by 11:59 PM on the next business day.</li>
                                </ul>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    6. A Disbursement is deemed performed by the First Party when:
                                    <ul className="mt-6 text-lg text-muted-foreground space-y-4 ml-6">
                                        <li>- <strong>Via API</strong>: The request for a Disbursement made by the Second Party reaches the First Party’s servers, and the response returned by the First Party’s API shows the transaction as “COMPLETED.”</li>
                                        <li>- <strong>Manual Upload</strong>: The status of the Second Party’s request for a Disbursement is shown as “COMPLETED” on the Batch Disbursements screen on the Dashboard of the Second Party.</li>
                                    </ul>
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    7. The Second Party acknowledges and accepts that the First Party’s obligations to the Second Party in respect of each Disbursement are fulfilled in full upon completion of the conditions stated in Clause 3.6 above. The Second Party further acknowledges and accepts that the First Party and its Affiliates shall not be responsible nor liable for any Losses incurred by the Second Party due to any error, failure, delay, breakdown, postponement, or any other event affecting the final processing of any Disbursement by the banks where the Top-Up Account(s) and the Destination Account(s) are created, administered, and maintained.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    8. The First Party covenants that, subject to this Condition 3.8, all funds received by the First Party and/or any of its Affiliates on behalf of the Second Party shall be held for the benefit of the Second Party. This is except for any expenses, fees, costs, or charges owed by the Second Party to the First Party in accordance with the Fee Schedule or any Losses legally and rightfully incurred by the First Party due to the actions of the Second Party, as determined in accordance with Clause 7 (Dispute Resolution) of the Services Agreement, Condition 2.6, or Condition 4 below.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    9. The Second Party agrees to be subject to the terms and conditions of the appointed bank(s) and their partners with whom the First Party provides the Services. This includes, but is not limited to, any limits or changes to the operating hours during the Services or any segment thereof. All such terms and conditions are incorporated herein by this reference.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    10. The Second Party accepts and agrees that it is their responsibility to fully review the API reference and thoroughly test its integration before processing live Disbursements using the First Party’s API. The Second Party acknowledges that the First Party has provided idempotency in its Disbursement API so that the Second Party can safely retry requests without accidentally performing the same operation twice. It is the Second Party’s responsibility to implement idempotency in its Disbursement requests to prevent losses due to unsafe retries. The Second Party agrees that it is solely responsible for all losses it may incur from not performing idempotent requests.
                                </p>
                            </div>
                            <div id="collection-services"> {/* Add id for navigation */}
                                <h2 className="text-3xl font-bold">Collection Services via Retail Outlets or E-Wallets</h2> {/* Section title */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Section content */}
                                    Any Collections performed or to be performed by the First Party on behalf of the Second Party via Retail Outlets or E-wallets are subject to the following conditions:
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    1. Configuration of Collection Method
                                    <br />
                                    The Second Party shall configure its elected method for Collections to be performed by the First Party by notifying any authorized representative, employee, officer, or director of the First Party of its election for Collections to be performed via Retail Outlets or E-Wallets, via Instant Messaging Service or otherwise in writing.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    2. Creation of Invoice
                                    <br />
                                    The Second Party shall create an invoice via the API or the Invoice UI for each transaction with any End-User in respect of which a Collection is to be performed by the First Party on behalf of the Second Party. Such invoice shall be created in accordance with the instructions found at <a href="https://dashboard.lomi.africa/docs/invoices" target="_blank" rel="noopener noreferrer">https://dashboard.lomi.africa/docs/invoices</a>.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    3. Invoice Expiry
                                    <br />
                                    Each invoice created by the Second Party will expire after twenty-four (24) hours from the time of creation unless the First Party receives a notification from the Second Party to amend such expiry period. This notification should be made via Instant Messaging Service or otherwise in writing.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    4. Switching Services Engagement
                                    <br />
                                    Where the Second Party elects to engage the switching services of the First Party, the following provisions shall apply:
                                    <ul className="mt-6 text-lg text-muted-foreground space-y-4 ml-6">
                                        <li>a. The Second Party shall enter into a cooperation agreement with its preferred partner bank before engaging the switching services of the First Party.</li>
                                        <li>b. The Second Party shall provide a certified copy of the cooperation agreement entered into with its preferred partner bank to the First Party upon request.</li>
                                        <li>c. The First Party shall be entitled to determine the minimum volume of transactions that shall be made by the Second Party when using the switching services of the First Party, which shall be effective upon written notice of not less than thirty (30) days to the Second Party.</li>
                                        <li>d. Where the Second Party uses a Leased Line, any installation cost and/or subscription fee for any communication link installed between the website of the Second Party and the First Party’s system shall be borne solely by the Second Party.</li>
                                        <li>e. The Parties agree that reconciliation of any transaction data for the preceding month shall be made no later than the 10th of each month by mutual signing of the minutes of reconciliation.</li>
                                    </ul>
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    5. Terms and Conditions of Retail Outlets or E-wallets
                                    <br />
                                    Where the Second Party elects to engage the collection services of the First Party via Retail Outlets or E-wallets, the Second Party agrees to be subject to the terms and conditions of the Retail Outlets and E-wallet organizers or issuers of e-money (including, but not limited to, any limits or changes to the hours during which payments may be received via the payment channels maintained by the Retail Outlets or E-wallets). All such terms and conditions are incorporated herein by this reference.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    6. Handling Incorrect Payments
                                    <br />
                                    Where an incoming payment from an End-User has been incorrectly made, whether by:
                                    <ul className="mt-6 text-lg text-muted-foreground space-y-4 ml-6">
                                        <li>i. The payment of an incorrect amount which does not correspond with the amount charged in the invoice delivered to and intended for such End-User,</li>
                                        <li>ii. The payment of funds to the wrong destination, or</li>
                                        <li>iii. Failure to complete any credit and/or debit card transaction,</li>
                                    </ul>
                                    Then the Second Party is entitled to initiate a transaction review by notification to the First Party, such notification to be made via Instant Messaging Service or otherwise in writing. The First Party may respond to such notification (in the case where such notification is made by 5:00 P.M. Côte d&apos;Ivoire Time on a business day) no later than 11:59 P.M. (Côte d&apos;Ivoire Time) on the next business day and (in the case where such notification is made after 5:00 P.M. Côte d&apos;Ivoire Time on a business day or on a non-business day) no later than two (2) business days after such notification has been made.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    7. Addition to Balance
                                    <br />
                                    All funds received by the First Party on behalf of the Second Party as a result of the performance by the First Party of all Collections under this Condition 4 shall be added to the balance of the Second Party by the First Party.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    8. Settlement of Funds
                                    <br />
                                    Settlement of all funds received in the balance of the Second Party shall be done on an H + 1 business day basis. All payments due to the Second Party shall be totaled and routed to the Top-Up Account(s) designated to the Second Party with such balance made available on the Dashboard of the Second Party ready for disbursement or withdrawal no later than 11:59 P.M. (Côte d&apos;Ivoire Time) one (1) business day after the last receipt of any payment from any End-User, provided that such payment was made by 5:00 P.M. (Côte d&apos;Ivoire Time) on a business day. This is less the deduction of any expenses, fees, costs, or charges owed by the Second Party to the First Party in accordance with the Fee Schedule, the Services Agreement, and these Conditions. Subject to Clause 5 of the Services Agreement, the Second Party shall be entitled to withdraw the funds held on its behalf in the Top-Up Account(s) and reflected on its Dashboard at any time.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    9. Holding of Funds for Sole Benefit
                                    <br />
                                    The First Party covenants that, subject to this Condition 4.9, all funds received by the First Party and/or any of its Affiliates on behalf of the Second Party shall be held for the sole benefit of the Second Party. Save for any expenses, fees, costs, or charges owed by the Second Party to the First Party in accordance with the Fee Schedule, the Services Agreement, or these Conditions, or any Losses legally and rightfully incurred by the First Party due to the actions of the Second Party, as determined in accordance with Clause 7 (Dispute Resolution) of the Services Agreement, Condition 2.6 above, or Condition 6 below, the First Party shall not have any rights to any funds received on behalf of the Second Party.
                                </p>
                            </div>
                            <div id="card-processing-services"> {/* Add id for navigation */}
                                <h2 className="text-3xl font-bold">Card Processing Services</h2> {/* Section title */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Section content */}
                                    Any Card Processing Services performed or to be performed by the First Party on behalf of the Second Party are subject to the following conditions:
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    1. Methods of Card Processing Services
                                    <br />
                                    a. Aggregator Method: The First Party acts as an aggregator. The Second Party may enjoy Card Processing Services using the merchant account and unique merchant identification number(s) (collectively, the “Merchant ID”) of the First Party with its appointed acquiring bank(s). All third-party processors and authorizing banking institutions upstream of any transactions processed with the Merchant ID(s) will identify such transactions as transactions belonging to the First Party. Subsequently, all funds from such transactions shall be deposited into the merchant account (the “Aggregator Method”).
                                    <br /><br />
                                    b. Switcher Method: The First Party assists the Second Party in obtaining its own Merchant ID with the First Party’s partner Banks (the “Switcher Method”).
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    2. Notification of Method
                                    <br />
                                    The Second Party shall notify the First Party of its elected method for the provision of the Card Processing Services via Instant Messaging Service, Email, or otherwise in writing. The First Party shall not be obligated to commence any Card Processing Services or the performance of any card Collections on behalf of the Second Party until such notification has been made in accordance with this Condition 4.2.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    3. Aggregator Method Provisions
                                    <br />
                                    a. Unless otherwise agreed by both Parties and the Second Party enables the auto-withdrawal feature, settlement of all funds received in the balance of the Second Party shall be done on an H + 7 calendar days basis. All payments due to the Second Party shall be totaled and routed to the Top-Up Account(s) designated to the Second Party with such balance made available on the Dashboard of the Second Party for disbursement or withdrawal no later than 23:59 P.M. (Côte d&apos;Ivoire Time) seven (7) calendar days after the last receipt of any payment from any End-User, where such payment was made by 14:00 P.M. (Côte d&apos;Ivoire Time) on a business day, less the deduction of any expenses, fees, costs, or charges owed by the Second Party to the First Party in accordance with the Fee Schedule, the Services Agreement, or these Conditions.
                                    <br /><br />
                                    b. Where such payment is made after 14:00 P.M. (Côte d&apos;Ivoire Time) on a business day or on a non-business day, all payments due to the Second Party shall be totaled and routed to the Top-Up Account(s) designated to the Second Party with such balance made available on the Dashboard of the Second Party for disbursement or withdrawal no later than 23:59 P.M. (Côte d&apos;Ivoire Time) eight (8) calendar days after the date of such payment.
                                    <br /><br />
                                    c. Save as subject to Clause 7 (Dispute Resolution) of the Services Agreement, Condition 2.6 above, or Condition 5 below, the Second Party shall be entitled to withdraw the funds held on its behalf in the merchant account through the Dashboard at any time.
                                    <br /><br />
                                    d. The First Party reserves the right and has full discretion to convert all Card Processing Services provided to the Second Party under the Aggregator Method to be managed under the Switcher Method instead. The following considerations shall serve as guidelines for when such conversion may take place:
                                    <ul className="mt-6 text-lg text-muted-foreground space-y-4 ml-6">
                                        <li>i. When the total volume of transactions conducted on behalf of the Second Party exceeds 5,000 transactions per month;</li>
                                        <li>ii. When the total value of transactions conducted on behalf of the Second Party exceeds XOF 40 million per month; and/or</li>
                                        <li>iii. When the aggregate Chargeback rate or volume of transactions conducted on behalf of the Second Party exceeds 0.5%.</li>
                                    </ul>
                                    For the avoidance of doubt, notwithstanding anything contained in this Condition 4.3(d), the First Party shall have full discretion to make such conversion for any reason and at any time that it deems fit.
                                    <br /><br />
                                    e. Where such conversion initiated by the First Party in accordance with subsection (d) above fails for any reason whatsoever, the First Party shall not be obligated to maintain the provision of the Card Processing Services under the Aggregator Method and shall not be liable for any Losses directly or indirectly incurred by the Second Party following the termination of the Card Processing Services following such failed conversion.
                                    <br /><br />
                                    f. The First Party covenants that, subject to this Condition 4.3, all funds received by the First Party on behalf of the Second Party shall be held for the benefit of the Second Party. Save for any expenses, fees, costs, or charges owed by the Second Party to the First Party in accordance with the Fee Schedule or any Losses legally and rightfully incurred by the First Party as a result of the actions of the Second Party, as determined in accordance with Clause 7 (Dispute Resolution) of the Services Agreement, Condition 2.6, or Condition 5 below, the First Party shall not have any rights to any funds received on behalf of the Second Party.
                                    <br /><br />
                                    g. Where the Second Party engages the Card Processing Services of the First Party to receive recurring payments or implement subscription billing, the Second Party acknowledges and agrees that the First Party shall have the right to cancel any subscription in respect of any card upon receipt of a Chargeback request on such card immediately with written notice. The First Party shall not be responsible or liable for any Losses directly or indirectly incurred by the Second Party in respect of or in connection with such cancellation in accordance with this Condition. Further, the First Party shall not be responsible for the re-subscription of such card, which shall be the sole responsibility of the Second Party.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    4. Switcher Method Provisions
                                    <br />
                                    a. The First Party may, at the request of the Second Party, assist with the Second Party’s Merchant ID application with the partner banks. Such assistance may be in the form of:
                                    <ul className="mt-6 text-lg text-muted-foreground space-y-4 ml-6">
                                        <li>i. Collection and submission of the Second Party’s company documents to the relevant bank;</li>
                                        <li>ii. Negotiation of pricing terms;</li>
                                        <li>iii. Completion of any Merchant ID application forms for the Second Party; and/or</li>
                                        <li>iv. Liaising with the relevant bank to provide other information as required by such bank.</li>
                                    </ul>
                                    For the avoidance of doubt, notwithstanding anything contained in this Condition 4.4(a), the First Party shall have sole and absolute discretion in respect of the manner in which it may assist the Second Party in the latter’s application for a Merchant ID and may vary the list above in any way and at any time as it deems fit.
                                    <br /><br />
                                    b. Settlement of all funds received into the Second Party’s merchant account shall be done directly with the appointed acquiring bank with whom such account is opened. All matters in respect of such settlement shall be determined solely by such appointed acquiring bank. The First Party shall not be directly or indirectly responsible for any matter in respect of settlement, which shall be managed solely between the Second Party and the appointed acquiring bank, and shall not be liable to the Second Party for any Losses directly or indirectly incurred in respect thereof.
                                    <br /><br />
                                    c. The Second Party acknowledges and agrees that the First Party shall not be responsible for the rejection (if any) of the Second Party’s Merchant ID application, which shall be the sole and final decision of the relevant bank, nor shall the First Party be liable for any Losses directly or indirectly incurred by the Second Party in respect of such rejection.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    5. Terms and Conditions of Appointed Acquiring Banks
                                    <br />
                                    The Second Party agrees to be subject to the terms and conditions of the appointed acquiring banks (in the case where either the Aggregator Method or the Switcher Method is elected) with whom the merchant account is created and maintained. All such terms and conditions are incorporated herein by this reference.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    6. Compliance with Network Rules
                                    <br />
                                    The Second Party acknowledges, agrees with, and covenants that, when accepting card payments, it will comply with all guidelines, by-laws, rules, and regulations imposed by any bank, money services business, payment network, or other financial intermediary that operates payment networks supported by the First Party (including the payment card network operating rules for Visa, MasterCard, JCB, American Express, and/or UnionPay networks) (the “Network Rules”) applicable to merchants. The Second Party acknowledges and accepts, and covenants to comply with all Network Rules, including all prohibitions on:
                                    <ul className="mt-6 text-lg text-muted-foreground space-y-4 ml-6">
                                        <li>i. Providing cash refunds for a Charge on a credit card, unless required by any law, rule, or regulation;</li>
                                        <li>ii. Accepting cash, its equivalent, or any other item of value for a Refund;</li>
                                        <li>iii. Acting as a payment intermediary or aggregator, or otherwise reselling Card Processing Services on behalf of others;</li>
                                        <li>iv. Submitting what the Second Party or any of its respective directors, officers, employees, or representatives believe or know to be a fraudulent Charge; or</li>
                                        <li>v. Using Card Processing Services in a manner that is an abuse of the networks of any bank, money services business, payment network, or other financial intermediary or a violation of the Network Rules.</li>
                                    </ul>
                                    The payment card networks may amend the Network Rules at any time without notice. In such event, the First Party reserves the right to amend the Card Processing Services provided to the Second Party at any time to comply with the Network Rules.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    7. Direct Relationship with End-Users
                                    <br />
                                    The Second Party acknowledges and agrees, and covenants to maintain a direct relationship with each of its End-Users and, consistent with relevant banking and money laundering and countering terrorist financing regulations, is responsible for:
                                    <ul className="mt-6 text-lg text-muted-foreground space-y-4 ml-6">
                                        <li>i. Acquiring appropriate consent to submit Charges through the Card Processing Services on behalf of each End-User;</li>
                                        <li>ii. Providing confirmation or receipts to End-Users for each Charge;</li>
                                        <li>iii. Confirming and verifying the identity of each End-User; and</li>
                                        <li>iv. Determining an End-User’s eligibility and authority to complete all transactions between it and such End-User.</li>
                                    </ul>
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    8. Responsibility for Chargebacks, Refunds, and Reversals
                                    <br />
                                    Notwithstanding that a transaction is successfully authorized, the First Party is not responsible for or liable to the Second Party for any Losses directly or indirectly incurred in connection with any authorized and completed Charges that are later the subject of a Chargeback, Refund, or Reversal, which are submitted without authorization or in error, or in violation of any law, rule, or regulation.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    9. Responsibility for Reimbursements
                                    <br />
                                    The Second Party shall be immediately responsible to the First Party for all Chargebacks, Refunds, and Reversals regardless of the reason or timing. Where any Refund or Reversal is requested, the End-User shall be issued a refund in the amount of the original Charge, a corresponding value of which shall be deducted by the First Party immediately after the time that such refund is issued directly from the balance in the Top-Up Account(s) and Dashboard of the Second Party. Any failure or delay by the First Party to deduct such corresponding value shall not constitute or be construed as a waiver of any or all of the First Party’s rights to such corresponding value. Where the balance in the Top-Up Account of the Second Party is less than the sum of the value of any Chargebacks, Refunds, or Reversals, the First Party shall issue a written notice to the Second Party for any reimbursement in respect of such Chargebacks, Refunds, or Reversals, and the Second Party shall make such reimbursement within seven (7) calendar days of receipt of such notice. The Second Party acknowledges and agrees to bear all direct or indirect Losses in respect of any Chargeback, Refund, or Reversal and shall indemnify the First Party in full in respect thereof, including but not limited to processing fees paid to the First Party for each transaction.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    10. Termination Settlement Period
                                    <br />
                                    In relation to Condition 4.9, in the event that a termination is initiated by either Party with or without cause, the First Party reserves the right to settle card payments to the Second Party within one hundred eighty (180) calendar days of either Party sending such termination notice to the other Party.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    11. Dispute Assistance
                                    <br />
                                    The First Party is under no obligation whatsoever to assist the Second Party in disputing any claims made by an End-User or any financial institution in respect of a Chargeback or Reversal. However, where the First Party agrees to facilitate the Second Party in its dispute of such claims, the Second Party agrees and covenants to provide all information, data, and documentation necessary (in the sole determination of the First Party) in relation to the dispute within seven (7) calendar days of the First Party’s request for such information, data, and documentation. Notwithstanding any assistance by the First Party, the First Party does not make any representation or guarantee that the dispute by the Second Party will be successful, and any result of the dispute is solely at the discretion of the relevant financial institution. Where a dispute is entirely or partially successful, the relevant financial institution may credit funds associated with the Charge that is the subject of the Chargeback or Reversal (or a portion thereof) to (where the Aggregator Method applies) the merchant account of the First Party on behalf of the Second Party or (where the Switcher Method applies) the merchant account of the Second Party.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    12. Suspension or Termination Due to Chargeback Rate
                                    <br />
                                    The First Party reserves the right and has full discretion to suspend or terminate the provision of its Services to the Second Party where the aggregate Chargeback rate of the transactions conducted by the Second Party or by the First Party on behalf of the Second Party exceeds 0.5%. The First Party further reserves the right and has full discretion to terminate or suspend the provision of its Card Processing Services to the Second Party should the Second Party fail to manage Chargebacks in a timely and effective manner with its End-Users (as determined in the sole discretion of the First Party). The First Party shall not be liable for any Losses directly or indirectly incurred by the Second Party in connection with the suspension or termination of its Services (including the Card Processing Services) to the Second Party pursuant to this Condition 4.12.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    13. Sharing of Information
                                    <br />
                                    The First Party reserves the right to share the information provided by the Second Party used to identify the nature of the products or services with any bank, money services business, payment network, or other financial intermediary. This includes the assignment of the business activities of the Second Party to a particular payment network merchant category code (MCC).
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    14. Security of Personal Data
                                    <br />
                                    The First Party shall take appropriate technical and organizational measures in order to secure the confidentiality of the Personal Data against unauthorized access and to prevent its unauthorized disclosure or use.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    15. Transfer of Personal Data Overseas
                                    <br />
                                    The Second Party acknowledges and understands that personal data may be transferred overseas in order for the First Party to provide the Services. The Second Party warrants to the First Party that it will provide all necessary disclosures and/or obtain all necessary consents for such transfer of personal data overseas.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    16. Record Keeping
                                    <br />
                                    The Second Party is advised to keep records or proof of trading, delivery of goods and/or services, and receipt of payment such as tax invoices, delivery slips, receipts, and other documents that can be used to prove entitlement to receive payments by the Second Party as evidence in case of disputes. The Second Party acknowledges and affirms that it is solely responsible for maintaining complete backup records of all information relating to orders, inquiries, and purchases and any information submitted to the First Party for the purpose of providing the Services. The Second Party acknowledges that insufficient records or proof of donation may increase the risk that it will be unable to successfully defend any requested Chargebacks, Reversals, Refunds, and refusals and agrees that it shall be responsible for all such risks and all losses, damages, costs, and liabilities arising therefrom.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    17. Verification of Transactions
                                    <br />
                                    In the event that the First Party requires verification for a transaction related to the Second Party, the Second Party agrees and covenants to provide all relevant information and documents within seven (7) calendar days of such request to the First Party. The Second Party further agrees and covenants that it will assist the First Party in its obtainment of such information and documents and will not impede, impair, or inhibit the First Party in its obtainment of such information and documents.
                                </p>
                            </div>
                            <div id="invalid-payments-and-other-liabilities"> {/* Add id for navigation */}
                                <h2 className="text-3xl font-bold">Invalid Payments and Other Liabilities</h2> {/* Section title */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Section content */}
                                    1. The Second Party acknowledges and agrees that the First Party and each of its Affiliates shall not be liable or responsible in any respect, and that the Second Party shall be liable for all Losses incurred by the First Party arising out of:
                                    <br /><br />
                                    <div className="ml-6"> {/* Add left margin */}
                                        a. Any over-payment, payment error, refund, or other invalid payment caused by the Second Party or its End-Users (collectively, &quot;Invalid Payment&quot;).
                                        <br /><br />
                                        b. Any error, default, negligence, misconduct, or fraud by the Second Party, employees, directors, officers, representatives of the Second Party, or anyone acting on behalf of the Second Party.
                                        <br /><br />
                                        c. Any Losses incurred by the First Party in respect of a failure by the Second Party to comply with the terms of the Services Agreement or these Conditions.
                                        <br /><br />
                                    </div>
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    2. In the event of an Invalid Payment or other liability as provided above, the First Party may deduct the amounts due to it from the balance in the Dashboard of the Second Party immediately and without objection or refusal by the Second Party. Where the balance in the Top-Up Account of the Second Party is less than the sum of the value of any Invalid Payment(s) and/or other costs or liabilities incurred in accordance with this Condition 7, the First Party shall issue a written notice to the Second Party for any reimbursement in respect of such Invalid Payment(s) and/or such other costs or liabilities. The Second Party shall make such reimbursement within seven (7) calendar days of receipt of such notice. Provided always that any delay or failure by the First Party to make such deduction shall not constitute or be construed as a waiver of any or all of the First Party’s rights in relation to such Losses to which it is entitled.
                                </p>
                            </div>
                            <div id="security-and-fraud"> {/* Add id for navigation */}
                                <h2 className="text-3xl font-bold">Security and Fraud</h2> {/* Section title */}
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Section content */}
                                    1. The Second Party represents and warrants that, at all times while the Service Agreement is in effect, the Second Party shall maintain and adhere to all reasonable security measures to protect the Second Party Computer Systems and the data contained therein from unauthorized control, tampering, or any other unauthorized access. The Second Party shall comply with all applicable laws, rules, and regulations and (where applicable) card company rules, including, without limitation, the Payment Card Industry Data Security Standard. For the purposes of this Condition 5.1, &quot;Second Party Computer Systems&quot; shall mean the computer systems operated by or on behalf of the Second Party that capture or store End-User data or that transmit End-User data to the First Party.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    2. Unless caused solely by the First Party&apos;s gross negligence, fraud, or willful or deliberate act, the Second Party shall be responsible for all Losses incurred when there has been a compromise of username or password of the Second Party or any other unauthorized use or modification of the account of the Second Party on the First Party&apos;s platform. The First Party and its Affiliates do not and will not insure the Second Party against any Losses caused by fraud. Further, the Second Party acknowledges and agrees to fully reimburse the First Party for any direct or indirect Losses incurred by the First Party in respect of the use of lost or stolen credentials or accounts of the Second Party, unless such credentials or accounts have been lost or stolen solely through the gross negligence, fraud, or willful and deliberate act of the First Party.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    3. The First Party may assist the Second Party with any investigations with law enforcement to recover lost funds. However, where the First Party agrees to facilitate the Second Party in such investigations, the First Party shall not be liable to the Second Party or responsible for any financial or non-financial (whether direct or indirect) Losses or any other consequences of such fraud.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    4. The onus is on the Second Party to review all security controls provided or suggested by the First Party and to determine if such security controls are sufficient or appropriate for its purposes and, where appropriate, independently implement other security procedures and controls not provided by the First Party. The First Party does not represent, warrant, or guarantee that the Second Party or any End-User will never become victims of fraud.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    5. The Second Party agrees that it will immediately provide evidence of its compliance with Condition 5.1 to the First Party upon the request of the First Party. Failure to provide evidence of such compliance to the satisfaction of the First Party may result in the suspension of Services or termination of the Services Agreement.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    6. The First Party may provide the Second Party with subjective data regarding the possibility or likelihood that a transaction may be fraudulent, which will require action or review by the Second Party. The First Party may also incorporate action or inaction against the Second Party into any future subjective scoring when identifying future potential fraud. However, the Second Party acknowledges and agrees that it is solely responsible for any action(s) that it may choose to take (or otherwise) in relation to such data and for providing inaccurate or incorrect information to the First Party. The First Party does not represent, warrant, or guarantee that such subjective data will be accurate in detecting fraud in all instances and shall not be liable for any Losses incurred in respect of any fraudulent transaction undetected by the subjective data provided to the Second Party.
                                </p>
                                <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                    7. The First Party may provide or suggest best practices for implementation to help prevent losses and ensure the smoothest experience. The Second Party agrees to review all the best practices that the First Party suggests, choose those that are appropriate for the Second Party&apos;s business, and independently implement other security procedures and controls not provided by the First Party.
                                </p>
                            </div>
                        </div>
                        <div id="license-and-intellectual-property"> {/* Add id for navigation */}
                            <h2 className="text-3xl font-bold">License and Intellectual Property</h2> {/* Section title */}
                            <p className="mt-6 text-lg text-muted-foreground"> {/* Section content */}
                                1. Grant of License
                                <br />
                                Subject to the terms of these Conditions, the First Party hereby grants to the Second Party, and the Second Party hereby accepts from the First Party, a personal, limited, non-exclusive, non-transferable license and right to use the First Party&apos;s API and accompanying Services Documentation for the following purposes:
                                <br /><br />
                                a. Install and use the API on as many machines as reasonably necessary (which machines are and shall be maintained in facilities owned, occupied, or leased by the Second Party) to use the Services for the purpose of conducting transactions with the End-Users.
                                <br /><br />
                                b. Use the accompanying Services Documentation solely for the purpose of using the APIs and Services.
                                <br /><br />
                                c. Create any necessary number of copies of the API and Services Documentation, with all copyright notices intact, for archival purposes only.
                            </p>
                            <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                2. Advertising Materials License
                                <br />
                                Subject to the terms of these Conditions, the First Party hereby grants the Second Party a limited, non-exclusive, non-transferable royalty-free license to use the First Party&apos;s trademarks and service marks (collectively the &quot;Advertising Materials&quot;). Provided that the Second Party agrees to change, at the Second Party&apos;s expense, any Advertising Materials which the First Party, in its sole judgment, determines to be inaccurate, objectionable, misleading, or a misuse of the First Party&apos;s trademarks and/or service marks. The Second Party, upon written demand by the First Party, shall immediately cease the use of any Advertising Materials that the First Party deems to be in violation of this Clause 9.2. Notwithstanding any provision in these Conditions to the contrary, such license shall be revoked immediately and automatically upon termination of the Services Agreement. The Second Party will not add to, delete from, or modify any Advertising Materials, Services Documentation, or forms provided by the First Party without the prior written consent of the First Party.
                            </p>
                            <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                3. Intellectual Property Rights
                                <br />
                                The Second Party acknowledges and agrees that except for the rights and licenses expressly granted to the Second Party in these Conditions, as between the Second Party and the First Party, the First Party shall retain all right, title, and interest in and to the Services, APIs, Services Documentation, and any derivatives of the foregoing (the &quot;First Party IP&quot;); and, nothing contained in the Services Agreement or these Conditions shall be construed as conferring upon the Second Party by implication, operation of law, estoppel, or otherwise, any other license or right. The Second Party shall not:
                                <br /><br />
                                <div className="ml-6"> {/* Add left margin */}
                                    a. Use, reproduce, distribute, or permit others to use, reproduce, or distribute any of the First Party IP for any purpose other than as specified in these Conditions.
                                    <br /><br />
                                    b. Make the First Party IP available to unauthorized third parties.
                                    <br /><br />
                                    c. Rent, electronically distribute, timeshare, or market the First Party IP by interactive cable, remote processing services, service bureau, or otherwise.
                                    <br /><br />
                                    d. Directly or indirectly modify, reverse engineer, decompile, disassemble, or derive source code from any of the First Party IP.
                                    <br /><br />
                                </div>
                            </p>
                            <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                4. Use of Second Party’s Name and Logo
                                <br />
                                The Second Party acknowledges and agrees to give the First Party permission to use the Second Party’s name, logo, and trademark on the First Party’s website for any lawful purposes, including marketing purposes.
                            </p>
                        </div>
                        <div id="representations-and-warranties"> {/* Add id for navigation */}
                            <h2 className="text-3xl font-bold mt-6">Representations and Warranties</h2> {/* Section title with added margin */}
                            <p className="mt-6 text-lg text-muted-foreground"> {/* Section content */}
                                1. First Party&apos;s Representations and Warranties
                                <br /><br />
                                <div className="ml-6"> {/* Add left margin */}
                                    a. The Services and APIs provided to the Second Party hereunder will conform to the specifications set forth in the applicable Services Documentation, as may be amended from time to time at the First Party&apos;s sole and absolute discretion, and in the Service Agreement.
                                    <br /><br />
                                    b. The First Party further represents and warrants that the First Party will maintain compliance with all applicable laws, rules, and regulations and (where applicable) card company rules governing the security of End-User data, including, without limitation, the Payment Card Industry Data Security Standard.
                                    <br /><br />
                                    c. The preceding warranties will not apply if:
                                    <br /><br />
                                    <div className="ml-9"> {/* Add left margin */}
                                        i. Any products, services, or deliverables provided hereunder are used in material variation with the Services Agreement, these Conditions, or the applicable documentation.
                                        <br /><br />
                                        ii. Any products, services, or deliverables licensed hereunder or any part thereof have been modified without the prior written consent of the First Party.
                                        <br /><br />
                                        iii. A defect in any products, services, or deliverables provided hereunder has been caused by any of the Second Party&apos;s malfunctioning equipment or third-party software.
                                        <br /><br />
                                    </div>
                                    d. In the event that the Second Party discovers that any products, services, or deliverables are not in conformance with the representations and warranties set forth in Condition 7.1(a) and Condition 7.1(b) and reports such non-conformity to the First Party, the First Party will, at the First Party&apos;s discretion,
                                    <br /><br />
                                    <div className="ml-9"> {/* Add left margin */}
                                        i. Exercise commercially reasonable efforts to correct the non-conformity at no additional charge to the Second Party, or
                                        <br /><br />
                                        ii. Refund the fees paid for the non-conforming products, services, or deliverables during the ninety (90) day period preceding the Second Party&apos;s notification to the First Party of such non-conformity. The remedy stated in this paragraph constitutes the Second Party&apos;s sole and exclusive remedy and the First Party&apos;s entire liability under Condition 7.1(a) and Condition 7.1(b).
                                        <br /><br />
                                    </div>
                                    e. The First Party represents and warrants that it will not use or disclose unique, non-public End-User data submitted by the Second Party except as reasonably necessary:
                                    <br /><br />
                                    <div className="ml-9"> {/* Add left margin */}
                                        i. To provide the Services to the Second Party hereunder,
                                        <br /><br />
                                        ii. Where applicable, to provide fraud screen services generally without disclosing personally identifiable End-User information, or,
                                        <br /><br />
                                        iii. As otherwise permitted or required by law.
                                        <br /><br />
                                    </div>
                                </div>
                            </p>
                            <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                                2. Second Party&apos;s Representations and Warranties
                                <br /><br />
                                <div className="ml-6"> {/* Add left margin */}
                                    a. The Second Party represents and warrants that:
                                    <br /><br />
                                    <div className="ml-9"> {/* Add left margin */}
                                        i. It has all necessary right, power, and ability to execute the Services Agreement and to perform its obligations thereof (including but not limited to these Conditions).
                                        <br /><br />
                                        ii. No authorization or approval from any third party is required in connection with the Second Party&apos;s execution, delivery, or performance of the Services Agreement.
                                        <br /><br />
                                        iii. The Services Agreement constitutes a legal, valid, and binding obligation, enforceable against the Second Party in accordance with its terms, and does not breach any other agreement to which the Second Party is bound.
                                        <br /><br />
                                    </div>
                                    b. Its use of the Services is solely for the purpose of legitimate transactions and business activities in compliance with all applicable laws, rules, and regulations.
                                    <br /><br />
                                    c. It does and will comply with all applicable laws, rules, and regulations.
                                    <br /><br />
                                    b. The Second Party further represents and warrants that its installation, configuration, and use of the Services and the APIs shall conform to the specifications set forth in the applicable Services Documentation and the terms of the Services Agreement and, in particular (where applicable), the specifications set forth in the services documentation or any other terms and conditions by any of the third-party licensors of the First Party, as shall be stipulated by the First Party and which are incorporated herein by this reference.
                                    <br /><br />
                                    c. The Second Party further represents and warrants that, prior to transmitting End-User information to the First Party, it will provide all reasonably necessary disclosures and/or obtain all reasonably necessary consents from each End-User regarding the intended disclosures and uses of the End-User data.
                                    <br /><br />
                                    d. The Second Party further represents and warrants that:
                                    <br /><br />
                                    <div className="ml-9"> {/* Add left margin */}
                                        i. It has all necessary rights and authorizations to sell or distribute products or services for which the Second Party is using the Services.
                                        <br /><br />
                                        ii. The Second Party does and will comply with all applicable laws and regulations as related to its use of the Services.
                                        <br /><br />
                                        iii. None of its products infringe or violate the Intellectual Property rights of any third party and do not and will not contain any content which violates any applicable law, regulation, or third-party right.
                                        <br /><br />
                                    </div>
                                    e. The Second Party represents and warrants that it complies with all applicable laws and restrictions and that none of its products or services are exported or imported from, and that it has not engaged in and is not now engaging in any dealings with:
                                    <br /><br />
                                    <div className="ml-9"> {/* Add left margin */}
                                        i. Any country or any person, national, or company belonging to any country to which the U.N. imposes product embargo and/or international sanction list such as US Consolidated Sanction, OFAC Specially Designated Nationals, EU Financial Sanctions, UK Financial Sanctions, Interpol Wanted List, and other applicable sanction lists.
                                        <br /><br />
                                        ii. Any country or any person, national, or company that is on the FATF blacklist.
                                        <br /><br />
                                    </div>
                                    f. The Second Party further represents and warrants that it has not engaged in and is not now engaging in any action in furtherance of an offer, payment, promise to pay, or authorization or approval of the payment or giving of money, property, gifts, or anything else of value, directly or indirectly, to any &quot;government official&quot; (including any officer or employee of a government or government-owned or controlled entity or of a public international organization, or any person acting in an official capacity for or on behalf of any of the foregoing, or any political party or party official or candidate for political office) to influence official action or secure an improper advantage; and the Second Party is conducting its business in compliance with the applicable anti-corruption anti-bribery laws.
                                    <br /><br />
                                    g. The Second Party represents and warrants that the operations of the Second Party are and have been conducted at all times in compliance with applicable financial record-keeping and reporting requirements and anti-money laundering and counter-terrorism financing laws and regulations in the Republic of Côte d&apos;Ivoire and all other jurisdictions in which the Second Party conducts business or operations, the rules and regulations thereunder and any related or similar rules, regulations, or guidelines, issued, administered, or enforced by any governmental agency or proceeding by or before any court or governmental agency (collectively, &quot;Anti-Money Laundering Laws&quot;) and no action, suit, or proceeding with respect to Anti-Money Laundering Laws involving the Second Party is pending before any court or governmental agency, authority, or body or any arbitrator.
                                    <br /><br />
                                    h. The Second Party represents and warrants that any goods or services that are sold or rendered by the Second Party and its Merchants to end-users shall be delivered or rendered accordingly based on its promises to the end-user and that the Second Party shall not hold the First Party and its Affiliates responsible nor liable for its relationship with the end-user.
                                    <br /><br />
                                </div>
                            </p>
                        </div>
                    </div>
                    <div id="license-and-intellectual-property"> {/* Add id for navigation */}
                        <h2 className="text-3xl font-bold  mt-6">License and Intellectual Property</h2> {/* Section title */}
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Section content */}
                            1. Grant of License
                            <br />
                            Subject to the terms of these Conditions, the First Party hereby grants to the Second Party, and the Second Party hereby accepts from the First Party, a personal, limited, non-exclusive, non-transferable license and right to use the First Party&apos;s API and accompanying Services Documentation for the following purposes:
                            <br /><br />
                            <div className="ml-6"> {/* Add left margin */}
                                a. Install and use the API on as many machines as reasonably necessary (which machines are and shall be maintained in facilities owned, occupied, or leased by the Second Party) to use the Services for the purpose of conducting transactions with the End-Users.
                                <br /><br />
                                b. Use the accompanying Services Documentation solely for the purpose of using the APIs and Services.
                                <br /><br />
                                c. Create any necessary number of copies of the API and Services Documentation, with all copyright notices intact, for archival purposes only.
                                <br /><br />
                            </div>
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground">
                            2. Advertising Materials License
                            <br />
                            Subject to the terms of these Conditions, the First Party hereby grants the Second Party a limited, non-exclusive, non-transferable royalty-free license to use the First Party&apos;s trademarks and service marks (collectively the &quot;Advertising Materials&quot;). Provided that the Second Party agrees to change, at the Second Party&apos;s expense, any Advertising Materials which the First Party, in its sole judgment, determines to be inaccurate, objectionable, misleading, or a misuse of the First Party&apos;s trademarks and/or service marks. The Second Party, upon written demand by the First Party, shall immediately cease the use of any Advertising Materials that the First Party deems to be in violation of this Clause 9.2. Notwithstanding any provision in these Conditions to the contrary, such license shall be revoked immediately and automatically upon termination of the Services Agreement. The Second Party will not add to, delete from, or modify any Advertising Materials, Services Documentation, or forms provided by the First Party without the prior written consent of the First Party.
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground">
                            3. Intellectual Property Rights
                            <br />
                            The Second Party acknowledges and agrees that except for the rights and licenses expressly granted to the Second Party in these Conditions, as between the Second Party and the First Party, the First Party shall retain all right, title, and interest in and to the Services, APIs, Services Documentation, and any derivatives of the foregoing (the &quot;First Party IP&quot;); and, nothing contained in the Services Agreement or these Conditions shall be construed as conferring upon the Second Party by implication, operation of law, estoppel, or otherwise, any other license or right. The Second Party shall not:
                            <br /><br />
                            a. Use, reproduce, distribute, or permit others to use, reproduce, or distribute any of the First Party IP for any purpose other than as specified in these Conditions.
                            <br /><br />
                            b. Make the First Party IP available to unauthorized third parties.
                            <br /><br />
                            c. Rent, electronically distribute, timeshare, or market the First Party IP by interactive cable, remote processing services, service bureau, or otherwise.
                            <br /><br />
                            d. Directly or indirectly modify, reverse engineer, decompile, disassemble, or derive source code from any of the First Party IP.
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground">
                            4. Use of Second Party&apos;s Name and Logo
                            <br />
                            The Second Party acknowledges and agrees to give the First Party permission to use the Second Party&apos;s name, logo, and trademark on the First Party&apos;s website for any lawful purposes, including marketing purposes.
                        </p>
                    </div>
                    <div id="restricted-activities"> {/* Add id for navigation */}
                        <h2 className="text-3xl font-bold mt-12">Restricted Activities</h2> {/* Section title */}
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Section content */}
                            The Second Party acknowledges that the First Party is prohibited from engaging in or providing services in activities restricted under Ivoirian laws, including Unlawful Activities as defined under the Anti-Money Laundering laws, as amended, and its Implementing Rules and Regulations (“Restricted Activities”). The list of Restricted Activities may change from time to time due to changes in regulations. Thus, the Second Party acknowledges that the First Party may unilaterally change, revise, or modify the list of Restricted Activities below without prior notification to the Second Party. The list below is representative but not exhaustive. If the Second Party is uncertain as to whether its business is classified as a Restricted Activity or has questions about how these requirements apply, please contact us.
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                            The Second Party legally acknowledges and confirms its consent and agrees that it will not use the Service to accept or disburse payments in connection with any of the Restricted Activities including but not limited to:
                        </p>
                    </div>
                    <div id="disclaimers"> {/* Add id for navigation */}
                        <h2 className="text-3xl font-bold mt-12">Disclaimers</h2> {/* Section title */}
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Section content */}
                            Except as expressly set forth in the Services Agreement or these Conditions, the products and services provided hereunder are provided &quot;as is&quot; with all faults and without any representations or warranties. The entire risk as to satisfactory quality, performance, accuracy, and effort is with the Second Party. This disclaimer of warranty extends to the End-User and users of the End-User&apos;s products and services, is in lieu of all warranties and conditions whether express, implied, or statutory, and the First Party hereby specifically excludes, to the fullest extent permitted by law, any representations, conditions or warranties, express or implied, regarding any of its products or services, including the implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement with respect to the products and services, and any implied warranties arising from the course of dealing or course of performance.
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                            The Second Party acknowledges that the First Party is regulated by the Bangko Sentral ng Pilipinas. To such extent recognized and allowed under existing regulations, each of the First Party and its Affiliates is not responsible for the action or inaction of any third party, including but not limited to:
                            <br /><br />
                            <div className="ml-6"> {/* Add left margin */}
                                a. The operation of the websites of internet service providers (&quot;ISPs&quot;), banks, financial processors, or other financial institutions.
                                <br /><br />
                                b. The availability or the operation of the operating systems of ISPs, banks, financial processors, or other financial institutions, and shall not be liable for any direct or indirect financial or non-financial Losses or any other consequences suffered or incurred by the Second Party in respect of any errors, omissions, failure, delay, or breakdown of any ISPs, banks, financial processors, or financial institutions.
                                <br /><br />
                            </div>
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                            The Second Party acknowledges and affirms that the First Party shall not be responsible for recognizing any particular purchase, sale, donation, order, or other transaction (each a &quot;Transaction&quot;) with respect to whether it is accurate or correct, or typical for the business of the Second Party. The Second Party shall be solely responsible for recognizing whether a Transaction initiated by an End-User is erroneous or suspicious (including, but not limited to, unusual or large purchases, or an atypical request for delivery to a foreign country). The Second Party acknowledges and agrees that it shall make reasonable checks on Transactions that appear suspicious and/or erroneous and, if necessary, contact an End-User in relation to such suspicious or erroneous Transaction before fulfilling or completing the Transaction. The Second Party is solely responsible for any Losses directly or indirectly incurred due to erroneous or fraudulent Transactions in connection with its use of the Services, and the First Party shall not have any responsibility or liability in respect of the same whatsoever.
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                            The Second Party shall only use the Services for legitimate transactions with its End-Users. The Second Party shall be responsible for its relationship with its End-Users, and the First Party and its Affiliates shall not be responsible or liable in any manner whatsoever for the products or services publicized or sold by the Second Party, or purchased by the End-Users from the Second Party using the Services; or if the Second Party accepts donations, for the Second Party’s communication to its End-Users of the intended use of such donations. The Second Party acknowledges and affirms that it is solely responsible for the nature and quality of the products or services provided by it, and for delivery, support, refunds, returns, and for any other ancillary services provided by it to its End-Users, and that the First Party and its Affiliates shall not have any responsibility or liability in respect of the same whatsoever. The First Party reserves the right to terminate the Services and the Services Agreement immediately upon reasonable suspicion that the Second Party is engaged in any illegitimate transaction(s) with its End-Users and/or illegitimate business and shall not be responsible or liable for any Losses incurred in respect thereof or in connection therewith by any person (including, without limitation, the Second Party and/or any End-User) whatsoever.
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                            The Second Party understands and agrees (i) that neither the First Party nor its third-party licensors can guarantee the accuracy of tax rates obtained from taxing authorities, and (ii) that the Second Party bears the ultimate responsibility for the proper payment of taxes applicable to Second Party&apos;s sale of its products or services.
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                            For the avoidance of doubt, the First Party does not make any representation, warranty, or guarantee in respect of the quality, authenticity, fitness, nor any other statement in relation to the nature whatsoever, of the goods or services delivered or rendered by the Second Party, and shall not be responsible or liable for any claims in respect thereof or in connection therewith by any person (including, without limitation, any End-User) whatsoever.
                        </p>
                    </div>
                    <div id="indemnification-and-liability"> {/* Add id for navigation */}
                        <h2 className="text-3xl font-bold mt-12">Indemnification and Liability</h2> {/* Section title */}
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Section content */}
                            1. The First Party shall defend, hold harmless, and indemnify, at its expense, the Second Party, its affiliates, and each of their respective officers, directors, employees, and the successors and assigns of the foregoing (each, a &quot;Second Party Indemnified Party&quot;) against any third-party legal cause of action, claim, suit, proceeding, or regulatory action brought against the Second Party Indemnified Party and any related Losses (including reasonable fees and expenses of legal and other advisers, court costs, and other dispute resolution costs) suffered or incurred by the Second Party Indemnified Party, to the extent that such cause of action is based upon a claim that any services or products of the First Party infringe a copyright, patent, trade secret, or other intellectual property rights of a third party. Should any of the First Party&apos;s products or services become, or in the First Party&apos;s reasonable opinion is highly likely to become, the subject of a claim of intellectual property infringement, the First Party may, at its option:
                            <br /><br />
                            <div className="ml-6"> {/* Add left margin */}
                                a. Obtain the right for the Second Party and its Customers to continue using the products or services.
                                <br /><br />
                                b. Replace or modify the First Party&apos;s products and services so it is no longer infringing or reduces the likelihood that it will be determined to be infringing.
                                <br /><br />
                                c. If neither of the foregoing options is commercially reasonable, terminate the Service Agreement.
                                <br /><br />
                            </div>
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                            2. The Second Party shall defend, hold harmless, and indemnify, at its own expense, the First Party, its affiliates, and each of their respective directors, officers, employees, and representatives, and the successors and assigns of the foregoing (each, a &quot;First Party Indemnified Party&quot;) against any third-party legal cause of action, claim, suit, proceeding, or regulatory action brought against the First Party Indemnified Party and any related Losses, damages, liability, costs, and expenses (including reasonable fees and expenses of legal and other advisers, court costs, and other dispute resolution costs) suffered or incurred by the First Party Indemnified Party, to the extent that such cause of action is based on or arising from:
                            <br /><br />
                            <div className="ml-6"> {/* Add left margin */}
                                a. Any services or products of the Second Party that infringe a copyright, patent, trade secret, or other intellectual property rights of a third party.
                                <br /><br />
                                b. A breach by the Second Party of any of the terms, conditions, representations, and warranties set forth in the Services Agreement and these Conditions.
                                <br /><br />
                                c. The Second Party&apos;s or an End-User&apos;s use of the Services that are inconsistent with any of the terms of the Services Agreement or these Conditions or that violate any data protection laws, Network Rules, or any other applicable law, rule, or regulation.
                                <br /><br />
                            </div>
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                            3. The Party from whom indemnification is being sought (the &quot;Indemnifying Party&quot;) will indemnify the Party seeking indemnification (the &quot;Indemnified Party&quot;) from a claim provided that the Indemnified Party notifies the Indemnifying Party in writing promptly and in any event not later than three (3) business days after the Indemnified Party becomes aware of such claim (provided that the failure to so notify shall not affect the Indemnified Party&apos;s rights to indemnification hereunder unless, and then only to the extent that, the Indemnifying Party has been actually prejudiced thereby). The Indemnifying Party may not agree to any settlement that involves injunctive or equitable relief affecting the Indemnified Party or admission of liability by the Indemnified Party without obtaining the Indemnified Party&apos;s prior written consent.
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                            4. The First Party shall have no liability to the Second Party for any claim based on:
                            <br /><br />
                            <div className="ml-6"> {/* Add left margin */}
                                a. Any and all Losses incurred by the Second Party in respect of the products or services of the First Party which have been modified by parties other than the First Party.
                                <br /><br />
                                b. Any and all Losses incurred by the Second Party in respect of the Second Party&apos;s use of the First Party&apos;s products or services in conjunction with data where use of such data gave rise to an infringement claim.
                                <br /><br />
                                c. Any and all Losses incurred by the Second Party in respect of any failure of the Second Party to install upgrades or patches provided by the First Party where such upgrade or patch would have avoided such Losses.
                                <br /><br />
                                d. Any and all Losses incurred by the Second Party in respect of the Second Party&apos;s use of the First Party&apos;s products or services in a manner inconsistent with the Services Documentation provided with such products or services.
                                <br /><br />
                                e. The Second Party&apos;s use of the First Party&apos;s products or services with software or hardware not authorized by the First Party, where use with such other software or hardware gave rise to the Losses incurred by the Second Party.
                                <br /><br />
                                f. Any and all Losses incurred by the Second Party in relation to any absence of any license or permit in respect of the business activities and operations of the Second Party.
                                <br /><br />
                                g. Any and all Losses incurred by the Second Party in relation to any claim related to any infringement of any intellectual property committed by the Second Party.
                                <br /><br />
                            </div>
                            <div className="ml-6"> {/* Add left margin */}
                                h. Any other Losses, fines, penalties, claims (including, inter alia, legal and professional adviser costs), and damages suffered or incurred by the Second Party as a result of any tort (including, inter alia, negligence and misrepresentation), breach of statutory duty, fraud, fraudulent misrepresentation, willful damage to property or person, or any other willful or unlawful misconduct, in each case, attributable to or caused by the Second Party or any of its employees, directors, officers, representatives, agents, or affiliates.
                                <br /><br />
                                i. Failure to comply with Condition 5.7, in which the Second Party disables or fails to properly follow best practice suggestions by the First Party, which will increase the likelihood of fraud, losses, and other similar occurrences, unless such losses result from the First Party’s willful or intentional actions.
                                <br /><br />
                                j. Failure to comply with Condition 7.2 (h), in which the Second Party and/or its Merchants purposefully or negligently fail to send or render goods or services as promised to the end-user.
                                <br /><br />
                            </div>
                            5. Under no circumstances shall the First Party nor any of its third-party licensors be liable to the Second Party for indirect, incidental, consequential, special, or exemplary damages or Losses suffered or incurred (even if the First Party or any of its third-party licensors have been advised of the possibility of such damages and regardless whether each of them knew or had reason to know of the possibility of the loss, injury, or damage in question), such as, but not limited to, loss of revenue, profits, goodwill or business, anticipated savings, loss of reputation, costs of delay, costs of lost or damaged data or documentation, or such party&apos;s liabilities to third parties of any nature arising from any source.
                            <br /><br />
                            The entire liability of the First Party or any of its third-party licensors to the Second Party with respect to the Services Agreement or any subject matter thereof, these Conditions, or the Services under any contract, tort, negligence, strict liability, or other legal or equitable theory, shall not exceed the fees paid or payable to the First Party by the Second Party under the Services Agreement or (in the case of a dispute involving a third-party licensor of the First Party) the fees paid or payable to such third-party licensor during the six (6)-month period immediately prior to the date the cause of action arose.
                            <br /><br />
                            6. The exclusions and limitations of this Condition 12 do not apply to obligations hereunder regarding indemnification for infringement of third-party intellectual property rights by the Second Party or for liability arising from the bodily injury or death of a person by any Party.
                        </p>
                    </div>
                    <div id="confidential-information"> {/* Add id for navigation */}
                        <h2 className="text-3xl font-bold mt-12">Confidential Information</h2> {/* Section title */}
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Section content */}
                            1. Each Party (the &quot;Receiving Party&quot;) hereby agrees:
                            <br /><br />
                            <div className="ml-6"> {/* Add left margin */}
                                a. To hold the other Party&apos;s (the &quot;Disclosing Party&quot;) Confidential Information in strict confidence and to take reasonable precautions to protect such Confidential Information (including, without limitation, all precautions the Receiving Party employs with respect to its own confidential materials).
                                <br /><br />
                                b. Not to divulge any such Confidential Information or any information derived therefrom to any third party except as is strictly necessary to provide or use the Services.
                                <br /><br />
                                c. Not to make any use whatsoever at any time of such Confidential Information except as contemplated hereunder.
                                <br /><br />
                                d. That any employee or third party given access to any such Confidential Information must have a legitimate &quot;need to know&quot; and shall be bound in writing to comply with the Receiving Party&apos;s confidentiality obligations, whether generally or specific to the Services Agreement or these Conditions.
                                <br /><br />
                            </div>
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                            2. Except as otherwise provided in the Services Agreement or these Conditions, within thirty (30) calendar days of termination of the Services Agreement, the Receiving Party shall destroy all materials that constitute Confidential Information and/or Intellectual Property of the Disclosing Party and provide to the Disclosing Party written certification signed by an authorized officer or representative of the Receiving Party that all such information was so destroyed. Notwithstanding the foregoing, each party may retain Confidential Information that is:
                            <br /><br />
                            a. Stored on archival or back-up files, or
                            <br /><br />
                            b. Required for compliance with applicable law, card company rules, or its obligations pursuant to the Services Agreement (including these Conditions), provided that such party continues to maintain confidentiality of such Confidential Information pursuant to the terms of the Services Agreement and these Conditions.
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                            3. Notwithstanding any provision in the Services Agreement or these Conditions to the contrary, each Party may disclose Confidential Information of the other Party to the extent it is required to be disclosed pursuant to a valid order or requirement of a governmental agency or court of competent jurisdiction, provided that the owner of the Confidential Information shall be given reasonable notice of the pendency of such an order or requirement and the opportunity to contest it.
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                            4. For the avoidance of doubt and notwithstanding the foregoing, either Party shall be entitled to disclose the existence of the relationship formed hereunder between the First Party and the Second Party and may include the name, trade name, trademark, or symbol of the other Party in its publicity materials without the prior written consent of the other Party.
                        </p>
                    </div>
                    <div id="miscellaneous"> {/* Add id for navigation */}
                        <h2 className="text-3xl font-bold mt-12">Miscellaneous</h2> {/* Section title */}
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Section content */}
                            1. The Parties shall perform all of their duties under the Services Agreement (including these Conditions) as independent contractors. Nothing in the Services Agreement shall be construed to give either Party the power to direct or control the daily activities of the other Party, or to constitute the Parties as principal and agent, employer and employee, franchiser and franchisee, partners, joint capital venturers, co-owners, or otherwise as participants in a joint undertaking. The Parties understand and agree that, except as specifically provided in the Services Agreement, neither Party grants the other Party the power or authority to make or give any agreement, statement, representation, warranty, or other commitment on behalf of the other Party, or to enter into any contract or otherwise incur any liability or obligation, express or implied, on behalf of the other Party, or to transfer, release, or waive any right, title, or interest of such other Party.
                        </p>
                        <p className="mt-6 text-lg text-muted-foreground"> {/* Increased font size and margin */}
                            2. In performing any of the Services under the Services Agreement and these Conditions, from time to time, to the extent permitted under the law, the Second Party hereby agrees to authorize the First Party, at the First Party&apos;s sole discretion, to delegate any of its duties and obligations hereunder to any of its Affiliates and/or trusted third parties. For the avoidance of doubt, should the First Party choose to exercise its rights in Condition 15.2, the First Party shall not be considered in breach of Conditions 11 for failure or delay in notifying the Second Party of such intention.
                        </p>
                    </div>
                </main>
            </div>
            <ScrollToTop />
            <Footer />
        </>
    );
};

export default Terms;