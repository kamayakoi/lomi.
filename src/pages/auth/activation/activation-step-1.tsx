import React from 'react';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

interface ActivationStep1Props {
    onNext: (data: Record<string, never>) => void;
}

const ActivationStep1: React.FC<ActivationStep1Props> = ({ onNext }) => {
    const { t } = useTranslation();
    const steps = t('activation.step1.steps', { returnObjects: true }) as string[];

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg dark:bg-green-900 dark:border-green-400">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                <p className="text-lg font-medium text-green-700 dark:text-green-100">{t('activation.step1.success_message')}</p>
            </div>

            <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-100">
                    {t('activation.step1.verification_intro')}
                </p>
                <p className="text-gray-700 font-medium dark:text-gray-100">
                    {t('activation.step1.process_title')}
                </p>
                <ul className="space-y-2">
                    {steps.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                            <ChevronRight className="h-4 w-4 text-primary" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <p className="text-sm text-gray-500 italic dark:text-gray-400">
                    {t('activation.step1.compliance_notice')}
                </p>
            </div>
            <div className="flex justify-end">
                <Button onClick={() => onNext({})} className="bg-green-500 hover:bg-green-600 text-white">
                    {t('common.next')}
                </Button>
            </div>
        </div>
    );
};

export default ActivationStep1;