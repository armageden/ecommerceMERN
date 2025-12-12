import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

describe('Home Component', () => {
    it('renders welcome message', () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
        expect(screen.getByText(/Welcome to E-Commerce MERN/i)).toBeInTheDocument();
    });
});
