import React from 'react';
import { CheckCircle, ChevronRight } from 'lucide-react';

const ActivationStep1: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <p className="text-lg font-medium text-green-700">Your account has been created successfully!</p>
            </div>

            <div className="space-y-4">
                <p className="text-gray-700">
                    To complete your registration, we need to verify your business information.
                </p>
                <p className="text-gray-700 font-medium">
                    Please proceed with our business verification process to:
                </p>
                <ul className="space-y-2">
                    {[
                        "Confirm your business details",
                        "Submit required documentation",
                        "Get your account activated",
                        "Start using our platform"
                    ].map((item, index) => (
                        <li key={index} className="flex items-center space-x-2 text-gray-600">
                            <ChevronRight className="h-4 w-4 text-primary" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <p className="text-sm text-gray-500 italic">
                    This verification ensures the security of our platform and compliance with regulations in your country and in the Republic of Côte d&apos;Ivoire.
                </p>
            </div>
        </div>
    );
};

export default ActivationStep1;