import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [coach, setCoach] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('coachToken');
        if (token) {
            const user = JSON.parse(localStorage.getItem('coachUser'));
            setCoach(user);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/coaches/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('coachToken', token);
            localStorage.setItem('coachUser', JSON.stringify(user));
            setCoach(user);
            return user;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('coachToken');
        localStorage.removeItem('coachUser');
        setCoach(null);
    };

    return (
        <AuthContext.Provider value={{ coach, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);