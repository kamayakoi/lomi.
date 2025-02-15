import { Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next';

const Progress: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
    </div>
);

const ActivationStep5: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="text-center py-12">
                <Clock className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold">{t('activation.step5.title')}</h2>
                <p className="text-muted-foreground">
                    {t('activation.step5.description')}
                </p>
            </div>
            <div className="space-y-2">
                <Progress value={33} />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t('activation.step5.day_1')}</span>
                    <span>{t('activation.step5.day_2')}</span>
                    <span>{t('activation.step5.day_3')}</span>
                </div>
            </div>
        </div>
    )
}

export default ActivationStep5;