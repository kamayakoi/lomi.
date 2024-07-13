//components

import { VisitIcon } from "./Icons.tsx";
import { Badge } from "../ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { LightBulbIcon } from "./Icons";
import { useTheme } from '../../lib/useTheme';

//Images
import canvas from "/canvas.png";
import canvasdark from "/canvas_dark.png";

export const HeroCards = () => {
  const { theme } = useTheme();
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Shadow */}
      <div className="shadow hero-card-shadow"></div>

      {/* Testimonial */}
      <Card className="absolute w-[340px] -top-[31px] drop-shadow-xl shadow-black/10 dark:shadow-white/10 transform transition-transform duration-500 hover:scale-105">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          {/* Replaced Avatar component with VisitIcon */}
          <VisitIcon />
          <div className="flex flex-col ml-[-10px]"> {/* Added negative left margin */}
            <CardTitle className="text-lg">Kwame Adjei</CardTitle>
            <CardDescription>@kadjei_</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          lomi. has been handling our mobile money integrations since we launched. Process was quick, and their support is great!
        </CardContent>
      </Card>

      {/* Team */}
      <div className="absolute right-[-75px] top-[15px] w-[500px] flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10 z-50 transform transition-transform duration-500 hover:scale-105">
        <img
          src={theme === 'dark' ? canvasdark : canvas} // Use canvasdark in dark mode
          alt="Our mission"
          className="w-full h-auto rounded-lg border-1 border-gray-50 dark:border-gray-700"
        />
      </div>

      {/* Pricing */}
      <Card className="absolute top-[133px] left-[25px] w-72 drop-shadow-xl shadow-black/10 dark:shadow-white/10 transform transition-transform duration-500 hover:scale-105">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            <Badge
              variant="secondary"
              className="text-sm text-primary mr-2" // Added margin-right to create space between badges
            >
              Mobile money
            </Badge>
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">3. — 3.70%</span>
            <span className="text-muted-foreground"> per transaction</span>
          </div>

          <CardDescription className="text-gray-800 dark:text-gray-200">
            Our pricing ensures you get the best value for quality payment processing.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Link to="/sign-in">
            <Button className="w-full">Start</Button>
          </Link>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4">
            {["Simple integration", "24/7 Support", "Secure Transactions"].map(
              (benefit: string) => (
                <span
                  key={benefit}
                  className="flex"
                >
                  <Check className="text-green-500" />{" "}
                  <h3 className="ml-2">{benefit}</h3>
                </span>
              )
            )}
          </div>
        </CardFooter>
      </Card>

      {/*  Payment Orchestration */}
      <Card className="absolute w-[350px] -right-[4px] bottom-[-100px] drop-shadow-xl shadow-black/10 dark:shadow-white/10 transform transition-transform duration-500 hover:scale-105">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/10 p-1 rounded-2xl">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>Payment Orchestration</CardTitle>
            <CardDescription className="text-md mt-2 text-gray-800 dark:text-gray-200">
              Manage all your payment methods in one single place.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};