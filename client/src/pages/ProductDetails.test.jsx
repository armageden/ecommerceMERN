import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductDetails from './ProductDetails';
import api from '../api/axios';

// Mock the API module
vi.mock('../api/axios');

// Mock CartContext
const mockAddToCart = vi.fn();
vi.mock('../context/CartContext', () => ({
    useCart: () => ({
        addToCart: mockAddToCart,
    }),
}));

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        auth: { user: { name: 'Test User' }, token: 'fake-token' },
    }),
}));

describe('ProductDetails Component', () => {
    it('renders product details', async () => {
        // Mock successful API responses
        const mockProduct = {
            _id: '1',
            name: 'Test Product',
            slug: 'test-product',
            description: 'Test Description',
            price: 100,
            category: { _id: 'c1', name: 'Test Category', slug: 'test-category' },
            quantity: 10,
            shipping: true,
            image: { data: 'base64data', contentType: 'image/png' }
        };

        api.get.mockImplementation((url) => {
            if (url === '/products/test-product') {
                return Promise.resolve({
                    data: {
                        success: true,
                        payload: { product: mockProduct }
                    }
                });
            }
            if (url.includes('/products?category=')) {
                return Promise.resolve({
                    data: {
                        success: true,
                        payload: { products: [] }
                    }
                });
            }
            // Mock reviews API (third API call)
            if (url === '/products/1/reviews') {
                return Promise.resolve({
                    data: {
                        reviews: [],
                        numReviews: 0,
                        averageRating: 0
                    }
                });
            }
            return Promise.reject(new Error('Not found'));
        });

        render(
            <MemoryRouter initialEntries={['/product/test-product']}>
                <Routes>
                    <Route path="/product/:slug" element={<ProductDetails />} />
                </Routes>
            </MemoryRouter>
        );

        // Check for loading state initially
        expect(screen.getByText(/Loading product details.../i)).toBeInTheDocument();

        // Wait for product details to load
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Test Product/i })).toBeInTheDocument();
            expect(screen.getByText(/Test Description/i)).toBeInTheDocument();
            expect(screen.getByText(/\$100/i)).toBeInTheDocument();
            expect(screen.getByText(/Category: Test Category/i)).toBeInTheDocument();
        });
    });
});
