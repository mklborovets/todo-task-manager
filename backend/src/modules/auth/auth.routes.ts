import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../common/middlewares/validate.middleware';
import { requireAuth } from '../../common/middlewares/auth.middleware';
import { registerSchema, loginSchema } from './auth.schema';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), (req, res, next) =>
    authController.register(req, res, next)
);

authRouter.post('/login', validate(loginSchema), (req, res, next) =>
    authController.login(req, res, next)
);

authRouter.get('/me', requireAuth, (req, res, next) =>
    authController.getMe(req, res, next)
);