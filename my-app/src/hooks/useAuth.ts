import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('apiKey');
        localStorage.removeItem('aiprovider');
        setUser(null);
        // Force page reload to clear all state
        window.location.href = '/';
    }

    return { user, loading, login, logout };
}