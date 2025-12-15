import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.payload.categories);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/categories', { name });
            setMessage('Category created successfully');
            setName('');
            fetchCategories();
        } catch (error) {
            setMessage('Failed to create category');
        }
    };

    const handleDelete = async (slug) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/categories/${slug}`);
                setMessage('Category deleted successfully');
                fetchCategories();
            } catch (error) {
                setMessage('Failed to delete category');
            }
        }
    };

    const handleUpdate = async (slug, currentName) => {
        const newName = window.prompt('Enter new category name:', currentName);
        if (newName && newName !== currentName) {
            try {
                await api.put(`/categories/${slug}`, { name: newName });
                setMessage('Category updated successfully');
                fetchCategories();
            } catch (error) {
                setMessage('Failed to update category');
            }
        }
    };

    return (
        <div className="admin-categories-container">
            <h3>Category Management</h3>
            {message && <p className="message">{message}</p>}

            <form onSubmit={handleSubmit} className="mb-4">
                <div className="form-group">
                    <label>New Category Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter category name"
                    />
                </div>
                <button type="submit">Create Category</button>
            </form>

            <ul className="category-list">
                {categories && categories.map(cat => (
                    <li key={cat._id} className="category-item">
                        <span>{cat.name}</span>
                        <div>
                            <button onClick={() => handleUpdate(cat.slug, cat.name)} className="btn-success btn-sm" style={{ marginRight: '0.5rem' }}>Edit</button>
                            <button onClick={() => handleDelete(cat.slug)} className="btn-danger btn-sm">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminCategories;
