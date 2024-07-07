import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MedalIcon, MapIcon, PlaneIcon, ShieldIcon } from "./Icons";

interface ProductProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const products: ProductProps[] = [
  {
    icon: <MedalIcon />,
    title: "Accessibility",
    description: "Easily integrate our API to start accepting payments from multiple channels.",
  },
  {
    icon: <MapIcon />,
    title: "Support",
    description: "Our resources can help make integration quick and straightforward.",
  },
  {
    icon: <PlaneIcon />,
    title: "Scalability",
    description: "Our platform is built to scale with your business, ensuring reliable and fast transactions regardless of volume.",
  },
  {
    icon: <ShieldIcon />, // Assuming LockIcon is another icon linked to security
    title: "Security",
    description: "Advanced security features to protect your transactions and customer data at all times.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="howItWorks" className="container text-center py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold">
        How it{" "}
        <span className="inline bg-gradient-to-r from-[#F596D3] to-[#D247BF] text-transparent bg-clip-text">
          works{" "}
        </span>
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Discover how we make online payments seamless.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map(({ icon, title, description }: ProductProps) => (
          <Card key={title} className="bg-muted/50">
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};