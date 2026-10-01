import { WhereOptions } from 'sequelize';
import { Task, TaskAttributes } from './task.model';
import { CreateTaskDto, UpdateTaskDto, GetTasksQueryDto } from './tasks.schema';
import { AppError } from '../../common/errors/app-error';

export class TasksService {
    async findAllByUser(userId: string, query: GetTasksQueryDto): Promise<Task[]> {
        const whereClause: WhereOptions<TaskAttributes> = { userId };

        if (query.status) {
            whereClause.status = query.status;
        }

        return Task.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
        });
    }

    async findOneByUser(userId: string, taskId: string): Promise<Task> {
        const task = await Task.findOne({
            where: { id: taskId, userId },
        });

        if (!task) {
            throw new AppError('Task not found', 404);
        }

        return task;
    }

    async create(userId: string, dto: CreateTaskDto): Promise<Task> {
        return Task.create({
            title: dto.title,
            description: dto.description ?? null,
            status: dto.status,
            userId,
        });
    }

    async update(userId: string, taskId: string, dto: UpdateTaskDto): Promise<Task> {
        const task = await this.findOneByUser(userId, taskId);

        if (dto.title !== undefined) {
            task.title = dto.title;
        }
        if (dto.description !== undefined) {
            task.description = dto.description;
        }
        if (dto.status !== undefined) {
            task.status = dto.status;
        }

        await task.save();
        return task;
    }

    async delete(userId: string, taskId: string): Promise<void> {
        const task = await this.findOneByUser(userId, taskId);
        await task.destroy();
    }
}

export const tasksService = new TasksService();