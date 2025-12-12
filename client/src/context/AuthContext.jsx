import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount (e.g., check for cookie/token validity)
    // Since we use httpOnly cookies, we might need an endpoint like /api/users/profile or /api/auth/check
    // For now, we'll assume we need to fetch the profile if we think we are logged in, 
    // or just wait for the first 401 to clear state.
    // A better approach with httpOnly cookies is to have a "me" endpoint.

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                // We'll use the profile endpoint to check if we are logged in
                const response = await api.get('/users/profile');
                if (response.data.success) {
                    setUser(response.data.payload.user);
                }
            } catch (error) {
                // Not logged in or token expired
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            setUser(response.data.payload.User || response.data.payload.user); // Adjust based on actual API response
            return response.data;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const register = async (formData) => {
        // formData should be a FormData object for file upload
        const response = await api.post('/users/process-register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
