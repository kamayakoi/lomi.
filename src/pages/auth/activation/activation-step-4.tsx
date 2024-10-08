import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { ActivationData } from "./activation";

const activationStep4Schema = z.object({
    // Remove file-related fields for now
});

type ActivationStep4Data = z.infer<typeof activationStep4Schema>;

interface ActivationStep4Props {
    onSubmit: (data: ActivationData) => void;
    onPrevious: () => void;
    data: ActivationData;
}

const ActivationStep4: React.FC<ActivationStep4Props> = ({ onSubmit, onPrevious, data }) => {
    const { handleSubmit } = useForm<ActivationStep4Data>({
        resolver: zodResolver(activationStep4Schema),
        defaultValues: {},
    });

    const onFormSubmit = async () => {
        // Just pass the existing data without modifications
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <h2 className="text-lg font-semibold">Review and Submit</h2>

            <p>Please review your information before submitting:</p>

            <ul className="list-disc pl-5 space-y-2">
                <li>Legal Name: {data.legalName}</li>
                <li>Tax Number: {data.taxNumber}</li>
                <li>Business Description: {data.businessDescription}</li>
                <li>Country: {data.country}</li>
                <li>Region: {data.region}</li>
                <li>City: {data.city}</li>
                <li>Postal Code: {data.postalCode}</li>
                <li>Street: {data.street}</li>
                <li>Proof of Business: {data.proofOfBusiness}</li>
                <li>Business URL: {data.businessUrl}</li>
                <li>Full Name: {data.fullName}</li>
                <li>Email: {data.email}</li>
                <li>Phone: {data.countryCode} {data.mobileNumber}</li>
            </ul>

            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onPrevious}>
                    Back
                </Button>
                <Button type="submit">
                    Submit
                </Button>
            </div>
        </form>
    );
};

export default ActivationStep4;
export type { ActivationStep4Data };
