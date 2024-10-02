import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon, ChartIcon, MagnifierIcon } from "./Icons";


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

        <div className="hidden lg:block relative overflow-hidden z-[-100]">
          <div className="right-0 w-screen">
            <img
              src="/portal2.png"
              alt="Portal"
              className="w-[3000px] h-[800px] -ml-[-500px] -padding-top-[-60px] border-6 border-gray-300 dark:border-gray-600 rounded-md shadow-md transition duration-300 ease-in-out hover:shadow-lg hover:scale-102 block dark:hidden"
            />
            <img
              src="/portal.png"
              alt="Portal"
              className="w-[3000px] h-[800px] -ml-[-500px] -padding-top-[-60px] border-6 border-gray-300 dark:border-gray-600 rounded-md shadow-md transition duration-300 ease-in-out hover:shadow-lg hover:scale-102 hidden dark:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
};