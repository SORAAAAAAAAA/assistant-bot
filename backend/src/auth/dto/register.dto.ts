import { IsEmail, MinLength, Matches, IsNotEmpty, IsIn } from 'class-validator';
import { RegisterRequest, type DepartmentType } from '@ai-assistant/shared';

export class RegisterDto implements RegisterRequest {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

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
    confirmPassword: string;
}
