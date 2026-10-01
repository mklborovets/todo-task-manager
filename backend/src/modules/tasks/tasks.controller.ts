import { Request, Response, NextFunction } from 'express';
import { tasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, GetTasksQueryDto } from './tasks.schema';

export class TasksController {
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query as unknown as GetTasksQueryDto;
            const tasks = await tasksService.findAllByUser(req.user!.id, query);
            res.status(200).json(tasks);
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const task = await tasksService.findOneByUser(req.user!.id, req.params.id as string);
            res.status(200).json(task);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const task = await tasksService.create(req.user!.id, req.body as CreateTaskDto);
            res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const task = await tasksService.update(
                req.user!.id,
                req.params.id as string,
                req.body as UpdateTaskDto
            );
            res.status(200).json(task);
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await tasksService.delete(req.user!.id, req.params.id as string);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export const tasksController = new TasksController();