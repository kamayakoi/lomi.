import { BentoDemo } from "./BentoGrid";

export const Products = () => {
  return (
    <section id="products" className="container py-24 sm:py-32">
      <div className="text-center mb-12">
        <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-600 tracking-wide uppercase mb-4">
          CUSTOMER LOVE
        </h3>
        <h2 className="text-3xl md:text-4xl font-bold">
          Our products{" "}
          <span className="inline text-gray-900 dark:text-gray-100">
            at launch
          </span>
        </h2>
        <p className="text-muted-foreground text-2xl mt-4 mb-8 ">
          Our platform provide a frictionless customer experience for receiving funds.
        </p>
      </div>
      <BentoDemo />
    </section>
  );
};