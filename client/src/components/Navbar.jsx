import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">E-Shop</Link>
            </div>
            <div className="navbar-links">
                <Link to="/">Home</Link>
                <Link to="/cart">
                    Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
                {user ? (
                    <>
                        <span>Hello, {user.name}</span>
                        {user.isAdmin && <Link to="/admin/dashboard">Dashboard</Link>}
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
