import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { ScrollToTop } from "@/components/landing/ScrollToTop";
import { Services } from "@/components/landing/NewServices";
// import Particles from "@/components/ui/particles";
// import { Sponsors } from "@/components/landing/Sponsors";

function Homepage() {
  return (
    <>
      {/* <Particles className="fixed inset-0 -z-10" color="#000000" /> */}
      <Navbar />
      <div className="h-16"></div>
      <Hero />
      {/* <Sponsors /> */}
      <HowItWorks />
      <Services />
      <FAQ />
      <div className="border-b border-gray-300 dark:border-gray-700"></div>
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default Homepage;