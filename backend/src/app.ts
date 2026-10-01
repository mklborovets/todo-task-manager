import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { authRouter } from './modules/auth/auth.routes';
import { tasksRouter } from './modules/tasks/tasks.routes';
import { errorHandler } from './common/middlewares/error.middleware';

export const app: Application = express();

app.use(helmet());
app.use(
    cors({
        origin: env.CLIENT_URL,
    })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);

app.use(errorHandler);