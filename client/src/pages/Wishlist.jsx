import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
    const { auth } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth?.token) {
            fetchWishlist();
        }
    }, [auth?.token]);

    const fetchWishlist = async () => {
        try {
            const { data } = await api.get('/wishlist');
            setWishlist(data.products || []);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await api.delete(`/wishlist/${productId}`);
            setWishlist(wishlist.filter((p) => p._id !== productId));
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    if (loading) return <div className="loading">Loading wishlist...</div>;

    return (
        <div className="wishlist-container">
            <h2>My Wishlist</h2>
            {wishlist.length === 0 ? (
                <div className="empty-wishlist">
                    <p>Your wishlist is empty.</p>
                    <Link to="/" className="btn-primary">Continue Shopping</Link>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlist.map((product) => (
                        <div key={product._id} className="wishlist-item">
                            <div className="wishlist-image">
                                {product.image && product.image.data ? (
                                    <img
                                        src={`data:${product.image.contentType};base64,${product.image.data}`}
                                        alt={product.name}
                                    />
                                ) : (
                                    <div className="placeholder-image">No Image</div>
                                )}
                            </div>
                            <div className="wishlist-info">
                                <h4>{product.name}</h4>
                                <p className="price">${product.price}</p>
                                <div className="wishlist-actions">
                                    <Link to={`/product/${product.slug}`} className="btn-primary">
                                        View
                                    </Link>
                                    <button
                                        onClick={() => removeFromWishlist(product._id)}
                                        className="btn-secondary btn-remove"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
