import { useStripeConnect } from "../../src/lib/hooks/useStripeConnect";
import {
    ConnectAccountOnboarding,
    ConnectComponentsProvider,
} from "@stripe/react-connect-js";

export default function StripeOnboarding() {
    const stripeConnectInstance = useStripeConnect(null);

    const handleOnboardingExit = () => {
        // Redirect the user or perform any necessary actions when onboarding is complete
        console.log("Onboarding completed");
        // Add your desired logic here, e.g., navigate to a success page
    };

    return (
        <div className="container mx-auto">
            {stripeConnectInstance && (
                <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                    <div className="max-w-lg mx-auto mt-8">
                        <ConnectAccountOnboarding onExit={handleOnboardingExit} />
                    </div>
                </ConnectComponentsProvider>
            )}
        </div>
    );
}