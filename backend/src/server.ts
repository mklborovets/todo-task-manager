import 'reflect-metadata';
import { app } from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';

const startServer = async () => {
    await connectDatabase();

    app.listen(env.PORT, () => {
        console.log(`Server is running on http://localhost:${env.PORT}`);
    });
};

startServer();