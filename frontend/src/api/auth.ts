import { apiClient } from './client';
import type { AuthResponse, User } from '../types';

export interface AuthCredentials {
    email: string;
    password: string;
}

export const authApi = {
    login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    register: async (credentials: AuthCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
        return response.data;
    },

    getMe: async (): Promise<{ user: User }> => {
        const response = await apiClient.get<{ user: User }>('/auth/me');
        return response.data;
    },
};