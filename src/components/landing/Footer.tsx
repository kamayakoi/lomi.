import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ModeToggle } from "./mode-toggle";
import SystemOperational from "@/components/custom/system-operational";

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
      <div className="container max-w-8xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 mb-16">
        {/* Logo Section */}
        <div>
        </div>

        {/* Company Section */}
        <div className="grid gap-2 col-span-1 md:col-span-2">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
            Company
          </h4>
          <nav className="grid gap-2">
            <a href="/solutions" className="hover:underline text-gray-600 dark:text-gray-300">
              Solutions
            </a>
            <a href="/products" className="hover:underline text-gray-600 dark:text-gray-300">
              Features
            </a>
            <a href="/about" className="hover:underline text-gray-600 dark:text-gray-300">
              Case Studies
            </a>
            <a href="" className="hover:underline text-gray-600 dark:text-gray-300">
              Customers
            </a>
          </nav>
        </div>

        {/* Products Section */}
        <div className="grid gap-2 col-span-1 md:col-span-2">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
            Products
          </h4>
          <nav className="grid gap-2">
            <a href="" className="hover:underline text-gray-600 dark:text-gray-300">
              Payments
            </a>
            <a href="" className="hover:underline text-gray-600 dark:text-gray-300">
              Subscriptions
            </a>
            <a href="" className="hover:underline text-gray-600 dark:text-gray-300">
              Checkout
            </a>
            <a href="" className="hover:underline text-gray-600 dark:text-gray-300">
              Integrations
            </a>
          </nav>
        </div>

        {/* Resources Section */}
        <div className="grid gap-2 col-span-1 md:col-span-2">
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
            <a href="#" className="hover:underline text-gray-600 dark:text-gray-300">
              Support
            </a>
            <a href="https://developers.lomi.africa/guides/support/contact" className="hover:underline text-gray-600 dark:text-gray-300">
              Contact
            </a>
          </nav>
        </div>

        {/* Links Section */}
        <div className="grid gap-2 col-span-1 md:col-span-2">
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
            <a href="" className="hover:underline  text-gray-600 dark:text-gray-300">
              Leave a testimony
            </a>
            <a href="" className="hover:underline text-gray-600 dark:text-gray-300">
              Join our Slack
            </a>
          </nav>
        </div>

        {/* Vertical Separation Line */}
        <div className="hidden md:block md:col-span-1 border-l border-gray-300 dark:border-gray-700"></div>

        {/* Community Section */}
        <div className="grid gap-2 col-span-1 md:col-span-2">
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
            <a href="https://wa.me/31687533993" className="hover:underline text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} /> Newsletters
            </a>
          </nav>
        </div>
      </div>

      {/* Added vertical space */}
      <div className="h-10"></div>

      <div className="container max-w-8xl mt-8 flex flex-wrap items-center justify-between text-xs text-gray-600 dark:text-gray-300">
        <div className="flex flex-wrap items-center gap-4 ml-[35px]">
          <SystemOperational />
          <ModeToggle />
          <p>&copy; 2024 lomi.africa, Inc. </p>
          <a href="https://maps.app.goo.gl/maQA72wpgb3nVGQ46" target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-600 dark:text-gray-300">
            Abidjan, Côte d&apos;Ivoire
          </a>
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleLanguages} className="hover:underline text-gray-600 dark:text-gray-300">
              Language
            </button>
            {showLanguages && (
              <div className="absolute bottom-full mb-2 bg-white dark:bg-[#06060A] border border-gray-300 dark:border-gray-700 rounded shadow-lg">
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
    </footer>
  );
};