import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from './user.model';
import { RegisterDto, LoginDto } from './auth.schema';
import { AppError } from '../../common/errors/app-error';
import { env } from '../../config/env';

const SALT_ROUNDS = 10;

export class AuthService {
    private generateToken(id: string, email: string): string {
        const options: SignOptions = {
            expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
        };

        return jwt.sign({ id, email }, env.JWT_SECRET, options);
    }

    async register(dto: RegisterDto) {
        const existingUser = await User.findOne({ where: { email: dto.email } });
        if (existingUser) {
            throw new AppError('User with this email already exists', 409);
        }

        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

        const user = await User.create({
            email: dto.email,
            passwordHash,
        });

        const token = this.generateToken(user.id, user.email);

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
            },
        };
    }

    async login(dto: LoginDto) {
        const user = await User.findOne({ where: { email: dto.email } });
        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = this.generateToken(user.id, user.email);

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
            },
        };
    }

    async getMe(userId: string) {
        const user = await User.findByPk(userId, {
            attributes: ['id', 'email', 'createdAt'],
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }
}

export const authService = new AuthService();