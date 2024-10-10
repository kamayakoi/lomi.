import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivationData } from "./activation";
import { countries } from "@/utils/data/onboarding";
import { Button } from "@/components/ui/button";

const activationStep2Schema = z.object({
    legalName: z.string().min(1, "Legal company name is required"),
    taxNumber: z.string().optional(),
    businessDescription: z.string().min(40, "Business description must be at least 40 characters"),
    country: z.string().min(1, "Country is required"),
    region: z.string().min(1, "Region is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    street: z.string().min(1, "Street is required"),
    proofOfBusiness: z.string().min(1, "Proof of business is required"),
    businessUrl: z.string().url("Must be a valid URL").or(z.literal("")),
});

type ActivationStep2Data = z.infer<typeof activationStep2Schema>;

interface ActivationStep2Props {
    onNext: (data: ActivationStep2Data) => void;
    onPrevious: () => void;
    data: ActivationData;
}

const ActivationStep2: React.FC<ActivationStep2Props> = ({ onNext, onPrevious, data }) => {
    const { control, handleSubmit, formState: { errors } } = useForm<ActivationStep2Data>({
        resolver: zodResolver(activationStep2Schema),
        defaultValues: data,
        mode: 'onChange',
    });

    const onSubmit = (data: ActivationStep2Data) => {
        onNext(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-lg font-semibold">Business details</h2>

            <div>
                <Label htmlFor="legalName">Legal company name</Label>
                <Controller
                    name="legalName"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="legalName"
                            placeholder="e.g. Ashanti Enterprises"
                            {...field}
                        />
                    )}
                />
                {errors.legalName && <p className="text-red-500 text-sm mt-1">{errors.legalName.message}</p>}
            </div>

            <div>
                <Label htmlFor="taxNumber">Tax number (optional)</Label>
                <Controller
                    name="taxNumber"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="taxNumber"
                            placeholder="e.g. CI-ABJ-03-2024-B12-07612"
                            {...field}
                        />
                    )}
                />
            </div>

            <div>
                <Label htmlFor="businessDescription">Business description</Label>
                <Controller
                    name="businessDescription"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            id="businessDescription"
                            placeholder="e.g. We're selling second-hand smartphones via Instagram."
                            {...field}
                        />
                    )}
                />
                {errors.businessDescription && <p className="text-red-500 text-sm mt-1">{errors.businessDescription.message}</p>}
                <p className="text-xs text-muted-foreground mt-1">Describe your products and sales channels.</p>
            </div>

            <div>
                <Label htmlFor="country">Country</Label>
                <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your country" />
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
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
            </div>

            <div>
                <Label htmlFor="region">Region</Label>
                <Controller
                    name="region"
                    control={control}
                    render={({ field }) => (
                        <Input id="region" placeholder="e.g. Lagunes" {...field} />
                    )}
                />
                {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region.message}</p>}
            </div>

            <div>
                <Label htmlFor="city">City</Label>
                <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                        <Input id="city" placeholder="e.g. Abidjan" {...field} />
                    )}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
            </div>

            <div>
                <Label htmlFor="postalCode">Postal code</Label>
                <Controller
                    name="postalCode"
                    control={control}
                    render={({ field }) => (
                        <Input id="postalCode" placeholder="e.g. 01012" {...field} />
                    )}
                />
                {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>}
            </div>

            <div>
                <Label htmlFor="street">Street</Label>
                <Controller
                    name="street"
                    control={control}
                    render={({ field }) => (
                        <Input id="street" placeholder="e.g. 123 Rue des Perles" {...field} />
                    )}
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>}
            </div>

            <div>
                <Label htmlFor="proofOfBusiness">Proof of business</Label>
                <Controller
                    name="proofOfBusiness"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your proof of business" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Live Website / Application">Live Website | Application</SelectItem>
                                <SelectItem value="Facebook / Instagram">Facebook | Instagram</SelectItem>
                                <SelectItem value="E-Commerce / Marketplace">E-Commerce | Marketplace</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.proofOfBusiness && <p className="text-red-500 text-sm mt-1">{errors.proofOfBusiness.message}</p>}
            </div>

            <div>
                <Label htmlFor="businessUrl">Link to your business page</Label>
                <Controller
                    name="businessUrl"
                    control={control}
                    render={({ field }) => (
                        <Input id="businessUrl" placeholder="e.g. https://www.ashantishoes.ci" {...field} />
                    )}
                />
                {errors.businessUrl && <p className="text-red-500 text-sm mt-1">{errors.businessUrl.message}</p>}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted p-1.5 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-red-500">
                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <p>Please ensure that the information provided matches your legal documents.</p>
            </div>

            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onPrevious}>
                    Back
                </Button>
                <Button type="submit">Next</Button>
            </div>

            <button type="submit" className="hidden">Submit</button>
        </form>
    );
};

export default ActivationStep2;
export type { ActivationStep2Data };