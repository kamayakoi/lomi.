import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Core components (keep these non-lazy for faster initial load)
import { SessionCheck } from '@/lib/routes/SessionCheck';
import AnimatedLogoLoader from '@/components/portal/loader';
import Signin from './pages/auth/sign-in';

// Preload function for route components
function preloadRoute<T>(importFn: () => Promise<T>): Promise<T> {
    return importFn();
}

// Lazy loaded route guards with preloading
const ProtectedRoute = lazy(() => preloadRoute(() => import('./lib/routes/ProtectedRoute').then(m => ({ default: m.ProtectedRoute }))));
const OnboardingRoute = lazy(() => preloadRoute(() => import('@/lib/routes/OnboardingRoute').then(m => ({ default: m.OnboardingRoute }))));
const ActivationRoute = lazy(() => preloadRoute(() => import('@/lib/routes/ActivationRoute').then(m => ({ default: m.ActivationRoute }))));

// Lazy loaded components with preloading
const Home = lazy(() => preloadRoute(() => import('./pages/Home')));
const Login = lazy(() => preloadRoute(() => import('./pages/auth/log-in')));
const Signup = lazy(() => preloadRoute(() => import('./pages/auth/sign-up')));
const Forgot = lazy(() => preloadRoute(() => import('./pages/auth/forgot-password')));
const OTP = lazy(() => preloadRoute(() => import('./pages/auth/otp')));
const ResetPassword = lazy(() => preloadRoute(() => import('./pages/auth/reset-password')));
const Onboarding = lazy(() => preloadRoute(() => import('./pages/auth/onboarding/onboarding')));
const AuthCallback = lazy(() => preloadRoute(() => import('./pages/auth/callback')));
const AppShell = lazy(() => preloadRoute(() => import('./components/portal/app-shell')));

// Lazy loaded error pages
const GeneralError = lazy(() => preloadRoute(() => import('./pages/errors/general-error')));
const NotFoundError = lazy(() => preloadRoute(() => import('./pages/errors/not-found-error')));
const MaintenanceError = lazy(() => preloadRoute(() => import('./pages/errors/maintenance-error')));

// Lazy loaded dashboard pages
const Dashboard = lazy(() => preloadRoute(() => import('@/pages/portal/dashboard/Dashboard')));
const Integrators = lazy(() => preloadRoute(() => import('@/pages/portal/Integrate/Integrate')));
const PaymentChannels = lazy(() => preloadRoute(() => import('./pages/portal/payment-channels/paymentChannels')));
const Logs = lazy(() => preloadRoute(() => import('./pages/portal/logs-page/Logs')));
const Balance = lazy(() => preloadRoute(() => import('./pages/portal/balance/Balance')));
const Transactions = lazy(() => preloadRoute(() => import('./pages/portal/transactions/Transactions')));
const Reporting = lazy(() => preloadRoute(() => import('./pages/portal/reporting/Reporting')));
const Webhooks = lazy(() => preloadRoute(() => import('./pages/portal/webhooks/Webhooks')));
const PaymentLinks = lazy(() => preloadRoute(() => import('./pages/portal/payment-links/PaymentLinks')));
const Customers = lazy(() => preloadRoute(() => import('./pages/portal/customers/Customers')));
const Subscription = lazy(() => preloadRoute(() => import("./pages/portal/subscription/subscription")));
const Product = lazy(() => preloadRoute(() => import("./pages/portal/product/Product")));
const Storefront = lazy(() => preloadRoute(() => import("./pages/portal/storefront/Storefront")));
const Activation = lazy(() => preloadRoute(() => import('./pages/auth/activation/activation')));

// Lazy loaded website pages
const About = lazy(() => preloadRoute(() => import('./pages/About')));
const Products = lazy(() => preloadRoute(() => import('./pages/Products')));
const Integrations = lazy(() => preloadRoute(() => import('./pages/Integrations')));
const Terms = lazy(() => preloadRoute(() => import('./pages/Terms')));
const Privacy = lazy(() => preloadRoute(() => import('./pages/Privacy')));
const Status = lazy(() => preloadRoute(() => import('./pages/Status')));

// Lazy loaded settings pages
const Settings = lazy(() => preloadRoute(() => import('./pages/portal/settings/settings')));
const PaymentMethods = lazy(() => preloadRoute(() => import('./pages/portal/settings/receiving-money/payment-methods')));
const CheckoutSettings = lazy(() => preloadRoute(() => import('./pages/portal/settings/receiving-money/checkout/checkout-settings')));
const Disbursements = lazy(() => preloadRoute(() => import('./pages/portal/settings/sending-money/disbursements')));
const DisbursementNotifications = lazy(() => preloadRoute(() => import('./pages/portal/settings/sending-money/notifications')));
const Business = lazy(() => preloadRoute(() => import('./pages/portal/settings/business-profile/business')));
const Profile = lazy(() => preloadRoute(() => import('./pages/portal/settings/business-profile/profile')));
const BillingStatements = lazy(() => preloadRoute(() => import('./pages/portal/settings/billing/statements')));
const FeeStructure = lazy(() => preloadRoute(() => import('./pages/portal/settings/billing/fee-structure')));
const ApiKeys = lazy(() => preloadRoute(() => import('./pages/portal/settings/developers/api-keys')));
const BankAccounts = lazy(() => preloadRoute(() => import('./pages/portal/settings/withdrawals/bank-accounts')));
const WithdrawalNotifications = lazy(() => preloadRoute(() => import('./pages/portal/settings/withdrawals/email-notifications')));

// Lazy loaded checkout
const CheckoutPage = lazy(() => preloadRoute(() => import('@/api/checkout/Checkout')));

// Preload critical routes
const preloadCriticalRoutes = () => {
    preloadRoute(() => import('./pages/Home'));
    preloadRoute(() => import('./pages/auth/sign-in'));
    preloadRoute(() => import('./pages/auth/log-in'));
    preloadRoute(() => import('./pages/auth/sign-up'));
};

// Call preload on initial load
preloadCriticalRoutes();

const AppRouter = () => (
    <Suspense fallback={<AnimatedLogoLoader />}>
        <Routes>
            {/* Checkout routes - outside SessionCheck for better performance */}
            <Route path="/product/:linkId" element={<CheckoutPage />} />
            <Route path="/plan/:linkId" element={<CheckoutPage />} />
            <Route path="/instant/:linkId" element={<CheckoutPage />} />

            {/* Public routes - no auth check needed */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/status" element={<Status />} />

            {/* Auth routes - minimal auth check */}
            <Route path="/sign-in" element={<Signin />} />
            <Route path="/log-in" element={<Login />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/forgot-password" element={<Forgot />} />
            <Route path="/otp" element={<OTP />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected routes - full auth check */}
            <Route path="/portal/*" element={
                <SessionCheck>
                    <ProtectedRoute>
                        <AppShell />
                    </ProtectedRoute>
                </SessionCheck>
            }>
                <Route index element={<Dashboard />} />
                <Route path="integrations" element={<Integrators />} />
                <Route path="subscription" element={<Subscription />} />
                <Route path="product" element={<Product />} />
                <Route path="payment-channels" element={<PaymentChannels />} />
                <Route path="logs" element={<Logs />} />
                <Route path="balance" element={<Balance />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="reporting" element={<Reporting />} />
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
                <SessionCheck>
                    <OnboardingRoute>
                        <Onboarding />
                    </OnboardingRoute>
                </SessionCheck>
            } />

            {/* Error routes */}
            <Route path="/500" element={<GeneralError />} />
            <Route path="/404" element={<NotFoundError />} />
            <Route path="/503" element={<MaintenanceError />} />
            <Route path="*" element={<NotFoundError />} />
        </Routes>
    </Suspense>
);

export default AppRouter;