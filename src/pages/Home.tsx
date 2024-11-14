import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import { Products } from "@/components/landing/Products"
import { HowItWorks } from "@/components/landing/HowItWorks";
// import { ScrollToTop } from "@/components/landing/ScrollToTop";

function Homepage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="h-16"></div>
        <section className="hero-section">
          <Hero />
        </section>
        <section>
          <HowItWorks />
        </section>
        <section>
          <Products />
        </section>
        <section>
          <FAQ />
        </section>
      </main>
      <div className="border-b border-gray-300 dark:border-gray-700"></div>
      <Footer />
      {/* <ScrollToTop /> */}
    </>
  );
}

export default Homepage;