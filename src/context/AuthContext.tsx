import React, { createContext, useContext, useMemo, useState } from 'react';
import { login as loginRequest, LoginResponse } from '../services/authService';
import { setAuthToken } from '../services/apiClient';
import { User } from '../types';

type AuthContextValue = {
    user: User | null;
    userId: number | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<User>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
        const response = await loginRequest(email, password);
        const nextUser = extractUser(response);
        const token = extractToken(response);

        setUser(nextUser);
        setAuthToken(token);
        return nextUser;
    };

    const logout = () => {
        setUser(null);
        setAuthToken(null);
    };

    const value = useMemo<AuthContextValue>(() => ({
        user,
        userId: user?.id ?? null,
        isAuthenticated: Boolean(user),
        login,
        logout,
    }), [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

function extractUser(response: LoginResponse): User {
    if (hasUser(response)) {
        return response.user;
    }
    if (isUser(response)) {
        return response;
    }
    throw new Error('Login response did not include a valid user.');
}

function hasUser(response: LoginResponse): response is { user: User; token?: string; accessToken?: string } {
    return 'user' in response && isUser(response.user);
}

function isUser(value: unknown): value is User {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const candidate = value as Partial<User>;
    if (typeof candidate.id !== 'number') {
        return false;
    }
    if (typeof candidate.username !== 'string') {
        return false;
    }
    if (typeof candidate.email !== 'string') {
        return false;
    }
    return true;
}

function extractToken(response: LoginResponse): string | null {
    if ('token' in response && typeof response.token === 'string') {
        return response.token;
    }
    if ('accessToken' in response && typeof response.accessToken === 'string') {
        return response.accessToken;
    }
    return null;
}
