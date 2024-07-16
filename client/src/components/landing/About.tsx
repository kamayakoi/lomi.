import { Statistics } from "./Statistics";
import pilot from "/pilot.png";

export const About = () => {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col md:flex-row gap-8 md:gap-16 max-w-screen-xl mx-auto"> {/* Changed max-w-screen-lg to max-w-screen-xl */}
          <div className="flex justify-center md:justify-start flex-shrink-0">
            <img
              src={pilot}
              alt=""
              className="w-[320px] h-[320px] object-contain rounded-lg" // Adjusted width and height
            />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div className="pb-6 text-left"> {/* Added text-left class */}
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="inline bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
                  One link to grow your revenue
                </span>{" "}
                <span className="text-current"> {/* Adapts to the current text color */}
                  and manage all your
                </span>{" "}
                <span className="inline bg-gradient-to-r from-[#61DAFB] to-[#1B95E0] text-transparent bg-clip-text"> {/* Applied the blue gradient */}
                  payment needs.
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Our mission is to make online payments seamless and accessible for businesses and entrepreneurs alike.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="max-w-3xl w-full">
                <Statistics />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};