import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { MagnifierIcon, WalletIcon, ChartIcon } from "./Icons";
import total from "/total.png";

interface ServiceProps {
  title: string;
  description: string;
  icon: JSX.Element;
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

        <img
          src={total}
          className="w-[400px] md:w-[600px] lg:w-[800px] object-contain rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105"
          alt="About Products"
        />
      </div>
    </section>
  );
};
