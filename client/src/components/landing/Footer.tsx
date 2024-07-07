import { LogoIcon } from "./Icons";

export const Footer = () => {
  return (
    <footer id="footer" className="bg-gray-100 dark:bg-gray-900 py-10 w-full"> {/* Add dark mode background color */}
      <div className="container max-w-8xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Logo and Location */}
        <div className="flex flex-col gap-4 col-span-1 md:col-span-1"> {/* Ensure this section spans one column */}
          <a href="/" className="flex items-center gap-2">
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
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2"> {/* Add dark mode text color and increase bottom margin */}
            Company
          </h4>
          <nav className="grid gap-1">
            <a href="/about" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
              About
            </a>
            <a href="/products" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
              Products
            </a>
            <a href="/careers" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
              Careers
            </a>
            <a href="/contact" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
              Contact sales
            </a>
          </nav>
        </div>

        {/* Resources Section */}
        <div className="grid gap-2 col-span-1 md:col-span-1"> {/* Ensure this section spans one column */}
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2"> {/* Add dark mode text color and increase bottom margin */}
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
            <div className="h-6"></div> {/* Empty div to maintain equal height */}
          </nav>
        </div>

        {/* Community Section */}
        <div className="grid gap-2 col-span-1 md:col-span-1"> {/* Ensure this section spans one column */}
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2"> {/* Add dark mode text color and increase bottom margin */}
            Community
          </h4>
          <nav className="grid gap-1">
            <a href="https://github.com/princemuichkine" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
              Github
            </a>
            <a href="https://www.linkedin.com/company/lomiafri/" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
              LinkedIn
            </a>
            <a href="https://x.com/lomiafrica" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
              X (Twitter)
            </a>
            <div className="h-6"></div> {/* Empty div to maintain equal height */}
          </nav>
        </div>
      </div>

      <div className="container max-w-8xl mt-8 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
        <div className="flex items-center gap-4 ml-[-2px]"> {/* Align with logo and add space between items */}
          <p>&copy; 2024 lomi.africa, Inc. All rights reserved.</p> {/* Align with logo */}
          <a className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
            Les Perles — Abidjan, Côte d'Ivoire
          </a>
          <a href="/privacy-policy" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="hover:underline text-gray-600 dark:text-gray-300"> {/* Add dark mode text color */}
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};