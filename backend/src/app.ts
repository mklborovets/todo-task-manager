import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';

export const app: Application = express();

app.use(helmet());
app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});