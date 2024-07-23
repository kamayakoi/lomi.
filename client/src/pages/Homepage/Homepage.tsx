// Imported
import { FAQ } from "../../components/landing/FAQ";
import { Footer } from "../../components/landing/Footer-Homepage";
import { Hero } from "../../components/landing/Hero";
import { HowItWorks } from "../../components/landing/HowItWorks";
import { Navbar } from "../../components/landing/Navbar";
import { ScrollToTop } from "../../components/landing/ScrollToTop";
import { Services } from "../../components/landing/Services";

import "./Homepage.css";

// Not Imported

{/* import { About } from "../../components/landing/About";* /}
{/* import { Newsletter } from "./components/landing/Newsletter";* /}
{/* import { Pricing } from "./components/landing/Pricing"; */ }
{/* import { Sponsors } from "./components/landing/Sponsors"; */ }
{/* import { Team } from "./components/landing/Team"; */ }
{/* import { Testimonials } from "./components/landing/Testimonials"; */ }
{/*import { Products } from "./components/landing/Products";*/ }
{/* import { Cta } from "./components/landing/Cta"; */ }

function Homepage() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Services />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default Homepage;