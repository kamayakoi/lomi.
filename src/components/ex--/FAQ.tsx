import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FAQProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8">
      <button
        className="w-full text-left p-8 bg-white dark:bg-[#121317] rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-gray-900 dark:text-white text-xl">{question}</span>
        <ChevronDown className={`h-8 w-8 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-4 p-8 bg-gray-50 dark:bg-[#1a1c23] rounded-2xl">
          <div className="text-muted-foreground dark:text-gray-300 text-lg" dangerouslySetInnerHTML={{ __html: answer }} />
        </div>
      )}
    </div>
  );
};

export const FAQ: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="faq" className="container py-32 sm:py-40">
      <div className="text-center mb-16">
        <h3 className="text-base font-semibold text-red-500 tracking-wide uppercase mb-6">
          {t('faq.support')}
        </h3>
        <h2 className="text-3xl md:text-4xl font-bold dark:text-white">
          {t('faq.title')}
        </h2>
        <p className="text-muted-foreground dark:text-gray-300 text-2xl md:text-2xl mt-4 mb-8">
          {t('faq.description')}
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        {Array.from({ length: 4 }, (_, index) => (
          <FAQItem key={index} question={t(`faq.questions.${index}.question`)} answer={t(`faq.questions.${index}.answer`)} />
        ))}
      </div>
      <div className="mt-16 text-center">
        <h3 className="text-base font-medium text-gray-600 dark:text-gray-400">
          {t('faq.stillHaveQuestions')}{' '}
          <a
            rel="noreferrer noopener"
            href="https://developers.lomi.africa/"
            className="text-primary transition-colors duration-200 hover:text-primary-dark no-underline hover:underline hover:decoration-[1px] hover:underline-offset-4 dark:hover:decoration-white"
          >
            {t('faq.visitSupportCenter')}
          </a>
        </h3>
      </div>
    </section>
  );
};
