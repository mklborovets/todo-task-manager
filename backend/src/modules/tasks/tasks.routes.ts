import { Router } from 'express';
import { tasksController } from './tasks.controller';
import { requireAuth } from '../../common/middlewares/auth.middleware';
import { validate } from '../../common/middlewares/validate.middleware';
import {
    createTaskSchema,
    updateTaskSchema,
    taskIdParamSchema,
    getTasksQuerySchema,
} from './tasks.schema';

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

tasksRouter.get('/', validate(getTasksQuerySchema), (req, res, next) =>
    tasksController.getAll(req, res, next)
);

tasksRouter.get('/:id', validate(taskIdParamSchema), (req, res, next) =>
    tasksController.getById(req, res, next)
);

tasksRouter.post('/', validate(createTaskSchema), (req, res, next) =>
    tasksController.create(req, res, next)
);

tasksRouter.patch('/:id', validate(updateTaskSchema), (req, res, next) =>
    tasksController.update(req, res, next)
);

tasksRouter.delete('/:id', validate(taskIdParamSchema), (req, res, next) =>
    tasksController.delete(req, res, next)
);