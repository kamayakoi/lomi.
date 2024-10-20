// import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Loader from '@/components/dashboard/loader.tsx'
// import { config } from '@/utils/config';


// Routes pages
import { ProtectedRoute } from './lib/routes/ProtectedRoute';
import { OnboardingRoute } from '@/lib/routes/OnboardingRoute';
import { ActivationRoute } from '@/lib/routes/ActivationRoute';
import { SessionCheck } from '@/lib/routes/SessionCheck';


// Home and landing pages
import Home from "./pages/Home.tsx";
import About from './pages/About.tsx';
import Products from './pages/Products.tsx';
import Integrations from './pages/Integrations.tsx';
import Terms from './pages/Terms.tsx';
import Privacy from './pages/Privacy.tsx';
// import Careers from './pages/Careers.tsx';


// Connect pages
import Signin from './pages/auth/sign-in';
import Login from './pages/auth/log-in';
import Signup from './pages/auth/sign-up';
import Forgot from './pages/auth/forgot-password';
import OTP from './pages/auth/otp';
import ResetPassword from './pages/auth/reset-password';
import Onboarding from './pages/auth/onboarding/onboarding';
import AuthCallback from './pages/auth/callback';


// Error pages
import GeneralError from './pages/errors/general-error.tsx';
import NotFoundError from './pages/errors/not-found-error.tsx';
import MaintenanceError from './pages/errors/maintenance-error.tsx';


// Dashboard
import AppShell from './components/dashboard/app-shell';
import Dashboard from './pages/portal/dashboard/Dashboard.tsx';
import Integrators from './pages/portal/integrators/Integrators.tsx';
import Settings from './pages/portal/settings/settings.tsx';
import PaymentChannels from './pages/portal/payment-channels/PaymentChannels.tsx'
import Logs from './pages/portal/logs-page/Logs.tsx'
import Balance from './pages/portal/balance/Balance.tsx'
// import Cards from './pages/portal/accept-payments/cards/Cards.tsx'
// import EWallets from './pages/portal/accept-payments/eWallets/eWallets.tsx'
// import PayoutLinks from './pages/portal/payout-links/PayoutLinks.tsx'
import Transactions from './pages/portal/transactions/Transactions.tsx'
import Reporting from './pages/portal/reporting/Reporting.tsx'
import Webhooks from './pages/portal/webhooks/Webhooks.tsx'
import PaymentLinks from './pages/portal/payment-links/PaymentLinks.tsx'
import Customers from './pages/portal/customers/Customers.tsx';
import Subscription from "./pages/portal/subscription/Subscription.tsx"
import Product from "./pages/portal/product/Product.tsx"


// Settings pages
import PaymentMethods from './pages/portal/settings/receiving-money/payment-methods.tsx';
import CheckoutSettings from './pages/portal/settings/receiving-money/checkout/checkout-settings.tsx';
import Disbursements from './pages/portal/settings/sending-money/disbursements.tsx';
import DisbursementNotifications from './pages/portal/settings/sending-money/notifications.tsx';
import Business from './pages/portal/settings/business-profile/business';
import Profile from './pages/portal/settings/business-profile/profile';
// import TeamMembers from './pages/portal/settings/team/members.tsx';
// import EmailRecipients from './pages/portal/settings/team/email-recipients.tsx';
import BillingStatements from './pages/portal/settings/billing/statements.tsx';
import FeeStructure from './pages/portal/settings/billing/fee-structure.tsx';
import ApiKeys from './pages/portal/settings/developers/api-keys.tsx';
import IpAllowlist from './pages/portal/settings/developers/ip-allowlist.tsx';
import SettingsWebhooks from './pages/portal/settings/developers/webhooks.tsx';
import BankAccounts from './pages/portal/settings/withdrawals/bank-accounts.tsx';
import WithdrawalNotifications from './pages/portal/settings/withdrawals/email-notifications.tsx';
import AutoWithdrawal from './pages/portal/settings/withdrawals/auto-withdrawal.tsx';
import Activation from './pages/auth/activation/activation';
import Status from './pages/Status.tsx';


// API pages
import StripeCallback from '../providers/stripe/callback/stripe-callback-index.tsx';
import StripeConnectLanding from "../providers/stripe/StripeConnectLanding";


// // Test pages
// import Test from './pages/test/test.tsx'
// import CheckoutTest from './pages/test/CheckoutTest.tsx'
// import CheckoutFormTest from './pages/test/CheckoutFormTest.tsx'
// import CheckoutSummaryTest from './pages/test/CheckoutSummaryTest.tsx'
// import PaymentMethodSelectorTest from './pages/test/PaymentMethodSelectorTest.tsx'

const AppRouter = () => (
    <Router>
        <SessionCheck>
            <Routes>
                {/* Website routes */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/status" element={<Status />} />

                {/* Dashboard routes */}
                {/* {config.isPortal ? ( */}
                <Route path="/portal" element={
                    <ProtectedRoute>
                        <AppShell />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="integrations" element={<Integrators />} />
                    <Route path="subscription" element={<Subscription />} />
                    <Route path="product" element={<Product />} />
                    <Route path="payment-channels" element={<PaymentChannels />} />
                    <Route path="logs" element={<Logs />} />
                    <Route path="balance" element={<Balance />} />
                    {/* <Route path="cards" element={<Cards />} />
                    <Route path="e-wallets" element={<EWallets />} /> 
                    <Route path="payout-links" element={<PayoutLinks />} />*/}
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="reporting" element={<Reporting />} />
                    <Route path="webhooks" element={<Webhooks />} />
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
                        {/* <Route path="team/members" element={<TeamMembers />} />
                        <Route path="team/email-recipients" element={<EmailRecipients />} /> */}
                        <Route path="billing/statements" element={<BillingStatements />} />
                        <Route path="billing/fee-structure" element={<FeeStructure />} />
                        <Route path="developers/api-keys" element={<ApiKeys />} />
                        <Route path="developers/ip-allowlist" element={<IpAllowlist />} />
                        <Route path="developers/webhooks" element={<SettingsWebhooks />} />
                        <Route path="withdrawals/bank-accounts" element={<BankAccounts />} />
                        <Route path="withdrawals/email-notifications" element={<WithdrawalNotifications />} />
                        <Route path="withdrawals/auto-withdrawal" element={<AutoWithdrawal />} />
                    </Route>
                    <Route path="activation" element={
                        <ActivationRoute>
                            <Activation />
                        </ActivationRoute>
                    } />
                </Route>

                {/* Login/Signup routes */}
                <Route path="/sign-in" element={<Signin />} />
                <Route path="/log-in" element={<Login />} />
                <Route path="/sign-up" element={<Signup />} />
                <Route path="/forgot-password" element={<Forgot />} />
                <Route path="/otp" element={<OTP />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/onboarding" element={
                    <OnboardingRoute>
                        <Onboarding />
                    </OnboardingRoute>
                } />
                <Route path="/auth/callback" element={<AuthCallback />} />

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