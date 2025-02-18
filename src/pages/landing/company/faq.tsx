import { useTranslation } from "react-i18next"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQPage() {
    const { t } = useTranslation()

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-8">
                    {t('features.faq.title', 'Frequently Asked Questions')}
                </h1>
                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                {t('features.faq.questions.pricing', 'How does lomi. pricing work?')}
                            </AccordionTrigger>
                            <AccordionContent>
                                {t('features.faq.answers.pricing', 'lomi. offers transparent pricing with no hidden fees. We charge a small percentage per transaction, and you only pay for what you use.')}
                            </AccordionContent>
                        </AccordionItem>
                        {/* Add more FAQ items here */}
                    </Accordion>
                </div>
            </div>
        </div>
    )
}

export default FAQPage 