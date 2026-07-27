import { IsEmail, Matches } from 'class-validator';

export class ForgotPasswordDto {
    @IsEmail()
    @Matches(/@seiwakaiun\.com\.ph$/, {
        message: 'Email must be from the @seiwakaiun.com.ph domain',
    })
    email: string;
}
