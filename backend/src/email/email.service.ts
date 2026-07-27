import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendPasswordResetEmail(to: string, resetToken: string) {
        const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, '');
        const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"SEIWA KAIUN Assistant Bot" <${process.env.SMTP_USER}>`,
            to,
            subject: 'Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>We received a request to reset your password for your SEIWA KAIUN account at SKPI Chatbot.</p>
                    <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #800000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>If you did not request this, please ignore this email.</p>
                    <p style="color: #666; font-size: 12px; margin-top: 40px;">- SEIWA KAIUN IT Support</p>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Password reset email sent to ${to}`);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send password reset email');
        }
    }
}
