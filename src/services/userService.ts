import api from './api';

export interface User {
    id: string;
    username: string;
    role: string;
    createdAt: string;
}

export interface CreateUserPayload {
    username: string;
    password: string;
    role?: string;
}

export const userService = {
    getUsers: async (): Promise<User[]> => {
        const response = await api.get('/users');
        return response.data;
    },
    createUser: async (data: CreateUserPayload): Promise<User> => {
        const response = await api.post('/users', data);
        return response.data;
    },
    deleteUser: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },
};

