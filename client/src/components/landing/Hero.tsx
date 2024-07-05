import { Button } from "../ui/button";
import { HeroCards } from "./HeroCards";
import { useState } from "react"; // Import useState

export const Hero = () => {
  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage modal visibility

  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              One integration
            </span>{" "}
            for all your payment needs.
          </h1>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          An API and payment gateway integrated with multiple banks and networks across West Africa — so your business can handle transactions seamlessly and scale faster.
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3" onClick={() => setIsFormOpen(true)}>
            Contact Sales
          </Button>

          <Button
            className="w-full md:w-1/3"
            variant="outline"
            onClick={() => window.location.href = "https://developers.lomi.africa/"} // Redirect to the resources URL
          >
            Resources
          </Button>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>

      {/* Airtable form modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={() => setIsFormOpen(false)} // Close modal on background click
        >
          <div
            className="bg-white rounded-lg p-3 w-full max-w-3xl mx-2"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on content click
          >
            <iframe
              className="airtable-embed"
              src="https://airtable.com/embed/appFQadFIGVMYNnHq/pagphA6Lt1pPzWMhX/form"
              frameBorder="0"
              width="100%"
              height="800"
              style={{ background: 'transparent', border: '1px solid #ccc' }}
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};