import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.coerce.number().default(4000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    CLIENT_URL: z.string().default('http://localhost:5173'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('Invalid environment variables:', parsedEnv.error.format());
    process.exit(1);
}

export const env = parsedEnv.data;