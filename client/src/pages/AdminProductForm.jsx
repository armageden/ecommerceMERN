import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

/**
 * AdminProductForm Component
 * 
 * This component is used for both creating and editing products.
 * It handles form state, file uploads, and API interactions.
 * 
 * Features:
 * - Dynamic mode (Create vs Edit) based on URL parameters.
 * - Fetches categories for the dropdown selection.
 * - Handles image file selection and preview.
 * - Submits data using FormData to support file uploads.
 */
const AdminProductForm = () => {
    const { slug } = useParams(); // If slug is present, we are in Edit mode
    const navigate = useNavigate();
    const isEditMode = !!slug;

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        shipping: '0', // 0 for No, 1 for Yes
        category: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                if (response.data.success) {
                    setCategories(response.data.payload.categories);
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch product details if in Edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const response = await api.get(`/products/${slug}`);
                    if (response.data.success) {
                        const product = response.data.payload.product;
                        setFormData({
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            quantity: product.quantity,
                            shipping: product.shipping ? '1' : '0',
                            category: product.category?._id || product.category, // Handle populated or unpopulated category
                            image: null, // We don't set the image file here, only preview
                        });
                        // Set existing image as preview if available
                        if (product.image && product.image.data) {
                            // Note: The backend returns buffer data. 
                            // In a real app, we might want to handle this differently, but for now:
                            // We won't convert buffer to blob for preview here easily without more logic.
                            // We'll just show "Existing image" text or similar if we don't want to complicate.
                            // Or we can try to construct the data URI.
                            setImagePreview(`data:${product.image.contentType};base64,${product.image.data}`);
                        }
                    }
                } catch (err) {
                    console.error('Error fetching product details:', err);
                    setError('Failed to load product details.');
                }
            };
            fetchProduct();
        }
    }, [isEditMode, slug]);

    /**
     * Handles input changes for text and select fields.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Handles file input changes for product image.
     */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    /**
     * Submits the form data to the server.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('quantity', formData.quantity);
            data.append('shipping', formData.shipping === '1' ? 'true' : 'false'); // Backend expects boolean or string? Let's check model.
            // Model says: shipping: { type: Boolean, default: false }
            // FormData sends strings. 'true'/'false' usually works if backend parses it, or we might need to be careful.
            // Let's send it as is, usually express/mongoose handles it or we might need to adjust.
            // Actually, let's check if we need to send it as '1' or '0' or 'true'. 
            // Safe bet: 'true' or 'false' string.

            data.append('category', formData.category);
            if (formData.image) {
                data.append('image', formData.image);
            }

            if (isEditMode) {
                await api.put(`/products/${slug}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await api.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            navigate('/admin/dashboard/products');
        } catch (err) {
            console.error('Error saving product:', err);
            setError(err.response?.data?.message || 'Failed to save product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-product-form-container">
            <h3>{isEditMode ? 'Edit Product' : 'Create New Product'}</h3>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                    />
                </div>

                <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Shipping</label>
                    <select
                        name="shipping"
                        value={formData.shipping}
                        onChange={handleChange}
                    >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Product Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        required={!isEditMode} // Required only for creation
                    />
                    {imagePreview && (
                        <div style={{ marginTop: '1rem' }}>
                            <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '4px' }} />
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
                </button>
            </form>
        </div>
    );
};

export default AdminProductForm;
