import { MagicCard } from "../ui/magic-card";
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
    ),
    title: "Accessibility",
    description: "Easily integrate our API to start accepting payments from multiple channels.",
  },
  {
    icon: (
      <div style={{ width: '40px', height: '40px' }}>
        <MapIcon />
      </div>
    ),
    title: "Support",
    description: "Our resources and support can help make integration quick and straightforward.",
  },
  {
    icon: (
      <div style={{ width: '40px', height: '40px' }}>
        <PlaneIcon />
      </div>
    ),
    title: "Scalability",
    description: "Our platform is built to scale with your business, ensuring fast processing regardless of volume.",
  },
  {
    icon: (
      <div style={{ width: '40px', height: '40px' }}>
        <ShieldIcon />
      </div>
    ),
    title: "Security",
    description: "Advanced security features to protect your funds and customer data at all times.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="howItWorks" className="container text-center py-24 sm:py-32">
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
          <MagicCard
            key={title}
            className="p-6"
            gradientColor="#e5e7eb" // Light gray color for the gradient
            gradientOpacity={0.4} // Very low opacity for an almost invisible effect
          >
            <div className="grid gap-4 place-items-center">
              {icon}
              <h3 className="text-xl font-semibold">{title}</h3>
            </div>
            <p className="mt-4 text-lg">{description}</p>
          </MagicCard>
        ))}
      </div>
    </section>
  );
};