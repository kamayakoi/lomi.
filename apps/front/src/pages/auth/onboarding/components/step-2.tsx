import { employeeRanges } from '@/lib/data/onboarding';
import { ButtonExpand } from '@/components/design/button-expand';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/actions/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import LogoUploader from '@/components/auth/logo-uploader';
import { useState, useEffect } from 'react';
import { type OnboardingData } from '../onboarding';
import { useTranslation } from 'react-i18next';
import {
    operatingCountries,
    senegalRegions,
    cotedIvoireRegions,
    beninRegions,
    togoRegions,
    ghanaRegions,
    nigeriaRegions,
    nigerRegions,
    maliRegions,
    burkinaFasoRegions,
} from '@/lib/data/onboarding';
import { OnboardingLanguageSwitcher } from '@/components/design/onboarding-language-switcher';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const noop = () => undefined;

const onboardingStep2Schema = z.object({
    orgName: z.string().min(1, 'onboarding.step2.org_name.required'),
    orgEmail: z.string().email('onboarding.step2.org_email.invalid'),
    orgEmployees: z.string().min(1, 'onboarding.step2.org_employees.required'),
    orgCountry: z.string().min(1, 'onboarding.step2.org_country.required'),
    orgRegion: z.string().min(1, 'onboarding.step2.org_region.required'),
    storeHandle: z.string().min(1, 'onboarding.step2.store_handle.required'),
});

export type OnboardingStep2Data = z.infer<typeof onboardingStep2Schema> & {
    logoUrl: string;
};

interface OnboardingStep2Props {
    onNext: (data: OnboardingStep2Data) => void;
    onPrevious: () => void;
    data: OnboardingData;
    onLogoUpdate?: (logoUrl: string) => void;
}

const OnboardingStep2: React.FC<OnboardingStep2Props> = ({ onNext, onPrevious, data, onLogoUpdate }) => {
    const { t } = useTranslation();
    const onboardingForm = useForm<OnboardingStep2Data>({
        resolver: zodResolver(onboardingStep2Schema),
        mode: 'onChange',
        defaultValues: {
            orgName: data.orgName,
            orgEmail: data.orgEmail,
            orgEmployees: data.orgEmployees,
            orgCountry: data.orgCountry,
            orgRegion: data.orgRegion,
            storeHandle: data.storeHandle,
            logoUrl: data.logoUrl,
        },
    });

    const [logoUrl, setLogoUrl] = useState(data.logoUrl || '');

    const handleLogoUpdate = (newLogoUrl: string) => {
        // Keep the full URL path for the logo
        const fullLogoUrl = newLogoUrl;

        // Update local state with full URL
        setLogoUrl(fullLogoUrl);

        // Update parent state with full URL
        if (onLogoUpdate) {
            onLogoUpdate(fullLogoUrl);
        }

        // Pass the full URL to form
        onboardingForm.setValue("logoUrl", fullLogoUrl);
    };

    const onSubmit = (formData: OnboardingStep2Data) => {
        // Include the full logo URL in the submission
        onNext({
            ...formData,
            logoUrl: logoUrl || formData.logoUrl
        });
    };

    const generateStoreHandle = (orgName: string) => {
        return orgName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const selectedCountry = onboardingForm.watch('orgCountry');
    const showRegionField = ['Senegal', 'Côte d\'Ivoire', 'Benin', 'Togo', 'Ghana', 'Nigeria', 'Niger', 'Mali', 'Burkina Faso'].includes(selectedCountry);

    const regions = {
        'Senegal': senegalRegions,
        'Côte d\'Ivoire': cotedIvoireRegions,
        'Benin': beninRegions,
        'Togo': togoRegions,
        'Ghana': ghanaRegions,
        'Nigeria': nigeriaRegions,
        'Niger': nigerRegions,
        'Mali': maliRegions,
        'Burkina Faso': burkinaFasoRegions,
    }[selectedCountry] || [];

    useEffect(() => {
        const subscription = onboardingForm.watch((value, { name }) => {
            if (name === 'orgName') {
                const storeHandle = value.orgName ? generateStoreHandle(value.orgName) : '';
                onboardingForm.setValue('storeHandle', storeHandle);
            }
        });
        return () => subscription.unsubscribe();
    }, [onboardingForm]);

    return (
        <form onSubmit={onboardingForm.handleSubmit(onSubmit)} className="space-y-0">
            <div className="absolute top-8 sm:top-4 right-4">
                <OnboardingLanguageSwitcher onLanguageChange={noop} />
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Left side - Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-[280px] lg:w-[380px] h-[280px] lg:h-[380px] relative flex-shrink-0 flex items-center justify-center"
                >
                    <img
                        src="/okra/okra_test_icon.svg"
                        alt="Organization Information"
                        className="w-full h-full object-contain"
                        loading="eager"
                    />
                </motion.div>

                {/* Right side - Form Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 w-full"
                >
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2">
                            <div className="w-full sm:w-1/3">
                                <Label htmlFor="orgName" className="block mb-2">{t('onboarding.step2.org_name.label')}</Label>
                                <Input
                                    id="orgName"
                                    autoComplete="organization"
                                    placeholder={t('onboarding.step2.org_name.placeholder')}
                                    {...onboardingForm.register("orgName")}
                                    className={cn(
                                        "w-full mb-2 h-[48px]",
                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    )}
                                />
                                {onboardingForm.formState.errors.orgName &&
                                    <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgName.message || '')}</p>
                                }
                            </div>
                            <div className="w-full sm:w-1/3">
                                <Label htmlFor="orgEmail" className="block mb-2">{t('onboarding.step2.org_email.label')}</Label>
                                <Input
                                    id="orgEmail"
                                    type="email"
                                    autoComplete="organization email"
                                    placeholder={t('onboarding.step2.org_email.placeholder')}
                                    {...onboardingForm.register("orgEmail")}
                                    className={cn(
                                        "w-full mb-2 h-[48px]",
                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    )}
                                />
                                {onboardingForm.formState.errors.orgEmail &&
                                    <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgEmail.message || '')}</p>
                                }
                            </div>
                            <div className="w-full sm:w-1/3">
                                <Label htmlFor="orgEmployees" className="block mb-2">{t('onboarding.step2.org_employees.label')}</Label>
                                <select
                                    id="orgEmployees"
                                    autoComplete="off"
                                    {...onboardingForm.register("orgEmployees")}
                                    className={cn(
                                        "w-full mb-2 px-3 py-2 border h-[48px]",
                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                        "appearance-none rounded-none"
                                    )}
                                >
                                    <option value="">{t('onboarding.step2.org_employees.placeholder')}</option>
                                    {employeeRanges.map((range) => (
                                        <option key={range} value={range}>
                                            {range}
                                        </option>
                                    ))}
                                </select>
                                {onboardingForm.formState.errors.orgEmployees &&
                                    <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgEmployees.message || '')}</p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2">
                            <div className="w-full sm:w-1/2">
                                <Label htmlFor="orgCountry" className="block mb-2">{t('onboarding.step2.org_country.label')}</Label>
                                <select
                                    id="orgCountry"
                                    autoComplete="country"
                                    {...onboardingForm.register("orgCountry", {
                                        onChange: () => {
                                            // Reset region when country changes
                                            onboardingForm.setValue('orgRegion', '');
                                        }
                                    })}
                                    className={cn(
                                        "w-full mb-2 px-3 py-2 border h-[48px]",
                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                        "appearance-none rounded-none"
                                    )}
                                >
                                    <option value="">{t('onboarding.step2.org_country.placeholder')}</option>
                                    {operatingCountries.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                                {onboardingForm.formState.errors.orgCountry &&
                                    <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgCountry.message || '')}</p>
                                }
                            </div>
                            {showRegionField ? (
                                <div className="w-full sm:w-1/2">
                                    <Label htmlFor="orgRegion" className="block mb-2">{t('onboarding.step2.org_region.label')}</Label>
                                    <select
                                        id="orgRegion"
                                        {...onboardingForm.register("orgRegion")}
                                        className={cn(
                                            "w-full mb-2 px-3 py-2 border h-[48px]",
                                            "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                            "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                            "appearance-none rounded-none"
                                        )}
                                    >
                                        <option value="">{t('onboarding.step2.org_region.placeholder')}</option>
                                        {regions.map((region) => (
                                            <option key={region} value={region}>
                                                {region}
                                            </option>
                                        ))}
                                    </select>
                                    {onboardingForm.formState.errors.orgRegion &&
                                        <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgRegion.message || '')}</p>
                                    }
                                </div>
                            ) : (
                                <div className="w-full sm:w-1/2">
                                    <Label htmlFor="orgRegion" className="block mb-2">{t('onboarding.step2.org_region.label')}</Label>
                                    <Input
                                        id="orgRegion"
                                        placeholder={t('onboarding.step2.org_region.placeholder')}
                                        {...onboardingForm.register("orgRegion")}
                                        className={cn(
                                            "w-full mb-2 px-3 py-2 border h-[48px]",
                                            "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                            "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        )}
                                    />
                                    {onboardingForm.formState.errors.orgRegion &&
                                        <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgRegion.message || '')}</p>
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mb-6 flex flex-col sm:flex-row space-y-6 sm:space-y-6 sm:space-x-8">
                        <div className="w-full sm:w-1/2 space-y-6">
                            <p className="text-sm font-medium">{t('onboarding.step2.logo.label')}</p>
                            <div className="ml-0 sm:ml-8">
                                <LogoUploader
                                    currentLogo={logoUrl}
                                    onLogoUpdate={handleLogoUpdate}
                                    companyName={onboardingForm.watch('orgName')}
                                />
                            </div>
                        </div>
                        <div className="w-full space-y-8 sm:w-1/2 sm:space-y-10">
                            <Label htmlFor="storeHandle" className="block mb-2 sm:-ml-3 sm:-mt-5">{t('onboarding.step2.store_handle.label')}</Label>
                            <div className="relative flex items-center sm:-ml-3 h-[48px]">
                                <Input
                                    id="storeHandle"
                                    autoComplete="off"
                                    placeholder={t('onboarding.step2.store_handle.placeholder')}
                                    {...onboardingForm.register("storeHandle")}
                                    className={cn(
                                        "w-full h-[48px] pl-[132.5px] text-base",
                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    )}
                                />
                                <div className="absolute left-3 text-base text-muted-foreground">
                                    store.lomi.africa/
                                </div>
                            </div>
                            {onboardingForm.formState.errors.storeHandle ? (
                                <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.storeHandle.message || '')}</p>
                            ) : (
                                <p className="text-xs text-muted-foreground mt-1 -translate-y-[70%]">
                                    {t('onboarding.step2.store_handle.help')}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between mt-8">
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
                            text={t('common.next')}
                            icon={ArrowRight}
                            iconPlacement="right"
                            bgColor="bg-black dark:bg-gray-800"
                            hoverBgColor="hover:bg-gray-900 dark:hover:bg-gray-700"
                            textColor="text-white"
                            hoverTextColor="hover:text-white"
                            className="h-[44px] sm:h-[48px] font-semibold text-base transition-all duration-300 ease-in-out hover:shadow-lg"
                            onClick={() => onboardingForm.handleSubmit(onSubmit)()}
                        />
                    </div>
                </motion.div>
            </div>
        </form>
    );
};

export default OnboardingStep2;