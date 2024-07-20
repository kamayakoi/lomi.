import { Button } from "../ui/button";
import { HeroCards } from "./HeroCards";
import { useState } from "react"; // Import useState

// Image import
import africanledger from "/africanledger_round.png";
import testimony2 from "/testimony2.png";
import testimony3 from "/testimony3.png";
import heart from "/heart.png";

export const Hero = () => {
  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage modal visibility

  return (
    <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold text-left lg:text-start"> {/* Added text-left for mobile */}
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              One integration
            </span>{" "}
            for all your{" "}
            <span className="inline bg-gradient-to-r from-[#61DAFB] to-[#1B95E0] text-transparent bg-clip-text"> {/* Applied the blue gradient */}
              payment needs.
            </span>
          </h1>
        </main>

        <p className="text-2xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0 text-left lg:text-start"> {/* Added text-left for mobile */}
          We offer an easy-to-use API & financial gateway that connects with banks and networks across West Africa — making it simple for your business to handle transactions and scale faster.
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button
            className="w-full md:w-1/2 lg:w-1/5 text-2xl  px-20 py-7" // Increased font size and padding for height
            onClick={() => setIsFormOpen(true)}
          >
            Learn more
          </Button>

          <Button
            className="w-full md:w-1/2 lg:w-1/5 text-2xl px-20 py-7 bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 rounded-lg"
            onClick={() => window.location.href = "https://developers.lomi.africa/"}
          >
            Resources
          </Button>
        </div>


        {/* New section */}
        <div className="relative flex items-center mt-6 group">
          <div className="relative -ml"> {/* Reduced negative margin to -ml-2 */}
            <img src={africanledger} alt="Person 1" className="w-8 h-8 rounded-full border-2 border-white" /> {/* Added border */}
            <img src={heart} alt="Heart" className="absolute w-6 h-6 top-[-10px] left-[80px] opacity-0 group-hover:opacity-100" /> {/* Adjusted position */}
          </div>
          <div className="relative -ml-2"> {/* Reduced negative margin to -ml-2 */}
            <img src={testimony2} alt="Person 2" className="w-8 h-8 rounded-full border-2 border-white" /> {/* Added border */}
            <img src={heart} alt="Heart" className="absolute w-6 h-6 top-[-20px] left-[65px] opacity-0 group-hover:opacity-100" /> {/* Adjusted position */}
          </div>
          <div className="relative -ml-2"> {/* Reduced negative margin to -ml-2 */}
            <img src={testimony3} alt="Person 3" className="w-8 h-8 rounded-full border-2 border-white" /> {/* Added border */}
            <img src={heart} alt="Heart" className="absolute w-6 h-6 top-[-13px] left-[52px] opacity-0 group-hover:opacity-100" /> {/* Adjusted position */}
          </div>
          <span className="text-lg text-gray-600 dark:text-gray-300 ml-2"> {/* Added dark mode text color */}
            Loved by dozens of businesses and entrepreneurs.
          </span>
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