import { industries, languages } from '@/data/onboarding';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const onboardingStep4Schema = z.object({
    orgWebsite: z.string().min(1, 'Website is required').refine((value) => {
        if (!value) return false;
        try {
            new URL(value.startsWith('http') ? value : `https://${value}`);
            return true;
        } catch {
            return false;
        }
    }, 'Invalid website URL'),
    orgIndustry: z.string().min(1, 'Industry is required'),
    orgDefaultLanguage: z.string().min(1, 'Default language is required')
});

type OnboardingStep4Data = z.infer<typeof onboardingStep4Schema>;

interface OnboardingStep4Props {
    onSubmit: (data: OnboardingStep4Data) => void;
    onPrevious: () => void;
}

const OnboardingStep4: React.FC<OnboardingStep4Props> = ({ onSubmit, onPrevious }) => {
    const onboardingForm = useForm<OnboardingStep4Data>({
        resolver: zodResolver(onboardingStep4Schema),
        mode: 'onChange',
        defaultValues: {
            orgDefaultLanguage: 'English'
        }
    });

    const handleSubmit = (data: OnboardingStep4Data) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={onboardingForm.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="mb-6">
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <Label htmlFor="orgWebsite" className="mb-1">Website<span className="text-red-500">*</span></Label>
                        <Input
                            id="orgWebsite"
                            placeholder="example.com"
                            {...onboardingForm.register("orgWebsite")}
                            className={cn(
                                "w-full",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgWebsite && (
                            <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgWebsite.message}</p>
                        )}
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="orgIndustry" className="mb-1">Industry<span className="text-red-500">*</span></Label>
                        <select
                            id="orgIndustry"
                            {...onboardingForm.register("orgIndustry")}
                            className={cn(
                                "p-2 border rounded-md w-full",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                        <Label htmlFor="orgDefaultLanguage" className="mb-1">Preferred language<span className="text-red-500">*</span></Label>
                        <select
                            id="orgDefaultLanguage"
                            {...onboardingForm.register("orgDefaultLanguage")}
                            className={cn(
                                "p-2 border rounded-md w-full",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            <div className="flex justify-between">
                <Button
                    type="button"
                    onClick={onPrevious}
                    className="mt-6 dark:bg-primary-600 dark:hover:bg-primary-700"
                >
                    Previous
                </Button>
                <Button type="submit" className="mt-6">
                    Complete Onboarding
                </Button>
            </div>
        </form>
    );
};

export default OnboardingStep4;
export type { OnboardingStep4Data };