import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import AnimatedLogoLoader from './components/portal/loader';

// Core routes that should load immediately
import { ProtectedRoute } from './lib/routes/ProtectedRoute';
import { OnboardingRoute } from '@/lib/routes/OnboardingRoute';
import { ActivationRoute } from '@/lib/routes/ActivationRoute';
import { SessionCheck } from '@/lib/routes/SessionCheck';
import AppShell from './components/portal/app-shell';

// Lazy load auth pages
const Signin = lazy(() => import('./pages/auth/sign-in'));
const Login = lazy(() => import('./pages/auth/log-in'));
const Signup = lazy(() => import('./pages/auth/sign-up'));
const Forgot = lazy(() => import('./pages/auth/forgot-password'));
const OTP = lazy(() => import('./pages/auth/otp'));
const ResetPassword = lazy(() => import('./pages/auth/reset-password'));
const Onboarding = lazy(() => import('./pages/auth/onboarding/onboarding'));
const AuthCallback = lazy(() => import('./pages/auth/callback'));

// Lazy load error pages
const GeneralError = lazy(() => import('./pages/errors/general-error'));
const NotFoundError = lazy(() => import('./pages/errors/not-found-error'));
const MaintenanceError = lazy(() => import('./pages/errors/maintenance-error'));

// Lazy load dashboard pages
const Dashboard = lazy(() => import('@/pages/portal/portal'));
const Integrators = lazy(() => import('@/pages/portal/Integrate/Integrate'));
const PaymentChannels = lazy(() => import('./pages/portal/payment-channels/paymentChannels'));
const Logs = lazy(() => import('./pages/portal/logs/logs'));
const Balance = lazy(() => import('./pages/portal/balance/Balance'));
const Transactions = lazy(() => import('./pages/portal/transactions/Transactions'));
const Webhooks = lazy(() => import('./pages/portal/webhooks/Webhooks'));
const PaymentLinks = lazy(() => import('./pages/portal/payment-links/PaymentLinks'));
const Customers = lazy(() => import('./pages/portal/customers/Customers'));
const Subscription = lazy(() => import("./pages/portal/subscription/subscription"));
const Storefront = lazy(() => import("./pages/portal/storefront/Storefront"));
const Activation = lazy(() => import('./pages/auth/activation/activation'));
const Product = lazy(() => import('./pages/portal/product/Product'));
const Reporting = lazy(() => import('./pages/portal/reporting/reporting'));
const CheckoutPage = lazy(() => import('@/api/checkout/Checkout'));

// Lazy load website pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const Integrations = lazy(() => import('./pages/Integrations'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Status = lazy(() => import('./pages/Status'));

// Lazy load settings pages
const Settings = lazy(() => import('./pages/portal/settings/settings'));
const PaymentMethods = lazy(() => import('./pages/portal/settings/receiving-money/payment-methods'));
const CheckoutSettings = lazy(() => import('./pages/portal/settings/receiving-money/checkout/checkout-settings'));
const Disbursements = lazy(() => import('./pages/portal/settings/sending-money/disbursements'));
const DisbursementNotifications = lazy(() => import('./pages/portal/settings/sending-money/notifications'));
const Business = lazy(() => import('./pages/portal/settings/business-profile/business'));
const Profile = lazy(() => import('./pages/portal/settings/business-profile/profile'));
const BillingStatements = lazy(() => import('./pages/portal/settings/billing/statements'));
const FeeStructure = lazy(() => import('./pages/portal/settings/billing/fee-structure'));
const ApiKeys = lazy(() => import('./pages/portal/settings/developers/api-keys'));
const BankAccounts = lazy(() => import('./pages/portal/settings/withdrawals/bank-accounts'));
const WithdrawalNotifications = lazy(() => import('./pages/portal/settings/withdrawals/email-notifications'));

const AppRouter = () => (
    <Routes>
        {/* Checkout routes */}
        <Route path="/product/:linkId" element={<CheckoutPage />} />
        <Route path="/plan/:linkId" element={<CheckoutPage />} />
        <Route path="/instant/:linkId" element={<CheckoutPage />} />
        <Route path="*" element={
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
                    {/* Login/Signup routes */}
                    <Route path="/sign-in" element={<Signin />} />
                    <Route path="/log-in" element={<Login />} />
                    <Route path="/sign-up" element={<Signup />} />
                    <Route path="/forgot-password" element={<Forgot />} />
                    <Route path="/otp" element={<OTP />} />
                    <Route path="/auth/reset-password" element={<ResetPassword />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    {/* Dashboard routes */}
                    <Route path="/portal" element={
                        <ProtectedRoute>
                            <AppShell />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Dashboard />} />
                        <Route path="integrations" element={<Integrators />} />
                        <Route path="subscription" element={<Subscription />} />
                        <Route path="product" element={
                            <Suspense fallback={<AnimatedLogoLoader />}>
                                <Product />
                            </Suspense>
                        } />
                        <Route path="payment-channels" element={<PaymentChannels />} />
                        <Route path="logs" element={<Logs />} />
                        <Route path="balance" element={<Balance />} />
                        <Route path="transactions" element={<Transactions />} />
                        <Route path="reporting" element={
                            <Suspense fallback={<AnimatedLogoLoader />}>
                                <Reporting />
                            </Suspense>
                        } />
                        <Route path="webhooks" element={<Webhooks />} />
                        <Route path="payment-links" element={<PaymentLinks />} />
                        <Route path="storefront" element={<Storefront />} />
                        <Route path="customers" element={<Customers />} />
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
                            <Route path="withdrawals/bank-accounts" element={<BankAccounts />} />
                            <Route path="withdrawals/email-notifications" element={<WithdrawalNotifications />} />
                        </Route>
                        <Route path="activation" element={
                            <ActivationRoute>
                                <Activation />
                            </ActivationRoute>
                        } />
                    </Route>
                    <Route path="/onboarding" element={
                        <OnboardingRoute>
                            <Onboarding />
                        </OnboardingRoute>
                    } />
                    {/* Error routes */}
                    <Route path="/500" element={<GeneralError />} />
                    <Route path="/404" element={<NotFoundError />} />
                    <Route path="/503" element={<MaintenanceError />} />
                    <Route path="*" element={<NotFoundError />} />
                </Routes>
            </SessionCheck>
        } />
    </Routes>
);

export default AppRouter;