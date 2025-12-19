import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

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
 */
const ProductDetails = () => {
    const { slug } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        </div>
    );
};

export default ProductDetails;
