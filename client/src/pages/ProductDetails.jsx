import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * ProductDetails Component
 * 
 * Displays detailed information about a single product.
 * Also fetches and displays related products based on the current product's category.
 * 
 * Features:
 * - Fetches product details by slug.
 * - Displays product image, name, description, price, category, and stock status.
 * - Fetches related products from the same category.
 * - Allows logged-in users to submit reviews.
 */
const ProductDetails = () => {
    const { slug } = useParams();
    const { addToCart } = useCart();
    const { auth } = useAuth();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [numReviews, setNumReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Wishlist state
    const [inWishlist, setInWishlist] = useState(false);

    // Fetch product details and related products
    useEffect(() => {
        const fetchProductAndRelated = async () => {
            try {
                setLoading(true);
                setError('');

                // 1. Fetch current product
                const { data } = await api.get(`/products/${slug}`);
                if (data.success) {
                    const currentProduct = data.payload.product;
                    setProduct(currentProduct);

                    // 2. Fetch related products if category exists
                    if (currentProduct.category) {
                        const categoryId = currentProduct.category._id || currentProduct.category;
                        // Use existing getProducts endpoint with category filter
                        // We'll filter out the current product on the client side or hope for the best for now
                        // Ideally backend should support excluding a specific ID, but client-side filtering works for small datasets
                        const relatedRes = await api.get(`/products?category=${currentProduct.category.slug}&limit=4`);
                        if (relatedRes.data.success) {
                            const related = relatedRes.data.payload.products.filter(p => p._id !== currentProduct._id);
                            setRelatedProducts(related);
                        }
                    }

                    // 3. Fetch reviews for this product
                    await fetchReviews(currentProduct._id);
                }
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError('Failed to load product details.');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProductAndRelated();
        }
    }, [slug]);

    const fetchReviews = async (productId) => {
        try {
            const { data } = await api.get(`/reviews/${productId}`);
            setReviews(data.reviews || []);
            setNumReviews(data.numReviews || 0);
            setAverageRating(data.averageRating || 0);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!product) return;

        setSubmitting(true);
        try {
            await api.post(`/reviews/${product._id}`, { rating, comment });
            setComment('');
            setRating(5);
            await fetchReviews(product._id);
            alert('Review submitted successfully!');
        } catch (err) {
            const message = err.response?.data?.error || 'Error submitting review';
            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    // Check if product is in wishlist
    useEffect(() => {
        const checkWishlist = async () => {
            if (auth?.token && product) {
                try {
                    const { data } = await api.get('/wishlist');
                    const isInWishlist = data.products?.some(p => p._id === product._id);
                    setInWishlist(isInWishlist);
                } catch (err) {
                    console.error('Error checking wishlist:', err);
                }
            }
        };
        checkWishlist();
    }, [auth?.token, product]);

    const toggleWishlist = async () => {
        if (!auth?.token) {
            alert('Please login to add to wishlist');
            return;
        }
        try {
            if (inWishlist) {
                await api.delete(`/wishlist/${product._id}`);
                setInWishlist(false);
                alert('Removed from wishlist');
            } else {
                await api.post('/wishlist', { productId: product._id });
                setInWishlist(true);
                alert('Added to wishlist!');
            }
        } catch (err) {
            const message = err.response?.data?.error || 'Error updating wishlist';
            alert(message);
        }
    };

    if (loading) return <div className="loading">Loading product details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!product) return <div className="error-message">Product not found.</div>;

    return (
        <div className="product-details-container">
            <div className="product-main-details">
                <div className="product-image-large">
                    {product.image && product.image.data ? (
                        <img
                            src={`data:${product.image.contentType};base64,${product.image.data}`}
                            alt={product.name}
                        />
                    ) : (
                        <div className="placeholder-image-large">No Image Available</div>
                    )}
                </div>

                <div className="product-info-large">
                    <h2>{product.name}</h2>
                    <p className="product-category">Category: {product.category?.name || 'Uncategorized'}</p>
                    <p className="product-price">${product.price}</p>
                    <p className="product-description">{product.description}</p>

                    <div className="product-meta">
                        <p>Stock: {product.quantity > 0 ? <span className="in-stock">In Stock ({product.quantity})</span> : <span className="out-of-stock">Out of Stock</span>}</p>
                        <p>Shipping: {product.shipping ? 'Available' : 'Not Available'}</p>
                    </div>

                    <button
                        onClick={() => {
                            addToCart(product);
                            alert('Item added to cart');
                        }}
                        className="btn-primary btn-large"
                    >
                        Add to Cart
                    </button>
                    <button
                        onClick={toggleWishlist}
                        className={`btn-wishlist btn-large ${inWishlist ? 'active' : ''}`}
                    >
                        {inWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
                    </button>
                </div>
            </div>

            {/* Related Products Section */}
            <div className="related-products-section">
                <h3>Related Products</h3>
                {relatedProducts.length === 0 ? (
                    <p>No related products found.</p>
                ) : (
                    <div className="product-grid">
                        {relatedProducts.map(p => (
                            <div key={p._id} className="product-card">
                                <div className="product-image">
                                    {p.image && p.image.data ? (
                                        <img
                                            src={`data:${p.image.contentType};base64,${p.image.data}`}
                                            alt={p.name}
                                        />
                                    ) : (
                                        <div className="placeholder-image">No Image</div>
                                    )}
                                </div>
                                <div className="product-info">
                                    <h4>{p.name}</h4>
                                    <p className="price">${p.price}</p>
                                    <Link to={`/product/${p.slug}`} className="btn-primary btn-block">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
                <h3>Customer Reviews ({numReviews})</h3>
                <p className="average-rating">Average Rating: {averageRating.toFixed(1)} / 5</p>

                {auth?.user && (
                    <form onSubmit={handleSubmitReview} className="review-form">
                        <h4>Write a Review</h4>
                        <div className="form-group">
                            <label htmlFor="rating">Rating</label>
                            <select
                                id="rating"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            >
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Very Good</option>
                                <option value="3">3 - Good</option>
                                <option value="2">2 - Fair</option>
                                <option value="1">1 - Poor</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="comment">Comment</label>
                            <textarea
                                id="comment"
                                rows="4"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                )}

                {reviews.length === 0 ? (
                    <p>No reviews yet. Be the first to review!</p>
                ) : (
                    <div className="reviews-list">
                        {reviews.map((r, i) => (
                            <div key={i} className="review-card">
                                <div className="review-header">
                                    <span className="reviewer-name">{r.name}</span>
                                    <span className="review-rating">Rating: {r.rating}/5</span>
                                </div>
                                <p className="review-comment">{r.comment}</p>
                                <span className="review-date">
                                    {new Date(r.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
