import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import SystemOperational from "@/components/custom/system-operational";
import { AnotherIcon } from "./Icons";
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useTheme } from '@/lib/hooks/useTheme';
import GithubStarButton from "@/components/custom/github-star-button";

export const Footer = () => {
  const { t, i18n, changeLanguage } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const { theme, setTheme } = useTheme();

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'fr' : 'en';
    changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  return (
    <footer id="footer" className="bg-gray-100 dark:bg-[#06060A] py-10 w-full">
      <div className="container max-w-8xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 mb-16 px-4">
        {/* Logo Section */}
        <div className="col-span-1 md:col-span-12 ml-2 md:ml-0">
          {/* Add logo or any other content */}
        </div>

        {/* Company Section */}
        <div className="grid gap-2 col-span-1 sm:col-span-1 md:col-span-2 ml-2 md:ml-14">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
            {t('footer.company')}
          </h4>
          <nav className="grid gap-2">
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              {t('footer.solutions')}
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              {t('footer.caseStudies')}
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              {t('footer.customers')}
            </a>
            <a href="/about" className="hover:underline text-gray-600 dark:text-gray-300">
              {t('footer.aboutUs')}
            </a>
          </nav>
        </div>

        {/* Products Section */}
        <div className="grid gap-2 col-span-1 sm:col-span-1 md:col-span-2 ml-2 md:ml-14">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
            {t('footer.products')}
          </h4>
          <nav className="grid gap-2">
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              {t('footer.payments')}
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              {t('footer.subscriptions')}
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              {t('footer.checkout')}
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              {t('footer.payouts')}
            </a>
          </nav>
        </div>

        {/* Resources Section */}
        <div className="grid gap-2 col-span-1 sm:col-span-1 md:col-span-2 ml-2 md:ml-14">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
            {t('footer.resources')}
          </h4>
          <nav className="grid gap-2">
            <a href="https://developers.lomi.africa/" className="hover:underline text-gray-600 dark:text-gray-300">
              {t('footer.developers')}
            </a>
            <a href="https://developers.lomi.africa/api-documentation" className="hover:underline text-gray-600 dark:text-gray-300">
              {t('footer.recipes')}
            </a>
            <a href="mailto:hello@lomi.africa?subject=[Support] — Question" className="hover:underline text-gray-600 dark:text-gray-300">
              {t('footer.support')}
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              {t('footer.pricing')}
            </a>
          </nav>
        </div>

        {/* Links Section */}
        <div className="grid gap-2 col-span-1 sm:col-span-1 md:col-span-2 ml-2 md:ml-14">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
            {t('footer.links')}
          </h4>
          <nav className="grid gap-2">
            <a href="/privacy" className="hover:underline text-gray-600 dark:text-gray-300">
              {t('footer.privacyPolicy')}
            </a>
            <a href="/terms" className="hover:underline text-gray-600 dark:text-gray-300">
              {t('footer.termsOfService')}
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300 whitespace-nowrap">
              {t('footer.leaveTestimony')}
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              {t('footer.helpCenter')}
            </a>
          </nav>
        </div>

        {/* Vertical Separation Line */}
        <div className="hidden md:block md:col-span-1 border-r border-gray-300 dark:border-gray-700"></div>

        {/* Community Section */}
        <div className="grid gap-2 col-span-1 sm:col-span-2 md:col-span-3 ml-2 md:ml-14">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
            {t('footer.community')}
          </h4>
          <nav className="grid gap-2">
            <a href="https://github.com/lomiafrica" className="hover:underline text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FontAwesomeIcon icon={faGithub as IconProp} /> {t('footer.github')}
            </a>
            <a href="https://www.linkedin.com/company/lomiafri/" className="hover:underline text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FontAwesomeIcon icon={faLinkedin as IconProp} /> {t('footer.linkedIn')}
            </a>
            <a href="https://x.com/intent/follow?screen_name=lomiafrica" className="hover:underline text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FontAwesomeIcon icon={faTwitter as IconProp} /> {t('footer.twitter')}
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FontAwesomeIcon icon={faDiscord as IconProp} /> {t('footer.discord')}
            </a>
          </nav>
        </div>
      </div>

      {/* Added vertical space */}
      <div className="h-10 md:h-20"></div>

      <div className="container max-w-8xl mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-600 dark:text-gray-400 px-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-4 md:mb-0 ml-2 md:ml-[55px]">
          <div className="flex items-center gap-4">
            <div className="cursor-pointer" onClick={toggleTheme}>
              <AnotherIcon />
            </div>
            <SystemOperational />
            <GithubStarButton />
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <p>{t('footer.copyright')}</p>
            <a href="https://maps.app.goo.gl/maQA72wpgb3nVGQ46" target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {t('footer.address')}
            </a>
            <div className="flex items-center gap-4 md:gap-6">
              <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-400">
                {t('footer.cookiePreferences')}
              </a>
              <button onClick={toggleLanguage} className="hover:underline text-gray-600 dark:text-gray-400">
                {currentLanguage === 'en' ? 'English' : 'Français'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
