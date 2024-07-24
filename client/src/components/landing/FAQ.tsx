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
    question: "How quickly can I get started with lomi.?",
    answer: "Our onboarding process is simple and quick. You can start accepting payments the same day you set up your account.",
    value: "item-1",
  },
  {
    question: "How do I create an account to start accepting payments?",
    answer: "To get access to our platform, click on the 'Contact Sales' button and follow the instructions to complete the registration process.",
    value: "item-2",
  },
  {
    question: "Can I schedule a demo to see how your solution can help my business grow?",
    answer: "Yes, you can schedule a demo by contacting our sales team through our website.",
    value: "item-5",
  },
  {
    question: "What are the criteria for website or app registration?",
    answer: "Your website or app should meet our security and compliance standards. For detailed criteria, please refer to our registration guidelines. After registration, you'll have to verify your email and complete the KYC process. Once verified, you can integrate our API and start accepting payments.",
    value: "item-6",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="inline bg-gradient-to-r from-[#61DAFB] to-[#2563EB] text-transparent bg-clip-text">
          Questions
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