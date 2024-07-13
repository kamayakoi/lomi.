import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';

const Products = () => {
    return (
        <>
            <Navbar />
            <div className="container py-24 sm:py-32">
                <h1>Products</h1>
                <p>Welcome to the Products page!</p>
            </div>
            <Footer />
        </>
    );
};

export default Products;