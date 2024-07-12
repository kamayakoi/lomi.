import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

const Services = () => {
    return (
        <>
            <Navbar />
            <div className="container py-24 sm:py-32">
                <h1>Services</h1>
                <p>Welcome to the Services page!</p>
            </div>
            <Footer />
        </>
    );
};

export default Services;