import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Routes pages
import { ProtectedRoute } from './lib/routes/ProtectedRoute';
import { OnboardingRoute } from '@/lib/routes/OnboardingRoute';
import { ActivationRoute } from '@/lib/routes/ActivationRoute';
import { SessionCheck } from '@/lib/routes/SessionCheck';

// Auth pages
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
import Integrators from './pages/portal/Integrate/Integrate.tsx';
import PaymentChannels from './pages/portal/payment-channels/paymentChannels';
import Logs from './pages/portal/logs-page/Logs.tsx';
import Balance from './pages/portal/balance/Balance.tsx';
import Transactions from './pages/portal/transactions/Transactions.tsx';
import Reporting from './pages/portal/reporting/Reporting.tsx';
import Webhooks from './pages/portal/webhooks/Webhooks.tsx';
import PaymentLinks from './pages/portal/payment-links/PaymentLinks.tsx';
import Customers from './pages/portal/customers/Customers.tsx';
import Subscription from "./pages/portal/subscription/subscription.tsx";
import Product from "./pages/portal/product/Product.tsx";
import Activation from './pages/auth/activation/activation';

// Checkout pages
import CheckoutPage from '@/api/checkout/Checkout.tsx';

// Lazy loaded components
const Home = lazy(() => import('./pages/Home.tsx'));
const About = lazy(() => import('./pages/About.tsx'));
const Products = lazy(() => import('./pages/Products.tsx'));
const Integrations = lazy(() => import('./pages/Integrations.tsx'));
const Terms = lazy(() => import('./pages/Terms.tsx'));
const Privacy = lazy(() => import('./pages/Privacy.tsx'));
const Status = lazy(() => import('./pages/Status.tsx'));

const Settings = lazy(() => import('./pages/portal/settings/settings.tsx'));
const PaymentMethods = lazy(() => import('./pages/portal/settings/receiving-money/payment-methods.tsx'));
const CheckoutSettings = lazy(() => import('./pages/portal/settings/receiving-money/checkout/checkout-settings.tsx'));
const Disbursements = lazy(() => import('./pages/portal/settings/sending-money/disbursements.tsx'));
const DisbursementNotifications = lazy(() => import('./pages/portal/settings/sending-money/notifications.tsx'));
const Business = lazy(() => import('./pages/portal/settings/business-profile/business'));
const Profile = lazy(() => import('./pages/portal/settings/business-profile/profile'));
const BillingStatements = lazy(() => import('./pages/portal/settings/billing/statements.tsx'));
const FeeStructure = lazy(() => import('./pages/portal/settings/billing/fee-structure.tsx'));
const ApiKeys = lazy(() => import('./pages/portal/settings/developers/api-keys.tsx'));
const SettingsWebhooks = lazy(() => import('./pages/portal/settings/developers/webhooks.tsx'));
const BankAccounts = lazy(() => import('./pages/portal/settings/withdrawals/bank-accounts.tsx'));
const WithdrawalNotifications = lazy(() => import('./pages/portal/settings/withdrawals/email-notifications.tsx'));
const AutoWithdrawal = lazy(() => import('./pages/portal/settings/withdrawals/auto-withdrawal.tsx'));

// Import the custom Loader component
import Loader from '@/components/dashboard/loader';

const AppRouter = () => (
    <Router>
        <Routes>
            {/* Checkout routes */}
            <Route path="/product/:linkId" element={<CheckoutPage />} />
            <Route path="/plan/:linkId" element={<CheckoutPage />} />
            <Route path="/instant/:linkId" element={<CheckoutPage />} />

            <Route path="*" element={
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
                            <Route path="product" element={<Product />} />
                            <Route path="payment-channels" element={<PaymentChannels />} />
                            <Route path="logs" element={<Logs />} />
                            <Route path="balance" element={<Balance />} />
                            <Route path="transactions" element={<Transactions />} />
                            <Route path="reporting" element={<Reporting />} />
                            <Route path="webhooks" element={<Webhooks />} />
                            <Route path="payment-links" element={<PaymentLinks />} />
                            <Route path="customers" element={<Customers />} />
                            <Route path="settings" element={
                                <Suspense fallback={<Loader />}>
                                    <Settings />
                                </Suspense>
                            }>
                                <Route path="receiving-money/payment-methods" element={
                                    <Suspense fallback={<Loader />}>
                                        <PaymentMethods />
                                    </Suspense>
                                } />
                                <Route path="receiving-money/checkout" element={
                                    <Suspense fallback={<Loader />}>
                                        <CheckoutSettings />
                                    </Suspense>
                                } />
                                <Route path="sending-money/disbursements" element={
                                    <Suspense fallback={<Loader />}>
                                        <Disbursements />
                                    </Suspense>
                                } />
                                <Route path="sending-money/notifications" element={
                                    <Suspense fallback={<Loader />}>
                                        <DisbursementNotifications />
                                    </Suspense>
                                } />
                                <Route path="business" element={
                                    <Suspense fallback={<Loader />}>
                                        <Business />
                                    </Suspense>
                                } />
                                <Route path="profile" element={
                                    <Suspense fallback={<Loader />}>
                                        <Profile />
                                    </Suspense>
                                } />
                                <Route path="billing/statements" element={
                                    <Suspense fallback={<Loader />}>
                                        <BillingStatements />
                                    </Suspense>
                                } />
                                <Route path="billing/fee-structure" element={
                                    <Suspense fallback={<Loader />}>
                                        <FeeStructure />
                                    </Suspense>
                                } />
                                <Route path="developers/api-keys" element={
                                    <Suspense fallback={<Loader />}>
                                        <ApiKeys />
                                    </Suspense>
                                } />
                                <Route path="developers/webhooks" element={
                                    <Suspense fallback={<Loader />}>
                                        <SettingsWebhooks />
                                    </Suspense>
                                } />
                                <Route path="withdrawals/bank-accounts" element={
                                    <Suspense fallback={<Loader />}>
                                        <BankAccounts />
                                    </Suspense>
                                } />
                                <Route path="withdrawals/email-notifications" element={
                                    <Suspense fallback={<Loader />}>
                                        <WithdrawalNotifications />
                                    </Suspense>
                                } />
                                <Route path="withdrawals/auto-withdrawal" element={
                                    <Suspense fallback={<Loader />}>
                                        <AutoWithdrawal />
                                    </Suspense>
                                } />
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

                        {/* Error routes */}
                        <Route path="/500" element={<GeneralError />} />
                        <Route path="/404" element={<NotFoundError />} />
                        <Route path="/503" element={<MaintenanceError />} />
                        <Route path="*" element={<NotFoundError />} />
                    </Routes>
                </SessionCheck>
            } />
        </Routes>
    </Router>
);

export default AppRouter;
