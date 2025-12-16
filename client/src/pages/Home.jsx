import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

/**
 * Home Component
 * 
 * The main landing page of the application.
 * Displays a list of products with advanced filtering, searching, and sorting capabilities.
 * 
 * Features:
 * - Product Search: Real-time or submit-based search by name/description.
 * - Category Filter: Filter products by specific categories.
 * - Price Filter: Filter products within a specific price range.
 * - Sorting: Sort products by price or newness.
 * - Pagination: Navigate through pages of products.
 */
const Home = () => {
    // State for product data and UI
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for filters and pagination
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sort, setSort] = useState('-createdAt'); // Default: Newest first
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    /**
     * Fetches categories for the sidebar filter.
     * Runs once on component mount.
     */
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                if (response.data.success) {
                    setCategories(response.data.payload.categories);
                }
            } catch (err) {
                console.error('Failed to load categories', err);
            }
        };
        fetchCategories();
    }, []);

    /**
     * Fetches products based on current filters.
     * Runs whenever filters (page, search, category, price, sort) change.
     */
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError('');

                // Construct query parameters
                const params = {
                    page,
                    limit: 9, // 9 products per page for a 3x3 grid
                    search,
                    sort,
                    category: selectedCategory,
                    minPrice: priceRange.min,
                    maxPrice: priceRange.max,
                };

                const response = await api.get('/products', { params });

                if (response.data.success) {
                    setProducts(response.data.payload.products);
                    setTotalPages(response.data.payload.pagination.totalPages);
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        // Debounce search to prevent excessive API calls
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [page, search, selectedCategory, priceRange, sort]);

    /**
     * Handles changes in price input fields.
     */
    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setPriceRange(prev => ({ ...prev, [name]: value }));
        setPage(1); // Reset to first page on filter change
    };

    /**
     * Resets all filters to their default state.
     */
    const handleResetFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setPriceRange({ min: '', max: '' });
        setSort('-createdAt');
        setPage(1);
    };

    return (
        <div className="home-container">
            {/* Sidebar for Filters */}
            <aside className="filters-sidebar">
                <h3>Filters</h3>

                {/* Category Filter */}
                <div className="filter-group">
                    <h4>Categories</h4>
                    <ul className="category-filter-list">
                        <li
                            className={selectedCategory === '' ? 'active' : ''}
                            onClick={() => { setSelectedCategory(''); setPage(1); }}
                        >
                            All Categories
                        </li>
                        {categories.map(cat => (
                            <li
                                key={cat._id}
                                className={selectedCategory === cat.slug ? 'active' : ''}
                                onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                            >
                                {cat.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Price Filter */}
                <div className="filter-group">
                    <h4>Price Range</h4>
                    <div className="price-inputs">
                        <input
                            type="number"
                            name="min"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={handlePriceChange}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            name="max"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={handlePriceChange}
                        />
                    </div>
                </div>

                <button onClick={handleResetFilters} className="btn-secondary">Reset Filters</button>
            </aside>

            {/* Main Content Area */}
            <main className="product-main">
                {/* Top Bar: Search and Sort */}
                <div className="top-bar">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="search-input"
                    />

                    <select
                        value={sort}
                        onChange={(e) => { setSort(e.target.value); setPage(1); }}
                        className="sort-select"
                    >
                        <option value="-createdAt">Newest First</option>
                        <option value="price">Price: Low to High</option>
                        <option value="-price">Price: High to Low</option>
                        <option value="-sold">Best Selling</option>
                    </select>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="loading">Loading products...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : products.length === 0 ? (
                    <div className="no-products">No products found matching your criteria.</div>
                ) : (
                    <div className="product-grid">
                        {products.map(product => (
                            <div key={product._id} className="product-card">
                                <div className="product-image">
                                    {product.image && product.image.data ? (
                                        <img
                                            src={`data:${product.image.contentType};base64,${product.image.data}`}
                                            alt={product.name}
                                        />
                                    ) : (
                                        <div className="placeholder-image">No Image</div>
                                    )}
                                </div>
                                <div className="product-info">
                                    <h4>{product.name}</h4>
                                    <p className="price">${product.price}</p>
                                    <Link to={`/product/${product.slug}`} className="btn-primary btn-block">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
