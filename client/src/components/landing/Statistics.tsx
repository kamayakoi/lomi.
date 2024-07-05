export const Statistics = () => {
  interface StatsProps {
    quantity: string;
    description: string;
  }

  const stats: StatsProps[] = [
    {
      quantity: "35+",
      description: "Businesses Served",
    },
    {
      quantity: "99.9%",
      description: "Uptime Guarantee",
    },
    {
      quantity: "12+",
      description: "Payment Methods",
    },
    {
      quantity: "24/7",
      description: "Free Support",
    },
  ];

  return (
    <section id="statistics" className="mt-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map(({ quantity, description }: StatsProps) => (
          <div key={description} className="space-y-2 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold">{quantity}</h2>
            <p className="text-xl text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
