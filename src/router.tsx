import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx';
import { OnboardingRoute } from '@/components/auth/OnboardingRoute';
import { SessionCheck } from '@/components/auth/SessionCheck';
import React, { Suspense } from 'react';
import Loader from '@/components/dashboard/loader';

// Home and landing Pages
const Home = React.lazy(() => import("./pages/home/Home.tsx"));
const About = React.lazy(() => import('./pages/About.tsx'));
const Products = React.lazy(() => import('./pages/Products.tsx'));
const Integrations = React.lazy(() => import('./pages/Integrations.tsx'));
const Careers = React.lazy(() => import('./pages/Careers.tsx'));
const Terms = React.lazy(() => import('./pages/Terms.tsx'));
const Privacy = React.lazy(() => import('./pages/Privacy.tsx'));

// Connect Pages
const Signin = React.lazy(() => import('./pages/auth/sign-in.tsx'));
const Login = React.lazy(() => import('./pages/auth/log-in.tsx'));
const Signup = React.lazy(() => import('./pages/auth/sign-up.tsx'));
const Forgot = React.lazy(() => import('./pages/auth/forgot-password.tsx'));
const OTP = React.lazy(() => import('./pages/auth/otp.tsx'));
const Onboarding = React.lazy(() => import('./pages/auth/onboarding/onboarding.tsx'));
const AuthCallback = React.lazy(() => import('./pages/auth/callback'));
const ResetPassword = React.lazy(() => import('./pages/auth/reset-password.tsx'));

// Error Pages
const GeneralError = React.lazy(() => import('./pages/errors/general-error.tsx'));
const NotFoundError = React.lazy(() => import('./pages/errors/not-found-error.tsx'));
const MaintenanceError = React.lazy(() => import('./pages/errors/maintenance-error.tsx'));

// Dashboard
import AppShell from './components/dashboard/app-shell';
import Dashboard from './pages/portal/dashboard/Dashboard.tsx';
import Integrators from './pages/portal/integrators/Integrators.tsx';
import Settings from './pages/portal/settings/settings.tsx';
import PaymentChannels from './pages/portal/payment-channels/PaymentChannels.tsx';
import Logs from './pages/portal/logsP/Logs.tsx';
import Balance from './pages/portal/balance/Balance.tsx';
import Cards from './pages/portal/accept-payments/cards/Cards.tsx';
import EWallets from './pages/portal/accept-payments/eWallets/eWallets.tsx';
import Transactions from './pages/portal/transactions/Transactions.tsx';
import Reporting from './pages/portal/reporting/Reporting.tsx';
import Webhooks from './pages/portal/webhooks/Webhooks.tsx';
import PayoutLinks from './pages/portal/payout-links/PayoutLinks.tsx';
import PaymentLinks from './pages/portal/payment-links/PaymentLinks.tsx';
import Customers from './pages/portal/customers/Customers.tsx';
import Subscription from "./pages/portal/subscription/Subscription.tsx";

// Settings pages
import PaymentMethods from './pages/portal/settings/receiving-money/payment-methods.tsx';
import CheckoutSettings from './pages/portal/settings/receiving-money/checkout/checkout-settings.tsx';
import Disbursements from './pages/portal/settings/sending-money/disbursements.tsx';
import DisbursementNotifications from './pages/portal/settings/sending-money/notifications.tsx';
import Business from './pages/portal/settings/business-profile/business';
import Profile from './pages/portal/settings/business-profile/profile';
import BillingStatements from './pages/portal/settings/billing/statements.tsx';
import FeeStructure from './pages/portal/settings/billing/fee-structure.tsx';
import ApiKeys from './pages/portal/settings/developers/api-keys.tsx';
import IpAllowlist from './pages/portal/settings/developers/ip-allowlist.tsx';
import SettingsWebhooks from './pages/portal/settings/developers/webhooks.tsx';
import BankAccounts from './pages/portal/settings/withdrawals/bank-accounts.tsx';
import WithdrawalNotifications from './pages/portal/settings/withdrawals/email-notifications.tsx';
import AutoWithdrawal from './pages/portal/settings/withdrawals/auto-withdrawal.tsx';
import PhoneNumbers from './pages/portal/settings/withdrawals/phone-numbers.tsx';
import Status from './pages/Status.tsx';

import Activation from './pages/auth/kyc/activation.tsx';

// API pages
const StripeCallback = React.lazy(() => import('../providers/stripe/callback/stripe-callback-index.tsx'));
const StripeConnectLanding = React.lazy(() => import("../providers/stripe/StripeConnectLanding"));

// Test pages
const Test = React.lazy(() => import('./pages/test/test.tsx'));
const CheckoutTest = React.lazy(() => import('./pages/test/CheckoutTest.tsx'));
const CheckoutFormTest = React.lazy(() => import('./pages/test/CheckoutFormTest.tsx'));
const CheckoutSummaryTest = React.lazy(() => import('./pages/test/CheckoutSummaryTest.tsx'));
const PaymentMethodSelectorTest = React.lazy(() => import('./pages/test/PaymentMethodSelectorTest.tsx'));

const AppRouter = () => (
    <Router>
        <SessionCheck>
            <Routes>
                {/* Website routes */}
                <Route path="/" element={
                    <Suspense fallback={<Loader />}>
                        <Home />
                    </Suspense>
                } />
                <Route path="/home" element={
                    <Suspense fallback={<Loader />}>
                        <Home />
                    </Suspense>
                } />
                <Route path="/about" element={
                    <Suspense fallback={<Loader />}>
                        <About />
                    </Suspense>
                } />
                <Route path="/products" element={
                    <Suspense fallback={<Loader />}>
                        <Products />
                    </Suspense>
                } />
                <Route path="/integrations" element={
                    <Suspense fallback={<Loader />}>
                        <Integrations />
                    </Suspense>
                } />
                <Route path="/careers" element={
                    <Suspense fallback={<Loader />}>
                        <Careers />
                    </Suspense>
                } />
                <Route path="/terms" element={
                    <Suspense fallback={<Loader />}>
                        <Terms />
                    </Suspense>
                } />
                <Route path="/privacy" element={
                    <Suspense fallback={<Loader />}>
                        <Privacy />
                    </Suspense>
                } />
                <Route path="/status" element={
                    <Suspense fallback={<Loader />}>
                        <Status />
                    </Suspense>
                } />

                {/* Dashboard routes */}
                <Route path="/portal" element={
                    <ProtectedRoute>
                        <AppShell />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="integrations" element={<Integrators />} />
                    <Route path="subscription" element={<Subscription />} />
                    <Route path="payment-channels" element={<PaymentChannels />} />
                    <Route path="logs" element={<Logs />} />
                    <Route path="balance" element={<Balance />} />
                    <Route path="cards" element={<Cards />} />
                    <Route path="e-wallets" element={<EWallets />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="reporting" element={<Reporting />} />
                    <Route path="webhooks" element={<Webhooks />} />
                    <Route path="payout-links" element={<PayoutLinks />} />
                    <Route path="payment-links" element={<PaymentLinks />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="stripe-connect-landing" element={<StripeConnectLanding />} />

                    <Route path="settings" element={<Settings />}>
                        <Route path="receiving-money/payment-methods" element={<PaymentMethods />} />
                        <Route path="receiving-money/checkout" element={<CheckoutSettings />} />
                        <Route path="sending-money/disbursements" element={<Disbursements />} />
                        <Route path="sending-money/notifications" element={<DisbursementNotifications />} />
                        <Route path="business" element={<Business />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="billing/statements" element={<BillingStatements />} />
                        <Route path="billing/fee-structure" element={<FeeStructure />} />
                        <Route path="developers/api-keys" element={<ApiKeys />} />
                        <Route path="developers/ip-allowlist" element={<IpAllowlist />} />
                        <Route path="developers/webhooks" element={<SettingsWebhooks />} />
                        <Route path="withdrawals/bank-accounts" element={<BankAccounts />} />
                        <Route path="withdrawals/email-notifications" element={<WithdrawalNotifications />} />
                        <Route path="withdrawals/auto-withdrawal" element={<AutoWithdrawal />} />
                        <Route path="withdrawals/phone-numbers" element={<PhoneNumbers />} />
                    </Route>
                    <Route path="activation" element={<Activation />} />
                </Route>

                {/* Login/Signup routes */}
                <Route path="/sign-in" element={
                    <Suspense fallback={<Loader />}>
                        <Signin />
                    </Suspense>
                } />
                <Route path="/log-in" element={
                    <Suspense fallback={<Loader />}>
                        <Login />
                    </Suspense>
                } />
                <Route path="/sign-up" element={
                    <Suspense fallback={<Loader />}>
                        <Signup />
                    </Suspense>
                } />
                <Route path="/forgot-password" element={
                    <Suspense fallback={<Loader />}>
                        <Forgot />
                    </Suspense>
                } />
                <Route path="/otp" element={
                    <Suspense fallback={<Loader />}>
                        <OTP />
                    </Suspense>
                } />
                <Route path="/auth/reset-password" element={
                    <Suspense fallback={<Loader />}>
                        <ResetPassword />
                    </Suspense>
                } />
                <Route path="/onboarding" element={
                    <OnboardingRoute>
                        <Suspense fallback={<Loader />}>
                            <Onboarding />
                        </Suspense>
                    </OnboardingRoute>
                } />
                <Route path="/auth/callback" element={
                    <Suspense fallback={<Loader />}>
                        <AuthCallback />
                    </Suspense>
                } />

                {/* API routes */}
                <Route path="api/stripe/callback" element={
                    <Suspense fallback={<Loader />}>
                        <StripeCallback />
                    </Suspense>
                } />

                {/* Test routes */}
                <Route path="test" element={
                    <Suspense fallback={<Loader />}>
                        <Test />
                    </Suspense>
                }>
                    <Route path="checkout" element={
                        <Suspense fallback={<Loader />}>
                            <CheckoutTest />
                        </Suspense>
                    } />
                    <Route path="checkout-form" element={
                        <Suspense fallback={<Loader />}>
                            <CheckoutFormTest />
                        </Suspense>
                    } />
                    <Route path="checkout-summary" element={
                        <Suspense fallback={<Loader />}>
                            <CheckoutSummaryTest />
                        </Suspense>
                    } />
                    <Route path="payment-method-selector" element={
                        <Suspense fallback={<Loader />}>
                            <PaymentMethodSelectorTest />
                        </Suspense>
                    } />
                </Route>

                {/* Error routes */}
                <Route path="/500" element={
                    <Suspense fallback={<Loader />}>
                        <GeneralError />
                    </Suspense>
                } />
                <Route path="/404" element={
                    <Suspense fallback={<Loader />}>
                        <NotFoundError />
                    </Suspense>
                } />
                <Route path="/503" element={
                    <Suspense fallback={<Loader />}>
                        <MaintenanceError />
                    </Suspense>
                } />
                <Route path="*" element={
                    <Suspense fallback={<Loader />}>
                        <NotFoundError />
                    </Suspense>
                } />

            </Routes>
        </SessionCheck>
    </Router>
);

export default AppRouter;