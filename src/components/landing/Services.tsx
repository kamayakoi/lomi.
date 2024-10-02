import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { VisitIcon, WalletIcon, ChartIcon, MagnifierIcon } from "./Icons";
import { useTheme } from '@/lib/useTheme';
import PulsatingButton from "@/components/ui/pulsating-button";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";

interface ServiceProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const serviceList: ServiceProps[] = [
  {
    title: "Collect Money",
    description:
      "Accept payments via Card, Mobile Money, e-wallets, and pay-by-bank using an interface uniquely built for West Africa.",
    icon: <WalletIcon />,
  },
  {
    title: "Manage Money",
    description:
      "Orchestrate and reconcile money seamlessly across different methods and providers.",
    icon: <ChartIcon />,
  },
  {
    title: "Send Money",
    description:
      "Send payouts quickly and efficiently to anywhere your earnings need to go.",
    icon: <MagnifierIcon />,
  },
];

export const Services = () => {
  const { theme } = useTheme();

  return (
    <section id="products" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          {/* New section name */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wide uppercase mb-4">
            CUSTOMER LOVE
          </h3>

          <h2 className="text-3xl md:text-4xl font-bold">
            Our products{" "}
            <span className="inline text-gray-900 dark:text-gray-100">
              at launch
            </span>
          </h2>
          <p className="text-muted-foreground text-2xl mt-4 mb-8 ">
            Our products provide a frictionless customer experience for receiving funds.
          </p>

          <div className="flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/10 p-1 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2" style={{ fontSize: '1.01rem' }}>
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
          {/* Shadow */}
          <div className="shadow hero-card-shadow"></div>

          {/* Testimonial */}
          <Card className="absolute w-[350px] -top-[82px] left-[50px] drop-shadow-xl shadow-black/10 dark:shadow-white/10 transform transition-transform duration-500 hover:scale-105">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <VisitIcon />
              <div className="flex flex-col ml-[-10px]">
                <CardTitle className="text-lg">Jessy Diakité</CardTitle>
                <CardDescription>@jessy_d</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="text-lg">
              lomi. has been handling our mobile money integrations since we launched. Process was quick, and their support is great!
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="absolute top-[123px] left-[50px] w-72 drop-shadow-xl shadow-black/10 dark:shadow-white/10 transform transition-transform duration-500 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex item-center justify-between">
                <Badge
                  variant="secondary"
                  className={`text-sm ${theme === 'dark' ? 'bg-white text-black' : 'text-primary'} mr-[-4px]`}
                >
                  Mobile money
                </Badge>
                <Badge
                  variant="secondary"
                  className={`text-sm ${theme === 'dark' ? 'bg-white text-black' : 'text-primary'} mr-[12px]`}
                >
                  Pay by bank
                </Badge>
              </CardTitle>

              <div style={{ marginTop: '15px' }}>
                <span className="text-3xl font-bold">3. — 3.70%</span>
                <span className="text-muted-foreground"> per transaction</span>
              </div>

              <CardDescription className="text-lg text-gray-800 dark:text-gray-200">
                Our pricing ensures you get the best value for quality payment processing.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex justify-center">
                <Link to="/sign-in">
                  <PulsatingButton className="px-6 py-4 rounded-md shadow-lg bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700">
                    <span className="font-bold">Start</span>
                    <span className="text-lg ml-2">— in minutes</span>
                  </PulsatingButton>
                </Link>
              </div>
            </CardContent>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {["Simple integration", "24/7 Support", "Secure Transactions"].map(
                  (benefit: string) => (
                    <span key={benefit} className="flex">
                      <Check className="text-green-500" />{" "}
                      <h3 className="ml-2">{benefit}</h3>
                    </span>
                  )
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};