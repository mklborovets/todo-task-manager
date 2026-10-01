import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authApi, type AuthCredentials } from '../api/auth';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: AuthCredentials) => Promise<void>;
    register: (credentials: AuthCredentials) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const queryClient = useQueryClient();

    const initAuth = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const data = await authApi.getMe();
            setUser(data.user);
        } catch {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void initAuth();
    }, [initAuth]);

    const login = async (credentials: AuthCredentials) => {
        const data = await authApi.login(credentials);
        localStorage.setItem('token', data.token);
        setUser(data.user);
    };

    const register = async (credentials: AuthCredentials) => {
        const data = await authApi.register(credentials);
        localStorage.setItem('token', data.token);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        queryClient.clear();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}