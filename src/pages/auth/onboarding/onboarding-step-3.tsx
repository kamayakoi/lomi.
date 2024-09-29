import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const onboardingStep3Schema = z.object({
    orgCity: z.string().min(1, 'City is required'),
    orgDistrict: z.string().min(1, 'District is required'),
    orgPostalCode: z.string().min(1, 'Postal code is required'),
    orgAddress: z.string().min(1, 'Address is required'),
});

type OnboardingStep3Data = z.infer<typeof onboardingStep3Schema>;

interface OnboardingStep3Props {
    onNext: (data: OnboardingStep3Data) => void;
    onPrevious: () => void;
}

const OnboardingStep3: React.FC<OnboardingStep3Props> = ({ onNext, onPrevious }) => {
    const onboardingForm = useForm<OnboardingStep3Data>({
        resolver: zodResolver(onboardingStep3Schema),
        mode: 'onChange',
    });

    const onSubmit = (data: OnboardingStep3Data) => {
        onNext(data);
    };

    return (
        <form onSubmit={onboardingForm.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-6">
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <Label htmlFor="orgCity" className="mb-1">City</Label>
                        <Input
                            id="orgCity"
                            placeholder="Abidjan"
                            {...onboardingForm.register("orgCity")}
                            className={cn(
                                "w-full",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgCity && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgCity.message}</p>}
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="orgDistrict" className="mb-1">District</Label>
                        <Input
                            id="orgDistrict"
                            placeholder="Cocody"
                            {...onboardingForm.register("orgDistrict")}
                            className={cn(
                                "w-full",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgDistrict && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgDistrict.message}</p>}
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <Label htmlFor="orgPostalCode" className="mb-1">Postal code</Label>
                        <Input
                            id="orgPostalCode"
                            placeholder="01012"
                            {...onboardingForm.register("orgPostalCode")}
                            className={cn(
                                "w-full",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgPostalCode && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgPostalCode.message}</p>}
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="orgAddress" className="mb-1">Address</Label>
                        <Input
                            id="orgAddress"
                            placeholder="123 Rue des Jardins"
                            {...onboardingForm.register("orgAddress")}
                            className={cn(
                                "w-full",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgAddress && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgAddress.message}</p>}
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

export default OnboardingStep3;
export type { OnboardingStep3Data };