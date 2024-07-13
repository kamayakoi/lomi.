import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Home Pages
import Homepage from "./Homepage.tsx";
import About from './pages/About.tsx';
import Products from './pages/Products.tsx';
import Solutions from './pages/Solutions.tsx';
import Careers from './pages/Careers.tsx';
import Support from './pages/Support.tsx';
import Terms from './pages/Terms.tsx';
import Privacy from './pages/Privacy.tsx';

// FR Pages
import HomepageFR from "./Homepage.tsx";


// Connect Pages
import Signin from './pages/auth/sign-in.tsx';
import Login from './pages/auth/log-in.tsx';
import Signup from './pages/auth/sign-up.tsx';
import Forgot from './pages/auth/forgot-password.tsx';
import OTP from './pages/auth/otp.tsx';

// Dashboard Pages
import Dashboard from './pages/auth/otp.tsx';


const AppRouter = () => (
    <Router>
        <Routes>
            {/* Website routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/support" element={<Support />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/fr" element={< HomepageFR />} />
            {/* Login/Signup routes */}
            <Route path="/sign-in" element={<Signin />} />
            <Route path="/log-in" element={<Login />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/forgot-password" element={<Forgot />} />
            <Route path="/otp" element={<OTP />} />
            {/* Portal routes */}
            <Route path="/portal/dashboard" element={<Dashboard />} />
        </Routes>
    </Router>
);

export default AppRouter;