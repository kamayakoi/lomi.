import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "How quickly can I get started with Lomi?",
    answer: "Our onboarding is fast and straightforward. Once you set up your account and meet the KYC requirements outlined in our Terms of Service, you can start accepting payments the same day.",
    value: "item-1",
  },
  {
    question: "How do I create an account to start accepting payments?",
    answer: "To access our platform, simply click the 'Connect' button and follow the steps to create your account.",
    value: "item-2",
  },
  {
    question: "Can I schedule a demo to see how Lomi can help my business?",
    answer: "Absolutely! You can schedule a demo by contacting our team through the contact form. We will respond promptly and guide you through the setup and integration process.",
    value: "item-5",
  },
  {
    question: "What are the requirements for registering my website or app?",
    answer: "Your website or app must meet our security and compliance standards. After registration, complete the KYC process. Once verified, you can integrate our API and begin accepting payments.",
    value: "item-6",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 tracking-wide uppercase mb-4">
        SUPPORT
      </h3>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently asked{" "}
        <span className="inline text-gray-900 dark:text-gray-100">
          questions
        </span>
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full AccordionRoot"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem
            key={value}
            value={value}
          >
            <AccordionTrigger className="text-left" style={{ fontSize: '1.2rem' }}>
              {question}
            </AccordionTrigger>

            <AccordionContent style={{ fontSize: '1.06rem' }}>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="https://developers.lomi.africa/" // Updated link
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Visit our support center
        </a>
      </h3>
    </section>
  );
};