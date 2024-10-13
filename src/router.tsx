import React from 'react';
import Loader from '@/components/dashboard/loader.tsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import route utility components normally
import { ProtectedRoute } from './lib/routes/ProtectedRoute';
import { OnboardingRoute } from '@/lib/routes/OnboardingRoute';
import { SessionCheck } from '@/lib/routes/SessionCheck';
import { ActivationRoute } from '@/lib/routes/ActivationRoute';

// Import non-portal / non-essential pages normally
import Terms from './pages/Terms.tsx';
import Privacy from './pages/Privacy.tsx';
import Status from './pages/Status.tsx';

// // Import non-portal test pages normally
// import Test from './pages/test/test.tsx';
// import CheckoutTest from './pages/test/CheckoutTest.tsx';
// import CheckoutFormTest from './pages/test/CheckoutFormTest.tsx';
// import CheckoutSummaryTest from './pages/test/CheckoutSummaryTest.tsx';
// import PaymentMethodSelectorTest from './pages/test/PaymentMethodSelectorTest.tsx';

// Lazy load main home pages
const Home = React.lazy(() => import('./pages/Home.tsx'));
const About = React.lazy(() => import('./pages/About.tsx'));
const Products = React.lazy(() => import('./pages/Products.tsx'));
const Integrations = React.lazy(() => import('./pages/Integrations.tsx'));

// Lazy load auth pages
import Signin from './pages/auth/sign-in';
import Login from './pages/auth/log-in';
import Signup from './pages/auth/sign-up';
import Forgot from './pages/auth/forgot-password';
import OTP from './pages/auth/otp';
const Onboarding = React.lazy(() => import('./pages/auth/onboarding/onboarding'));
const AuthCallback = React.lazy(() => import('./pages/auth/callback'));
const Activation = React.lazy(() => import('./pages/auth/activation/activation'));

// Lazy load error pages
const GeneralError = React.lazy(() => import('./pages/errors/general-error.tsx'));
const NotFoundError = React.lazy(() => import('./pages/errors/not-found-error.tsx'));
const MaintenanceError = React.lazy(() => import('./pages/errors/maintenance-error.tsx'));

// Lazy load Stripe-related pages
const StripeCallback = React.lazy(() => import('../providers/stripe/callback/stripe-callback-index.tsx'));
const StripeConnectLanding = React.lazy(() => import("../providers/stripe/StripeConnectLanding"));

// Lazy load portal pages
const AppShell = React.lazy(() => import('./components/dashboard/app-shell'));
const Dashboard = React.lazy(() => import('./pages/portal/dashboard/Dashboard.tsx'));
const Integrators = React.lazy(() => import('./pages/portal/integrators/Integrators.tsx'));
const Settings = React.lazy(() => import('./pages/portal/settings/settings.tsx'));
const PaymentChannels = React.lazy(() => import('./pages/portal/payment-channels/PaymentChannels.tsx'));
const Logs = React.lazy(() => import('./pages/portal/logs-page/Logs.tsx'));
const Balance = React.lazy(() => import('./pages/portal/balance/Balance.tsx'));
const Cards = React.lazy(() => import('./pages/portal/accept-payments/cards/Cards.tsx'));
const EWallets = React.lazy(() => import('./pages/portal/accept-payments/eWallets/eWallets.tsx'));
const Transactions = React.lazy(() => import('./pages/portal/transactions/Transactions.tsx'));
const Reporting = React.lazy(() => import('./pages/portal/reporting/Reporting.tsx'));
const Webhooks = React.lazy(() => import('./pages/portal/webhooks/Webhooks.tsx'));
const PayoutLinks = React.lazy(() => import('./pages/portal/payout-links/PayoutLinks.tsx'));
const PaymentLinks = React.lazy(() => import('./pages/portal/payment-links/PaymentLinks.tsx'));
const Customers = React.lazy(() => import('./pages/portal/customers/Customers.tsx'));
const Subscription = React.lazy(() => import('./pages/portal/subscription/Subscription.tsx'));
const PaymentMethods = React.lazy(() => import('./pages/portal/settings/receiving-money/payment-methods.tsx'));
const CheckoutSettings = React.lazy(() => import('./pages/portal/settings/receiving-money/checkout/checkout-settings.tsx'));
const Disbursements = React.lazy(() => import('./pages/portal/settings/sending-money/disbursements.tsx'));
const DisbursementNotifications = React.lazy(() => import('./pages/portal/settings/sending-money/notifications.tsx'));
const Business = React.lazy(() => import('./pages/portal/settings/business-profile/business'));
const Profile = React.lazy(() => import('./pages/portal/settings/business-profile/profile'));
const BillingStatements = React.lazy(() => import('./pages/portal/settings/billing/statements.tsx'));
const FeeStructure = React.lazy(() => import('./pages/portal/settings/billing/fee-structure.tsx'));
const ApiKeys = React.lazy(() => import('./pages/portal/settings/developers/api-keys.tsx'));
const IpAllowlist = React.lazy(() => import('./pages/portal/settings/developers/ip-allowlist.tsx'));
const SettingsWebhooks = React.lazy(() => import('./pages/portal/settings/developers/webhooks.tsx'));
const BankAccounts = React.lazy(() => import('./pages/portal/settings/withdrawals/bank-accounts.tsx'));
const WithdrawalNotifications = React.lazy(() => import('./pages/portal/settings/withdrawals/email-notifications.tsx'));
const AutoWithdrawal = React.lazy(() => import('./pages/portal/settings/withdrawals/auto-withdrawal.tsx'));
const PhoneNumbers = React.lazy(() => import('./pages/portal/settings/withdrawals/phone-numbers.tsx'));

const AppRouter = () => (
    <Router>
        <SessionCheck>
            <Routes>
                {/* Website routes */}
                <Route path="/" element={<React.Suspense fallback={<Loader />}><Home /></React.Suspense>} />
                <Route path="/home" element={<React.Suspense fallback={<Loader />}><Home /></React.Suspense>} />
                <Route path="/about" element={<React.Suspense fallback={<Loader />}><About /></React.Suspense>} />
                <Route path="/products" element={<React.Suspense fallback={<Loader />}><Products /></React.Suspense>} />
                <Route path="/integrations" element={<React.Suspense fallback={<Loader />}><Integrations /></React.Suspense>} />

                {/* Non-essential Website routes */}
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/status" element={<Status />} />

                {/* Dashboard routes */}
                <Route path="/portal" element={
                    <ProtectedRoute>
                        <React.Suspense fallback={<Loader />}>
                            <AppShell />
                        </React.Suspense>
                    </ProtectedRoute>
                }>
                    <Route index element={<React.Suspense fallback={<Loader />}><Dashboard /></React.Suspense>} />
                    <Route path="integrations" element={<React.Suspense fallback={<Loader />}><Integrators /></React.Suspense>} />
                    <Route path="subscription" element={<React.Suspense fallback={<Loader />}><Subscription /></React.Suspense>} />
                    <Route path="payment-channels" element={<React.Suspense fallback={<Loader />}><PaymentChannels /></React.Suspense>} />
                    <Route path="logs" element={<React.Suspense fallback={<Loader />}><Logs /></React.Suspense>} />
                    <Route path="balance" element={<React.Suspense fallback={<Loader />}><Balance /></React.Suspense>} />
                    <Route path="cards" element={<React.Suspense fallback={<Loader />}><Cards /></React.Suspense>} />
                    <Route path="e-wallets" element={<React.Suspense fallback={<Loader />}><EWallets /></React.Suspense>} />
                    <Route path="transactions" element={<React.Suspense fallback={<Loader />}><Transactions /></React.Suspense>} />
                    <Route path="reporting" element={<React.Suspense fallback={<Loader />}><Reporting /></React.Suspense>} />
                    <Route path="webhooks" element={<React.Suspense fallback={<Loader />}><Webhooks /></React.Suspense>} />
                    <Route path="payout-links" element={<React.Suspense fallback={<Loader />}><PayoutLinks /></React.Suspense>} />
                    <Route path="payment-links" element={<React.Suspense fallback={<Loader />}><PaymentLinks /></React.Suspense>} />
                    <Route path="customers" element={<React.Suspense fallback={<Loader />}><Customers /></React.Suspense>} />
                    <Route path="stripe-connect-landing" element={<React.Suspense fallback={<Loader />}><StripeConnectLanding /></React.Suspense>} />

                    <Route path="settings" element={<React.Suspense fallback={<Loader />}><Settings /></React.Suspense>}>
                        <Route path="receiving-money/payment-methods" element={<React.Suspense fallback={<Loader />}><PaymentMethods /></React.Suspense>} />
                        <Route path="receiving-money/checkout" element={<React.Suspense fallback={<Loader />}><CheckoutSettings /></React.Suspense>} />
                        <Route path="sending-money/disbursements" element={<React.Suspense fallback={<Loader />}><Disbursements /></React.Suspense>} />
                        <Route path="sending-money/notifications" element={<React.Suspense fallback={<Loader />}><DisbursementNotifications /></React.Suspense>} />
                        <Route path="business" element={<React.Suspense fallback={<Loader />}><Business /></React.Suspense>} />
                        <Route path="profile" element={<React.Suspense fallback={<Loader />}><Profile /></React.Suspense>} />
                        <Route path="billing/statements" element={<React.Suspense fallback={<Loader />}><BillingStatements /></React.Suspense>} />
                        <Route path="billing/fee-structure" element={<React.Suspense fallback={<Loader />}><FeeStructure /></React.Suspense>} />
                        <Route path="developers/api-keys" element={<React.Suspense fallback={<Loader />}><ApiKeys /></React.Suspense>} />
                        <Route path="developers/ip-allowlist" element={<React.Suspense fallback={<Loader />}><IpAllowlist /></React.Suspense>} />
                        <Route path="developers/webhooks" element={<React.Suspense fallback={<Loader />}><SettingsWebhooks /></React.Suspense>} />
                        <Route path="withdrawals/bank-accounts" element={<React.Suspense fallback={<Loader />}><BankAccounts /></React.Suspense>} />
                        <Route path="withdrawals/email-notifications" element={<React.Suspense fallback={<Loader />}><WithdrawalNotifications /></React.Suspense>} />
                        <Route path="withdrawals/auto-withdrawal" element={<React.Suspense fallback={<Loader />}><AutoWithdrawal /></React.Suspense>} />
                        <Route path="withdrawals/phone-numbers" element={<React.Suspense fallback={<Loader />}><PhoneNumbers /></React.Suspense>} />
                    </Route>
                    <Route path="activation" element={
                        <ActivationRoute>
                            <React.Suspense fallback={<Loader />}>
                                <Activation />
                            </React.Suspense>
                        </ActivationRoute>
                    } />
                </Route>

                {/* Login/Signup routes */}
                <Route path="/sign-in" element={<Signin />} />
                <Route path="/log-in" element={<Login />} />
                <Route path="/sign-up" element={<Signup />} />
                <Route path="/forgot-password" element={<Forgot />} />
                <Route path="/otp" element={<OTP />} />
                <Route path="/onboarding" element={
                    <OnboardingRoute>
                        <React.Suspense fallback={<Loader />}>
                            <Onboarding />
                        </React.Suspense>
                    </OnboardingRoute>
                } />
                <Route path="/auth/callback" element={<React.Suspense fallback={<Loader />}><AuthCallback /></React.Suspense>} />

                {/* API routes */}
                <Route path="api/stripe/callback" element={<StripeCallback />} />

                {/* Test routes
                <Route path="test" element={<Test />}>
                    <Route path="checkout" element={<CheckoutTest />} />
                    <Route path="checkout-form" element={<CheckoutFormTest />} />
                    <Route path="checkout-summary" element={<CheckoutSummaryTest />} />
                    <Route path="payment-method-selector" element={<PaymentMethodSelectorTest />} />
                </Route> */}

                {/* Error routes */}
                <Route path="/500" element={<GeneralError />} />
                <Route path="/404" element={<NotFoundError />} />
                <Route path="/503" element={<MaintenanceError />} />
                <Route path="*" element={<NotFoundError />} />

            </Routes>
        </SessionCheck>
    </Router>
);

export default AppRouter;