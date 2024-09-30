import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StripeConnectLanding() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

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
          // Redirect to the StripeOnboarding page
          navigate("/stripe-onboarding");
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
    <div className="container mx-auto">
      <div className="banner">
        <h2>lomi.</h2>
      </div>
      <div className="content">
        <h2>Get ready for take off</h2>
        <p>lomi. is the world&apos;s leading air travel platform: join our team of pilots to help people travel faster.</p>
        {!accountCreatePending && (
          <div>
            <button onClick={handleSignUp}>Sign up</button>
          </div>
        )}
        {error && <p className="error">Something went wrong!</p>}
        {accountCreatePending && <p>Creating a connected account...</p>}
        <div className="info-callout">
          <p>
            This is a sample app for Connect onboarding using the Account Onboarding embedded component. <a href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=embedded" target="_blank" rel="noopener noreferrer">View docs</a>
          </p>
        </div>
      </div>
    </div>
  );
}