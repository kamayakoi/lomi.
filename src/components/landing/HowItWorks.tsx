import { MagicCard } from "../ui/magic-card";
import { MedalIcon, MapIcon, PlaneIcon, ShieldIcon } from "./Icons";
import { useTranslation } from 'react-i18next';

interface ProductProps {
  icon: JSX.Element;
  title: string;
}

const products: ProductProps[] = [
  {
    icon: (
      <div style={{ width: '40px', height: '40px' }}>
        <MedalIcon />
      </div>
    ),
    title: "Accessibility",
  },
  {
    icon: (
      <div style={{ width: '40px', height: '40px' }}>
        <MapIcon />
      </div>
    ),
    title: "Support",
  },
  {
    icon: (
      <div style={{ width: '40px', height: '40px' }}>
        <PlaneIcon />
      </div>
    ),
    title: "Scalability",
  },
  {
    icon: (
      <div style={{ width: '40px', height: '40px' }}>
        <ShieldIcon />
      </div>
    ),
    title: "Security",
  },
];

export const HowItWorks = () => {
  const { t } = useTranslation();

  return (
    <section id="howItWorks" className="container text-center py-24 sm:py-32">
      <h3 className="text-sm font-semibold tracking-wider uppercase mb-4" style={{ color: '#D247BF' }}>
        {t('howItWorks.keyBenefits')}
      </h3>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        {t('howItWorks.whyChooseUs')}{" "}
        <span className="inline text-gray-900 dark:text-gray-100">
          {t('howItWorks.us')}{" "}
        </span>
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-2xl text-muted-foreground">
        {t('howItWorks.description')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map(({ icon, title }: ProductProps) => (
          <MagicCard
            key={title}
            className="p-6"
            gradientColor="#e5e7eb"
            gradientOpacity={0.4}
          >
            <div className="grid gap-4 place-items-center">
              {icon}
              <h4 className="text-xl font-semibold">{t(`howItWorks.products.${title}.title`)}</h4>
            </div>
            <p className="mt-4 text-lg">{t(`howItWorks.products.${title}.description`)}</p>
          </MagicCard>
        ))}
      </div>
    </section>
  );
};
