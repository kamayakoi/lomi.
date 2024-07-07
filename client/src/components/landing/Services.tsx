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
      "Accept payments via Card, Mobile Money, e-wallets, and Pay by bank.",
    icon: <WalletIcon />,
  },
  {
    title: "Manage Money",
    description:
      "Orchestrate and reconcile payments seamlessly across different methods and providers.",
    icon: <ChartIcon />,
  },
  {
    title: "Send Money",
    description:
      "Send payouts quickly and efficiently to anywhere your money needs to go.",
    icon: <MagnifierIcon />,
  },
];

export const Services = () => {
  return (
    <section id="products" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="inline bg-gradient-to-r from-[#F596D3] to-[#4781d2] text-transparent bg-clip-text">
              Our products{" "}
            </span>
            at launch
          </h2>
          <p className="text-muted-foreground text-xl mt-4 mb-8 ">
            A Payment Interface uniquely built for West Africa.
          </p>


          <div className="flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
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
