import { IsEmail, MinLength, Matches, IsNotEmpty, IsIn } from 'class-validator';
import { RegisterRequest, type DepartmentType } from '@ai-assistant/shared';

export class RegisterDto implements RegisterRequest {
    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    @IsEmail()
    @Matches(/@seiwakaiun\.com\.ph$/, {
        message: 'Email must be from the @seiwakaiun.com.ph domain',
    })
    email: string;

    @IsIn(['HR', 'OJS', 'Finance', 'MIS', 'GA', 'OOS'], {
        message: 'Department must be one of: HR, OJS, Finance, MIS, GA, OOS',
    })
    @IsNotEmpty()
    department: DepartmentType;

    @MinLength(8)
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @Matches(/{password}$/, {
        message: 'Passwords do not match',
    })
    confirmPassword: string;
}
