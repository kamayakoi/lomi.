import { employeeRanges } from '@/data/onboarding';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import LogoUploader from '@/pages/auth/components/logo-uploader';
import { useState, useEffect } from 'react';

const onboardingStep2Schema = z.object({
    orgName: z.string().min(1, 'Organization name is required'),
    orgEmail: z.string().email('Invalid email format'),
    orgEmployees: z.string().min(1, 'Number of employees is required'),
    orgCountry: z.string().min(1, 'Organization country is required'),
    orgRegion: z.string().min(1, 'Region is required'),
    workspaceHandle: z.string().min(1, 'Workspace handle is required'),
});

type OnboardingStep2Data = z.infer<typeof onboardingStep2Schema> & {
    logoUrl: string;
};

interface OnboardingStep2Props {
    onNext: (data: OnboardingStep2Data & { logoUrl: string }) => void;
    onPrevious: () => void;
}

const OnboardingStep2: React.FC<OnboardingStep2Props> = ({ onNext, onPrevious }) => {
    const onboardingForm = useForm<OnboardingStep2Data>({
        resolver: zodResolver(onboardingStep2Schema),
        mode: 'onChange',
    });

    const [logoUrl, setLogoUrl] = useState('');

    const onSubmit = (data: OnboardingStep2Data) => {
        const completeWorkspaceHandle = `portal.lomi.africa/${data.workspaceHandle}`;
        onNext({ ...data, logoUrl, workspaceHandle: completeWorkspaceHandle });
    };

    const generateWorkspaceHandle = (orgName: string) => {
        return orgName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

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
                        <Label htmlFor="orgName" className="block mb-2">Company name</Label>
                        <Input
                            id="orgName"
                            placeholder="Ashanti Shoes Inc."
                            {...onboardingForm.register("orgName")}
                            className={cn(
                                "w-full mb-2",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgName && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgName.message}</p>}
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="orgEmail" className="block mb-2">Company email</Label>
                        <Input
                            id="orgEmail"
                            placeholder="jessy@ashantishoes.com"
                            {...onboardingForm.register("orgEmail")}
                            className={cn(
                                "w-full mb-2",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgEmail && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgEmail.message}</p>}
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="orgEmployees" className="block mb-2">Nb. of collaborators</Label>
                        <select
                            id="orgEmployees"
                            {...onboardingForm.register("orgEmployees")}
                            className={cn(
                                "w-full mb-2 p-2 border rounded-md",
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
                        <Label htmlFor="orgCountry" className="block mb-2">Billing country</Label>
                        <Input
                            id="orgCountry"
                            placeholder="Côte d'Ivoire"
                            {...onboardingForm.register("orgCountry")}
                            className={cn(
                                "w-full mb-2",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgCountry && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgCountry.message}</p>}
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="orgRegion" className="block mb-2">Region</Label>
                        <Input
                            id="orgRegion"
                            placeholder="Lagunes"
                            {...onboardingForm.register("orgRegion")}
                            className={cn(
                                "w-full mb-2",
                                "focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:outline-none",
                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            )}
                        />
                        {onboardingForm.formState.errors.orgRegion && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.orgRegion.message}</p>}
                    </div>
                </div>
            </div>
            <div className="mb-6 flex space-x-8">
                <div className="w-1/2 space-y-6">
                    <p className="text-sm font-medium">Company logo</p>
                    <div className="ml-8">
                        <LogoUploader
                            currentLogo={logoUrl}
                            onLogoUpdate={setLogoUrl}
                            companyName={onboardingForm.watch('orgName')}
                        />
                    </div>
                </div>
                <div className="w-1/2 space-y-8">
                    <Label htmlFor="workspaceHandle" className="block mb-2">Workspace Handle</Label>
                    <div className="flex items-center border border-gray-300 rounded-md dark:border-gray-600">
                        <div className="px-3 py-2 text-gray-500 dark:text-gray-400">
                            portal.lomi.africa/
                        </div>
                        <Input
                            id="workspaceHandle"
                            placeholder="my-workspace"
                            {...onboardingForm.register("workspaceHandle")}
                            className={cn(
                                "w-full border-0 focus:ring-0 pl-0 ml-[-10px]",
                                "dark:bg-gray-800 dark:text-white"
                            )}
                        />
                    </div>
                    {onboardingForm.formState.errors.workspaceHandle && <p className="text-red-500 text-sm">{onboardingForm.formState.errors.workspaceHandle.message}</p>}
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