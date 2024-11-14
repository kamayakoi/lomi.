import { NavbarAbout } from '@/components/landing/Navbar-About';
import { Link } from 'react-router-dom';
import PulsatingButton from '@/components/ui/pulsating-button';
import { useTranslation } from 'react-i18next';
import { FooterAbout } from '@/components/landing/Footer-About';

const About = () => {
    const { t } = useTranslation();

    return (
        <div className="relative w-full min-h-screen bg-gray-900 overflow-hidden">
            <div className="min-h-screen pb-20">
                <NavbarAbout />
                <div className="h-(-10)"></div>

                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{
                        backgroundImage: 'url("/transition-star.webp")',
                        backgroundPosition: '55% 12%',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                ></div>
                <div className="relative z-10">
                    {/* Hero Section */}
                    <section className="w-full h-[1100px] flex flex-col justify-center items-center px-4 md:px-6">
                        <p className="text-5xl tracking-tighter sm:text-6xl md:text-6xl lg:text-5xl text-center text-white mt-[-295px] mx-auto max-w-6xl font-bold">
                            {t('about.mission')}
                        </p>
                    </section>

                    {/* Our Story Section */}
                    <section className="w-full py-12 md:py-24 lg:py-32">
                        <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6 text-white">{t('about.ourStory')}</h2>
                                <p className="text-gray-300 md:text-xl">
                                    {t('about.storyParagraph1')}
                                </p>
                                <p className="text-gray-300 md:text-xl">
                                    {t('about.storyParagraph2')}
                                </p>
                                <p className="text-gray-300 md:text-xl">
                                    {t('about.storyParagraph3')}
                                </p>
                                {/* Get Started Button */}
                                <div className="flex justify-center lg:justify-start">
                                    <Link to="/integrations">
                                        <PulsatingButton
                                            className="text-xl mt-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition-colors duration-300"
                                            pulseColor="#ff4d4d"
                                        >
                                            {t('about.getStarted')}
                                        </PulsatingButton>
                                    </Link>
                                </div>
                            </div>

                            {/* Our Values Section */}
                            <div className="space-y-4 mt-12 lg:mt-0 lg:ml-28">
                                <h2 className="text-4xl text-justify font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6 text-white">{t('about.ourValues')}</h2>
                                <div className="bg-transparent p-4 rounded-lg hover:bg-gray-800 transition-colors duration-300">
                                    <h3 className="text-lg font-semibold mt-0 text-white">
                                        {t('about.innovation')}
                                    </h3>
                                    <p className="text-gray-300 mt-1">
                                        {t('about.innovationDescription')}
                                    </p>
                                </div>
                                <div className="bg-transparent p-4 rounded-lg hover:bg-gray-800 transition-colors duration-300">
                                    <h3 className="text-lg font-semibold mt-0 text-white">
                                        {t('about.customerObsession')}
                                    </h3>
                                    <p className="text-gray-300 mt-1">
                                        {t('about.customerObsessionDescription')}
                                    </p>
                                </div>
                                <div className="bg-transparent p-4 rounded-lg hover:bg-gray-800 transition-colors duration-300">
                                    <h3 className="text-lg font-semibold mt-0 text-white">
                                        {t('about.integrity')}
                                    </h3>
                                    <p className="text-gray-300 mt-1">
                                        {t('about.integrityDescription')}
                                    </p>
                                </div>
                                <div className="bg-transparent p-4 rounded-lg hover:bg-gray-800 transition-colors duration-300">
                                    <h3 className="text-lg font-semibold mt-0 text-white">
                                        {t('about.speed')}
                                    </h3>
                                    <p className="text-gray-300 mt-1">
                                        {t('about.speedDescription')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <div className="relative z-20">
                <FooterAbout />
            </div>
        </div>
    );
};

export default About;
