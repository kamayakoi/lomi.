import { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useTranslation } from 'react-i18next';

import '@/lib/styles/home.css';

const Integrations = () => {
    const [expandedStates, setExpandedStates] = useState<boolean[]>([false, false, true]);
    const { t } = useTranslation();

    const toggleExpand = (index: number) => {
        setExpandedStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = !newStates[index];
            return newStates;
        });
    };

    const integrationOptions = [
        {
            title: t('integrations.fullAPI.title'),
            description: t('integrations.fullAPI.description'),
            details: t('integrations.fullAPI.details'),
            link: "https://developers.lomi.africa/"
        },
        {
            title: t('integrations.lowCode.title'),
            description: t('integrations.lowCode.description'),
            details: t('integrations.lowCode.details'),
            link: "mailto:hello@lomi.africa"
        },
        {
            title: t('integrations.noCode.title'),
            description: t('integrations.noCode.description'),
            details: t('integrations.noCode.details'),
            link: "/sign-up",
            linkText: t('integrations.noCode.linkText')
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background dark:bg-background font-poppins">
            <Navbar />
            <div className="h-24"></div>
            <div className="flex flex-1 flex-col items-center p-4 md:p-8 bg-background dark:bg-background border-b border-gray-300 dark:border-gray-700">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground dark:text-foreground">
                            {t('integrations.title')}
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground dark:text-muted-foreground">
                            {t('integrations.description')}
                        </p>
                    </div>
                    <div className="space-y-12 w-full max-w-3xl mx-auto">
                        {integrationOptions.map((option, index) => (
                            <div
                                key={index}
                                className={`p-12 bg-[#F8F9FB] dark:bg-[#0D0D15] rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${expandedStates[index] ? 'md:col-span-3' : ''}`}
                            >
                                <button
                                    className="w-full text-left focus:outline-none"
                                    onClick={() => toggleExpand(index)}
                                >
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-3xl font-semibold text-card-foreground dark:text-card-foreground">{option.title}</h2>
                                        <span className="text-3xl text-muted-foreground dark:text-muted-foreground">
                                            {expandedStates[index] ? '×' : '+'}
                                        </span>
                                    </div>
                                </button>
                                {expandedStates[index] && (
                                    <div className="mt-6 text-left">
                                        <p className="text-muted-foreground dark:text-muted-foreground" dangerouslySetInnerHTML={{ __html: option.description }}></p>
                                        <p className="mt-4 text-muted-foreground dark:text-muted-foreground" dangerouslySetInnerHTML={{ __html: option.details }}></p>
                                        <a href={option.link} className="text-blue-600 dark:text-blue-400 font-semibold mt-6 inline-block">
                                            {option.linkText || (option.link.includes('mailto') ? 'Contact us to learn more →' : 'Explore our developer docs →')}
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
