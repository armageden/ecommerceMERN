import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Checkout from './Checkout';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import api from '../api/axios';

// Mock API
vi.mock('../api/axios');

// Mock Braintree DropIn
vi.mock('braintree-web-drop-in-react', () => ({
    default: ({ onInstance }) => {
        // Simulate instance creation
        setTimeout(() => {
            onInstance({
                requestPaymentMethod: vi.fn().mockResolvedValue({ nonce: 'fake-nonce' }),
            });
        }, 0);
        return <div data-testid="braintree-dropin">Braintree DropIn</div>;
    },
}));

// Mock AuthContext
const mockUser = { name: 'Test User', _id: '123' };
vi.mock('../context/AuthContext', async () => {
    const actual = await vi.importActual('../context/AuthContext');
    return {
        ...actual,
        useAuth: () => ({
            auth: { user: mockUser, token: 'fake-token' },
        }),
    };
});

// Mock CartContext
const mockCart = [{ _id: '1', name: 'Product 1', price: 100, quantity: 1 }];
const mockClearCart = vi.fn();
vi.mock('../context/CartContext', async () => {
    return {
        CartProvider: ({ children }) => <div>{children}</div>,
        useCart: () => ({
            cart: mockCart,
            clearCart: mockClearCart,
        }),
    };
});

describe('Checkout Component', () => {
    it('renders checkout page with total amount', async () => {
        api.get.mockResolvedValue({ data: { clientToken: 'fake-client-token' } });

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        expect(screen.getByText(/Checkout/i)).toBeInTheDocument();
        expect(screen.getByText(/Total Amount: \$100.00/i)).toBeInTheDocument();

        // Check if Braintree DropIn renders after token fetch
        await waitFor(() => {
            expect(screen.getByTestId('braintree-dropin')).toBeInTheDocument();
        });
    });

    it('handles payment submission', async () => {
        api.get.mockResolvedValue({ data: { clientToken: 'fake-client-token' } });
        api.post.mockResolvedValue({ data: { ok: true } });
        window.alert = vi.fn();

        render(
            <MemoryRouter>
                <Checkout />
            </MemoryRouter>
        );

        // Wait for DropIn and Pay button
        await waitFor(() => {
            expect(screen.getByText('Pay Now')).toBeInTheDocument();
        });

        const payButton = screen.getByText('Pay Now');
        fireEvent.click(payButton);

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/braintree/payment', expect.any(Object));
            expect(mockClearCart).toHaveBeenCalled();
            expect(window.alert).toHaveBeenCalledWith('Payment Successful');
        });
    });
});
