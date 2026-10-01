import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.schema';

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await authService.register(req.body as RegisterDto);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await authService.login(req.body as LoginDto);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await authService.getMe(req.user!.id);
            res.status(200).json({ user });
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();