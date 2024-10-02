import { useState } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import './home/home.css'; // Import the home.css file

const integrationOptions = [
    {
        title: "Full API",
        description: "<strong>Looking for a full API integration for a seamless user experience?</strong>",
        details: "It takes only a few lines of code to integrate our front-end module into your B2B platform.<br><br>Customize our product to fit your website and branding, and provide a fully integrated experience to your buyers.",
        link: "https://developers.lomi.africa/"
    },
    {
        title: "Low Code",
        description: "<strong>Not ready for a full integration? Learn about our low-code option.</strong>",
        details: "No front-end java script code needed. Our low-code solution lets you get started quickly with minimal coding. Perfect for small businesses or those with limited tech resources. You can direct buyers to our hosted checkout page for payment.<br><br>Customize the interface to fit your brand and start accepting payments swiftly. This option is great for a quick start to all lomi. has to offer.",
        link: "mailto:hello@lomi.africa"
    },
    {
        title: "No Code",
        description: "<strong>No developers? No problem. Use our no-code option to get started today.</strong>",
        details: "Easily create a one-time payment link from your lomi.'s dashboard and send it to your buyer for payment. Buyers will select their payment terms and method using the generated order URL.<br><br>No integration necessary!",
        link: "mailto:hello@lomi.africa"
    }
];

const Integrations = () => {
    const [expandedIndices, setExpandedIndices] = useState<number[]>([2]);

    const toggleExpand = (index: number) => {
        setExpandedIndices((prevIndices) =>
            prevIndices.includes(index)
                ? prevIndices.filter((i) => i !== index)
                : [...prevIndices, index]
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-background dark:bg-background font-poppins">
            <Navbar />
            <div className="h-24"></div>
            <div className="flex flex-1 flex-col items-center p-4 md:p-8 bg-background dark:bg-background border-b border-gray-300 dark:border-gray-700">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground dark:text-foreground">Integration made easy</h2>
                        <p className="mt-4 text-lg text-muted-foreground dark:text-muted-foreground">Choose the integration option that best suits your needs</p>
                    </div>
                    <div className="space-y-12 w-full max-w-3xl mx-auto">
                        {integrationOptions.map((option, index) => (
                            <div
                                key={index}
                                className="p-12 bg-[#F8F9FB] dark:bg-[#0D0D15] rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 transition-transform transform hover:scale-105 hover:shadow-2xl"
                            >
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleExpand(index)}
                                >
                                    <h2 className="text-3xl font-semibold text-card-foreground dark:text-card-foreground">{option.title}</h2>
                                    <button className="text-3xl text-muted-foreground dark:text-muted-foreground">{expandedIndices.includes(index) ? '×' : '+'}</button>
                                </div>
                                {expandedIndices.includes(index) && (
                                    <div className="mt-6 text-left">
                                        <p className="text-muted-foreground dark:text-muted-foreground" dangerouslySetInnerHTML={{ __html: option.description }}></p>
                                        <p className="mt-4 text-muted-foreground dark:text-muted-foreground" dangerouslySetInnerHTML={{ __html: option.details }}></p>
                                        <a href={option.link} className="text-blue-500 dark:text-blue-400 font-semibold mt-6 inline-block">
                                            {option.link.includes('mailto') ? 'Contact us to learn more →' : 'Explore our developer docs →'}
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Add border-b to create a line after the last section */}
            <Footer />
        </div>
    );
};

export default Integrations;