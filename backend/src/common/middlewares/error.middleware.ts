import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            message: err.message,
        });
        return;
    }

    if (err instanceof ZodError) {
        res.status(400).json({
            message: 'Validation failed',
            errors: err.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        });
        return;
    }

    console.error('Unhandled error:', err);
    res.status(500).json({
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
            error: String(err),
            stack: err instanceof Error ? err.stack : undefined
        })
    });
};
