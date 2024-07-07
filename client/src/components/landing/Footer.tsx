import { LogoIcon } from "./Icons";

export const Footer = () => {
  return (
    <footer id="footer" className="bg-gray-100 py-12 w-full">
      <div className="container max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {/* Logo and Location */}
        <div className="flex flex-col gap-4 col-span-1 md:col-span-1"> {/* Ensure this section spans one column */}
          <a href="/" className="flex items-center gap-2">
            <LogoIcon />
            <span className="text-xl font-bold text-black">lomi.africa</span>
          </a>
          <p className="text-gray-600 text-xs ml-14 mt-[-16]"> {/* Set text size to extra small, add left margin, and increase negative top margin */}
            Les perles, Abidjan, Côte d'Ivoire
          </p>
        </div>

        {/* Spacer to create space between sections */}
        <div className="hidden md:block md:col-span-1"></div> {/* Hidden on small screens, spans one column on medium and larger screens */}

        {/* Navigation, Resources, and Community Sections */}
        <div className="flex flex-col md:flex-row md:col-span-3 gap-8"> {/* Use flexbox to align sections horizontally */}
          {/* Navigation Section */}
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-black"> {/* Changed to black for darker color */}
              Navigation
            </h4>
            <nav className="flex flex-col gap-1">
              <a href="/about" className="hover:underline text-gray-600"> {/* Changed to gray-600 for uniform color */}
                About
              </a>
              <a href="/products" className="hover:underline text-gray-600"> {/* Changed to gray-600 for uniform color */}
                Products
              </a>
              <a href="/careers" className="hover:underline text-gray-600"> {/* Changed to Careers */}
                Careers
              </a>
            </nav>
          </div>

          {/* Resources Section */}
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-black"> {/* Changed to black for darker color */}
              Resources
            </h4>
            <nav className="flex flex-col gap-1">
              <a href="/documentation" className="hover:underline text-gray-600"> {/* Changed to gray-600 for uniform color */}
                Developers
              </a>
              <a href="/support" className="hover:underline text-gray-600"> {/* Changed to gray-600 for uniform color */}
                Support
              </a>
            </nav>
          </div>

          {/* Community Section */}
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-black"> {/* Changed to black for darker color */}
              Community
            </h4>
            <nav className="flex flex-col gap-1">
              <a href="https://github.com/princemuichkine" className="hover:underline text-gray-600">
                Github
              </a>
              <a href="https://x.com/lomiafrica" className="hover:underline text-gray-600">
                X
              </a>
              <a href="https://www.linkedin.com/company/lomiafri/" className="hover:underline text-gray-600">
                LinkedIn
              </a>
            </nav>
          </div>
        </div>
      </div>
      <div className="container max-w-7xl mt-8 flex items-center justify-between text-xs text-gray-600">
        <p>&copy; 2024 lomi.africa, Inc. All rights reserved.</p>
        <nav className="flex gap-4">
          <a href="/privacy-policy" className="hover:underline text-gray-600"> {/* Changed to gray-600 for uniform color */}
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="hover:underline text-gray-600"> {/* Changed to gray-600 for uniform color */}
            Terms of Service
          </a>
        </nav>
      </div>
    </footer>
  );
};