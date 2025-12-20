import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react';
import api from '../api/axios';

const Checkout = () => {
    const { auth } = useAuth();
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();

    const [clientToken, setClientToken] = useState('');
    const [instance, setInstance] = useState('');
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    useEffect(() => {
        if (auth?.token) {
            getToken();
        }
    }, [auth?.token]);

    const getToken = async () => {
        try {
            const { data } = await api.get('/braintree/token');
            setClientToken(data.clientToken);
        } catch (error) {
            console.error('Error fetching client token', error);
        }
    };

    const handlePayment = async () => {
        try {
            setProcessing(true);
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await api.post('/braintree/payment', {
                nonce,
                cart,
                total
            });
            setProcessing(false);
            if (data.ok) {
                clearCart();
                navigate('/dashboard/orders');
                alert('Payment Successful');
            }
        } catch (error) {
            console.error('Payment Error', error);
            setProcessing(false);
            alert('Payment Failed');
        }
    };

    if (!auth?.user) {
        return <div className="checkout-container">Please login to checkout.</div>;
    }

    if (cart.length === 0) {
        return <div className="checkout-container">Your cart is empty.</div>;
    }

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <div className="checkout-summary">
                <h3>Total Amount: ${total.toFixed(2)}</h3>
            </div>
            <div className="payment-section">
                {clientToken && (
                    <>
                        <DropIn
                            options={{
                                authorization: clientToken,
                                paypal: {
                                    flow: 'vault',
                                },
                            }}
                            onInstance={(instance) => setInstance(instance)}
                        />
                        <button
                            onClick={handlePayment}
                            className="btn-primary btn-block"
                            disabled={!instance || processing}
                        >
                            {processing ? 'Processing...' : 'Pay Now'}
                        </button>
                    </>
                )}
                {!clientToken && <p>Loading Payment Gateway...</p>}
            </div>
        </div>
    );
};

export default Checkout;
