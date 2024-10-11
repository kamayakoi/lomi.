import { industries, languages } from '@/utils/data/onboarding';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/actions/utils'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type OnboardingData } from './onboarding';

const onboardingStep4Schema = z.object({
    orgWebsite: z.string().min(1, 'Website is required').refine((value) => {
        if (!value) return false;
        const normalizedValue = value.replace(/^(https?:\/\/)?(www\.)?/i, '');
        try {
            new URL(`https://${normalizedValue}`);
            return true;
        } catch {
            return false;
        }
    }, 'Invalid website URL'),
    orgIndustry: z.string().min(1, 'Industry is required'),
    orgDefaultLanguage: z.string().min(1, 'Default language is required'),
    howDidYouHearAboutUs: z.string().min(1, 'Please let us know how you heard about us')
});

type OnboardingStep4Data = z.infer<typeof onboardingStep4Schema>;

interface OnboardingStep4Props {
    onSubmit: (data: OnboardingStep4Data) => void;
    onPrevious: () => void;
    data: OnboardingData;
}

const OnboardingStep4: React.FC<OnboardingStep4Props> = ({ onSubmit, onPrevious, data }) => {
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

    const handleSubmit = (data: OnboardingStep4Data) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={onboardingForm.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="mb-6">
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <Label htmlFor="orgWebsite" className="block mb-2">Website</Label>
                        <Input
                            id="orgWebsite"
                            placeholder="example.com"
                            {...onboardingForm.register("orgWebsite")}
                            className={cn(
                                "w-full mb-2",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgWebsite && (
                            <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgWebsite.message}</p>
                        )}
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="orgIndustry" className="block mb-2">Industry</Label>
                        <select
                            id="orgIndustry"
                            {...onboardingForm.register("orgIndustry")}
                            className={cn(
                                "w-full mb-2 px-3 py-2 border rounded-md h-10",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                "appearance-none"
                            )}
                        >
                            {industries.map((industry) => (
                                <option key={industry} value={industry}>
                                    {industry}
                                </option>
                            ))}
                        </select>
                        {onboardingForm.formState.errors.orgIndustry && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgIndustry.message}</p>}
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="orgDefaultLanguage" className="block mb-2">Preferred language</Label>
                        <select
                            id="orgDefaultLanguage"
                            {...onboardingForm.register("orgDefaultLanguage")}
                            className={cn(
                                "w-full mb-2 px-3 py-2 border rounded-md h-10",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                "appearance-none"
                            )}
                        >
                            {languages.map((language) => (
                                <option key={language} value={language}>
                                    {language}
                                </option>
                            ))}
                        </select>
                        {onboardingForm.formState.errors.orgDefaultLanguage && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgDefaultLanguage.message}</p>}
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <Label htmlFor="howDidYouHearAboutUs" className="block mb-2">How did you hear about us?</Label>
                <Input
                    id="howDidYouHearAboutUs"
                    placeholder="Share how you heard about us..."
                    {...onboardingForm.register("howDidYouHearAboutUs")}
                    className={cn(
                        "w-full mb-2",
                        "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    )}
                />
                {onboardingForm.formState.errors.howDidYouHearAboutUs && (
                    <p className="text-red-500 text-sm">{onboardingForm.formState.errors.howDidYouHearAboutUs.message}</p>
                )}
            </div>
            <div className="flex justify-between">
                <Button
                    type="button"
                    onClick={onPrevious}
                    className="mt-6 dark:bg-primary-600 dark:hover:bg-primary-700"
                >
                    Previous
                </Button>
                <Button type="submit" className="mt-6">
                    Let&apos;s Go!
                </Button>
            </div>
        </form>
    );
};

export default OnboardingStep4;
export type { OnboardingStep4Data };