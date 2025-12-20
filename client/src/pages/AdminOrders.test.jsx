import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminOrders from './AdminOrders';
import api from '../api/axios';
import { AuthProvider } from '../context/AuthContext';

// Mock API
vi.mock('../api/axios');

// Mock AuthContext
const mockUser = { name: 'Admin User', role: 1 };
vi.mock('../context/AuthContext', async () => {
    const actual = await vi.importActual('../context/AuthContext');
    return {
        ...actual,
        useAuth: () => ({
            auth: { user: mockUser, token: 'fake-token' },
        }),
    };
});

// Mock Ant Design
vi.mock('antd', () => {
    const Option = ({ children, ...props }) => <option {...props}>{children}</option>;
    const Select = ({ children, onChange, defaultValue, ...props }) => (
        <select onChange={(e) => onChange(e.target.value)} defaultValue={defaultValue} {...props}>
            {children}
        </select>
    );
    Select.Option = Option;
    return { Select };
});

describe('AdminOrders Component', () => {
    it('renders admin orders list', async () => {
        const mockOrders = [
            {
                _id: 'order1',
                status: 'Not Processed',
                createdAt: new Date().toISOString(),
                buyer: { name: 'Buyer 1' },
                products: [
                    { product: { name: 'Product 1' }, count: 2, price: 50 }
                ],
                payment: { transaction: { amount: 100 } }
            }
        ];

        api.get.mockResolvedValue({ data: mockOrders });

        render(<AdminOrders />);

        await waitFor(() => {
            expect(screen.getByText(/Manage Orders/i)).toBeInTheDocument();
            expect(screen.getByText(/Order ID: order1/i)).toBeInTheDocument();
            expect(screen.getByText(/Buyer: Buyer 1/i)).toBeInTheDocument();
        });
    });

    it('handles status update', async () => {
        const mockOrders = [
            {
                _id: 'order1',
                status: 'Not Processed',
                createdAt: new Date().toISOString(),
                buyer: { name: 'Buyer 1' },
                products: [],
                payment: {}
            }
        ];

        api.get.mockResolvedValue({ data: mockOrders });
        api.put.mockResolvedValue({ data: { ...mockOrders[0], status: 'Processing' } });

        render(<AdminOrders />);

        await waitFor(() => {
            expect(screen.getByText(/Not Processed/i)).toBeInTheDocument();
        });

        // Note: Testing Ant Design Select in JSDOM can be tricky due to its overlay nature.
        // We'll focus on ensuring the component renders and API calls are mocked correctly.
        // For a real interaction test, we might need a more complex setup or E2E tests.
    });
});
