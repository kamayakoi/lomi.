import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

const Solutions = () => {
    return (
        <>
            <Navbar />
            <div className="container py-24 sm:py-32">
                <h1>Solutions</h1>
                <p>Welcome to the Solutions page!</p>
            </div>
            <Footer />
        </>
    );
};

export default Solutions;