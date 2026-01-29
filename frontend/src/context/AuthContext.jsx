import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token
        const token = localStorage.getItem('token');
        if (token) {
            // In a real app we would validate the token with /me endpoint
            // Decoding JWT for simple display
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser({ username: payload.sub, role: payload.role });
                setIsAuthenticated(true);
            } catch (e) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password, mfaToken) => {
        try {
            const response = await api.post('/auth/login', {
                username,
                password,
            }, {
                params: { mfa_token: mfaToken }
            });

            const { access_token } = response.data;
            localStorage.setItem('token', access_token);

            const payload = JSON.parse(atob(access_token.split('.')[1]));
            setUser({ username: payload.sub, role: payload.role });
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed'
            };
        }
    };

    const register = async (username, email, password, role) => {
        try {
            const response = await api.post('/auth/register', {
                username,
                email,
                password,
                role
            });
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            const payload = JSON.parse(atob(access_token.split('.')[1]));
            setUser({ username: payload.sub, role: payload.role });
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
