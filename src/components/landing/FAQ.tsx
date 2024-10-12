import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQProps {
  question: string;
  answer: string;
}

const FAQList: FAQProps[] = [
  {
    question: "How quickly can I get started with lomi.?",
    answer: "Our onboarding is fast and straightforward. Once you set up your account and meet the KYC requirements outlined in our <a href='/terms' class='text-primary hover:underline'>Terms of Service</a>, you can start accepting payments.",
  },
  {
    question: "How do I create an account to start accepting payments?",
    answer: "To access our platform, simply click on this <a href='/sign-in' class='text-primary hover:underline'>connect</a> link and follow the steps to create your account.",
  },
  {
    question: "Can I schedule a demo to see how lomi. can help my business?",
    answer: "Absolutely! You can schedule a demo by contacting our team through the contact sales. We will respond promptly and guide you through the setup and integration process.",
  },
  {
    question: "What are the requirements for registering my website or app?",
    answer: "Your app must meet our security and compliance standards. After registration, complete the KYC proces and once verified, you can integrate our API and begin accepting payments.",
  },
];

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
  return (
    <section id="faq" className="container py-32 sm:py-40">
      <div className="text-center mb-16">
        <h3 className="text-base font-semibold text-red-500 tracking-wide uppercase mb-6">
          SUPPORT
        </h3>
        <h2 className="text-3xl md:text-4xl font-bold dark:text-white">
          Frequently asked questions
        </h2>
        <p className="text-muted-foreground dark:text-gray-300 text-2xl md:text-2xl mt-4 mb-8">
          Get answers to common questions about our products.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        {FAQList.map((item, index) => (
          <FAQItem key={index} {...item} />
        ))}
      </div>
      <div className="mt-16 text-center">
        <h3 className="text-base font-medium text-gray-600 dark:text-gray-400">
          Still have questions for us?{' '}
          <a
            rel="noreferrer noopener"
            href="https://developers.lomi.africa/"
            className="text-primary transition-colors duration-200 hover:text-primary-dark no-underline hover:underline hover:decoration-[1px] hover:underline-offset-4 dark:hover:decoration-white"
          >
            visit our support center
          </a>
        </h3>
      </div>
    </section>
  );
};