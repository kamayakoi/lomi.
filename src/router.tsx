// import { User } from '@supabase/supabase-js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { supabase } from '@/utils/supabase/client';

// Home and landing Pages
import Home from "./pages/home/Home.tsx";
import About from './pages/About.tsx';
import Products from './pages/Products.tsx';
import Integrations from './pages/Integrations.tsx';
import Solutions from './pages/Solutions.tsx';
import Careers from './pages/Careers.tsx';
import Template from './pages/Template.tsx';
import Terms from './pages/Terms.tsx';
import Privacy from './pages/Privacy.tsx';

// Connect Pages
import Signin from './pages/auth/sign-in.tsx';
import Login from './pages/auth/log-in.tsx';
import Signup from './pages/auth/sign-up.tsx';
import Forgot from './pages/auth/forgot-password.tsx';
import OTP from './pages/auth/otp.tsx';
import Onboarding from './pages/auth/onboarding.tsx';
import AuthCallback from './pages/auth/auth-callback.tsx';


// Error Pages
import GeneralError from './pages/portal/errors/general-error.tsx';
import NotFoundError from './pages/portal/errors/not-found-error.tsx';
import MaintenanceError from './pages/portal/errors/maintenance-error.tsx';

// Dashboard
import AppShell from './components/dashboard/app-shell';
import Dashboard from './pages/portal/dashboard/Dashboard.tsx';
import Tasks from './pages/portal/tasks/tasks.tsx';
import DashboardIntegrations from './pages/portal/integrations/integrations.tsx';
import ExtraComponents from './pages/portal/extra-components/extra-component.tsx';
import Settings from './pages/portal/settings/settings.tsx';
import Profile from './pages/portal/settings/profile/index.tsx';
import Account from './pages/portal/settings/account/index.tsx';
import Appearance from './pages/portal/settings/appearance/index.tsx';
import Notifications from './pages/portal/settings/notifications/index.tsx';
import Display from './pages/portal/settings/display/index.tsx';
import ErrorExample from './pages/portal/settings/error-example/index.tsx';

// Dashboard Coming soon
import Chats from "./components/dashboard/coming-soon";
import Users from "./components/dashboard/coming-soon";
import Analysis from "./components/dashboard/coming-soon";

// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [user, setUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const checkUser = async () => {
//             const { data: { user } } = await supabase.auth.getUser();
//             if (user) {
//                 if (!user.user_metadata?.onboarded) {
//                     navigate('/onboarding');
//                 } else {
//                     setUser(user);
//                 }
//             } else {
//                 navigate('/sign-in');
//             }
//             setLoading(false);
//         };
//         checkUser();
//     }, [navigate]);

//     if (loading) return <div>Loading...</div>;
//     if (!user) return null;
//     return <>{children}</>;
// };

const AppRouter = () => (
    <Router>
        <Routes>
            {/* Website routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/template" element={<Template />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Dashboard routes */}
            {/* Commented out ProtectedRoute for /portal temporarily */}
            {/* <Route path="/portal" element={
                <ProtectedRoute>
                    <AppShell />
                </ProtectedRoute>
            }> */}
            <Route path="/portal" element={<AppShell />}>
                {/* End of comment */}
                <Route index element={<Dashboard />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="chats" element={<Chats />} />
                <Route path="integrations" element={<DashboardIntegrations />} />
                <Route path="users" element={<Users />} />
                <Route path="analysis" element={<Analysis />} />
                <Route path="extra-components" element={<ExtraComponents />} />
                <Route path="settings" element={<Settings />}>
                    <Route index element={<Profile />} />
                    <Route path="account" element={<Account />} />
                    <Route path="appearance" element={<Appearance />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="display" element={<Display />} />
                    <Route path="error-example" element={<ErrorExample />} />
                </Route>
            </Route>

            {/* Login/Signup routes */}
            <Route path="/sign-in" element={<Signin />} />
            <Route path="/log-in" element={<Login />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/forgot-password" element={<Forgot />} />
            <Route path="/otp" element={<OTP />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Error routes */}
            <Route path="/500" element={<GeneralError />} />
            <Route path="/404" element={<NotFoundError />} />
            <Route path="/503" element={<MaintenanceError />} />
            <Route path="*" element={<NotFoundError />} />
        </Routes>
    </Router>
);

export default AppRouter;