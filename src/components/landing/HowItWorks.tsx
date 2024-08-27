import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MedalIcon, MapIcon, PlaneIcon, ShieldIcon } from "./Icons";

interface ProductProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const products: ProductProps[] = [
  {
    icon: (
      <div style={{ width: '40px', height: '40px' }}>
        <MedalIcon />
      </div>
    ), // Adjust size as needed
    title: "Accessibility",
    description: "Easily integrate our API to start accepting payments from multiple channels.",
  },
  {
    icon: (
      <div style={{ width: '40px', height: '40px' }}>
        <MapIcon />
      </div>
    ), // Adjust size as needed
    title: "Support",
    description: "Our resources and support can help make integration quick and straightforward.",
  },
  {
    icon: (
      <div style={{ width: '40px', height: '40px' }}>
        <PlaneIcon />
      </div>
    ), // Adjust size as needed
    title: "Scalability",
    description: "Our platform is built to scale with your business, ensuring reliable and fast processing regardless of volume.",
  },
  {
    icon: (
      <div style={{ width: '40px', height: '40px' }}>
        <ShieldIcon />
      </div>
    ), // Adjust size as needed
    title: "Security",
    description: "Advanced security features to protect your funds and customer data at all times.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="howItWorks" className="container text-center py-24 sm:py-32">
      {/* New section name */}
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wide uppercase mb-4">
        Key Benefits
      </h3>

      <h2 className="text-3xl md:text-4xl font-bold">
        Why choose {" "}
        <span className="inline text-gray-900 dark:text-gray-100">
          us ?{" "}
        </span>
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-2xl text-muted-foreground">
        Accept online payments and offer your clients flexibility through our seamless checkout experience and payment methods integrations
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
            <CardContent style={{ fontSize: '1.06rem' }}>{description}</CardContent> {/* Applied custom font size directly */}
          </Card>
        ))}
      </div>
    </section>
  );
};