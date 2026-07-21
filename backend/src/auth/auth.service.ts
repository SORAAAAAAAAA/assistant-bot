import {
    Injectable,
    UnauthorizedException,
    ForbiddenException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from '@ai-assistant/shared';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) { }
    async register(dto: RegisterDto): Promise<{ message: string }> {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) throw new ConflictException('Email already registered');
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        await this.prisma.user.create({
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                department: dto.department,
                email: dto.email,
                hashedPassword: hashedPassword
            },
        });
        return { message: 'Registered. You can now Log-in!' };
    }
    async login(dto: LoginDto): Promise<LoginResponse> {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user || !(await bcrypt.compare(dto.password, user.hashedPassword))) {
            throw new UnauthorizedException('Incorrect email or password');
        }
        const token = this.jwt.sign({ sub: user.email });
        return { access_token: token, token_type: 'bearer' };
    }
}
