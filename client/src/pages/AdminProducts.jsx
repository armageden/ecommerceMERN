import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

/**
 * AdminProducts Component
 * 
 * This component is responsible for listing all products in the admin dashboard.
 * It provides functionalities to view, delete, and navigate to create/edit pages.
 * 
 * Features:
 * - Fetches products from the backend API.
 * - Displays products in a tabular format with images.
 * - Handles product deletion with confirmation.
 */
const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /**
     * Fetches the list of products from the server.
     * Runs on component mount and after deletion.
     */
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            // The API returns { success: true, message: "...", payload: { products: [...], pagination: {...} } }
            if (response.data.success) {
                setProducts(response.data.payload.products);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    /**
     * Handles the deletion of a product.
     * 
     * @param {string} slug - The slug of the product to delete.
     */
    const handleDelete = async (slug) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                await api.delete(`/products/${slug}`);
                // Refresh the product list after successful deletion
                fetchProducts();
            } catch (err) {
                console.error('Error deleting product:', err);
                alert('Failed to delete product.');
            }
        }
    };

    if (loading) return <div className="loading">Loading products...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-products-container">
            <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Product Management</h3>
                <Link to="/admin/dashboard/products/create" className="btn-primary" style={{ textDecoration: 'none', padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', borderRadius: '4px' }}>
                    Create New Product
                </Link>
            </div>

            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    {product.image && product.image.data ? (
                                        <img
                                            src={`data:${product.image.contentType};base64,${product.image.data}`}
                                            alt={product.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
                                <td>{product.name}</td>
                                <td>{product.category?.name || 'Uncategorized'}</td>
                                <td>${product.price}</td>
                                <td>{product.quantity}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link to={`/admin/dashboard/products/edit/${product.slug}`} className="btn-success btn-sm" style={{ textDecoration: 'none', textAlign: 'center' }}>
                                            Edit
                                        </Link>
                                        <button onClick={() => handleDelete(product.slug)} className="btn-danger btn-sm">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminProducts;
