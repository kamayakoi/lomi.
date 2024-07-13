import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

const Terms = () => {
    return (
        <>
            <Navbar />
            <div className="container py-24 sm:py-32">
                <h1>Terms</h1>
                <p>Welcome to the Terms page!</p>
            </div>
            <Footer />
        </>
    );
};

export default Terms;