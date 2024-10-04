import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ModeToggle } from "./mode-toggle";
import SystemOperational from "@/components/custom/system-operational";
import { AnotherIcon } from "./Icons";

export const Footer = () => {
  const [showLanguages, setShowLanguages] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleLanguages = () => {
    setShowLanguages(!showLanguages);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowLanguages(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <footer id="footer" className="bg-gray-100 dark:bg-[#06060A] py-10 w-full">
      <div className="container max-w-8xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 mb-16 px-4">
        {/* Logo Section */}
        <div className="col-span-1 md:col-span-12 ml-8">
          {/* Add logo or any other content */}
        </div>

        {/* Company Section */}
        <div className="grid gap-2 col-span-1 sm:col-span-1 md:col-span-2 ml-14">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
            Company
          </h4>
          <nav className="grid gap-2">
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              Solutions
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              Case Studies
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              Customers
            </a>
            <a href="/about" className="hover:underline text-gray-600 dark:text-gray-300">
              About us
            </a>
          </nav>
        </div>

        {/* Products Section */}
        <div className="grid gap-2 col-span-1 sm:col-span-1 md:col-span-2 ml-14">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
            Products
          </h4>
          <nav className="grid gap-2">
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              Payments
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              Subscriptions
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              Checkout
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              Payouts
            </a>
          </nav>
        </div>

        {/* Resources Section */}
        <div className="grid gap-2 col-span-1 sm:col-span-1 md:col-span-2 ml-14">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
            Resources
          </h4>
          <nav className="grid gap-2">
            <a href="https://developers.lomi.africa/" className="hover:underline text-gray-600 dark:text-gray-300">
              Developers
            </a>
            <a href="https://developers.lomi.africa/api-documentation" className="hover:underline text-gray-600 dark:text-gray-300">
              Recipes
            </a>
            <a href="mailto:hello@lomi.africa?subject=[Support] — Question" className="hover:underline text-gray-600 dark:text-gray-300">
              Support
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              Pricing
            </a>
          </nav>
        </div>

        {/* Links Section */}
        <div className="grid gap-2 col-span-1 sm:col-span-1 md:col-span-2 ml-14">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
            Links
          </h4>
          <nav className="grid gap-2">
            <a href="/privacy" className="hover:underline text-gray-600 dark:text-gray-300">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:underline text-gray-600 dark:text-gray-300">
              Terms of Service
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300 whitespace-nowrap">
              Leave us a testimony
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
              Help center
            </a>
          </nav>
        </div>

        {/* Vertical Separation Line */}
        <div className="hidden md:block md:col-span-1 border-r border-gray-300 dark:border-gray-700"></div>

        {/* Community Section */}
        <div className="grid gap-2 col-span-1 sm:col-span-2 md:col-span-3 ml-14">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
            Community
          </h4>
          <nav className="grid gap-2">
            <a href="https://github.com/lomiafrica" className="hover:underline text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FontAwesomeIcon icon={faGithub} /> Github
            </a>
            <a href="https://www.linkedin.com/company/lomiafri/" className="hover:underline text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
            </a>
            <a href="https://x.com/intent/follow?screen_name=lomiafrica" className="hover:underline text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FontAwesomeIcon icon={faTwitter} /> X | Twitter
            </a>
            <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} /> Newsletters
            </a>
          </nav>
        </div>
      </div>

      {/* Added vertical space */}
      <div className="h-10 md:h-20"></div>

      <div className="container max-w-8xl mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-600 dark:text-gray-300 px-4">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0 ml-[55px] ">
          <div className="flex items-center gap-2">
            <AnotherIcon />
            <SystemOperational />
            <ModeToggle />
          </div>
          <div className="flex items-center gap-1">
            <p>&copy; 2024 lomi.africa, Inc. </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://maps.app.goo.gl/maQA72wpgb3nVGQ46" target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-600 dark:text-gray-300">
              Abidjan, Côte d&apos;Ivoire
            </a>
            <div className="flex items-center gap-1">
              <a onClick={(e) => e.preventDefault()} href="#" style={{ cursor: 'default' }} className="hover:underline text-gray-600 dark:text-gray-300">
                Cookie Preferences
              </a>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button onClick={toggleLanguages} className="hover:underline text-gray-600 dark:text-gray-300">
                Language
              </button>
              {showLanguages && (
                <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-[#06060A] border border-gray-300 dark:border-gray-700 rounded shadow-lg">
                  <a href="/" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                    English
                  </a>
                  <a href="/fr" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                    French
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};