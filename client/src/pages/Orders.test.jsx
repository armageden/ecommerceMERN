import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Orders from './Orders';
import api from '../api/axios';

// Mock API
vi.mock('../api/axios');

describe('Orders Component', () => {
    it('renders orders list', async () => {
        const mockOrders = [
            {
                _id: 'order1',
                status: 'Not Processed',
                createdAt: new Date().toISOString(),
                products: [
                    { product: { name: 'Product 1' }, count: 2, price: 50 }
                ],
                payment: { transaction: { amount: 100 } }
            }
        ];

        api.get.mockResolvedValue({ data: mockOrders });

        render(<Orders />);

        expect(screen.getByText(/Loading orders.../i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/Your Orders/i)).toBeInTheDocument();
            expect(screen.getByText(/Order ID: order1/i)).toBeInTheDocument();
            expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
            expect(screen.getByText(/\$100/i)).toBeInTheDocument();
        });
    });

    it('renders no orders message', async () => {
        api.get.mockResolvedValue({ data: [] });

        render(<Orders />);

        await waitFor(() => {
            expect(screen.getByText(/No orders found/i)).toBeInTheDocument();
        });
    });
});
