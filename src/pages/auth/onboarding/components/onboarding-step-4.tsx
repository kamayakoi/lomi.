import { industries } from '@/lib/data/onboarding';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/actions/utils'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type OnboardingData } from '../onboarding';
import { useTranslation } from 'react-i18next';
import { OnboardingLanguageSwitcher } from '@/components/design/OnboardingLanguageSwitcher';
import { languages as i18nLanguages } from '@/lib/i18n/config';
import { motion } from 'framer-motion';
import { ButtonExpand } from '@/components/design/button-expand';
import { ArrowLeft, ArrowRight } from 'lucide-react';


interface FormData {
    orgWebsite: string;
    orgIndustry: string;
    orgDefaultLanguage: {
        code: string;
        name: string;
    };
    howDidYouHearAboutUs: string;
}

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
    orgDefaultLanguage: z.object({
        code: z.string().min(1, 'onboarding.step4.org_default_language.required'),
        name: z.string().min(1, 'onboarding.step4.org_default_language.required')
    }),
    howDidYouHearAboutUs: z.string().min(1, 'onboarding.step4.how_did_you_hear_about_us.required')
});

export type OnboardingStep4Data = {
    orgWebsite: string;
    orgIndustry: string;
    orgDefaultLanguage: string;
    howDidYouHearAboutUs: string;
};

interface OnboardingStep4Props {
    onSubmit: (data: OnboardingStep4Data) => void;
    onPrevious: () => void;
    data: OnboardingData;
}

const OnboardingStep4: React.FC<OnboardingStep4Props> = ({ onSubmit, onPrevious, data }) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18nLanguages.find(l => l.code === i18n.language) || i18nLanguages[0];

    const onboardingForm = useForm<FormData>({
        resolver: zodResolver(onboardingStep4Schema),
        mode: 'onChange',
        defaultValues: {
            orgWebsite: data.orgWebsite,
            orgIndustry: data.orgIndustry,
            orgDefaultLanguage: data.orgDefaultLanguage
                ? {
                    code: data.orgDefaultLanguage,
                    name: i18nLanguages.find(l => l.code === data.orgDefaultLanguage)?.name || 'English'
                }
                : currentLanguage,
            howDidYouHearAboutUs: data.howDidYouHearAboutUs,
        },
    });

    const handleLanguageChange = (language: { code: string; name: string }) => {
        onboardingForm.setValue('orgDefaultLanguage', language, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const handleSubmit = (formData: FormData) => {
        // Update i18n and localStorage
        i18n.changeLanguage(formData.orgDefaultLanguage.code);
        localStorage.setItem('language', formData.orgDefaultLanguage.code);

        // Submit with the language code for the database
        onSubmit({
            ...formData,
            orgDefaultLanguage: formData.orgDefaultLanguage.code
        });
    };

    return (
        <form onSubmit={onboardingForm.handleSubmit(handleSubmit)} className="space-y-0">
            <div className="absolute top-8 sm:top-4 right-4">
                <OnboardingLanguageSwitcher
                    onLanguageChange={handleLanguageChange}
                    value={onboardingForm.watch('orgDefaultLanguage.name')}
                />
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Left side - Image */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="w-full max-w-[280px] lg:w-[380px] relative flex-shrink-0"
                >
                    <img
                        src="/onboarding/okra_going_live.svg"
                        alt="Final Setup"
                        className="w-full h-auto object-contain"
                        loading="eager"
                    />
                </motion.div>

                {/* Right side - Form Content */}
                <div className="flex-1 w-full -mt-8">
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2">
                            <div className="w-full sm:w-1/3">
                                <Label htmlFor="orgWebsite" className="block mb-2">{t('onboarding.step4.org_website.label')}</Label>
                                <Input
                                    id="orgWebsite"
                                    placeholder={t('onboarding.step4.org_website.placeholder')}
                                    {...onboardingForm.register("orgWebsite")}
                                    className={cn(
                                        "w-full mb-2 h-[48px]",
                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    )}
                                />
                                {onboardingForm.formState.errors.orgWebsite && (
                                    <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgWebsite.message || '')}</p>
                                )}
                            </div>
                            <div className="w-full sm:w-1/3">
                                <Label htmlFor="orgIndustry" className="block mb-2">{t('onboarding.step4.org_industry.label')}</Label>
                                <select
                                    id="orgIndustry"
                                    {...onboardingForm.register("orgIndustry")}
                                    className={cn(
                                        "w-full mb-2 h-[48px]",
                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                        "appearance-none rounded-none px-3"
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
                            <div className="w-full sm:w-1/3">
                                <Label htmlFor="orgDefaultLanguage" className="block mb-2">{t('onboarding.step4.org_default_language.label')}</Label>
                                <select
                                    id="orgDefaultLanguage"
                                    value={onboardingForm.watch('orgDefaultLanguage.code')}
                                    onChange={(e) => {
                                        const lang = i18nLanguages.find(l => l.code === e.target.value) || i18nLanguages[0];
                                        handleLanguageChange(lang);
                                    }}
                                    className={cn(
                                        "w-full mb-2 h-[48px]",
                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                        "appearance-none rounded-none px-3"
                                    )}
                                >
                                    <option value="">{t('onboarding.step4.org_default_language.placeholder')}</option>
                                    {i18nLanguages.map((language) => (
                                        <option key={language.code} value={language.code}>
                                            {t(`onboarding.step4.org_default_language.options.${language.name.toLowerCase()}`)}
                                        </option>
                                    ))}
                                </select>
                                {onboardingForm.formState.errors.orgDefaultLanguage &&
                                    <p className="text-red-500 text-sm">{t('onboarding.step4.org_default_language.required')}</p>
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
                                "w-full mb-2 h-[48px]",
                                "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.howDidYouHearAboutUs && (
                            <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.howDidYouHearAboutUs.message || '')}</p>
                        )}
                    </div>
                    <div className="flex-1 flex items-end justify-between mt-8 sm:-mb-12">
                        <ButtonExpand
                            text={t('common.back')}
                            icon={ArrowLeft}
                            iconPlacement="left"
                            bgColor="bg-black dark:bg-gray-800"
                            hoverBgColor="hover:bg-gray-900 dark:hover:bg-gray-700"
                            textColor="text-white"
                            hoverTextColor="hover:text-white"
                            className="h-[44px] sm:h-[48px] font-semibold text-base transition-all duration-300 ease-in-out hover:shadow-lg"
                            onClick={onPrevious}
                        />
                        <ButtonExpand
                            text={t('common.submit')}
                            icon={ArrowRight}
                            iconPlacement="right"
                            bgColor="bg-black dark:bg-gray-800"
                            hoverBgColor="hover:bg-gray-900 dark:hover:bg-gray-700"
                            textColor="text-white"
                            hoverTextColor="hover:text-white"
                            className="h-[44px] sm:h-[48px] font-semibold text-base transition-all duration-300 ease-in-out hover:shadow-lg"
                            onClick={() => {
                                const formData = onboardingForm.getValues();
                                onSubmit({
                                    ...formData,
                                    orgDefaultLanguage: formData.orgDefaultLanguage.code
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default OnboardingStep4;