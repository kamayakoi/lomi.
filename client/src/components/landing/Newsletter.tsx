import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"; // Import additional shadcn components
import React from "react"; // Import React to use React types

export const Newsletter = () => {
  // Specify the type for the event parameter
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log("Subscribed!"); // Log a message to the console
  };

  return (
    <section id="newsletter">
      <hr className="w-11/12 mx-auto" />

      <div className="container py-24 sm:py-32">
        <Card className="mx-auto w-full md:w-8/12 lg:w-6/12"> {/* Increased the width of the Card */}
          <CardHeader>
            <CardTitle className="text-left text-4xl md:text-5xl font-bold"> {/* Aligned text to the left */}
              Join Our Daily{" "}
              <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                Newsletter
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-muted-foreground text-left mt-4 mb-8"> {/* Aligned text to the left */}
              Lorem ipsum dolor sit amet consectetur.
            </p>

            <form
              className="flex flex-col w-full md:flex-row gap-4 md:gap-2 items-center justify-center" // Centered the form elements
              onSubmit={handleSubmit} // Attach the handleSubmit function to the form's onSubmit event
            >
              <Input
                placeholder="leomirandadev@gmail.com"
                className="bg-muted/50 dark:bg-muted/80"
                aria-label="email"
              />
              <Button>Subscribe</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <hr className="w-11/12 mx-auto" />
    </section>
  );
};