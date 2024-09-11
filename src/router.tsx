import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx';
import { OnboardingRoute } from '@/components/auth/OnboardingRoute';
import { SessionCheck } from '@/components/auth/SessionCheck';
import ResetPassword from './pages/auth/reset-password.tsx';
// import { config } from '@/utils/config';

// Home and landing Pages
import Home from "./pages/home/Home.tsx";
import About from './pages/About.tsx';
import Products from './pages/Products.tsx';
import Integrations from './pages/Integrations.tsx';
import Solutions from './pages/Solutions.tsx';
import Careers from './pages/Careers.tsx';
import Terms from './pages/Terms.tsx';
import Privacy from './pages/Privacy.tsx';

// Connect Pages
import Signin from './pages/auth/sign-in.tsx';
import Login from './pages/auth/log-in.tsx';
import Signup from './pages/auth/sign-up.tsx';
import Forgot from './pages/auth/forgot-password.tsx';
import OTP from './pages/auth/otp.tsx';
import Onboarding from './pages/auth/onboarding.tsx';
import AuthCallback from './pages/auth/callback';

// Error Pages
import GeneralError from './pages/errors/general-error.tsx';
import NotFoundError from './pages/errors/not-found-error.tsx';
import MaintenanceError from './pages/errors/maintenance-error.tsx';

// Dashboard
import AppShell from './components/dashboard/app-shell';
import Dashboard from './pages/portal/dashboard/Dashboard.tsx';
import Providers from './pages/portal/Providers/providers.tsx';
import Settings from './pages/portal/settings/Settings.tsx';
import PaymentChannels from './pages/portal/payment-channels/PaymentChannels.tsx'
import Logs from './pages/portal/logs/Logs.tsx'
import Balance from './pages/portal/balance/Balance.tsx'
import Cards from './pages/portal/accept-payments/cards/Cards.tsx'
import EWallets from './pages/portal/accept-payments/eWallets/eWallets.tsx'
import VirtualAccounts from './pages/portal/accept-payments/virtual-accounts/VirtualAccounts.tsx'
import Transactions from './pages/portal/transactions/Transactions.tsx'
import Reporting from './pages/portal/reporting/Reporting.tsx'
import Webhooks from './pages/portal/webhooks/Webhooks.tsx'
import PayoutLinks from './pages/portal/send-payments/payout-links/PayoutLinks.tsx'
import BatchDisbursements from './pages/portal/send-payments/batch-disbursements/BatchDisbursements.tsx'
import BatchPaymentLinks from './pages/portal/receive-payments/batch-payment-links/BatchPaymentLinks.tsx'
import PaymentLinks from './pages/portal/receive-payments/payment-links/PaymentLinks.tsx'
import Customers from './pages/portal/customers/Customers.tsx'
import Subscription from "./pages/portal/subscription/subscription.tsx";

// Settings pages
import PaymentMethods from './pages/portal/settings/accepting-money/payment-methods';
import Checkout from './pages/portal/settings/accepting-money/checkout';
import Disbursements from './pages/portal/settings/sending-money/disbursements';
import CategoryApproval from './pages/portal/settings/sending-money/category-approval';
import DisbursementNotifications from './pages/portal/settings/sending-money/notifications';
import Business from './pages/portal/settings/business-profile/business';
import Profile from './pages/portal/settings/business-profile/profile';
import Timezone from './pages/portal/settings/business-profile/timezone';
import TeamMembers from './pages/portal/settings/team/members';
import EmailRecipients from './pages/portal/settings/team/email-recipients';
import BillingStatements from './pages/portal/settings/billing/statements';
import FeeStructure from './pages/portal/settings/billing/fee-structure';
import ApiKeys from './pages/portal/settings/developers/api-keys';
import IpAllowlist from './pages/portal/settings/developers/ip-allowlist';
import SettingsWebhooks from './pages/portal/settings/developers/webhooks';
import BankAccounts from './pages/portal/settings/withdrawals/bank-accounts';
import WithdrawalNotifications from './pages/portal/settings/withdrawals/email-notifications';
import AutoWithdrawal from './pages/portal/settings/withdrawals/auto-withdrawal';

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
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />

                {/* Dashboard routes */}
                {/* {config.isPortal ? ( */}
                <Route path="/portal" element={
                    <ProtectedRoute>
                        <AppShell />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="integrations" element={<Providers />} />
                    <Route path="subscription" element={<Subscription />} />
                    <Route path="payment-channels" element={<PaymentChannels />} />
                    <Route path="logs" element={<Logs />} />
                    <Route path="balance" element={<Balance />} />
                    <Route path="cards" element={<Cards />} />
                    <Route path="e-wallets" element={<EWallets />} />
                    <Route path="virtual-accounts" element={<VirtualAccounts />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="reporting" element={<Reporting />} />
                    <Route path="webhooks" element={<Webhooks />} />
                    <Route path="payout-links" element={<PayoutLinks />} />
                    <Route path="batch-disbursements" element={<BatchDisbursements />} />
                    <Route path="batch-payment-links" element={<BatchPaymentLinks />} />
                    <Route path="payment-links" element={<PaymentLinks />} />
                    <Route path="customers" element={<Customers />} />

                    <Route path="settings" element={<Settings />}>
                        <Route path="accepting-money/payment-methods" element={<PaymentMethods />} />
                        <Route path="accepting-money/checkout" element={<Checkout />} />
                        <Route path="sending-money/disbursements" element={<Disbursements />} />
                        <Route path="sending-money/category-approval" element={<CategoryApproval />} />
                        <Route path="sending-money/notifications" element={<DisbursementNotifications />} />
                        <Route path="business" element={<Business />} />
                        <Route path="profile" element={<Profile />} />
                        {/* <Route path="timezone" element={<Timezone />} /> */}
                        <Route path="members" element={<TeamMembers />} />
                        <Route path="email-recipients" element={<EmailRecipients />} />
                        <Route path="billing/statements" element={<BillingStatements />} />
                        <Route path="billing/fee-structure" element={<FeeStructure />} />
                        <Route path="developers/api-keys" element={<ApiKeys />} />
                        <Route path="developers/ip-allowlist" element={<IpAllowlist />} />
                        <Route path="developers/webhooks" element={<SettingsWebhooks />} />
                        <Route path="withdrawals/bank-accounts" element={<BankAccounts />} />
                        <Route path="withdrawals/email-notifications" element={<WithdrawalNotifications />} />
                        <Route path="withdrawals/auto-withdrawal" element={<AutoWithdrawal />} />
                    </Route>
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