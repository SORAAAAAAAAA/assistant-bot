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
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { DepartmentType, LoginResponse, RegisterResponse, UserProfile } from '@ai-assistant/shared';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private emailService: EmailService,
    ) { }
    async register(dto: RegisterDto): Promise<RegisterResponse> {
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
        return { message: 'Registered successfully!' };
    }
    async login(dto: LoginDto): Promise<LoginResponse> {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) {
            throw new ForbiddenException('User not found');
        }
        if (!(await bcrypt.compare(dto.password, user.hashedPassword))) {
            throw new UnauthorizedException('Incorrect Password');
        }
        const userProfile: UserProfile = {
            fullName: `${user.firstName} ${user.lastName}`,
            department: user.department as DepartmentType
        }
        const token = this.jwt.sign({ sub: user.email });
        return { access_token: token, token_type: 'bearer', userProfile };
    }

    async forgotPassword(dto: ForgotPasswordDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) {
            throw new ForbiddenException('User not found');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiry

        await this.prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiry },
        });

        await this.emailService.sendPasswordResetEmail(user.email, resetToken);

        return { message: 'Password reset link sent to your email.' };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetToken: dto.token,
                resetTokenExpiry: { gt: new Date() }, // Check if not expired
            },
        });

        if (!user) {
            throw new ForbiddenException('Invalid or expired reset token');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return { message: 'Password has been reset successfully' };
    }
}
