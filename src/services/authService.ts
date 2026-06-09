import { apiClient } from './apiClient';
import { User } from '../types';

export type LoginResponse = User | {
    user?: User;
    token?: string;
    accessToken?: string;
};

export type RegisterInput = {
    username: string;
    email: string;
    password: string;
    name?: string;
    surname?: string;
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/users/login', { email, password });
};

export const register = async (userData: RegisterInput): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/users/register', userData);
};
