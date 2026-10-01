import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

export const validate =
    (schema: ZodTypeAny) =>
        async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
            try {
                const parsed = (await schema.parseAsync({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                })) as { body?: unknown; query?: unknown; params?: unknown };

                if (parsed.body !== undefined) {
                    req.body = parsed.body;
                }
                if (parsed.query !== undefined) {
                    Object.keys(req.query).forEach(key => delete req.query[key]);
                    Object.assign(req.query, parsed.query);
                }
                if (parsed.params !== undefined) {
                    Object.keys(req.params).forEach(key => delete req.params[key]);
                    Object.assign(req.params, parsed.params);
                }

                next();
            } catch (error) {
                next(error);
            }
        };