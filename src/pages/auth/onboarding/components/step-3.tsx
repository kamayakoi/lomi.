import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/actions/utils'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type OnboardingData } from '../Onboarding';
import { useTranslation } from 'react-i18next';
import {
    senegalCities,
    cotedIvoireCities,
    dakarDistricts,
    abidjanDistricts,
    beninCities,
    togoCities,
    ghanaCities,
    lomeDistricts,
    cotonouDistricts,
    accraDistricts,
    nigeriaCities,
    abujaDistricts,
    lagosDistricts,
    nigerCities,
    niameyDistricts,
    maliCities,
    bamakoDistricts,
    burkinaFasoCities,
    ouagadougouDistricts,
} from '@/lib/data/onboarding';
import { OnboardingLanguageSwitcher } from '@/components/design/onboarding-language-switcher';
import { motion } from 'framer-motion';
import { ButtonExpand } from '@/components/design/button-expand';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const noop = () => undefined;

const onboardingStep3Schema = z.object({
    orgCity: z.string().min(1, 'onboarding.step3.org_city.required'),
    orgDistrict: z.string().min(1, 'onboarding.step3.org_district.required'),
    orgPostalCode: z.string().min(1, 'onboarding.step3.org_postal_code.required'),
    orgStreet: z.string().min(1, 'onboarding.step3.org_street.required'),
});

export type OnboardingStep3Data = z.infer<typeof onboardingStep3Schema>;

interface OnboardingStep3Props {
    onNext: (data: OnboardingStep3Data) => void;
    onPrevious: () => void;
    data: OnboardingData;
}

const OnboardingStep3: React.FC<OnboardingStep3Props> = ({ onNext, onPrevious, data }) => {
    const { t } = useTranslation();
    const onboardingForm = useForm<OnboardingStep3Data>({
        resolver: zodResolver(onboardingStep3Schema),
        mode: 'onChange',
        defaultValues: {
            orgCity: data.orgCity,
            orgDistrict: data.orgDistrict,
            orgPostalCode: data.orgPostalCode,
            orgStreet: data.orgStreet,
        },
    });

    const onSubmit = (formData: OnboardingStep3Data) => {
        onNext(formData);
    };

    const selectedCountry = data.orgCountry;
    const selectedCity = onboardingForm.watch('orgCity');

    const showCityField = ['Senegal', 'Côte d\'Ivoire', 'Benin', 'Togo', 'Ghana', 'Nigeria', 'Niger', 'Mali', 'Burkina Faso'].includes(selectedCountry);
    const showDistrictField = (selectedCity === 'Dakar' && selectedCountry === 'Senegal') ||
        (selectedCity === 'Abidjan' && selectedCountry === 'Côte d\'Ivoire') ||
        (selectedCity === 'Lomé' && selectedCountry === 'Togo') ||
        (selectedCity === 'Cotonou' && selectedCountry === 'Benin') ||
        (selectedCity === 'Accra' && selectedCountry === 'Ghana') ||
        (selectedCity === 'Abuja' && selectedCountry === 'Nigeria') ||
        (selectedCity === 'Lagos' && selectedCountry === 'Nigeria') ||
        (selectedCity === 'Niamey' && selectedCountry === 'Niger') ||
        (selectedCity === 'Bamako' && selectedCountry === 'Mali') ||
        (selectedCity === 'Ouagadougou' && selectedCountry === 'Burkina Faso');

    const cities = {
        'Senegal': senegalCities,
        'Côte d\'Ivoire': cotedIvoireCities,
        'Benin': beninCities,
        'Togo': togoCities,
        'Ghana': ghanaCities,
        'Nigeria': nigeriaCities,
        'Niger': nigerCities,
        'Mali': maliCities,
        'Burkina Faso': burkinaFasoCities,
    }[selectedCountry] || [];

    const districts = {
        'Dakar': dakarDistricts,
        'Abidjan': abidjanDistricts,
        'Lomé': lomeDistricts,
        'Cotonou': cotonouDistricts,
        'Accra': accraDistricts,
        'Abuja': abujaDistricts,
        'Lagos': lagosDistricts,
        'Niamey': niameyDistricts,
        'Bamako': bamakoDistricts,
        'Ouagadougou': ouagadougouDistricts,
    }[selectedCity] || [];

    return (
        <form onSubmit={onboardingForm.handleSubmit(onSubmit)} className="space-y-8">
            <div className="absolute top-8 sm:top-4 right-4">
                <OnboardingLanguageSwitcher onLanguageChange={noop} />
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
                        src="/okra/okra_home.svg"
                        alt="Address Information"
                        className="w-full h-auto object-contain"
                        loading="eager"
                    />
                </motion.div>

                {/* Right side - Form Content */}
                <div className="flex-1 w-full -mt-6">
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2">
                            {showCityField ? (
                                <div className="w-full sm:w-1/2">
                                    <Label htmlFor="orgCity" className="block mb-2">{t('onboarding.step3.org_city.label')}</Label>
                                    <select
                                        id="orgCity"
                                        autoComplete="address-level2"
                                        {...onboardingForm.register("orgCity", {
                                            onChange: () => {
                                                // Reset district when city changes
                                                onboardingForm.setValue('orgDistrict', '');
                                            }
                                        })}
                                        className={cn(
                                            "w-full mb-2 px-3 py-2 border h-[48px]",
                                            "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                            "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                            "appearance-none rounded-none"
                                        )}
                                    >
                                        <option value="">{t('onboarding.step3.org_city.placeholder')}</option>
                                        {cities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                    {onboardingForm.formState.errors.orgCity && (
                                        <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgCity.message || '')}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full sm:w-1/2">
                                    <Label htmlFor="orgCity" className="block mb-2">{t('onboarding.step3.org_city.label')}</Label>
                                    <Input
                                        id="orgCity"
                                        autoComplete="address-level2"
                                        placeholder={t('onboarding.step3.org_city.placeholder')}
                                        {...onboardingForm.register("orgCity")}
                                        className={cn(
                                            "w-full mb-2 h-[48px]",
                                            "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                            "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        )}
                                    />
                                    {onboardingForm.formState.errors.orgCity && (
                                        <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgCity.message || '')}</p>
                                    )}
                                </div>
                            )}
                            {showDistrictField ? (
                                <div className="w-full sm:w-1/2">
                                    <Label htmlFor="orgDistrict" className="block mb-2">{t('onboarding.step3.org_district.label')}</Label>
                                    <select
                                        id="orgDistrict"
                                        autoComplete="address-level3"
                                        {...onboardingForm.register("orgDistrict")}
                                        className={cn(
                                            "w-full mb-2 px-3 py-2 border h-[48px]",
                                            "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                            "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                            "appearance-none rounded-none"
                                        )}
                                    >
                                        <option value="">{t('onboarding.step3.org_district.placeholder')}</option>
                                        {districts.map((district) => (
                                            <option key={district} value={district}>
                                                {district}
                                            </option>
                                        ))}
                                    </select>
                                    {onboardingForm.formState.errors.orgDistrict && (
                                        <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgDistrict.message || '')}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full sm:w-1/2">
                                    <Label htmlFor="orgDistrict" className="block mb-2">{t('onboarding.step3.org_district.label')}</Label>
                                    <Input
                                        id="orgDistrict"
                                        autoComplete="address-level3"
                                        placeholder={t('onboarding.step3.org_district.placeholder')}
                                        {...onboardingForm.register("orgDistrict")}
                                        className={cn(
                                            "w-full mb-2 h-[48px]",
                                            "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                            "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        )}
                                    />
                                    {onboardingForm.formState.errors.orgDistrict && (
                                        <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgDistrict.message || '')}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2">
                            <div className="w-full sm:w-1/2">
                                <Label htmlFor="orgPostalCode" className="block mb-2">{t('onboarding.step3.org_postal_code.label')}</Label>
                                <Input
                                    id="orgPostalCode"
                                    autoComplete="postal-code"
                                    placeholder={t('onboarding.step3.org_postal_code.placeholder')}
                                    {...onboardingForm.register("orgPostalCode")}
                                    className={cn(
                                        "w-full mb-2 h-[48px]",
                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    )}
                                />
                                {onboardingForm.formState.errors.orgPostalCode &&
                                    <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgPostalCode.message || '')}</p>
                                }
                            </div>
                            <div className="w-full sm:w-1/2">
                                <Label htmlFor="orgStreet" className="block mb-2">{t('onboarding.step3.org_street.label')}</Label>
                                <Input
                                    id="orgStreet"
                                    autoComplete="street-address"
                                    placeholder={t('onboarding.step3.org_street.placeholder')}
                                    {...onboardingForm.register("orgStreet")}
                                    className={cn(
                                        "w-full mb-2 h-[48px]",
                                        "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    )}
                                />
                                {onboardingForm.formState.errors.orgStreet &&
                                    <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgStreet.message || '')}</p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between mt-6 mb-2">
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
                </div>
            </div>
        </form>
    );
};

export default OnboardingStep3;