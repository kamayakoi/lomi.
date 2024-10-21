import { BentoDemo } from "./BentoGrid";
import { useTranslation } from 'react-i18next';

export const Products = () => {
  const { t } = useTranslation();

  return (
    <section id="products" className="container py-24 sm:py-32">
      <div className="text-center mb-12">
        <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-600 tracking-wide uppercase mb-4">
          {t('products.customerLove')}
        </h3>
        <h2 className="text-3xl md:text-4xl font-bold">
          {t('products.title')}{" "}
          <span className="inline text-gray-900 dark:text-gray-100">
            {t('products.atLaunch')}
          </span>
        </h2>
        <p className="text-muted-foreground text-2xl mt-4 mb-8 ">
          {t('products.description')}
        </p>
      </div>
      <BentoDemo />
    </section>
  );
};
