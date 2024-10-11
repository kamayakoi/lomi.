import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { ScrollToTop } from "@/components/landing/ScrollToTop";
import { Products } from "@/components/landing/Products"
// import { HowItWorks } from "@/components/landing/HowItWorks";

import "@/lib/styles/home.css"

function Homepage() {
  return (
    <>
      <Navbar />
      <div className="h-16"></div>
      <div className="hero-section">
        <Hero />
      </div>
      <Products />
      <FAQ />
      <div className="border-b border-gray-300 dark:border-gray-700"></div>
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default Homepage;