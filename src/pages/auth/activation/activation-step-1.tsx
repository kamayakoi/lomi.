import React from 'react';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ActivationStep1Props {
    onNext: (data: Record<string, never>) => void;
}

const ActivationStep1: React.FC<ActivationStep1Props> = ({ onNext }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg dark:bg-green-900 dark:border-green-400">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                <p className="text-lg font-medium text-green-700 dark:text-green-100">Your account has been created successfully!</p>
            </div>

            <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-100">
                    To complete your registration, we need to verify your business information.
                </p>
                <p className="text-gray-700 font-medium dark:text-gray-100">
                    Please proceed with our business verification process to:
                </p>
                <ul className="space-y-2">
                    {[
                        "Confirm your business details",
                        "Submit required documentation",
                        "Get your account activated",
                        "Start using our platform"
                    ].map((item, index) => (
                        <li key={index} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                            <ChevronRight className="h-4 w-4 text-primary" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <p className="text-sm text-gray-500 italic dark:text-gray-400">
                    This verification ensures the security of our platform and compliance with regulations in your country and in the Republic of Côte d&apos;Ivoire.
                </p>
            </div>
            <Button onClick={() => onNext({})}>Next</Button>
        </div>
    );
};

export default ActivationStep1;