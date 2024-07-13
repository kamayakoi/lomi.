import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

const Privacy = () => {
    return (
        <>
            <Navbar />
            <div className="container py-24 sm:py-32">
                <h1>Privacy</h1>
                <p>Welcome to the Privacy page!</p>
            </div>
            <Footer />
        </>
    );
};

export default Privacy;