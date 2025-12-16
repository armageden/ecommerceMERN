import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import api from '../api/axios';

// Mock the API module
vi.mock('../api/axios');

describe('Home Component', () => {
    it('renders filters and search bar', async () => {
        // Mock successful API responses
        api.get.mockResolvedValue({
            data: {
                success: true,
                payload: {
                    products: [],
                    categories: [],
                    pagination: { totalPages: 1 }
                }
            }
        });

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Check for Filters sidebar heading specifically
        expect(screen.getByRole('heading', { name: /^Filters$/i })).toBeInTheDocument();

        // Check for Search input
        expect(screen.getByPlaceholderText(/Search products.../i)).toBeInTheDocument();

        // Check for Categories section
        expect(screen.getByRole('heading', { name: /Categories/i })).toBeInTheDocument();
    });
});
