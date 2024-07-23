import { useState } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

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
        link: "mailto:work@lomi.africa"
    },
    {
        title: "No Code",
        description: "<strong>No developers? No problem. Use our no-code option to get started today.</strong>",
        details: "Easily create a one-time payment link from your lomi.'s dashboard and send it to your buyer for payment. Buyers will select their payment terms and method using the generated order URL.<br><br>No integration necessary!",
        link: "mailto:work@lomi.africa"
    }
];

const Integrations = () => {
    const [expandedIndices, setExpandedIndices] = useState<number[]>([]);

    const toggleExpand = (index: number) => {
        setExpandedIndices((prevIndices) =>
            prevIndices.includes(index)
                ? prevIndices.filter((i) => i !== index)
                : [...prevIndices, index]
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-500 font-poppins">
            <Navbar />
            <div className="flex flex-1 flex-col items-center p-4 md:p-8 bg-gray-50 dark:bg-slate-400">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-gray-800 dark:text-black">Integration made easy</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-800">Choose the integration option that best suits your needs</p>
                    </div>
                    <div className="space-y-8 w-full max-w-4xl mx-auto">
                        {integrationOptions.map((option, index) => (
                            <div key={index} className="p-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 transition-transform transform hover:scale-105">
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleExpand(index)}
                                >
                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{option.title}</h2>
                                    <button className="text-3xl text-gray-600 dark:text-gray-400">{expandedIndices.includes(index) ? '×' : '+'}</button>
                                </div>
                                {expandedIndices.includes(index) && (
                                    <div className="mt-6 text-left">
                                        <p className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: option.description }}></p>
                                        <p className="mt-4 text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: option.details }}></p>
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
            <Footer />
        </div>
    );
};

export default Integrations;