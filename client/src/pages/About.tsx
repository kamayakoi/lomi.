import { Navbar } from '../components/landing/Navbar-other';
import { Footer } from '../components/landing/Footer';

const About = () => {
    return (
        <>
            <Navbar />
            <div className="container py-24 sm:py-32">
                <h1>About Us</h1>
                <p>Welcome to the About page!</p>
            </div>
            <Footer />
        </>
    );
};

export default About;