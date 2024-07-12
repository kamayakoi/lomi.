import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Pages
import Homepage from "./Homepage.tsx";
import About from './pages/About.tsx';
import Services from './pages/Services.tsx';
import Signin from './pages/auth/sign-in.tsx';
import Signin2 from './pages/auth/sign-in-2.tsx';

const AppRouter = () => (
    <Router>
        <Routes>
            {/* Website routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/careers" element={<div>Careers Page</div>} />
            <Route path="/support" element={<div>Support Page</div>} />
            {/* Login/Signup routes */}
            <Route path="/sign-in" element={<Signin />} />
            <Route path="/sign-in2" element={<Signin2 />} />
            <Route path="/sign-up" element={<div>Signup Page</div>} />
            <Route path="/forgotpassword" element={<div>Forgot Password Page</div>} />
            {/* Portal routes */}
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
    </Router>
);

export default AppRouter;