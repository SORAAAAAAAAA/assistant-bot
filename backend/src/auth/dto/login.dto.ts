import { IsEmail, IsNotEmpty } from 'class-validator';
import { LoginRequest } from '@ai-assistant/shared';

export class LoginDto implements LoginRequest {
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
}
