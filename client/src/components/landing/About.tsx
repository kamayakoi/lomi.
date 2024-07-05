import { Statistics } from "./Statistics";
import pilot from "/pilot.png";

export const About = () => {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col md:flex-row gap-8 md:gap-16 max-w-screen-lg mx-auto">
          <div className="flex justify-center md:justify-start flex-shrink-0">
            <img
              src={pilot}
              alt=""
              className="w-[280px] object-contain rounded-lg"
            />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  One link to power all your{" "}
                </span>
                online payments
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Our platform provides a powerful and reliable API for payments, with direct integrations with banks, e-wallets, and telco providers across West Africa. Our mission is to make online payments seamless and accessible for businesses and entrepreneurs alike.
              </p>
            </div>
            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
