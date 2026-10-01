import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        email: z.string().trim().toLowerCase().email('Invalid email format'),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters')
            .max(72, 'Password is too long'),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().trim().toLowerCase().email('Invalid email format'),
        password: z.string().min(1, 'Password is required'),
    }),
});

export type RegisterDto = z.infer<typeof registerSchema>['body'];
export type LoginDto = z.infer<typeof loginSchema>['body'];