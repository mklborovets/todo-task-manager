import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from './auth.controller';
import { validate } from '../../common/middlewares/validate.middleware';
import { requireAuth } from '../../common/middlewares/auth.middleware';
import { registerSchema, loginSchema } from './auth.schema';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV !== 'production',
});

export const authRouter = Router();

authRouter.post('/register', authLimiter, validate(registerSchema), (req, res, next) =>
    authController.register(req, res, next)
);

authRouter.post('/login', authLimiter, validate(loginSchema), (req, res, next) =>
    authController.login(req, res, next)
);

authRouter.get('/me', requireAuth, (req, res, next) =>
    authController.getMe(req, res, next)
);