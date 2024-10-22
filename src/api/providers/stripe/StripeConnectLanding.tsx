import { useState } from "react";
import { useStripeConnect } from "@/../src/lib/hooks/useStripeConnect";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";

export default function StripeConnectLanding() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [onboardingExited, setOnboardingExited] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState<string | null>(null);
  const stripeConnectInstance = useStripeConnect(connectedAccountId);

  const handleSignUp = async () => {
    setAccountCreatePending(true);
    setError(false);

    try {
      const response = await fetch("/account", {
        method: "POST",
      });

      if (response.ok) {
        const { account } = await response.json();

        if (account) {
          setConnectedAccountId(account);
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error creating connected account:", error);
      setError(true);
    }

    setAccountCreatePending(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100vw", height: "64px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "#09090b", color: "#ffffff" }}>
        <h2 style={{ marginBottom: "18px", marginTop: "18px" }}>lomi.</h2>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", textAlign: "center", width: "420px", paddingTop: "40px", marginBottom: "110px" }}>
        {!connectedAccountId && <h2 style={{ marginBottom: "0", fontSize: "20px" }}>Get ready for take off</h2>}
        {connectedAccountId && !stripeConnectInstance && <h2 style={{ marginBottom: "0", fontSize: "20px" }}>Add information to start accepting card payments and more integrations such as Apple Pay. </h2>}
        {!connectedAccountId && <p style={{ margin: "0", color: "#687385", padding: "8px 0" }}>lomi. is West Africa&apos;s Payment Orchestration Platform. We help businesses reach their customers on their preferred payment methods.</p>}
        {!accountCreatePending && !connectedAccountId && (
          <div>
            <button
              style={{ fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", fontSize: "16px", fontWeight: "600", border: "1px solid gray", borderRadius: "4px", marginTop: "32px", paddingTop: "10px", paddingBottom: "10px", backgroundColor: "#09090b", color: "#ffffff", width: "420px" }}
              onClick={handleSignUp}
            >
              Activate Stripe
            </button>
          </div>
        )}
        {stripeConnectInstance && (
          <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
            <ConnectAccountOnboarding
              onExit={() => setOnboardingExited(true)}
            />
          </ConnectComponentsProvider>
        )}
        {error && <p style={{ fontWeight: "400", color: "#E61947", fontSize: "14px" }}>Something went wrong!</p>}
        {(connectedAccountId || accountCreatePending || onboardingExited) && (
          <div style={{ position: "fixed", bottom: "110px", borderRadius: "4px", boxShadow: "0px 5px 15px 0px rgba(0, 0, 0, 0.12), 0px 15px 35px 0px rgba(48, 49, 61, 0.08)", padding: "9px 12px", backgroundColor: "#ffffff" }}>
            {connectedAccountId && <p>Your connected account ID is: <code style={{ fontWeight: "700", fontSize: "14px" }}>{connectedAccountId}</code></p>}
            {accountCreatePending && <p>Creating a connected account...</p>}
            {onboardingExited && <p>The Account Onboarding component has exited</p>}
          </div>
        )}
        <div style={{ position: "fixed", bottom: "40px", borderRadius: "4px", boxShadow: "0px 5px 15px 0px rgba(0, 0, 0, 0.12), 0px 15px 35px 0px rgba(48, 49, 61, 0.08)", padding: "9px 12px", backgroundColor: "#ffffff" }}>
          <p>
            This is a sample app for Connect onboarding using the Account Onboarding embedded component. <a href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=embedded" target="_blank" rel="noopener noreferrer">View docs</a>
          </p>
        </div>
      </div>
    </div>
  );
}