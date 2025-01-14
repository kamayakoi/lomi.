import { industries, languages } from '@/utils/data/onboarding';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/actions/utils'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type OnboardingData } from './onboarding';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/design/LanguageSwitcher';

const onboardingStep4Schema = z.object({
    orgWebsite: z.string().min(1, 'onboarding.step4.org_website.required').refine((value) => {
        if (!value) return false;
        const normalizedValue = value.replace(/^(https?:\/\/)?(www\.)?/i, '');
        try {
            new URL(`https://${normalizedValue}`);
            return true;
        } catch {
            return false;
        }
    }, 'onboarding.step4.org_website.invalid'),
    orgIndustry: z.string().min(1, 'onboarding.step4.org_industry.required'),
    orgDefaultLanguage: z.string().min(1, 'onboarding.step4.org_default_language.required'),
    howDidYouHearAboutUs: z.string().min(1, 'onboarding.step4.how_did_you_hear_about_us.required')
});

export type OnboardingStep4Data = z.infer<typeof onboardingStep4Schema>;

interface OnboardingStep4Props {
    onSubmit: (data: OnboardingStep4Data) => void;
    onPrevious: () => void;
    data: OnboardingData;
}

const OnboardingStep4: React.FC<OnboardingStep4Props> = ({ onSubmit, onPrevious, data }) => {
    const { t } = useTranslation();
    const onboardingForm = useForm<OnboardingStep4Data>({
        resolver: zodResolver(onboardingStep4Schema),
        mode: 'onChange',
        defaultValues: {
            orgWebsite: data.orgWebsite,
            orgIndustry: data.orgIndustry,
            orgDefaultLanguage: data.orgDefaultLanguage || 'English',
            howDidYouHearAboutUs: data.howDidYouHearAboutUs,
        },
    });

    const handleSubmit = (formData: OnboardingStep4Data) => {
        onSubmit(formData);
    };

    return (
        <form onSubmit={onboardingForm.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="absolute top-4 right-4">
                <LanguageSwitcher />
            </div>
            <div className="mb-6">
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <Label htmlFor="orgWebsite" className="block mb-2">{t('onboarding.step4.org_website.label')}</Label>
                        <Input
                            id="orgWebsite"
                            placeholder={t('onboarding.step4.org_website.placeholder')}
                            {...onboardingForm.register("orgWebsite")}
                            className={cn(
                                "w-full mb-2 px-3 py-2 border h-[48px]",
                                "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgWebsite && (
                            <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgWebsite.message || '')}</p>
                        )}
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="orgIndustry" className="block mb-2">{t('onboarding.step4.org_industry.label')}</Label>
                        <select
                            id="orgIndustry"
                            {...onboardingForm.register("orgIndustry")}
                            className={cn(
                                "w-full mb-2 px-3 py-2 border h-[48px]",
                                "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                "appearance-none"
                            )}
                        >
                            <option value="">{t('onboarding.step4.org_industry.placeholder')}</option>
                            {industries.map((industry) => (
                                <option key={industry} value={industry}>
                                    {t(`onboarding.step4.org_industry.options.${industry.toLowerCase()}`)}
                                </option>
                            ))}
                        </select>
                        {onboardingForm.formState.errors.orgIndustry &&
                            <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgIndustry.message || '')}</p>
                        }
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="orgDefaultLanguage" className="block mb-2">{t('onboarding.step4.org_default_language.label')}</Label>
                        <select
                            id="orgDefaultLanguage"
                            {...onboardingForm.register("orgDefaultLanguage")}
                            className={cn(
                                "w-full mb-2 px-3 py-2 border h-[48px]",
                                "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                "appearance-none"
                            )}
                        >
                            <option value="">{t('onboarding.step4.org_default_language.placeholder')}</option>
                            {languages.map((language) => (
                                <option key={language} value={language}>
                                    {t(`onboarding.step4.org_default_language.options.${language.toLowerCase()}`)}
                                </option>
                            ))}
                        </select>
                        {onboardingForm.formState.errors.orgDefaultLanguage &&
                            <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgDefaultLanguage.message || '')}</p>
                        }
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <Label htmlFor="howDidYouHearAboutUs" className="block mb-2">{t('onboarding.step4.how_did_you_hear_about_us.label')}</Label>
                <Input
                    id="howDidYouHearAboutUs"
                    placeholder={t('onboarding.step4.how_did_you_hear_about_us.placeholder')}
                    {...onboardingForm.register("howDidYouHearAboutUs")}
                    className={cn(
                        "w-full mb-2 px-3 py-2 border h-[48px]",
                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    )}
                />
                {onboardingForm.formState.errors.howDidYouHearAboutUs && (
                    <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.howDidYouHearAboutUs.message || '')}</p>
                )}
            </div>
            <div className="flex justify-between">
                <Button
                    type="button"
                    onClick={onPrevious}
                    className="mt-6 h-[48px] bg-black hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 text-white font-semibold text-base transition-all duration-300 ease-in-out hover:shadow-lg"
                >
                    {t('common.back')}
                </Button>
                <Button
                    type="submit"
                    className="mt-6 h-[48px] bg-black hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold text-base transition-all duration-300 ease-in-out hover:shadow-lg"
                >
                    {t('common.submit')}
                </Button>
            </div>
        </form>
    );
};

export default OnboardingStep4;