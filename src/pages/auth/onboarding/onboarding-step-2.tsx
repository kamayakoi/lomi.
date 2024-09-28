import { employeeRanges } from '@/data/onboarding';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const onboardingStep2Schema = z.object({
    orgName: z.string().min(1, 'Organization name is required'),
    orgEmail: z.string().email('Invalid email format'),
    orgEmployees: z.string().min(1, 'Number of employees is required'),
    orgCountry: z.string().min(1, 'Organization country is required'),
    orgRegion: z.string().min(1, 'Region is required'),
});

type OnboardingStep2Data = z.infer<typeof onboardingStep2Schema>;

interface OnboardingStep2Props {
    onNext: (data: OnboardingStep2Data) => void;
    onPrevious: () => void;
}

const OnboardingStep2: React.FC<OnboardingStep2Props> = ({ onNext, onPrevious }) => {
    const onboardingForm = useForm<OnboardingStep2Data>({
        resolver: zodResolver(onboardingStep2Schema),
        mode: 'onChange',
    });

    const onSubmit = (data: OnboardingStep2Data) => {
        onNext(data);
    };

    return (
        <form onSubmit={onboardingForm.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-6">
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <Label htmlFor="orgName" className="mb-1">Company name<span className="text-red-500">*</span></Label>
                        <Input
                            id="orgName"
                            placeholder="Ashanti Shoes Inc."
                            {...onboardingForm.register("orgName")}
                            className={cn(
                                "w-full",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgName && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgName.message}</p>}
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="orgEmail" className="mb-1">Company email<span className="text-red-500">*</span></Label>
                        <Input
                            id="orgEmail"
                            placeholder="jessy@example.com"
                            {...onboardingForm.register("orgEmail")}
                            className={cn(
                                "w-full",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgEmail && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgEmail.message}</p>}
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="orgEmployees" className="mb-1">Nb. of collaborators<span className="text-red-500">*</span></Label>
                        <select
                            id="orgEmployees"
                            {...onboardingForm.register("orgEmployees")}
                            className={cn(
                                "p-2 border rounded-md w-full",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        >
                            {employeeRanges.map((range) => (
                                <option key={range} value={range}>
                                    {range}
                                </option>
                            ))}
                        </select>
                        {onboardingForm.formState.errors.orgEmployees && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgEmployees.message}</p>}
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <Label htmlFor="orgCountry" className="mb-1">Company HQ<span className="text-red-500">*</span></Label>
                        <Input
                            id="orgCountry"
                            placeholder="Côte d'Ivoire"
                            {...onboardingForm.register("orgCountry")}
                            className={cn(
                                "w-full",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgCountry && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgCountry.message}</p>}
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="orgRegion" className="mb-1">Region<span className="text-red-500">*</span></Label>
                        <Input
                            id="orgRegion"
                            placeholder="Lagunes"
                            {...onboardingForm.register("orgRegion")}
                            className={cn(
                                "w-full",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgRegion && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgRegion.message}</p>}
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
                    Next
                </Button>
            </div>
        </form>
    );
};

export default OnboardingStep2;
export type { OnboardingStep2Data };