import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer-Newsletter';

const Template = () => {
    return (
        <>
            <Navbar />
            <div className="container py-24 sm:py-32">
                <h1>Template</h1>
                <p>Welcome to the Template page!</p>
            </div>
            <Footer />
        </>
    );
};

export default Template;