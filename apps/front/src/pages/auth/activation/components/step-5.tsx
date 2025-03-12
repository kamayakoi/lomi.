import { Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Progress: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full bg-gray-200 h-3 dark:bg-gray-700">
        <div className="bg-green-500 dark:bg-green-600 h-3" style={{ width: `${value}%` }}></div>
    </div>
);

const ActivationStep5: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center py-12"
            >
                <Clock className="w-20 h-20 text-green-500 dark:text-green-400 mx-auto mb-6 animate-pulse" />
                <h2 className="text-2xl font-bold mb-3">{t('activation.step5.title')}</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    {t('activation.step5.description')}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="space-y-3 max-w-lg mx-auto px-4"
            >
                <Progress value={33} />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span className="font-medium text-green-600 dark:text-green-400">{t('activation.step5.day_1')}</span>
                    <span>{t('activation.step5.day_2')}</span>
                    <span>{t('activation.step5.day_3')}</span>
                </div>
            </motion.div>
        </div>
    )
}

export default ActivationStep5;