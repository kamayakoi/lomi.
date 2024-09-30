import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StripeCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {

        navigate('/portal/payment-channels');
    }, [navigate]);

    return <div>Processing...</div>;
};

export default StripeCallback;