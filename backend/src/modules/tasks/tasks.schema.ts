import { z } from 'zod';
import { TaskStatus } from './task.model';

export const createTaskSchema = z.object({
    body: z.object({
        title: z.string().trim().min(1, 'Title is required').max(150, 'Title is too long'),
        description: z.string().trim().max(2000, 'Description is too long').nullable().optional(),
        status: z.nativeEnum(TaskStatus).optional().default(TaskStatus.TODO),
    }),
});

export const updateTaskSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid task ID'),
    }),
    body: z.object({
        title: z.string().trim().min(1, 'Title cannot be empty').max(150, 'Title is too long').optional(),
        description: z.string().trim().max(2000, 'Description is too long').nullable().optional(),
        status: z.nativeEnum(TaskStatus).optional(),
    }),
});

export const taskIdParamSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid task ID'),
    }),
});

export const getTasksQuerySchema = z.object({
    query: z.object({
        status: z.nativeEnum(TaskStatus).optional(),
    }),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>['body'];
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>['body'];
export type GetTasksQueryDto = z.infer<typeof getTasksQuerySchema>['query'];