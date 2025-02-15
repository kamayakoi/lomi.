import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivationData } from "../Activation";
import { countries } from "@/lib/data/onboarding";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const activationStep2Schema = z.object({
    legalName: z.string().min(1, "activation.step2.legal_name.error"),
    taxNumber: z.string().optional(),
    businessDescription: z.string().min(40, "activation.step2.business_description.error"),
    country: z.string().min(1, "activation.step2.country.error"),
    region: z.string().min(1, "activation.step2.region.error"),
    city: z.string().min(1, "activation.step2.city.error"),
    postalCode: z.string().min(1, "activation.step2.postal_code.error"),
    street: z.string().min(1, "activation.step2.street.error"),
    proofOfBusiness: z.string().min(1, "activation.step2.proof_of_business.error"),
    businessUrl: z.string().url("activation.step2.business_url.error").or(z.literal("")),
});

type ActivationStep2Data = z.infer<typeof activationStep2Schema>;

interface ActivationStep2Props {
    onNext: (data: ActivationStep2Data) => void;
    onPrevious: () => void;
    data: ActivationData;
}

const ActivationStep2: React.FC<ActivationStep2Props> = ({ onNext, onPrevious, data }) => {
    const { t } = useTranslation();
    const { control, handleSubmit, formState: { errors } } = useForm<ActivationStep2Data>({
        resolver: zodResolver(activationStep2Schema),
        defaultValues: data,
        mode: 'onChange',
    });

    const onSubmit = (data: ActivationStep2Data) => {
        onNext(data);
    };

    const getErrorMessage = (error: { message?: string }) => {
        if (!error.message) return '';
        return t(error.message);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-lg font-semibold">{t('activation.step2.title')}</h2>

            <div>
                <Label htmlFor="legalName" className="block mb-4">{t('activation.step2.legal_name.label')}</Label>
                <Controller
                    name="legalName"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="legalName"
                            placeholder={t('activation.step2.legal_name.placeholder')}
                            className="rounded-none"
                            {...field}
                        />
                    )}
                />
                {errors.legalName && <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.legalName)}</p>}
            </div>

            <div>
                <Label htmlFor="taxNumber" className="block mb-4">{t('activation.step2.tax_number.label')}</Label>
                <Controller
                    name="taxNumber"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="taxNumber"
                            placeholder={t('activation.step2.tax_number.placeholder')}
                            className="rounded-none"
                            {...field}
                        />
                    )}
                />
            </div>

            <div>
                <Label htmlFor="businessDescription" className="block mb-4">{t('activation.step2.business_description.label')}</Label>
                <Controller
                    name="businessDescription"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            id="businessDescription"
                            placeholder={t('activation.step2.business_description.placeholder')}
                            className="rounded-none min-h-[100px]"
                            {...field}
                        />
                    )}
                />
                {errors.businessDescription && <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.businessDescription)}</p>}
                <p className="text-xs text-muted-foreground mt-1">{t('activation.step2.business_description.helper')}</p>
            </div>

            <div>
                <Label htmlFor="country" className="block mb-4">{t('activation.step2.country.label')}</Label>
                <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="rounded-none">
                                <SelectValue placeholder={t('activation.step2.country.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map((country) => (
                                    <SelectItem key={country} value={country}>
                                        {country}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.country && <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.country)}</p>}
            </div>

            <div>
                <Label htmlFor="region" className="block mb-4">{t('activation.step2.region.label')}</Label>
                <Controller
                    name="region"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="region"
                            placeholder={t('activation.step2.region.placeholder')}
                            className="rounded-none"
                            {...field}
                        />
                    )}
                />
                {errors.region && <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.region)}</p>}
            </div>

            <div>
                <Label htmlFor="city" className="block mb-4">{t('activation.step2.city.label')}</Label>
                <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="city"
                            placeholder={t('activation.step2.city.placeholder')}
                            className="rounded-none"
                            {...field}
                        />
                    )}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.city)}</p>}
            </div>

            <div>
                <Label htmlFor="postalCode" className="block mb-4">{t('activation.step2.postal_code.label')}</Label>
                <Controller
                    name="postalCode"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="postalCode"
                            placeholder={t('activation.step2.postal_code.placeholder')}
                            className="rounded-none"
                            {...field}
                        />
                    )}
                />
                {errors.postalCode && <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.postalCode)}</p>}
            </div>

            <div>
                <Label htmlFor="street" className="block mb-4">{t('activation.step2.street.label')}</Label>
                <Controller
                    name="street"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="street"
                            placeholder={t('activation.step2.street.placeholder')}
                            className="rounded-none"
                            {...field}
                        />
                    )}
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.street)}</p>}
            </div>

            <div>
                <Label htmlFor="proofOfBusiness" className="block mb-4">{t('activation.step2.proof_of_business.label')}</Label>
                <Controller
                    name="proofOfBusiness"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="rounded-none">
                                <SelectValue placeholder={t('activation.step2.proof_of_business.placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Live Website / Application">{t('activation.step2.proof_of_business.options.website')}</SelectItem>
                                <SelectItem value="Facebook / Instagram">{t('activation.step2.proof_of_business.options.social')}</SelectItem>
                                <SelectItem value="E-Commerce / Marketplace">{t('activation.step2.proof_of_business.options.marketplace')}</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.proofOfBusiness && <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.proofOfBusiness)}</p>}
            </div>

            <div>
                <Label htmlFor="businessUrl" className="block mb-4">{t('activation.step2.business_url.label')}</Label>
                <Controller
                    name="businessUrl"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="businessUrl"
                            placeholder={t('activation.step2.business_url.placeholder')}
                            className="rounded-none"
                            {...field}
                        />
                    )}
                />
                {errors.businessUrl && <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.businessUrl)}</p>}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted dark:bg-gray-800 dark:border dark:border-gray-700 p-1.5 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-red-500">
                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <p>{t('activation.step2.legal_notice')}</p>
            </div>

            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onPrevious}>
                    {t('common.back')}
                </Button>
                <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                    {t('common.next')}
                </Button>
            </div>

            <button type="submit" className="hidden">Submit</button>
        </form>
    );
};

export default ActivationStep2;
export type { ActivationStep2Data };