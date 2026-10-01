import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import type { TaskStatus, CreateTaskPayload, UpdateTaskPayload } from '../types';

export const TASKS_QUERY_KEY = 'tasks';

export function useTasks(statusFilter?: TaskStatus) {
    return useQuery({
        queryKey: [TASKS_QUERY_KEY, statusFilter ?? 'all'],
        queryFn: () => tasksApi.getAll(statusFilter),
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateTaskPayload) => tasksApi.create(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) =>
            tasksApi.update(id, payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => tasksApi.delete(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
        },
    });
}