import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { OnboardingRoute } from '@/components/auth/OnboardingRoute';
import { SessionCheck } from '@/components/auth/SessionCheck';
import ResetPassword from './pages/auth/reset-password.tsx';

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
import Providers from './pages/portal/integrations/providers.tsx';
import Settings from './pages/portal/settings/settings.tsx';
import Profile from './pages/portal/settings/profile/index.tsx';
import Account from './pages/portal/settings/account/index.tsx';
import Appearance from './pages/portal/settings/appearance/index.tsx';
import Notifications from './pages/portal/settings/notifications/index.tsx';
import Display from './pages/portal/settings/display/index.tsx';
import PaymentChannels from './pages/portal/payment-channels/paymentChannels.tsx'

// Dashboard Coming soon
import Subscription from "./pages/portal/subscription/subscription.tsx";

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
                <Route path="/portal" element={
                    <AppShell />
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="integrations" element={<Providers />} />
                    <Route path="subscription" element={<Subscription />} />
                    <Route path="payment-channels" element={<PaymentChannels />} />

                    <Route path="settings" element={<Settings />}>
                        <Route index element={<Profile />} />
                        <Route path="account" element={<Account />} />
                        <Route path="appearance" element={<Appearance />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="display" element={<Display />} />
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