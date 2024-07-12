import { useState } from "react"; // Import useState
import { LogoIcon } from "./Icons";

export const Footer = () => {
  const [showLanguages, setShowLanguages] = useState(false); // State to toggle language options

  const toggleLanguages = () => {
    setShowLanguages(!showLanguages); // Toggle the state
  };

  return (
    <footer id="footer" className="bg-gray-100 dark:bg-gray-900 py-10 w-full"> {/* Add dark mode background color */}
      <div className="container max-w-8xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Logo and Location */}
        <div className="flex flex-col gap-4 col-span-1 md:col-span-1"> {/* Ensure this section spans one column */}
          <a href="/" className="flex items-center gap-1">
            <LogoIcon />
            <span className="text-xl font-bold text-black dark:text-white"> {/* Add dark mode text color */}
              lomi.africa
            </span>
          </a>
        </div>

        {/* Spacer to create space between sections */}
        <div className="hidden md:block md:col-span-1"></div> {/* Hidden on small screens, spans one column on medium and larger screens, with a custom height */}

        {/* Company Section */}
        <div className="grid gap-2 col-span-1 md:col-span-1"> {/* Ensure this section spans one column */}
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-1">
            Company
          </h4>
          <nav className="grid gap-1">
            <a href="/about" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
              About
            </a>
            <a href="/products" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
              Products
            </a>
            <a href="/solutions" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
              Solutions
            </a>
            <a href="/careers" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
              Careers
            </a>
          </nav>
        </div>

        {/* Resources Section */}
        <div className="grid gap-2 col-span-1 md:col-span-1"> {/* Ensure this section spans one column */}
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Resources
          </h4>
          <nav className="grid gap-1">
            <a href="/documentation" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
              Developers
            </a>
            <a href="/recipes" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
              Recipes
            </a>
            <a href="/support" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
              Support
            </a>
            <a href="/contact" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
              Contact
            </a>
          </nav>
        </div>

        {/* Community Section */}
        <div className="grid gap-2 col-span-1 md:col-span-1"> {/* Ensure this section spans one column */}
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Community
          </h4>
          <nav className="grid gap-1">
            <a href="https://github.com/princemuichkine" className="hover:underline text-gray-600 dark:text-gray-300">
              Github
            </a>
            <a href="https://www.linkedin.com/company/lomiafri/" className="hover:underline text-gray-600 dark:text-gray-300">
              LinkedIn
            </a>
            <a href="https://wa.me/687533993" className="hover:underline text-gray-600 dark:text-gray-300">
              WhatsApp
            </a>
            <a href="https://x.com/lomiafrica" className="hover:underline text-gray-600 dark:text-gray-300">
              X | Twitter
            </a>
          </nav>
        </div>
      </div>

      <div className="container max-w-8xl mt-8 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
        <div className="flex items-center gap-4 ml-[-2px]">
          <p>&copy; 2024 lomi.africa, Inc. </p> {/*All rights reserved.*/}
          <a className="hover:underline text-gray-600 dark:text-gray-300">
            Abidjan, Côte d'Ivoire
          </a>
          <a href="/privacy-policy" className="hover:underline text-gray-600 dark:text-gray-300">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="hover:underline text-gray-600 dark:text-gray-300">
            Terms of Service
          </a>
          <div className="relative">
            <button onClick={toggleLanguages} className="hover:underline text-gray-600 dark:text-gray-300">
              English
            </button>
            {showLanguages && (
              <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg"> {/* Position above the button */}
                <a href="/" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  English
                </a>
                <a href="/home/fr" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
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