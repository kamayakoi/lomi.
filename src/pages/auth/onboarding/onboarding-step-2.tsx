import { employeeRanges } from '@/utils/data/onboarding';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/actions/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import LogoUploader from '@//components/auth/logo-uploader';
import { useState, useEffect } from 'react';
import { type OnboardingData } from './onboarding';
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
} from '@/utils/data/onboarding';

const onboardingStep2Schema = z.object({
    orgName: z.string().min(1, 'onboarding.step2.org_name.required'),
    orgEmail: z.string().email('onboarding.step2.org_email.invalid'),
    orgEmployees: z.string().min(1, 'onboarding.step2.org_employees.required'),
    orgCountry: z.string().min(1, 'onboarding.step2.org_country.required'),
    orgRegion: z.string().min(1, 'onboarding.step2.org_region.required'),
    workspaceHandle: z.string().min(1, 'onboarding.step2.workspace_handle.required'),
});

export type OnboardingStep2Data = z.infer<typeof onboardingStep2Schema> & {
    logoUrl: string;
};

interface OnboardingStep2Props {
    onNext: (data: OnboardingStep2Data) => void;
    onPrevious: () => void;
    data: OnboardingData;
}

const OnboardingStep2: React.FC<OnboardingStep2Props> = ({ onNext, onPrevious, data }) => {
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
            workspaceHandle: data.workspaceHandle,
            logoUrl: data.logoUrl,
        },
    });

    const [logoUrl, setLogoUrl] = useState(data.logoUrl || '');

    const handleLogoUpdate = (newLogoUrl: string) => {
        const relativeLogoPath = newLogoUrl.replace(/^.*\/logos\//, '');
        setLogoUrl(relativeLogoPath);
    };

    const onSubmit = (formData: OnboardingStep2Data) => {
        onNext({ ...formData, logoUrl });
    };

    const generateWorkspaceHandle = (orgName: string) => {
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
                const workspaceHandle = value.orgName ? generateWorkspaceHandle(value.orgName) : '';
                onboardingForm.setValue('workspaceHandle', workspaceHandle);
            }
        });
        return () => subscription.unsubscribe();
    }, [onboardingForm]);

    return (
        <form onSubmit={onboardingForm.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-6">
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <Label htmlFor="orgName" className="block mb-2">{t('onboarding.step2.org_name.label')}</Label>
                        <Input
                            id="orgName"
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
                    <div className="flex-1">
                        <Label htmlFor="orgEmail" className="block mb-2">{t('onboarding.step2.org_email.label')}</Label>
                        <Input
                            id="orgEmail"
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
                    <div className="flex-1">
                        <Label htmlFor="orgEmployees" className="block mb-2">{t('onboarding.step2.org_employees.label')}</Label>
                        <select
                            id="orgEmployees"
                            {...onboardingForm.register("orgEmployees")}
                            className={cn(
                                "w-full mb-2 px-3 py-2 border h-[48px]",
                                "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                "appearance-none"
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
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <Label htmlFor="orgCountry" className="block mb-2">{t('onboarding.step2.org_country.label')}</Label>
                        <select
                            id="orgCountry"
                            {...onboardingForm.register("orgCountry")}
                            className={cn(
                                "w-full mb-2 px-3 py-2 border h-[48px]",
                                "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                "appearance-none"
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
                        <div className="flex-1">
                            <Label htmlFor="orgRegion" className="block mb-2">{t('onboarding.step2.org_region.label')}</Label>
                            <select
                                id="orgRegion"
                                {...onboardingForm.register("orgRegion")}
                                className={cn(
                                    "w-full mb-2 px-3 py-2 border h-[48px]",
                                    "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                    "appearance-none"
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
                        <div className="flex-1">
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
            <div className="mb-6 flex space-x-8">
                <div className="w-1/2 space-y-6">
                    <p className="text-sm font-medium">{t('onboarding.step2.logo.label')}</p>
                    <div className="ml-8">
                        <LogoUploader
                            currentLogo={logoUrl}
                            onLogoUpdate={handleLogoUpdate}
                            companyName={onboardingForm.watch('orgName')}
                        />
                    </div>
                </div>
                <div className="w-1/2 space-y-10">
                    <Label htmlFor="workspaceHandle" className="block mb-2">{t('onboarding.step2.workspace_handle.label')}</Label>
                    <div className="relative flex items-center h-[48px]">
                        <Input
                            id="workspaceHandle"
                            placeholder={t('onboarding.step2.workspace_handle.placeholder')}
                            {...onboardingForm.register("workspaceHandle")}
                            className={cn(
                                "w-full h-[48px] pl-[138.5px] text-base",
                                "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        <div className="absolute left-3 text-base text-muted-foreground">
                            portal.lomi.africa/
                        </div>
                    </div>
                    {onboardingForm.formState.errors.workspaceHandle &&
                        <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.workspaceHandle.message || '')}</p>
                    }
                </div>
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
                    className="mt-6 h-[48px] bg-black hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 text-white font-semibold text-base transition-all duration-300 ease-in-out hover:shadow-lg"
                >
                    {t('common.next')}
                </Button>
            </div>
        </form>
    );
};

export default OnboardingStep2;