export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface User {
    id: string;
    email: string;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    userId: string;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskPayload {
    title: string;
    description?: string | null;
    dueDate?: string | null;
    status?: TaskStatus;
}

export interface UpdateTaskPayload {
    title?: string;
    description?: string | null;
    dueDate?: string | null;
    status?: TaskStatus;
}