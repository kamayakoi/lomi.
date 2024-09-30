import { useState, useEffect } from "react";
import { loadConnectAndInitialize, StripeConnectInstance } from "@stripe/connect-js";

export const useStripeConnect = (connectedAccountId: string | null) => {
    const [stripeConnectInstance, setStripeConnectInstance] = useState<StripeConnectInstance | undefined>();

    useEffect(() => {
        const initializeStripeConnect = async () => {
            if (connectedAccountId) {
                const fetchClientSecret = async () => {
                    const response = await fetch("/account_session", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            account: connectedAccountId,
                        }),
                    });

                    if (!response.ok) {
                        const { error } = await response.json();
                        throw new Error(`An error occurred: ${error}`);
                    } else {
                        const { client_secret: clientSecret } = await response.json();
                        return clientSecret;
                    }
                };

                try {
                    const stripeConnectInstance = await loadConnectAndInitialize({
                        publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY as string,
                        fetchClientSecret,
                        appearance: {
                            overlays: "dialog",
                            variables: {
                                colorPrimary: "#09090b",
                            },
                        },
                    });
                    setStripeConnectInstance(stripeConnectInstance);
                } catch (error) {
                    console.error("Error initializing Stripe Connect:", error);
                }
            }
        };

        initializeStripeConnect();
    }, [connectedAccountId]);

    return stripeConnectInstance;
};

export default useStripeConnect;