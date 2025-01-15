import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/actions/utils'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type OnboardingData } from './onboarding';
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
} from '@/utils/data/onboarding';
import { OnboardingLanguageSwitcher } from '@/components/design/OnboardingLanguageSwitcher';

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
        <form onSubmit={onboardingForm.handleSubmit(onSubmit)} className="space-y-6">
            <div className="absolute top-4 right-4">
                <OnboardingLanguageSwitcher onLanguageChange={noop} />
            </div>
            <div className="mb-6">
                <div className="flex space-x-2">
                    {showCityField ? (
                        <div className="flex-1">
                            <Label htmlFor="orgCity" className="block mb-2">{t('onboarding.step3.org_city.label')}</Label>
                            <select
                                id="orgCity"
                                {...onboardingForm.register("orgCity")}
                                className={cn(
                                    "w-full mb-2 px-3 py-2 border h-[48px]",
                                    "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                    "appearance-none"
                                )}
                            >
                                <option value="">{t('onboarding.step3.org_city.placeholder')}</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                            {onboardingForm.formState.errors.orgCity &&
                                <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgCity.message || '')}</p>
                            }
                        </div>
                    ) : (
                        <div className="flex-1">
                            <Label htmlFor="orgCity" className="block mb-2">{t('onboarding.step3.org_city.label')}</Label>
                            <Input
                                id="orgCity"
                                placeholder={t('onboarding.step3.org_city.placeholder')}
                                {...onboardingForm.register("orgCity")}
                                className={cn(
                                    "w-full mb-2 px-3 py-2 border h-[48px]",
                                    "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                )}
                            />
                            {onboardingForm.formState.errors.orgCity &&
                                <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgCity.message || '')}</p>
                            }
                        </div>
                    )}
                    {showDistrictField ? (
                        <div className="flex-1">
                            <Label htmlFor="orgDistrict" className="block mb-2">{t('onboarding.step3.org_district.label')}</Label>
                            <select
                                id="orgDistrict"
                                {...onboardingForm.register("orgDistrict")}
                                className={cn(
                                    "w-full mb-2 px-3 py-2 border h-[48px]",
                                    "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                    "appearance-none"
                                )}
                            >
                                <option value="">{t('onboarding.step3.org_district.placeholder')}</option>
                                {districts.map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ))}
                            </select>
                            {onboardingForm.formState.errors.orgDistrict &&
                                <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgDistrict.message || '')}</p>
                            }
                        </div>
                    ) : (
                        <div className="flex-1">
                            <Label htmlFor="orgDistrict" className="block mb-2">{t('onboarding.step3.org_district.label')}</Label>
                            <Input
                                id="orgDistrict"
                                placeholder={t('onboarding.step3.org_district.placeholder')}
                                {...onboardingForm.register("orgDistrict")}
                                className={cn(
                                    "w-full mb-2 px-3 py-2 border h-[48px]",
                                    "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                    "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                )}
                            />
                            {onboardingForm.formState.errors.orgDistrict &&
                                <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgDistrict.message || '')}</p>
                            }
                        </div>
                    )}
                </div>
            </div>
            <div className="mb-6">
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <Label htmlFor="orgPostalCode" className="block mb-2">{t('onboarding.step3.org_postal_code.label')}</Label>
                        <Input
                            id="orgPostalCode"
                            placeholder={t('onboarding.step3.org_postal_code.placeholder')}
                            {...onboardingForm.register("orgPostalCode")}
                            className={cn(
                                "w-full mb-2 px-3 py-2 border h-[48px]",
                                "focus:ring-1 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgPostalCode &&
                            <p className="text-red-500 text-sm">{t(onboardingForm.formState.errors.orgPostalCode.message || '')}</p>
                        }
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="orgStreet" className="block mb-2">{t('onboarding.step3.org_street.label')}</Label>
                        <Input
                            id="orgStreet"
                            placeholder={t('onboarding.step3.org_street.placeholder')}
                            {...onboardingForm.register("orgStreet")}
                            className={cn(
                                "w-full mb-2 px-3 py-2 border h-[48px]",
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
            <div className="flex justify-between">
                <Button
                    type="button"
                    onClick={onPrevious}
                    className="mt-6 h-[48px] dark:bg-primary-600 dark:hover:bg-primary-700"
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

export default OnboardingStep3;