import { useState, useEffect, useRef } from "react";
import { LogoIcon } from "./Icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faWhatsapp, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { ModeToggle } from "./mode-toggle";
import SystemOperational from "@/components/custom/System-operational";

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
      <div className="container max-w-8xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-16">
        {/* Logo Section */}
        <div className="flex flex-col gap-2 col-span-1 md:col-span-1">
          <a href="/" className="flex items-center gap-1" style={{ fontSize: '1.5rem' }}>
            <LogoIcon />
            <span className="text-2xl font-bold text-black dark:text-white">
              lomi.africa
            </span>
          </a>
        </div>

        {/* Company Section */}
        <div className="grid gap-2 col-span-1 md:col-span-1">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Company
          </h4>
          <nav className="grid gap-1">
            <a href="/about" className="hover:underline text-gray-600 dark:text-gray-300">
              About
            </a>
            <a href="/products" className="hover:underline text-gray-600 dark:text-gray-300">
              Products
            </a>
            <a href="/solutions" className="hover:underline text-gray-600 dark:text-gray-300">
              Solutions
            </a>
            <a href="/careers" className="hover:underline text-gray-600 dark:text-gray-300">
              Careers
            </a>
          </nav>
        </div>

        {/* Resources Section */}
        <div className="grid gap-2 col-span-1 md:col-span-1">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Resources
          </h4>
          <nav className="grid gap-1">
            <a href="https://developers.lomi.africa/" className="hover:underline text-gray-600 dark:text-gray-300">
              Developers
            </a>
            <a href="https://developers.lomi.africa/api-documentation" className="hover:underline text-gray-600 dark:text-gray-300">
              Recipes
            </a>
            <a href="https://developers.lomi.africa/guides/support" className="hover:underline text-gray-600 dark:text-gray-300">
              Support
            </a>
            <a href="https://developers.lomi.africa/guides/support/contact" className="hover:underline text-gray-600 dark:text-gray-300">
              Contact
            </a>
          </nav>
        </div>

        {/* Vertical Separation Line */}
        <div className="hidden md:block w-px bg-gray-300 dark:bg-gray-700 mx-auto"></div>

        {/* Community Section */}
        <div className="grid gap-2 col-span-1 md:col-span-1">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Community
          </h4>
          <nav className="grid gap-1">
            <a href="https://github.com/lomiafrica" className="hover:underline text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FontAwesomeIcon icon={faGithub} /> Github
            </a>
            <a href="https://www.linkedin.com/company/lomiafri/" className="hover:underline text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
            </a>
            <a href="https://wa.me/31687533993" className="hover:underline text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
            </a>
            <a href="https://x.com/intent/follow?screen_name=lomiafrica" className="hover:underline text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FontAwesomeIcon icon={faTwitter} /> X | Twitter
            </a>
          </nav>
        </div>
      </div>

      {/* Added vertical space */}
      <div className="h-10"></div>

      <div className="container max-w-8xl mt-8 flex flex-wrap items-center justify-between text-xs text-gray-600 dark:text-gray-300">
        <div className="flex flex-wrap items-center gap-4 ml-[-2px]">
          <p>&copy; 2024 lomi.africa, Inc. </p>
          <a href="https://maps.app.goo.gl/maQA72wpgb3nVGQ46" target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-600 dark:text-gray-300">
            Abidjan, Côte d&apos;Ivoire
          </a>
          <a href="/privacy" className="hover:underline text-gray-600 dark:text-gray-300">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:underline text-gray-600 dark:text-gray-300">
            Terms of Service
          </a>
          <div className="relative" ref={dropdownRef}>
            <button onClick={toggleLanguages} className="hover:underline text-gray-600 dark:text-gray-300">
              English
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
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <SystemOperational />
          <ModeToggle />
        </div>
      </div>
    </footer>
  );
};