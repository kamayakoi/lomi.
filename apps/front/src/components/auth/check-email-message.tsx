import { useTranslation } from 'react-i18next';

interface CheckEmailMessageProps {
    email: string;
    onResendEmail: () => void;
}

export function CheckEmailMessage({ email, onResendEmail }: CheckEmailMessageProps) {
    const { t } = useTranslation();

    return (
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4">{t('auth.check_email.title')}</h2>
            <p className="mb-4">
                {t('auth.check_email.message').replace('<email>', email)}
            </p>
            <p className="text-sm text-muted-foreground">
                {t('auth.check_email.resend')}{' '}
                <button
                    className="text-primary hover:underline"
                    onClick={onResendEmail}
                >
                    {t('auth.check_email.resend_link')}
                </button>
            </p>
        </div>
    );
}