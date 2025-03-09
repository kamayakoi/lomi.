import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';

// Routes pages
import { ProtectedRoute } from './lib/routes/ProtectedRoute';
import { OnboardingRoute } from '@/lib/routes/OnboardingRoute';
import { ActivationRoute } from '@/lib/routes/ActivationRoute';
import { SessionCheck } from '@/lib/routes/SessionCheck';
import { OrganizationRoute } from '@/lib/routes/OrganizationRoute';

// Auth pages
import Signin from './pages/auth/connect/sign-in';
import Login from './pages/auth/connect/log-in';
import Signup from './pages/auth/connect/sign-up';
import Forgot from './pages/auth/connect/forgot-password';
import OTP from './pages/auth/connect/otp';
import ResetPassword from './pages/auth/connect/reset-password';
import Onboarding from './pages/auth/onboarding/onboarding';
import AuthCallback from './pages/auth/connect/callback';
// Error pages
import GeneralError from './pages/errors/general-error';
import NotFoundError from './pages/errors/not-found-error';
import MaintenanceError from './pages/errors/maintenance-error';
// Dashboard
import AppShell from './components/portal/app-shell';
import Dashboard from '@/pages/portal/portal';
import Integrators from '@/pages/portal/Integrate/Integrate';
import PaymentChannels from '@/pages/portal/payment-channels/paymentChannels';
import Logs from '@/pages/portal/logs/logs';
import Balance from '@/pages/portal/balance/Balance';
import Transactions from '@/pages/portal/transactions/Transactions';
import Webhooks from './pages/portal/webhooks/Webhooks';
import PaymentLinks from './pages/portal/payment-links/PaymentLinks';
import Customers from './pages/portal/customers/Customers';
import Subscription from "./pages/portal/subscription/subscription";
import Storefront from "./pages/portal/storefront/Storefront";
import Activation from './pages/auth/activation/activation';
import CheckoutPage from '@/api/checkout/Checkout';
import Reporting from './pages/portal/reporting/Reporting';
import Product from './pages/portal/product/Product';

// Website routes
import Home from './pages/landing/home';
import Products from './pages/landing/features/products';
import Terms from './pages/landing/company/terms';
import Privacy from './pages/landing/company/privacy';
import Pricing from './pages/landing/features/pricing';
import Story from './pages/landing/company/story';
import FAQ from './pages/landing/features/faq';
import Billing from './pages/landing/features/billing';
import WebsiteSales from './pages/landing/features/website-sales';
import SubscriptionManagement from './pages/landing/features/subscription-management';
import WhatsAppSales from './pages/landing/features/whatsapp';

// Features routes
import SellProducts from './pages/landing/features/products';
import SellSubscriptions from './pages/landing/features/subscription-management';
import SellWhatsApp from './pages/landing/features/whatsapp';
import SellWebsite from './pages/landing/features/website-sales';

// Settings routes
import Settings from '@/pages/portal/settings/settings';
import PaymentMethods from '@/pages/portal/settings/receiving-money/payment-methods';
import CheckoutSettings from '@/pages/portal/settings/receiving-money/checkout/checkout-settings';
import Disbursements from '@/pages/portal/settings/sending-money/disbursements';
import DisbursementNotifications from '@/pages/portal/settings/sending-money/notifications';
import Business from '@/pages/portal/settings/business-profile/business';
import Profile from './pages/portal/settings/business-profile/profile';
import BillingStatements from './pages/portal/settings/billing/statements';
import FeeStructure from './pages/portal/settings/billing/fee-structure';
import ApiKeys from './pages/portal/settings/developers/api-keys';
import BankAccounts from './pages/portal/settings/withdrawals/bank-accounts';
import WithdrawalNotifications from './pages/portal/settings/withdrawals/email-notifications';
import AnimatedLogoLoader from './components/portal/loader';

// Blog routes
import Blog from './pages/blog/blog';
import BlogPost from './pages/blog/blog-post';

const AppRouter = () => {
    return (
        <Routes>
            {/* Checkout routes */}
            <Route path="/product/:linkId" element={<CheckoutPage />} />
            <Route path="/plan/:linkId" element={<CheckoutPage />} />
            <Route path="/instant/:linkId" element={<CheckoutPage />} />
            <Route path="/checkout/:sessionId" element={<CheckoutPage />} />
            <Route path="*" element={
                <SessionCheck>
                    <Routes>
                        {/* Website routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/story" element={<Story />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/billing" element={<Billing />} />
                        <Route path="/website" element={<WebsiteSales />} />
                        <Route path="/subscription-management" element={<SubscriptionManagement />} />
                        <Route path="/whatsapp" element={<WhatsAppSales />} />
                        {/* Blog routes */}
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        {/* Features routes */}
                        <Route path="/sell-products" element={<SellProducts />} />
                        <Route path="/sell-subscriptions" element={<SellSubscriptions />} />
                        <Route path="/sell-whatsapp" element={<SellWhatsApp />} />
                        <Route path="/sell-website" element={<SellWebsite />} />

                        {/* Login/Signup routes */}
                        <Route path="/sign-in" element={<Signin />} />
                        <Route path="/log-in" element={<Login />} />
                        <Route path="/sign-up" element={<Signup />} />
                        <Route path="/forgot-password" element={<Forgot />} />
                        <Route path="/otp" element={<OTP />} />
                        <Route path="/auth/reset-password" element={<ResetPassword />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />

                        {/* Organization routes */}
                        <Route path="/:organizationId" element={
                            <ProtectedRoute>
                                <OrganizationRoute>
                                    <AppShell />
                                </OrganizationRoute>
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
};

export default AppRouter;