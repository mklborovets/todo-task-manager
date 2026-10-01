import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { User } from '../auth/user.model';

export enum TaskStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    DONE = 'done',
}

export interface TaskAttributes {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TaskCreationAttributes
    extends Optional<TaskAttributes, 'id' | 'description' | 'status'> { }

@Table({
    tableName: 'tasks',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            name: 'tasks_user_id_status_idx',
            fields: ['user_id', 'status'],
        },
    ],
})
export class Task extends Model<TaskAttributes, TaskCreationAttributes> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @Column({
        type: DataType.STRING(150),
        allowNull: false,
    })
    declare title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
        defaultValue: null,
    })
    declare description: string | null;

    @Column({
        type: DataType.ENUM(...Object.values(TaskStatus)),
        allowNull: false,
        defaultValue: TaskStatus.TODO,
    })
    declare status: TaskStatus;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    declare userId: string;

    @BelongsTo(() => User, { onDelete: 'CASCADE' })
    declare user: User;
}