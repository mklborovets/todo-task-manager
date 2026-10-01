import { Sequelize } from 'sequelize-typescript';
import { env } from './env';
import { User } from '../modules/auth/user.model';
import { Task } from '../modules/tasks/task.model';

export const sequelize = new Sequelize(env.DATABASE_URL, {
    dialect: 'postgres',
    models: [User, Task],
    logging: false,
    ...(env.NODE_ENV === 'production' && {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }),
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

export const connectDatabase = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: env.NODE_ENV === 'development' });
        console.log('Database connected and models synchronized');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};