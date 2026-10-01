import { apiClient } from './client';
import type { Task, TaskStatus, CreateTaskPayload, UpdateTaskPayload } from '../types';

export const tasksApi = {
    getAll: async (status?: TaskStatus): Promise<Task[]> => {
        const params = status ? { status } : undefined;
        const response = await apiClient.get<Task[]>('/tasks', { params });
        return response.data;
    },

    getById: async (id: string): Promise<Task> => {
        const response = await apiClient.get<Task>(`/tasks/${id}`);
        return response.data;
    },

    create: async (payload: CreateTaskPayload): Promise<Task> => {
        const response = await apiClient.post<Task>('/tasks', payload);
        return response.data;
    },

    update: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
        const response = await apiClient.patch<Task>(`/tasks/${id}`, payload);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/tasks/${id}`);
    },
};