import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Task } from '../tasks/task.model';

export interface UserAttributes {
    id: string;
    email: string;
    passwordHash: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

@Table({
    tableName: 'users',
    timestamps: true,
    underscored: true,
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    declare id: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    declare passwordHash: string;

    @HasMany(() => Task)
    declare tasks: Task[];
}