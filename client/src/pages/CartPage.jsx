import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (user) {
            navigate('/dashboard/checkout'); // We'll implement checkout later
        } else {
            navigate('/login', { state: { from: '/cart' } });
        }
    };

    if (cart.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Your Cart is Empty</h2>
                <Link to="/" className="btn-primary">Shop Now</Link>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2>Shopping Cart</h2>
            <div className="cart-content">
                <div className="cart-items">
                    {cart.map((item) => (
                        <div key={item._id} className="cart-item">
                            <div className="cart-item-image">
                                {item.image && item.image.data ? (
                                    <img
                                        src={`data:${item.image.contentType};base64,${item.image.data}`}
                                        alt={item.name}
                                    />
                                ) : (
                                    <div className="placeholder-image">No Image</div>
                                )}
                            </div>
                            <div className="cart-item-details">
                                <h4>{item.name}</h4>
                                <p className="price">${item.price}</p>
                            </div>
                            <div className="cart-item-actions">
                                <div className="quantity-controls">
                                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                                </div>
                                <button onClick={() => removeFromCart(item._id)} className="btn-remove">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Total Items:</span>
                        <span>{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total Price:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <button onClick={handleCheckout} className="btn-primary btn-block">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
